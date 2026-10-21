import { CareerMilestone, VerifiedCredential, PromptStarter } from '../types';

export const ROBIN_PROFILE = {
  name: 'Robin Silm',
  assistantName: 'Hans',
  voiceTitle: 'First-Person Voice Persona',
  voiceDescription: 'Voiced by Hans in a deep, measured American male tone, representing Robin Silm directly.',
  location: 'Tallinn, Estonia',
  address: 'Akadeemia Tee 26, 12611 Tallinn',
  phone: '+372 58056631',
  email: 'Robinsilm19@gmail.com',
  pdfPath: '/assets/aistudio/CV_ENGLISH_c4ef3c18.pdf',
  summary:
    'Dynamic professional with a diverse background in mechanics, carpentry, and customer service, seeking to leverage creative problem-solving skills in a collaborative environment. Proven ability to connect functionality with aesthetics, delivering tailored solutions that meet client needs. Completed military service in the Estonian Defence Forces and holds a Level 4 Joiner Professional Certificate with business studies at EBS.',
};

export const PROMPT_STARTERS: PromptStarter[] = [
  {
    label: 'Bolt & Rocca al Mare Fit-outs',
    query: 'Can you describe your commercial installations at Bolt headquarters and Rocca al Mare School?',
    tag: 'Commercial Installations',
  },
  {
    label: 'Solid Wood Staircases & Joinery',
    query: 'Tell me about crafting custom solid wood staircases and furniture at M.P.Trepid.',
    tag: 'Precision Craft',
  },
  {
    label: 'Estonian Defence Forces Service',
    query: 'How did your service in the Estonian Defence Forces influence your leadership and discipline?',
    tag: 'Military Discipline',
  },
  {
    label: 'Estonian Botanical Garden Work',
    query: 'What was your role in landscaping the Estonian Botanical Garden?',
    tag: 'Horticulture',
  },
  {
    label: 'Entrepreneurship & Studies at EBS',
    query: 'How do your business studies at Estonian Business School tie into your craftsmanship?',
    tag: 'Business & Strategy',
  },
];

export const CAREER_MILESTONES: CareerMilestone[] = [
  {
    id: 'spa-instructor',
    role: 'Instructor & Facility Lead',
    company: 'Mustamäe Spa OÜ',
    period: '02/2025 — Current',
    location: 'Tallinn, Estonia',
    category: 'wellness',
    summary:
      'Ensuring safety and wellbeing in premier aquatic facility while maintaining rigorous health compliance and client satisfaction.',
    bullets: [
      'Ensured safety and wellbeing of all guests in pool and aquatic facilities.',
      'Maintained immaculate cleanliness of pools and surrounding architectural areas to meet national health standards.',
      'Assisted clients with personalized support to enhance guest satisfaction.',
      'Supported colleagues across daily operations and oversaw facility closing procedures to maintain security at day’s end.',
    ],
    keyHighlight: 'Operational discipline & guest safety oversight in high-throughput wellness environment',
  },
  {
    id: 'botanical-gardener',
    role: 'Landscape Craftsman & Gardener',
    company: 'Aiabutiik T.T',
    period: '07/2023 — 10/2023',
    location: 'Tallinn, Estonia',
    category: 'wellness',
    summary:
      'Specialized in landscape architecture, botanical maintenance, and botanical garden development.',
    bullets: [
      'Contributed directly to the establishment and landscaping development of the Estonian Botanical Garden (Tallinna Botaanikaaed).',
      'Worked on horticultural design, planting, weeding, trimming, mowing, and ecological garden maintenance.',
      'Connected environmental functionality with manicured outdoor aesthetic harmony.',
    ],
    keyHighlight: 'Contributed directly to the historic Estonian Botanical Garden',
  },
  {
    id: 'furniture-installer',
    role: 'Commercial Furniture & Interior Installer',
    company: 'Pristalpaigaluds',
    period: '06/2022 — 10/2022',
    location: 'Tallinn, Estonia',
    category: 'installation',
    summary:
      'High-specification interior installation projects across marquee institutional and tech enterprise campuses.',
    bullets: [
      'Executed premier installations across multiple locations, including Rocca al Mare School and Bolt global offices in Tallinn.',
      'Installed custom kitchens, designer office furniture, specialized appliances, and wide-ranging interior design elements with millimeter precision.',
      'Worked autonomously on active architectural sites, strengthening project delivery timelines and client coordination.',
    ],
    keyHighlight: 'Fitted executive interiors at Bolt global headquarters and Rocca al Mare School',
  },
  {
    id: 'wolt-logistics',
    role: 'Delivery Operations & Navigation Driver',
    company: 'WOLT EESTI OÜ',
    period: '06/2021 — 05/2022',
    location: 'Tallinn, Estonia',
    category: 'installation',
    summary:
      'Autonomous on-demand logistics navigation and time-critical delivery operations.',
    bullets: [
      'Operated autonomously in a fast-paced urban environment to fulfill customer orders with zero downtime.',
      'Cultivated rapid customer communication, route optimization, and calm performance in fluctuating traffic.',
    ],
  },
  {
    id: 'joiner-mp-trepid',
    role: 'Craftsman & Woodworking Specialist',
    company: 'M.P.Trepid OÜ',
    period: '02/2020 — 04/2022',
    location: 'Estonia',
    category: 'craft',
    summary:
      'Precision joinery crafting custom-made solid wood staircases and bespoke luxury furniture on private commission.',
    bullets: [
      'Built custom-made solid wood staircases and bespoke furniture to rigorous architectural tolerances.',
      'Operated industrial woodworking machinery: thickness planers, spindle moulders, routers, and CNC equipment.',
      'Mastered specialized surface finishing, spray painting, staining, and on-site architectural anchoring.',
    ],
    keyHighlight: 'Mastery of solid wood staircase architecture & precision machinery',
  },
  {
    id: 'matek-modular',
    role: 'Timber Construction Craftsman',
    company: 'Matek AS',
    period: '11/2020 — 12/2020',
    location: 'Estonia',
    category: 'craft',
    summary:
      'Industrial timber framing and prefabricated modular housing assembly lines.',
    bullets: [
      'Collaborated on assembly lines producing prefabricated modular housing units for Scandinavian and European export.',
      'Applied structural carpentry standards to timber element prefabrication and quality control checks.',
    ],
  },
  {
    id: 'maxer-mechanical',
    role: 'Mechanical Technician & Assistant',
    company: 'Maxer OÜ',
    period: '08/2015 — 07/2019',
    location: 'Estonia',
    category: 'craft',
    summary:
      'Mechanical diagnostics, engine rebuilds, and structural repair across automotive, marine, and commercial machinery.',
    bullets: [
      'Repaired and serviced cars, commercial transport trucks, motorboats, and heavy motorized machinery.',
      'Mastered pneumatic tooling, electrical diagnostics, hydraulic systems, and metal fabrication.',
    ],
  },
];

export const VERIFIED_CREDENTIALS: VerifiedCredential[] = [
  {
    title: 'Estonian Defence Forces (Eesti Kaitsevägi)',
    issuer: 'Republic of Estonia',
    year: 'Completed',
    description:
      'Rigorous military training cultivating tactical composure, duty under stress, high-integrity teamwork, and discipline.',
  },
  {
    title: 'Level 4 Joiner Professional Certificate',
    issuer: 'Pärnumaa Kutsehariduskeskus',
    year: '2022',
    description:
      'State-certified mastery in technical joinery, solid timber processing, wood finishes, and industrial machinery.',
  },
  {
    title: 'Entrepreneurship & Business Management',
    issuer: 'Estonian Business School (EBS)',
    year: 'Class of 2025',
    description:
      'Academic focus on venture creation, operational systems, financial strategy, and enterprise development.',
  },
  {
    title: 'AutoCAD & SolidWorks Technical Drafting',
    issuer: 'Certified Training',
    year: 'Certified',
    description:
      'Parametric 3D modeling, mechanical drafting, and architectural CAD production for fabrication.',
  },
  {
    title: "Driver's License B1",
    issuer: 'Transport Administration',
    year: 'Valid',
    description: 'Autonomous mobility and cross-region equipment transport.',
  },
];

export const LANGUAGES = [
  { language: 'Estonian', level: 'Native / First Language', code: 'C2+' },
  { language: 'English', level: 'Advanced Professional', code: 'C1' },
  { language: 'Russian', level: 'Elementary Working', code: 'A2' },
  { language: 'German', level: 'Elementary Working', code: 'A2' },
];
