(() => {
  // All project content comes from projects-data.js.
  const groups = window.LOUIS_PROJECTS;
  const params = new URLSearchParams(location.search);
  const group = groups.find(g => g.key === params.get('collection')) || groups[0];
  const value = Number(params.get('project'));
  const index = Number.isInteger(value) && value >= 0 && value < group.projects.length ? value : 0;
  const project = group.projects[index];
  const url = (g,i) => `project.html?collection=${g.key}&project=${i}`;
  const $ = id => document.querySelector(`#${id}`);
  const paragraphs = (lead, items) => [lead ? `<p class="large-copy">${lead}</p>` : '', ...items.map(t => `<p>${t}</p>`)].join('');

  document.title = `${project.organisation} — Louis Arvor`;
  $('project-name').textContent = project.organisation;
  $('project-no').textContent = String(index + 1).padStart(2, '0');
  $('collection').textContent = `${group.name.toUpperCase()} / SELECTED WORK`;
  $('place-year').textContent = `${project.place.toUpperCase()} / ${project.year}`;
  $('standfirst').innerHTML = project.standfirst;
  $('discipline').textContent = project.category;
  $('role').textContent = project.role;
  $('period').textContent = project.period;
  $('status').textContent = project.status;
  $('lead-caption').textContent = project.organisation;
  $('closing-caption').textContent = `${project.place} · ${project.period}`;
  // Slots in page order: lead, image pair (2), closing. A project can give its own
  // photos in `images`; without them every slot shows the single `image`.
  document.querySelectorAll('#lead-image, .project-image').forEach((img, i) => {
    const photo = project.images ? project.images[i] : {src: project.image, alt: project.alt, position: project.position};
    if (!photo) { img.closest('figure').hidden = true; return; }
    img.src = photo.src;
    img.alt = photo.src.includes('placeholder') ? '' : (photo.alt || '');
    if (photo.position) img.style.objectPosition = photo.position;
  });
  $('context-body').innerHTML = paragraphs(project.contextLead, project.context);
  $('process-body').innerHTML = paragraphs(project.processLead, [project.process])
    + `<div class="process-notes">${project.notes.map(([label, text]) => `<p><span>${label}</span>${text}</p>`).join('')}</div>`;
  $('figures').textContent = project.figures.join(' · ');
  $('figures-foot').textContent = `${project.place} · ${project.period}`;
  $('outcome-body').innerHTML = paragraphs(project.outcomeLead, project.outcome);

  const list = $('project-list');
  for (const g of groups) {
    const section = document.createElement('div'); section.className = 'nav-group';
    const label = document.createElement('p'); label.className = 'group-label'; label.textContent = g.name.toUpperCase(); section.append(label);
    g.projects.forEach((p,i) => {
      const link = document.createElement('a'); link.className = 'project-link'; link.href = url(g,i); link.setAttribute('aria-label',`${g.name} — ${p.organisation}`);
      const number = document.createElement('span'); number.textContent = `0${i+1}`; link.append(number,document.createTextNode(p.name));
      if(g === group && i === index) link.setAttribute('aria-current','page');
      section.append(link);
    }); list.append(section);
  }
  const last = index === group.projects.length - 1;
  const nextGroup = last ? groups[(groups.indexOf(group)+1)%groups.length] : group;
  const nextIndex = last ? 0 : index + 1;
  $('next-project').href = url(nextGroup,nextIndex);
  $('next-name').textContent = nextGroup.projects[nextIndex].organisation;
  const mobile = matchMedia('(max-width: 650px)');
  function showCurrentProject() {
    if (!mobile.matches) return;
    const current = list.querySelector('[aria-current="page"]');
    if (!current || list.scrollWidth <= list.clientWidth) return;
    const viewport = list.getBoundingClientRect(), item = current.getBoundingClientRect();
    const inset = 8;
    // Move only the collection index, preserving the reader's page position.
    if (item.left < viewport.left + inset) list.scrollLeft += item.left - viewport.left - inset;
    else if (item.right > viewport.right - inset) list.scrollLeft += item.right - viewport.right + inset;
  }
  requestAnimationFrame(showCurrentProject);
  document.fonts.ready.then(showCurrentProject);
  mobile.addEventListener('change', () => requestAnimationFrame(showCurrentProject));
})();
