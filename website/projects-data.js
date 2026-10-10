// Single source for every project shown on the site.
// Read by project-postcards.js (homepage letters) and project-detail.js (project pages).
// To change a project, edit it here only. Facts come from Louis's CV (October 2026).
(() => {
'use strict';
const placeholder = {
  image: 'assets/project-postcards/lily-placeholder-v1.jpg',
  position: '50% 50%',
  alt: 'Creamy white double lily against a dark background'
};

window.LOUIS_PROJECTS = [
  {key: 'china', name: 'China', projects: [
    {
      ...placeholder,
      name: 'PawSwing',
      organisation: 'PawSwing',
      category: 'Trade shows / Budget control',
      role: 'International Sales Coordinator',
      year: '2026',
      period: 'Jun – Aug 2026',
      place: 'Shenzhen',
      status: 'Completed',
      summary: 'Coordinated three international trade shows — Interzoo Nuremberg, SuperZoo Las Vegas and IFA Berlin — and owned their budget and administrative follow-up.',
      standfirst: 'Three international trade shows,<br>one budget to keep honest.',
      contextLead: 'A Shenzhen pet-tech brand taking its products to Europe and the United States.',
      context: [
        'From June to August 2026 I coordinated PawSwing’s presence at three international trade shows: Interzoo in Nuremberg, SuperZoo in Las Vegas and IFA Berlin.',
        'Beyond the logistics, I was responsible for the administrative and budget follow-up of each show, and for the reliability of the commercial data the team worked from.'
      ],
      processLead: 'Control the costs.<br>Clean the data.<br>Deliver the shows.',
      process: 'Each show combined suppliers, deadlines and documents across several countries. The work was to keep every invoice, payment and contact verifiable.',
      notes: [
        ['Budget follow-up', 'Checked supplier invoices, built and verified reimbursement files, kept payment deadlines.'],
        ['Data reliability', 'Built a 148-contact database in Excel: entry, consistency checks, anomaly detection and normalisation.'],
        ['Show coordination', 'Booth design, supplier management, technical orders and insurance.']
      ],
      figures: ['3 trade shows', '148 contacts', '5 languages'],
      outcomeLead: 'Three shows delivered,<br>on two continents.',
      outcome: [
        'Commercial materials and product documentation were reviewed and validated in five languages before release.',
        'The role combined international operations with the financial control behind them.'
      ]
    },
    {
      ...placeholder,
      name: 'Mingtuo',
      organisation: 'Shenzhen Mingtuo Industrial',
      category: 'Pricing / Export',
      role: 'Export Sales Coordinator',
      year: '2025',
      period: 'May – Aug 2025',
      place: 'Shenzhen',
      status: 'Completed',
      summary: 'Built quotes, proforma invoices and price grids, analysed prices and margins, and checked export documentation for accuracy and compliance.',
      standfirst: 'Prices, margins and the paperwork<br>that makes exports work.',
      contextLead: 'B2B export operations between a Shenzhen manufacturer and international clients.',
      context: [
        'From May to August 2025 I worked in export sales at Shenzhen Mingtuo Industrial, as the interface between internal teams and international clients.',
        'My work covered both ends of a transaction: setting the price, then making sure the commercial and logistics documents behind it were right.'
      ],
      processLead: 'Price it.<br>Check it.<br>Ship it.',
      process: 'Pricing decisions depended on reliable numbers, and shipments on documents that matched the contract. I worked on both.',
      notes: [
        ['Pricing', 'Prepared quotes, proforma invoices and price grids.'],
        ['Margin analysis', 'Price and margin calculations to support commercial decisions.'],
        ['Compliance', 'Checked commercial and logistics export documents against contractual and client requirements.']
      ],
      figures: ['Quotes & proformas', 'Price grids', 'Margin analysis'],
      outcomeLead: 'Clearer B2B operations,<br>between teams and clients.',
      outcome: [
        'I helped structure the company’s B2B operations and coordinated between several internal contacts and international clients.'
      ]
    },
    {
      ...placeholder,
      name: 'Senyuan',
      organisation: 'Senyuan Furniture Group',
      category: 'Production data / Market study',
      role: 'Project Coordinator',
      year: '2024',
      period: 'Jul – Aug 2024',
      place: 'Dongguan',
      status: 'Completed',
      summary: 'Tracked production data and deadlines, identified and resolved discrepancies, and studied French-speaking markets.',
      standfirst: 'Following production<br>through its data.',
      contextLead: 'A furniture manufacturer in Dongguan, looking at French-speaking markets.',
      context: [
        'In summer 2024 I joined Senyuan Furniture Group in Dongguan as a project coordinator.',
        'I followed production through its data and deadlines, and contributed a market perspective on French-speaking countries.'
      ],
      processLead: 'Track. Spot the gap.<br>Resolve it.',
      process: 'Production schedules only hold when the numbers behind them are checked. The work was to find where data and reality diverged.',
      notes: [
        ['Tracking', 'Followed production data and deadlines.'],
        ['Variances', 'Identified and resolved discrepancies.'],
        ['Markets', 'Reviewed cross-functional processes and carried out a market study on French-speaking markets.']
      ],
      figures: ['Production data', 'Deadlines', 'Francophone markets'],
      outcomeLead: 'Operations,<br>seen through their data.',
      outcome: [
        'An inside view of manufacturing operations, and of how much they depend on reliable data.'
      ]
    }
  ]},
  {key: 'france', name: 'France', projects: [
    {
      ...placeholder,
      name: 'EM Normandie',
      organisation: 'EM Normandie Business School',
      category: 'Education / Finance & data',
      role: 'Master Grande École student',
      year: '2023 – now',
      period: 'Sep 2023 – present',
      place: 'Paris · Le Havre',
      status: 'In progress',
      summary: 'Master Grande École in Financial Data Management, now on the Contrôle, Finance & Data track at the Le Havre campus.',
      standfirst: 'Finance, data and information systems,<br>studied together.',
      contextLead: 'A master’s degree at the intersection of finance, data management and information systems.',
      context: [
        'I joined EM Normandie’s Master Programme Grande École in 2023 and specialised in Financial Data Management.',
        'I now follow the Contrôle, Finance & Data track at the Le Havre campus, and I am looking for an apprenticeship to complete it.'
      ],
      processLead: 'Analyse. Control.<br>Make data useful.',
      process: 'The specialisation brings together the disciplines a modern finance function relies on.',
      notes: [
        ['Finance', 'Financial analysis and management control.'],
        ['Data', 'Data analytics and digital transformation.'],
        ['Exchange', 'Semester at Jinan University, Guangzhou (Sep 2025 – Jan 2026): audit, financial economics, international business law, macro- and microeconomics.']
      ],
      figures: ['Excel', 'Power BI', 'Python (basics)'],
      outcomeLead: 'Next: putting it to work<br>in a finance team.',
      outcome: [
        'Tools: Excel, Power BI, Python (basics), Microsoft Office, Canva. French native speaker with the Projet Voltaire certificate.'
      ]
    },
    {
      ...placeholder,
      name: 'Int’l Council',
      organisation: 'International Council of Paris',
      category: 'Student association / Events',
      role: 'Events team member',
      year: '2024 – 2025',
      period: 'Sep 2024 – May 2025',
      place: 'Paris',
      status: 'Completed',
      summary: 'Organised events to help international students settle into EM Normandie: role allocation, planning and team coordination.',
      standfirst: 'Helping international students<br>find their place.',
      contextLead: 'The student association that welcomes international students at EM Normandie’s Paris campus.',
      context: [
        'From September 2024 to May 2025 I was part of the events team of the International Council of Paris association.'
      ],
      processLead: 'Plan. Assign.<br>Coordinate.',
      process: 'Each event meant dividing the work, building a schedule and keeping a volunteer team aligned.',
      notes: [
        ['Roles', 'Allocated responsibilities across the team.'],
        ['Planning', 'Built and followed event schedules.'],
        ['Coordination', 'Kept the team aligned through each event.']
      ],
      figures: ['Events', 'International students', 'Team coordination'],
      outcomeLead: 'Events that brought<br>students together.',
      outcome: [
        'The association’s events helped international students integrate into campus life.'
      ]
    },
    {
      ...placeholder,
      name: 'Next chapter',
      organisation: 'Apprenticeship in management control',
      category: 'Open to opportunities',
      role: 'Management control apprentice',
      year: '2026 – 2028',
      period: 'From October 2026',
      place: 'France',
      status: 'Looking',
      summary: 'Looking for a two-year apprenticeship (M1–M2) in management control. Rhythm: three weeks in the company, one week at school. Available from October 2026.',
      standfirst: 'Looking for a two-year apprenticeship<br>in management control.',
      contextLead: 'Two years, three weeks in the company and one at school, from October 2026.',
      context: [
        'I am looking for a two-year apprenticeship (M1–M2) in management control, alongside the Contrôle, Finance & Data track at EM Normandie.',
        'Rhythm: three weeks in the company, one week at school. I am available from October 2026.'
      ],
      processLead: 'What I bring<br>to a finance team.',
      process: 'Experience across three companies in China, built on the work a controller relies on every day.',
      notes: [
        ['Budget follow-up', 'Invoice checks, reimbursement files and payment deadlines.'],
        ['Price & margin analysis', 'Quotes, price grids and margin calculations.'],
        ['Data reliability', 'Consistency checks, anomaly detection and normalisation in Excel.']
      ],
      figures: ['French', 'English (C1)', 'Mandarin'],
      outcomeLead: 'Let’s talk.',
      outcome: [
        'Write to me at <a href="mailto:hanyi.arvor@icloud.com">hanyi.arvor@icloud.com</a>.'
      ]
    }
  ]}
];
})();
