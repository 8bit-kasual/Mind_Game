// data.jsx — profiles, question generators, badges, localStorage

const PROFILE_DEFAULTS = [
  { id: 'child1', name: 'Ellie',  emoji: '🦋', color: '#EC4899', age: 5 },
  { id: 'child2', name: 'Everlyn', emoji: '🐞', color: '#3B82F6', age: 4 },
];

const SKILL_CONFIG = [
  {
    id: 'counting', name: 'Counting', emoji: '🐾',
    maxLevel: 3,
    levelNames: ['Count to 5', 'Count to 10', 'Count to 15'],
    colors: { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32', shadow: '#388E3C' },
  },
  {
    id: 'addition', name: 'Adding', emoji: '🌟',
    maxLevel: 3,
    levelNames: ['Sums to 5', 'Sums to 10', 'Sums to 15'],
    colors: { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0', shadow: '#1976D2' },
  },
  {
    id: 'geometry', name: 'Shapes', emoji: '🔷',
    maxLevel: 3,
    levelNames: ['Basic Shapes', 'More Shapes', 'All Shapes'],
    colors: { bg: '#F3E5F5', border: '#9C27B0', text: '#6A1B9A', shadow: '#7B1FA2' },
  },
];

const ANIMALS = ['🐦','🐸','🦋','🐝','🐌','🦎','🐢','🦜','🐻','🦊','🐨','🦁','🐧','🦩','🐿️'];
const ANIMAL_NAMES = {
  '🐦':'birds','🐸':'frogs','🦋':'butterflies','🐝':'bees','🐌':'snails',
  '🦎':'lizards','🐢':'turtles','🦜':'parrots','🐻':'bears','🦊':'foxes',
  '🐨':'koalas','🦁':'lions','🐧':'penguins','🦩':'flamingos','🐿️':'squirrels',
};

const SHAPES_L1 = [
  { name: 'Circle',    color: '#FF6B6B', type: 'circle'    },
  { name: 'Square',    color: '#4ECDC4', type: 'square'    },
  { name: 'Triangle',  color: '#FFD93D', type: 'triangle'  },
];
const SHAPES_L2 = [
  ...SHAPES_L1,
  { name: 'Rectangle', color: '#6BCF7F', type: 'rectangle' },
  { name: 'Diamond',   color: '#C3B1E1', type: 'diamond'   },
  { name: 'Oval',      color: '#FFB347', type: 'oval'      },
];
const SHAPES_L3 = [
  ...SHAPES_L2,
  { name: 'Star',      color: '#FFD700', type: 'star'      },
  { name: 'Heart',     color: '#FF69B4', type: 'heart'     },
];

const ALL_SHAPES = { 1: SHAPES_L1, 2: SHAPES_L2, 3: SHAPES_L3 };

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function generateChoices(correct, total, min, max) {
  const s = new Set([correct]);
  let attempts = 0;
  while (s.size < total && attempts < 200) {
    attempts++;
    const offset = randInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
    const c = Math.max(min, Math.min(max, correct + offset));
    if (c !== correct) s.add(c);
  }
  let n = min;
  while (s.size < total) { if (n !== correct) s.add(n); n++; }
  return shuffle([...s].slice(0, total));
}

function randomAnimal(exclude) {
  let a;
  do { a = ANIMALS[randInt(0, ANIMALS.length - 1)]; } while (a === exclude);
  return a;
}

function generateCountingQuestion(level) {
  const ranges = [[1,5],[6,10],[10,15]];
  const [lo, hi] = ranges[level - 1];
  const count = randInt(lo, hi);
  const animal = randomAnimal();
  const choices = generateChoices(count, 4, Math.max(1, lo - 1), hi + 2);
  return { type: 'counting', animal, animalName: ANIMAL_NAMES[animal], count, choices, correct: count, question: `How many ${ANIMAL_NAMES[animal]} do you see?` };
}

function generateAdditionQuestion(level) {
  const maxSums = [5, 10, 15];
  const maxSum = maxSums[level - 1];
  const a = randInt(1, Math.floor(maxSum / 2));
  const b = randInt(1, maxSum - a);
  const correct = a + b;
  const animal1 = randomAnimal();
  const animal2 = randomAnimal(animal1);
  const choices = generateChoices(correct, 4, Math.max(1, correct - 3), correct + 4);
  return { type: 'addition', a, b, animal1, animal2, correct, choices, question: `${a} + ${b} = ?` };
}

function generateShapeQuestion(level) {
  const shapeSet = ALL_SHAPES[level];
  const shape = shapeSet[randInt(0, shapeSet.length - 1)];
  const wrongs = shuffle(shapeSet.filter(s => s.name !== shape.name)).slice(0, 3);
  const choices = shuffle([shape.name, ...wrongs.map(s => s.name)]);
  return { type: 'shapes', shape, correct: shape.name, choices, question: 'What shape is this?' };
}

function generateQuestion(skill, level) {
  if (skill === 'counting') return generateCountingQuestion(level);
  if (skill === 'addition') return generateAdditionQuestion(level);
  if (skill === 'geometry') return generateShapeQuestion(level);
}

function generateSession(skill, level, count = 8) {
  return Array.from({ length: count }, () => generateQuestion(skill, level));
}

// --- Badges ---
const BADGES = [
  { id: 'first_star',     emoji: '⭐', name: 'First Star!',      desc: 'Earned your first star',              condition: (p)       => p.totalStars >= 1 },
  { id: 'ten_stars',      emoji: '🌟', name: 'Star Collector',   desc: 'Earned 10 stars total',               condition: (p)       => p.totalStars >= 10 },
  { id: 'counting_2',     emoji: '🐾', name: 'Counting Champ',   desc: 'Reached Level 2 in Counting',         condition: (p)       => p.skillLevels.counting >= 2 },
  { id: 'counting_3',     emoji: '🔢', name: 'Counting Master',  desc: 'Reached Level 3 in Counting',         condition: (p)       => p.skillLevels.counting >= 3 },
  { id: 'addition_2',     emoji: '➕', name: 'Addition Ace',     desc: 'Reached Level 2 in Adding',           condition: (p)       => p.skillLevels.addition >= 2 },
  { id: 'geometry_2',     emoji: '🔷', name: 'Shape Explorer',   desc: 'Reached Level 2 in Shapes',           condition: (p)       => p.skillLevels.geometry >= 2 },
  { id: 'perfect',        emoji: '🏆', name: 'Perfect Score!',   desc: 'Got 8/8 in a session',                condition: (p, s)    => s && s.correct === s.total },
  { id: 'on_fire',        emoji: '🔥', name: 'On Fire!',         desc: 'Got 5 in a row during a game',        condition: (p, s)    => s && s.maxStreak >= 5 },
];

// --- localStorage ---
function loadProfiles() {
  try {
    const raw = localStorage.getItem('mathAdv_profiles_v3');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return PROFILE_DEFAULTS.map(p => ({
    ...p,
    skillLevels:   { counting: 1, addition: 1, geometry: 1 },
    skillProgress: { counting: 0, addition: 0, geometry: 0 },
    totalStars: 0,
    badges: [],
    sessions: [],
    needsHelp: { counting: false, addition: false, geometry: false },
  }));
}

function saveProfiles(profiles) {
  try { localStorage.setItem('mathAdv_profiles_v3', JSON.stringify(profiles)); } catch (e) {}
}

Object.assign(window, {
  PROFILE_DEFAULTS, SKILL_CONFIG, ANIMALS, ANIMAL_NAMES,
  BADGES, ALL_SHAPES,
  randInt, shuffle,
  generateSession, generateQuestion,
  loadProfiles, saveProfiles,
});
