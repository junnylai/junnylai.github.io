// Site content for the single-page STUDIO|BD site. Edit, then run:  node tools/build.mjs
// Media paths are relative to assets/media and have no extension.
//   Image "folder/name" -> folder/name.webp (+ folder/name-s.webp small version when it exists)
//   Video "folder/name" -> folder/name.mp4 + folder/name.jpg poster

export const site = {
  name: 'STUDIO|BD',
  url: 'https://junnylai.github.io',
  email: 'lai15914091693@gmail.com',
  handle: '@爆蛋BD',
  description: 'STUDIO|BD makes AI-native brand content: campaign imagery, product films, digital humans and brand websites.',
};

const WEB_ROLE = 'Brand design, visual direction, content selection and development. I led the team that produced the content.';

// Three brand websites, shown as stacked panels.
export const websites = [
  {
    id: 'huayi', name: 'Huayi Space', url: 'https://www.huayispace.vip/home/', domain: 'huayispace.vip',
    kind: 'Brand website and AI campaign', role: WEB_ROLE,
    video: 'web/huayi', phone: 'web/huayi-m2',
    text: 'A Shenzhen furniture house built on original design. I led its digital flagship from brand identity to code, then extended it into AI campaigns and social films.',
    quote: 'Doing one thing to the extreme beats doing ten thousand things averagely.',
  },
  {
    id: 'gemrein', name: 'Gemrein', url: 'https://www.gemrein.com/', domain: 'gemrein.com',
    kind: 'Brand launch website', role: WEB_ROLE,
    video: 'web/gemrein', shot: 'web/gemrein-d4',
    text: 'The independent design label of the Huayi group, relaunched in 2025. A brand "with blue blood": the site opens in a palazzo with a single cobalt sofa and lets each room speak full-screen.',
    quote: 'Elegant rebellion. The enemy of the ordinary.',
  },
  {
    id: 'hothing', name: 'Hothing', url: 'https://www.hothing.vip/', domain: 'hothing.vip',
    kind: 'Brand website', role: WEB_ROLE,
    video: 'web/hothing', phone: 'web/hothing-m1',
    text: 'A furniture brand with its own independent design language. The site moves from a chrome figure in the dark into a catalogue of originals, the designers behind them and their craft.',
  },
];

// Huayi Space social films (post carousel).
export const social = [
  { video: 'social/huayi-01', title: 'Classic of Mountains and Seas', caption: 'An ink-dark myth told in silhouettes and firelight.', likes: '1,204' },
  { video: 'social/huayi-02', title: 'Visitors of the grassland', caption: 'We are all visitors to this time, this place. A home pitched under the Mongolian sky.', likes: '986' },
  { video: 'social/huayi-03', title: 'Wabi-sabi', caption: 'A sea cave, a sofa and the beauty of the imperfect.', likes: '1,532' },
  { video: 'social/huayi-04', title: 'French Design Award, gold', caption: 'Celebrating the Hercules and Knot chairs. Chinese design, world quality.', likes: '2,087' },
];

// Huayi Space sofa campaign (editorial carousel).
export const worlds = [
  { src: 'huayi/sofa-07', title: ['Sea', 'cliff'] },
  { src: 'huayi/sofa-10', title: ['Sunset', 'dunes'] },
  { src: 'huayi/sofa-03', title: ['Raw', 'concrete'] },
  { src: 'huayi/sofa-01', title: ['Blueprint', 'storm'] },
  { src: 'huayi/sofa-11', title: ['Morning', 'room'] },
  { src: 'huayi/sofa-05', title: ['Desert', 'walk'] },
  { src: 'huayi/sofa-04', title: ['Striped', 'light'] },
];

// Films (cards that open a player with sound).
export const films = [
  { video: 'moto/ride-at-dawn', title: 'Ride at Dawn', tag: 'Superbike film', length: '1:01' },
  { video: 'e8/exterior', title: 'E8 Exterior', tag: 'Film study', length: '0:30' },
  { video: 'e8/interior', title: 'E8 Interior', tag: 'Film study', length: '0:40' },
  { video: 'e8/lifestyle', title: 'E8 Lifestyle', tag: 'Film study', length: '1:12' },
  { video: 'baodan/catfood', title: 'Salmon Cat Food', tag: 'BAODAN launch', length: '0:15' },
];
export const filmsNote = 'Ride at Dawn and the E8 films are self-initiated studies in automotive imagery. The E8 series uses the GAC Trumpchi E8 PHEV as its subject and was not commissioned by GAC.';

// Collection story deck: one card per campaign (cover image). Each opens a carousel of the campaign.
const range = (folder, n) => Array.from({ length: n }, (_, i) => `${folder}/${String(i + 1).padStart(2, '0')}`);
export const collection = [
  { cover: 'baodan/honey-black-05', name: 'Black Gold Honey', tag: 'BAODAN', mode: 'depth', items: range('g-honeyblack', 11), text: 'A matte black jar with a gold hexagon window. Studio brand.' },
  { cover: 'jewelry/mereki-01', name: 'MEREKI Band', tag: 'Jewelry', mode: 'arc', items: range('g-mereki', 13), text: 'One engraved band in gold, silver and rose gold, across four casts.' },
  { cover: 'huayi/sofa-07', name: 'Bouclé Sofa', tag: 'Huayi Space', mode: 'depth', items: range('huayi/sofa', 13).map((s) => s.replace('/sofa/', '/sofa-')), text: 'One sofa, held perfectly consistent across sea cliffs, dunes and concrete.' },
  { cover: 'jewelry/aquamarine-06', name: 'Aquamarine Bloom', tag: 'Jewelry', mode: 'arc', items: range('g-aqua', 13), text: 'Bridal veils, a hyacinth macaw and red ribbon. The same six-petal ring in every frame.' },
  { cover: 'lab/glasses-01', name: 'Amber Frames', tag: 'Eyewear', mode: 'depth', items: range('g-eyewear', 14), text: 'Amber acetate frames, from a library chair to a vintage blue coupé.' },
  { cover: 'baodan/catfood-01', name: 'Salmon Cat Food', tag: 'BAODAN', mode: 'depth', items: range('g-catfood', 10), text: 'A full-orange key visual system for a salmon recipe. Studio brand.' },
  { cover: 'jewelry/solitaire-04', name: 'Solitaire', tag: 'Jewelry', mode: 'depth', items: range('g-solitaire', 9), text: 'A single diamond on velvet, rope, a rose and a calla lily, then on the hand.' },
  { cover: 'lab/lamp-05', name: 'Cordless Lamp', tag: 'Concept', mode: 'arc', items: range('g-lamp', 12), text: 'Fluted brass and green glass, carried from room to room.' },
  { cover: 'baodan/honey-01', name: 'Wildflower Honey', tag: 'BAODAN', mode: 'depth', items: range('g-honey', 8), text: 'Kraft paper, linen and a meadow full of bees. Studio brand.' },
  { cover: 'lab/santa-02', name: 'Hip-hop Santa', tag: 'Christmas', mode: 'arc', items: range('g-santa', 7), text: 'Bubble gum, white shades and a reindeer with a scarf.' },
  { cover: 'baodan/oats-01', name: 'Protein Oats', tag: 'BAODAN', mode: 'depth', items: range('g-oats', 8), text: 'A breakfast pack in warm terracotta, mid-pour and mid-air. Studio brand.' },
  { cover: 'digital-humans/uniform-02', name: 'Red Frames', tag: 'Digital human', mode: 'arc', items: range('digital-humans/uniform', 6).map((s) => s.replace('/uniform/', '/uniform-')), text: 'A burgundy uniform and red frames, shot from every angle.' },
];

// Light and Shadow (bending WebGL strip).
export const light = [
  ['light-shadow/ls-13', 'Laser grid'], ['light-shadow/ls-03', 'Halo'], ['light-shadow/ls-07', 'Eclipse'], ['light-shadow/ls-04', 'Light speed'],
  ['light-shadow/ls-02', 'Neon script'], ['light-shadow/ls-09', 'Sunset disc'], ['light-shadow/ls-12', 'Orbit'], ['light-shadow/ls-05', 'Rainbow'],
  ['light-shadow/ls-10', 'Leap'], ['light-shadow/ls-08', 'Ring light'], ['light-shadow/ls-11', 'Yellow cut'], ['light-shadow/ls-01', 'Ember lens'],
  ['light-shadow/ls-06', 'Spotlight'],
];

// Digital humans (fanned cards).
export const faces = [
  ['digital-humans/designer-05', 'The jewelry designer'], ['digital-humans/shades-01', 'Red lens'], ['digital-humans/pink-02', 'Pink room'],
  ['digital-humans/uniform-02', 'Campus look'], ['digital-humans/designer-08', 'The jewelry designer'], ['digital-humans/shades-03', 'Red lens'],
  ['digital-humans/designer-01', 'The jewelry designer'], ['digital-humans/pink-03', 'Pink room'], ['digital-humans/uniform-04', 'Campus look'],
  ['digital-humans/designer-07', 'The jewelry designer'], ['digital-humans/shades-04', 'Red lens'],
];
