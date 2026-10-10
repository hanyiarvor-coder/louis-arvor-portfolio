(() => {
'use strict';
window.createStampPostcards = ({scene, stamps, hover, onReturn}) => {
  const gsap = window.gsap;
  const overlay = document.querySelector('#project-postcards');
  if (!gsap || !overlay || !window.LOUIS_PROJECTS) return null;
  const get = id => overlay.querySelector(`#pc-${id}`);
  const card = get('postcard'), paper = get('paper-image');
  const paperShell = card.querySelector('.pc-paper-shell');
  const emboss = get('emboss-image');
  const paperLayers = [paperShell, emboss];
  const content = card.querySelector('.pc-postcard-content');
  const title = get('project-title'), number = get('project-number');
  const countryLabel = get('country-label'), projectTabs = get('project-tabs');
  const panel = get('project-panel'), category = get('project-category');
  const summary = get('project-summary'), projectImage = get('project-image');
  const meta = get('project-detail');
  const projectVisual = card.querySelector('.pc-project-visual');
  const viewProject = get('view-project');
  const projectLinks = [card.querySelector('.pc-project-image-window'), viewProject];
  const status = get('status');
  const ink = ['.pc-project-heading', '.pc-project-summary', '.pc-project-index'].map(s => card.querySelector(s));
  const thresholds = ['title', 'body', 'note'].map(name => get(`${name}-threshold`));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Keep interaction tilt outside the transforms used to unfold the paper and
  // dock the stamp. The cursor remains a sibling in the dialog's top layer.
  const assembly = document.createElement('div');
  assembly.className = 'pc-tilt-assembly';
  card.before(assembly);
  assembly.appendChild(card);
  let tiltReady = false;

  function resetPaperTilt(immediate = false) {
    tiltReady = false;
    gsap.killTweensOf(assembly);
    if (immediate) gsap.set(assembly, {rotationX: 0, rotationY: 0});
    else gsap.to(assembly, {rotationX: 0, rotationY: 0, duration: .28, ease: 'power2.out'});
  }

  function enablePaperTilt() {
    resetPaperTilt(true);
    gsap.set(assembly, {
      transformOrigin: `${geometry.paperX + geometry.paperW / 2}px ${geometry.paperY + geometry.paperH / 2}px`,
      transformPerspective: Math.max(900, geometry.paperW * 1.7)
    });
    tiltReady = !reduced.matches;
  }

  function aimPaperTilt(point) {
    if (!tiltReady || selected === null || returning) return;
    // Use the unrotated layout bounds: measuring the tilted rectangle on every
    // move would make the sheet chase its own perspective distortion.
    const g = geometry;
    const inPaper = point && point.clientX >= g.paperX && point.clientX <= g.paperX + g.paperW
      && point.clientY >= g.paperY && point.clientY <= g.paperY + g.paperH;
    const inStamp = point && document.elementFromPoint(point.clientX, point.clientY)?.closest('.sp-stamp') === stamps[selected];
    const clamp = value => Math.max(-1, Math.min(1, value));
    const x = inPaper || inStamp ? clamp((point.clientX - g.paperX) / g.paperW * 2 - 1) : 0;
    const y = inPaper || inStamp ? clamp((point.clientY - g.paperY) / g.paperH * 2 - 1) : 0;
    gsap.to(assembly, {rotationX: -y * 10, rotationY: x * 10,
      duration: point ? .45 : .65, ease: 'power3.out', overwrite: 'auto'});
  }

  overlay.addEventListener('pointermove', event => {
    if (event.pointerType !== 'touch') aimPaperTilt(event);
  });
  overlay.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'touch') aimPaperTilt(null);
  });
  // Observe the moving finger even when its gesture began outside the paper.
  // Passive listeners leave the project panel's native scrolling intact.
  const followPaperTouch = event => aimPaperTilt(event.touches.length === 1 ? event.touches[0] : null);
  document.addEventListener('touchstart', followPaperTouch, {passive: true});
  document.addEventListener('touchmove', followPaperTouch, {passive: true});
  document.addEventListener('touchend', () => aimPaperTilt(null), {passive: true});
  document.addEventListener('touchcancel', () => aimPaperTilt(null), {passive: true});
  window.addEventListener('blur', () => aimPaperTilt(null));
  const typographyReady = Promise.allSettled([
    document.fonts.load(`400 12px ${getComputedStyle(content).fontFamily}`),
    document.fonts.load(`400 12px ${getComputedStyle(title).fontFamily}`)
  ]);
  const rememberedProjects = [0, 0];
  let geometry, restore, selected = null, timeline = null, returning = false;
  let activeProject = 0, projectTransition = null, resizeFrame = 0;
  let keyboardNavigation = false;
  document.addEventListener('keydown', event => {
    if (['Tab', 'Enter', ' ', 'Escape'].includes(event.key)) keyboardNavigation = true;
  }, true);
  document.addEventListener('pointerdown', () => { keyboardNavigation = false; }, true);
  document.addEventListener('touchstart', () => { keyboardNavigation = false; }, {capture: true, passive: true});
  // Project content lives in projects-data.js (shared with the project pages).
  const collections = window.LOUIS_PROJECTS;
  // Motion adapted from the fetched React Bits Shuffle: clipped character strips,
  // horizontal rolls, then alternating odd/even groups. Keep the postcard typography.
  const shuffleLabel = viewProject.querySelector('.pc-view-project-label');
  const shuffleStrips = [];
  shuffleLabel.replaceChildren(...Array.from(shuffleLabel.textContent, character => {
    const cell = document.createElement('span');
    cell.className = 'pc-shuffle-glyph';
    if (character === ' ') { cell.textContent = '\u00a0'; return cell; }
    cell.dataset.glyph = character;
    const strip = document.createElement('span');
    strip.className = 'pc-shuffle-strip';
    for (let i = 0; i < 3; i++) {
      const glyph = document.createElement('span');
      glyph.textContent = character;
      strip.appendChild(glyph);
    }
    cell.appendChild(strip);
    shuffleStrips.push(strip);
    return cell;
  }));
  let shuffleTimeline = null;

  function resetShuffle() {
    shuffleTimeline?.kill();
    shuffleTimeline = null;
    gsap.set(shuffleStrips, {clearProps: 'transform'});
    viewProject.classList.remove('pc-is-shuffling');
  }

  function playShuffle() {
    if (reduced.matches || returning || selected === null || shuffleTimeline?.isActive()) return;
    const odd = shuffleStrips.filter((_, i) => i % 2 === 1);
    const even = shuffleStrips.filter((_, i) => i % 2 === 0);
    viewProject.classList.add('pc-is-shuffling');
    gsap.set(shuffleStrips, {xPercent: -200 / 3});
    shuffleTimeline = gsap.timeline({
      defaults: {duration: .35, ease: 'power3.out', stagger: .03},
      onComplete: resetShuffle
    })
      .to(odd, {xPercent: 0}, 0)
      .to(even, {xPercent: 0}, (.35 + (odd.length - 1) * .03) * .7);
  }

  viewProject.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') playShuffle();
  });
  viewProject.addEventListener('focus', playShuffle);

  // Decode the paper and its independent relief early, before the stamp is opened.
  collections.forEach(collection => {
    [`${collection.key}-paper.png`, `emboss-v3/${collection.key}-emboss.png`].forEach(file => {
      const image = new Image();
      image.src = `assets/project-postcards/${file}`;
      image.decode().catch(() => {});
    });
  });

  function selectTab(index) {
    [...projectTabs.children].forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `pc-project-tab-${index}`);
  }

  function populateProject(index) {
    const collection = collections[selected];
    const project = collection.projects[index];
    title.textContent = project.organisation;
    category.textContent = project.category;
    if (meta) meta.textContent = `${project.place} · ${project.year}`;
    summary.textContent = project.summary;
    number.textContent = String(index + 1).padStart(2, '0');
    projectImage.src = project.image;
    projectImage.style.objectPosition = project.position;
    projectImage.alt = project.alt;
    for (const link of projectLinks) {
      link.href = `project.html?collection=${collection.key}&project=${index}`;
      link.setAttribute('aria-label', `View ${collection.name} — ${project.organisation}`);
    }
    panel.scrollTop = 0;
    selectTab(index);
  }

  function renderCollection() {
    const collection = collections[selected];
    countryLabel.textContent = collection.name;
    projectTabs.setAttribute('aria-label', `${collection.name} projects`);
    projectTabs.replaceChildren(...collection.projects.map((project, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pc-project-tab';
      button.id = `pc-project-tab-${index}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', 'pc-project-panel');
      const ordinal = document.createElement('span');
      ordinal.textContent = String(index + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.textContent = project.name;
      button.append(ordinal, label);
      button.addEventListener('click', () => switchProject(index));
      return button;
    }));
    activeProject = rememberedProjects[selected];
    populateProject(activeProject);
  }

  function settleProject() {
    projectTransition?.kill();
    projectTransition = null;
    populateProject(activeProject);
    gsap.set(panel, {opacity: 1});
    gsap.set(ink.slice(0, 2), {opacity: 1});
    gsap.set(thresholds.slice(0, 2), {attr: {intercept: .8}});
    gsap.set(projectVisual, {opacity: 1});
  }

  function switchProject(index) {
    if (selected === null || returning || projectTabs.inert || index === activeProject) return;
    resetShuffle();
    activeProject = index;
    rememberedProjects[selected] = index;
    projectTransition?.kill();
    selectTab(index);
    if (reduced.matches) { settleProject(); return; }
    projectTransition = gsap.timeline({defaults: {ease: 'sine.inOut'}})
      .to(panel, {opacity: 0, duration: .15})
      .call(() => {
        populateProject(index);
        gsap.set(ink.slice(0, 2), {opacity: 0});
        gsap.set(thresholds.slice(0, 2), {attr: {intercept: -7}});
        gsap.set(projectVisual, {opacity: 0});
      })
      .to(panel, {opacity: 1, duration: .12})
      .to(ink.slice(0, 2), {opacity: 1, duration: .3, stagger: .06}, .18)
      .to(thresholds[0], {attr: {intercept: .8}, duration: .68}, .18)
      .to(thresholds[1], {attr: {intercept: .8}, duration: .76}, .25)
      .to(projectVisual, {opacity: 1, duration: .5, ease: 'power2.out'}, .35);
  }

  projectTabs.addEventListener('keydown', event => {
    if (selected === null || returning) return;
    const count = collections[selected].projects.length;
    let next = activeProject;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (next + 1) % count;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (next - 1 + count) % count;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;
    else return;
    event.preventDefault();
    projectTabs.children[next].focus({preventScroll: true});
    switchProject(next);
  });

  function measure() {
    const w = overlay.clientWidth, h = overlay.clientHeight;
    const paperW = Math.min(740, w * .845, (h - 40) / .82);
    const paperH = paperW / 1.5545;
    const paperX = (w - paperW) / 2 + paperW * .035;
    const paperY = (h - paperH) / 2 + paperW * .025;
    return {paperW, paperH, paperX, paperY, target: {
      x: paperX + paperW * .04 - restore.rect.width / 2,
      y: paperY + paperH * .025 - restore.rect.height / 2,
      scale: paperW * .2295 / restore.rect.width
    }};
  }

  // Read the underlying pocket's flat pose without reparenting or moving its stamps.
  function restPose() {
    const r = scene.getBoundingClientRect(), width = scene.clientWidth * .6;
    return {x: r.left + r.width * (selected === 0 ? -.16 : .56),
      y: r.top - r.width * .98, width, height: width * 1402 / 1122};
  }

  function finishClose(focus = true) {
    if (selected === null) return;
    resetPaperTilt(true);
    timeline?.kill(); projectTransition?.kill(); resetShuffle();
    const stamp = stamps[selected];
    gsap.set(stamp, {clearProps: 'all'});
    restore.parent.insertBefore(stamp, restore.next);
    stamp.style.cssText = restore.css;
    scene.style.cssText = restore.sceneCss;
    card.inert = true; card.setAttribute('aria-hidden', 'true');
    stamp.setAttribute('aria-expanded', 'false');
    overlay.close();
    selected = null; returning = false; timeline = null; projectTransition = null;
    hover.reset(true); onReturn();
    // Native dialog restoration plus unconditional focus can give a touch tap
    // Safari's keyboard outline. Restore visible focus only for keyboard input.
    if (focus && keyboardNavigation) stamp.focus({preventScroll: true});
    else stamp.blur();
  }

  function settleOpen() {
    if (selected === null || returning) return;
    geometry = measure();
    const g = geometry;
    gsap.set(scene, {opacity: 0});
    gsap.set(card, {x: g.paperX, y: g.paperY, width: g.paperW, height: g.paperH, autoAlpha: 1});
    gsap.set(paperLayers, {x: 0, y: 0, scale: 1, rotation: 0});
    gsap.set(stamps[selected], {...g.target, rotation: -9});
    gsap.set([content, ...ink], {opacity: 1});
    gsap.set(thresholds, {attr: {intercept: .8}});
    settleProject(); projectTabs.inert = false;
    hover.setPose(selected, 1, 1);
    enablePaperTilt();
  }

  function buildTimeline(index) {
    const g = geometry, stamp = stamps[index], rest = restore.rect;
    const startX = rest.left + rest.width / 2 - g.paperW / 2 - g.paperX;
    const startY = rest.top + rest.height / 2 - g.paperH / 2 - g.paperY;
    gsap.set(card, {x: g.paperX, y: g.paperY, width: g.paperW, height: g.paperH, scale: 1, rotation: 0, autoAlpha: 0});
    // Text lives at its final size. Only the paper unfolds beneath it.
    gsap.set(paperLayers, {x: startX, y: startY, scale: .24, rotation: index ? 3 : -3});
    gsap.set([content, ...ink, projectVisual], {opacity: 0});
    gsap.set(panel, {opacity: 1});
    gsap.set(thresholds, {attr: {intercept: -7}});
    const tl = gsap.timeline({paused: true, defaults: {ease: 'power3.inOut'}, onComplete() {
      projectTabs.inert = false; card.focus({preventScroll: true});
      hover.setPose(index, 1, 1);
      enablePaperTilt();
    }});
    tl.to(scene, {opacity: 0, duration: .32}, 0)
      .to(stamp, {y: rest.top - 15, scale: 1.02, duration: .16, ease: 'power2.out'}, 0)
      .to(card, {autoAlpha: 1, duration: .18, ease: 'power1.out'}, .13)
      .to(paperLayers, {x: 0, y: -3, scale: 1.008, rotation: .45, duration: .83}, .13)
      .to(stamp, {x: g.target.x, y: g.target.y - 4, scale: g.target.scale, rotation: -10.5, duration: .82}, .13)
      .to(paperLayers, {y: 0, scale: 1, rotation: 0, duration: .32, ease: 'power2.out'}, .95)
      .to(content, {opacity: 1, duration: .18, ease: 'sine.out'}, .95)
      .to(stamp, {y: g.target.y, rotation: -9, duration: .38, ease: 'power2.out'}, .95);
    [.98, 1.11, .98].forEach((at, i) => {
      tl.to(ink[i], {opacity: 1, duration: .42, ease: 'sine.out'}, at)
        .to(thresholds[i], {attr: {intercept: .8}, duration: i === 2 ? .83 : 1.2, ease: 'sine.inOut'}, at);
    });
    tl.to(projectVisual, {opacity: 1, duration: .65, ease: 'power2.out'}, 1.16);
    return tl;
  }

  function open(index) {
    if (selected !== null) return;
    selected = index; returning = false;
    resetPaperTilt(true);
    const stamp = stamps[index];
    if (hover.beginPostcard) hover.beginPostcard(index); else hover.reset(true);
    stamps.forEach((_, i) => hover.setPose(i, 1, 0));
    restore = {parent: stamp.parentNode, next: stamp.nextSibling, css: stamp.style.cssText,
      sceneCss: scene.style.cssText, rect: stamp.getBoundingClientRect()};
    overlay.showModal();
    // Move the same textured stamp into the top layer, preserving its image and canvas.
    assembly.appendChild(stamp);
    gsap.set(stamp, {clearProps: 'transform'});
    gsap.set(stamp, {left: 0, top: 0, x: restore.rect.left, y: restore.rect.top,
      width: restore.rect.width, height: restore.rect.height, scale: 1, rotation: 0, zIndex: 50});
    stamp.setAttribute('aria-expanded', 'true');
    card.dataset.country = collections[index].key;
    paper.src = `assets/project-postcards/${collections[index].key}-paper.png`;
    emboss.src = `assets/project-postcards/emboss-v3/${collections[index].key}-emboss.png`;
    renderCollection();
    card.inert = false; card.setAttribute('aria-hidden', 'false'); projectTabs.inert = true;
    status.textContent = '';
    geometry = measure(); timeline = buildTimeline(index);
    const opening = timeline;
    typographyReady.then(() => {
      if (timeline !== opening || selected !== index || returning) return;
      if (reduced.matches) opening.progress(1); else opening.play();
    });
  }

  function close({immediate = false, focus = true} = {}) {
    if (selected === null) return;
    if (immediate) { finishClose(focus); return; }
    if (returning) return;
    returning = true; projectTabs.inert = true; card.inert = true;
    resetPaperTilt();
    resetShuffle(); hover.reset(true);
    stamps.forEach((_, index) => hover.setPose(index, 1, 0));
    projectTransition?.kill(); timeline?.kill();
    if (reduced.matches) { finishClose(focus); return; }
    const rest = restPose(), g = geometry, size = restore.rect;
    timeline = gsap.timeline({defaults: {ease: 'power3.inOut'}, onComplete: () => finishClose(focus)})
      .to(content, {opacity: 0, duration: .15}, 0)
      .to(paperLayers, {x: rest.x + rest.width / 2 - g.paperW / 2 - g.paperX,
        y: rest.y + rest.height / 2 - g.paperH / 2 - g.paperY,
        scale: .24, rotation: selected ? 3 : -3, duration: .64}, .08)
      .to(stamps[selected], {x: rest.x + (rest.width - size.width) / 2,
        y: rest.y + (rest.height - size.height) / 2, scale: rest.width / size.width,
        rotation: 0, duration: .72}, .06)
      .to(card, {autoAlpha: 0, duration: .18}, .54)
      .to(scene, {opacity: 1, duration: .25}, .52);
  }

  // Native links retain new-tab and copy-link actions; closing blocks stale entry clicks.
  for (const link of projectLinks) {
    for (const type of ['click', 'auxclick']) link.addEventListener(type, event => {
      if (selected === null || returning) event.preventDefault();
    });
  }
  overlay.addEventListener('click', event => {
    if (!event.target.closest('.sp-stamp, .pc-postcard')) close();
  });
  overlay.addEventListener('cancel', event => { event.preventDefault(); close(); });
  overlay.addEventListener('wheel', event => {
    if (!panel.contains(event.target) || panel.scrollHeight <= panel.clientHeight) event.preventDefault();
  }, {passive: false});
  overlay.addEventListener('touchmove', event => {
    if (!panel.contains(event.target)) event.preventDefault();
  }, {passive: false});
  window.addEventListener('resize', () => {
    if (selected === null) return;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (selected === null) return;
      if (returning) { finishClose(false); return; }
      timeline?.kill(); settleOpen();
    });
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches || selected === null) return;
    timeline?.kill();
    if (returning) finishClose(); else settleOpen();
  });
  return {open, close, get active() {return selected !== null;}};
};
})();
