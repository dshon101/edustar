// ================================================================
// EDUSTAR — Shared Data & Utilities
// ================================================================

// ── THEME & FONT (applied globally on every page) ────────────────
(function applyGlobalPreferences() {
  const theme = localStorage.getItem('edustar_theme') || 'dark';
  const font  = localStorage.getItem('edustar_font')  || 'normal';
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-font',  font);
})();

// ── AUTH HELPERS ──────────────────────────────────────────────────
function getStudent() {
  try { return JSON.parse(localStorage.getItem('edustar_current') || 'null'); } catch { return null; }
}
function saveStudent(s) {
  localStorage.setItem('edustar_current', JSON.stringify(s));
  // Also update in users list
  const users = getUsers();
  const idx = users.findIndex(u => u.email === s.email);
  if (idx !== -1) { users[idx] = s; saveUsers(users); }
}
function getUsers() { try { return JSON.parse(localStorage.getItem('edustar_users') || '[]'); } catch { return []; } }
function saveUsers(u) { localStorage.setItem('edustar_users', JSON.stringify(u)); }
function requireAuth() {
  const s = getStudent();
  if (!s) { window.location.href = '/index.html'; return null; }
  return s;
}
function logout() { localStorage.removeItem('edustar_current'); window.location.href = '/index.html'; }

// ── GRADE LEVEL MAPPING ─────────────────────────────────────────
function getGradeLevel(grade) {
  const earlyGrades = ['PP1','PP2','Grade 1','Grade 2','Grade 3','Primary 1','Primary 2','Primary 3','Standard 1','Standard 2','Standard 3','P1','P2','P3','Class 1','Class 2','Class 3','S1 (primary)','Form 1 (primary)','CI','CP','CE1'];
  const midGrades   = ['Grade 4','Grade 5','Grade 6','Grade 7','Primary 4','Primary 5','Primary 6','Standard 4','Standard 5','Standard 6','Standard 7','P4','P5','P6','P7','Class 4','Class 5','Class 6','CE2','CM1','CM2'];
  const lowerSec    = ['Grade 8','Grade 9','JSS 1','JSS 2','JSS 3','Form 1','Form 2','Form 3','S1','S2','S3','JHS 1','JHS 2','JHS 3','Standard 8','6ème','5ème','4ème','3ème'];
  const upperSec    = ['Grade 10','Grade 11','Grade 12','SSS 1','SSS 2','SSS 3','Form 4','Form 5','Form 6','S4','S5','S6','SHS 1','SHS 2','SHS 3','2nde','1ère','Terminale'];
  if (earlyGrades.some(g => grade.includes(g.replace(/\(.*\)/,'').trim()) || grade === g)) return 'early';
  if (midGrades.some(g => grade === g || grade.includes(g))) return 'middle';
  if (upperSec.some(g => grade === g || grade.includes(g))) return 'upper';
  return 'lower';
}

// ── COUNTRY NAMES ────────────────────────────────────────────────
const COUNTRY_NAMES = {
  KE:'Kenya',NG:'Nigeria',ZA:'South Africa',TZ:'Tanzania',UG:'Uganda',
  GH:'Ghana',ZW:'Zimbabwe',ZM:'Zambia',ET:'Ethiopia',RW:'Rwanda',
  MZ:'Mozambique',MW:'Malawi',BW:'Botswana',SN:'Senegal',CI:"Côte d'Ivoire"
};
const COUNTRY_FLAGS = { KE:'🇰🇪',NG:'🇳🇬',ZA:'🇿🇦',TZ:'🇹🇿',UG:'🇺🇬',GH:'🇬🇭',ZW:'🇿🇼',ZM:'🇿🇲',ET:'🇪🇹',RW:'🇷🇼',MZ:'🇲🇿',MW:'🇲🇼',BW:'🇧🇼',SN:'🇸🇳',CI:'🇨🇮' };

// ── COUNTRY-SPECIFIC CURRICULUM NOTES ───────────────────────────
const COUNTRY_CURRICULUM = {
  KE: { system:'CBC (Competency Based Curriculum)', examBoard:'KNEC', keyExams:['KCPE (Grade 6)','KCSE (Grade 12)'], languages:['English','Kiswahili'] },
  NG: { system:'9-3-4 System', examBoard:'WAEC / NECO', keyExams:['BECE (JSS3)','WASSCE (SSS3)'], languages:['English','Yoruba','Hausa','Igbo'] },
  ZA: { system:'CAPS (Curriculum and Assessment Policy Statements)', examBoard:'DBE', keyExams:['NSC (Grade 12 Matric)'], languages:['English','Afrikaans','Zulu','Xhosa','+ 8 more'] },
  TZ: { system:'Tanzania Institute of Education Curriculum', examBoard:'NECTA', keyExams:['PSLE (Standard 7)','CSEE (Form 4)','ACSEE (Form 6)'], languages:['Swahili','English'] },
  UG: { system:'Uganda National Curriculum Framework', examBoard:'UNEB', keyExams:['PLE (P7)','UCE (S4)','UACE (S6)'], languages:['English','Luganda'] },
  GH: { system:'National Curriculum Framework', examBoard:'WAEC Ghana', keyExams:['BECE (JHS3)','WASSCE (SHS3)'], languages:['English'] },
  ZW: { system:'Zimbabwe School Curriculum', examBoard:'ZIMSEC', keyExams:['Grade 7','O-Level (Form 4)','A-Level (Form 6)'], languages:['English','Shona','Ndebele'] },
  ZM: { system:'Zambia School Curriculum', examBoard:'ECZ', keyExams:['Grade 9','Grade 12'], languages:['English'] },
  ET: { system:'General Education Quality Improvement Program', examBoard:'MOE Ethiopia', keyExams:['Grade 8 National Exam','Grade 10','Grade 12 EUEE'], languages:['Amharic','English'] },
  RW: { system:'Competence Based Curriculum', examBoard:'REB', keyExams:['P6 National Exam','S3','S6 National Exam'], languages:['Kinyarwanda','English','French'] },
};

// ── SUBJECTS DATA (with grade-differentiated content) ────────────
const ALL_SUBJECTS = [
  { id:'math',    name:'Mathematics',      icon:'📐', desc:'Numbers, algebra, geometry, calculus and more', badge:{text:'Core',cls:'badge-orange'}, category:'core' },
  { id:'english', name:'English Language', icon:'📖', desc:'Grammar, writing, comprehension and literature', badge:{text:'Core',cls:'badge-orange'}, category:'core' },
  { id:'science', name:'Science',          icon:'🔬', desc:'Biology, chemistry, physics and nature', badge:{text:'Core',cls:'badge-green'}, category:'core' },
  { id:'history', name:'History',          icon:'🏛️', desc:'African and world history, culture and events', badge:{text:'Popular',cls:'badge-blue'}, category:'humanities' },
  { id:'geography', name:'Geography',      icon:'🌍', desc:'Maps, climate, ecosystems, resources', badge:{text:'Popular',cls:'badge-blue'}, category:'humanities' },
  { id:'biology', name:'Biology',          icon:'🧬', desc:'Living organisms, cells, genetics, ecology', badge:{text:'Sciences',cls:'badge-green'}, category:'sciences' },
  { id:'chemistry', name:'Chemistry',      icon:'⚗️', desc:'Atoms, molecules, reactions, periodic table', badge:{text:'Sciences',cls:'badge-green'}, category:'sciences' },
  { id:'physics',  name:'Physics',         icon:'⚛️', desc:'Motion, energy, electricity, waves', badge:{text:'Sciences',cls:'badge-green'}, category:'sciences' },
  { id:'math-adv', name:'Mathematics (Advanced)', icon:'∑', desc:'Calculus, statistics, linear algebra', badge:{text:'Advanced',cls:'badge-gold'}, category:'sciences' },
  { id:'economics', name:'Economics',      icon:'📈', desc:'Micro & macro economics, markets, trade', badge:{text:'Commerce',cls:'badge-gold'}, category:'commerce' },
  { id:'accounting', name:'Accounting',    icon:'🧾', desc:'Bookkeeping, financial statements, taxation', badge:{text:'Commerce',cls:'badge-gold'}, category:'commerce' },
  { id:'commerce', name:'Commerce',        icon:'🤝', desc:'Trade, business transactions, banking', badge:{text:'Commerce',cls:'badge-gold'}, category:'commerce' },
  { id:'business', name:'Business Studies',icon:'💼', desc:'Entrepreneurship, management, marketing', badge:{text:'Commerce',cls:'badge-gold'}, category:'commerce' },
  { id:'computer', name:'Computer Studies',icon:'💻', desc:'ICT, coding basics, digital skills, internet', badge:{text:'Tech',cls:'badge-blue'}, category:'tech' },
  { id:'literature', name:'Literature',    icon:'📚', desc:'Poetry, prose, drama, literary analysis', badge:{text:'Arts',cls:'badge-blue'}, category:'humanities' },
  { id:'religious', name:'Religious Studies',icon:'✝️', desc:'World religions, ethics, values, philosophy', badge:{text:'Humanities',cls:'badge-blue'}, category:'humanities' },
  { id:'civics',  name:'Civics / Social Studies', icon:'🗳️', desc:'Government, citizenship, human rights', badge:{text:'Humanities',cls:'badge-blue'}, category:'humanities' },
  { id:'kiswahili', name:'Kiswahili',      icon:'🗣️', desc:'Kiswahili grammar, fasihi na uandishi', badge:{text:'Language',cls:'badge-orange'}, category:'languages' },
  { id:'french',  name:'French',           icon:'🇫🇷', desc:'Grammaire française, vocabulaire et expression', badge:{text:'Language',cls:'badge-orange'}, category:'languages' },
  { id:'agriculture', name:'Agriculture',  icon:'🌱', desc:'Farming, soil science, livestock, food security', badge:{text:'Practical',cls:'badge-green'}, category:'practical' },
  { id:'art',     name:'Art & Design',     icon:'🎨', desc:'Drawing, painting, design principles', badge:{text:'Creative',cls:'badge-orange'}, category:'practical' },
  { id:'music',   name:'Music',            icon:'🎵', desc:'Music theory, instruments, African music', badge:{text:'Creative',cls:'badge-orange'}, category:'practical' },
];

// ── LESSON CONTENT BY SUBJECT & GRADE LEVEL ─────────────────────
const LESSONS = {
  math: {
    early: [
      { id:'math-e1', title:'Counting Numbers 1–100', time:'15 min', points:50, body:`<h3>Learning to Count</h3><p>Counting is the foundation of all mathematics! Let's learn to count from 1 to 100.</p><div class="highlight-box">🔢 Numbers from 1 to 10: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10<br>After 10 comes 11, 12... all the way to 20, then 30, 40... until 100!</div><h3>Counting in Tens</h3><div class="example-box">10, 20, 30, 40, 50, 60, 70, 80, 90, 100</div><p>If you have 3 groups of 10 mangoes, you have 30 mangoes altogether!</p><h3>Practice</h3><div class="highlight-box">🥚 Count the eggs in a basket: 1, 2, 3... Can you count to 20?</div>` },
      { id:'math-e2', title:'Addition & Subtraction Basics', time:'20 min', points:50, body:`<h3>Adding Numbers</h3><p>Addition means putting numbers <strong>together</strong> to find a total.</p><div class="example-box">3 + 4 = 7   (3 apples plus 4 apples = 7 apples)</div><div class="highlight-box">➕ Use your fingers to count! Hold up 3 fingers, then 4 more = 7 fingers total.</div><h3>Subtracting Numbers</h3><p>Subtraction means taking numbers <strong>away</strong>.</p><div class="example-box">10 - 3 = 7   (10 sweets minus 3 sweets = 7 sweets left)</div><h3>Word Problems</h3><p>Amara has 5 bananas. She eats 2. How many are left?</p><div class="example-box">5 - 2 = 3 bananas 🍌</div>` },
      { id:'math-e3', title:'Shapes Around Us', time:'15 min', points:50, body:`<h3>2D Shapes</h3><p>Shapes are everywhere in our world! Let's learn the most common ones.</p><div class="highlight-box">🔵 <strong>Circle</strong> — Round, like a ball or the sun<br>⬜ <strong>Square</strong> — 4 equal sides, like a window<br>🔺 <strong>Triangle</strong> — 3 sides, like a roof<br>▭ <strong>Rectangle</strong> — 4 sides, 2 long and 2 short, like a door</div><h3>Shapes in Africa</h3><p>Traditional round huts are circles. The roof is a triangle. Farms are often rectangles. Look around you — shapes are everywhere!</p>` },
    ],
    middle: [
      { id:'math-m1', title:'Understanding Fractions', time:'25 min', points:50, body:`<h3>What is a Fraction?</h3><p>A fraction represents a <strong>part of a whole</strong>. It's written as one number over another: ½, ¾, ⅔.</p><div class="highlight-box">📌 The <strong>top number</strong> = numerator (how many parts you have)<br>The <strong>bottom number</strong> = denominator (how many equal parts the whole is divided into)</div><h3>Real-Life Example</h3><div class="example-box">🥭 Cut a mango into 4 equal pieces. Eat 1 piece → you ate 1/4 of the mango.</div><h3>Adding Fractions (Same Denominator)</h3><div class="example-box">1/4 + 2/4 = 3/4</div><h3>Adding Fractions (Different Denominators)</h3><div class="example-box">1/2 + 1/3  →  3/6 + 2/6  =  5/6</div>` },
      { id:'math-m2', title:'Introduction to Algebra', time:'30 min', points:50, body:`<h3>What is Algebra?</h3><p>Algebra uses <strong>letters</strong> (variables) to represent unknown numbers.</p><div class="highlight-box">💡 A variable is like an empty box: □ + 3 = 7. What is in the box? 4!</div><h3>Solving Equations</h3><div class="example-box">x + 5 = 12\nx = 12 − 5\nx = 7 ✓</div><p>Always do the same operation on <strong>both sides</strong> — like a balanced scale!</p><h3>Why Algebra Matters</h3><p>Algebra helps engineers, programmers, doctors, and scientists solve real-world problems every day.</p>` },
      { id:'math-m3', title:'Percentages & Ratios', time:'25 min', points:50, body:`<h3>What is a Percentage?</h3><p>A percentage is a fraction out of 100. The symbol is <strong>%</strong>.</p><div class="example-box">50% = 50/100 = 0.5 = half\n75% = 75/100 = three quarters</div><div class="highlight-box">💰 If a shirt costs 500 KES and is 20% off: 20% of 500 = 100. New price = 400 KES!</div><h3>Ratios</h3><p>A ratio compares two amounts. If a class has 15 girls and 10 boys, the ratio is 15:10 or simplified 3:2.</p>` },
    ],
    lower: [
      { id:'math-l1', title:'Linear Equations & Inequalities', time:'35 min', points:50, body:`<h3>Linear Equations</h3><p>A linear equation has a variable raised to the power of 1. The graph is always a straight line.</p><div class="example-box">2x + 3 = 11\n2x = 11 - 3 = 8\nx = 8 ÷ 2 = 4</div><h3>Simultaneous Equations</h3><div class="example-box">x + y = 10  ... (i)\n2x - y = 5  ... (ii)\nAdd: 3x = 15, so x = 5, y = 5</div><div class="highlight-box">✅ Always check your answer by substituting back into BOTH equations.</div>` },
      { id:'math-l2', title:'Geometry: Angles & Triangles', time:'30 min', points:50, body:`<h3>Types of Angles</h3><div class="highlight-box">📐 Acute: less than 90° | Right: exactly 90° | Obtuse: 90°–180° | Reflex: greater than 180°</div><h3>Triangles</h3><p>All angles in a triangle add up to <strong>180°</strong>.</p><div class="example-box">Equilateral: all sides equal (60°, 60°, 60°)\nIsosceles: two sides equal\nScalene: no sides equal</div><h3>Pythagoras Theorem</h3><div class="example-box">For a right-angled triangle:\na² + b² = c²  (c = hypotenuse)</div>` },
    ],
    upper: [
      { id:'math-u1', title:'Quadratic Equations', time:'40 min', points:50, body:`<h3>Standard Form</h3><p>A quadratic equation has the form: <strong>ax² + bx + c = 0</strong></p><h3>Solving by Factorisation</h3><div class="example-box">x² + 5x + 6 = 0\n(x + 2)(x + 3) = 0\nx = -2  or  x = -3</div><h3>The Quadratic Formula</h3><div class="example-box">x = (-b ± √(b²-4ac)) / 2a</div><div class="highlight-box">💡 Use the discriminant (b²-4ac) to determine the nature of roots:<br>If > 0: two distinct real roots<br>If = 0: one repeated root<br>If < 0: no real roots (complex)</div>` },
      { id:'math-u2', title:'Calculus: Differentiation', time:'45 min', points:50, body:`<h3>What is Differentiation?</h3><p>Differentiation finds the <strong>rate of change</strong> of a function — the slope of a curve at any point.</p><h3>Basic Rules</h3><div class="example-box">d/dx(xⁿ) = nxⁿ⁻¹\nd/dx(5x³) = 15x²\nd/dx(constant) = 0</div><h3>Applications</h3><div class="highlight-box">📈 Finding maximum profit in business<br>🚗 Calculating velocity from a position function<br>📐 Optimising area and volume problems</div>` },
    ],
  },

  biology: {
    early: [{ id:'bio-e1', title:'Living and Non-Living Things', time:'20 min', points:50, body:`<h3>What is Alive?</h3><p>Living things can grow, feed, move, reproduce and respond to their environment.</p><div class="highlight-box">🌿 <strong>Living:</strong> plants, animals, fungi, bacteria<br>🪨 <strong>Non-living:</strong> rocks, water, air, soil</div><h3>Characteristics of Life (MRS GREN)</h3><div class="example-box">M - Movement\nR - Respiration\nS - Sensitivity\nG - Growth\nR - Reproduction\nE - Excretion\nN - Nutrition</div>` }],
    middle: [{ id:'bio-m1', title:'The Cell — Basic Unit of Life', time:'30 min', points:50, body:`<h3>What is a Cell?</h3><p>All living things are made of cells. A cell is the smallest unit that can perform life functions.</p><div class="highlight-box">🔬 <strong>Animal Cell:</strong> cell membrane, nucleus, cytoplasm, mitochondria<br>🌱 <strong>Plant Cell:</strong> all of the above PLUS cell wall, chloroplasts, and large vacuole</div><h3>Cell Functions</h3><div class="example-box">Nucleus → controls cell activities (the "brain")\nMitochondria → produces energy (ATP)\nChloroplasts → photosynthesis (plants only)</div>` }],
    lower: [{ id:'bio-l1', title:'Photosynthesis and Respiration', time:'35 min', points:50, body:`<h3>Photosynthesis</h3><div class="example-box">6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂</div><p>Plants convert sunlight, water, and carbon dioxide into glucose and oxygen inside chloroplasts.</p><h3>Cellular Respiration</h3><div class="example-box">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (energy)</div><div class="highlight-box">🌡️ Aerobic respiration uses oxygen. Anaerobic doesn't — but produces lactic acid or ethanol.</div>` }],
    upper: [{ id:'bio-u1', title:'Genetics and DNA', time:'45 min', points:50, body:`<h3>DNA Structure</h3><p>DNA (Deoxyribonucleic Acid) is a double helix made of nucleotides containing bases: <strong>A-T</strong> and <strong>G-C</strong> pairs.</p><h3>Mendelian Genetics</h3><div class="example-box">Dominant (T) vs Recessive (t)\nTT = tall, Tt = tall, tt = short\nCross Tt × Tt: TT, Tt, Tt, tt → 3:1 ratio</div><div class="highlight-box">💉 Gene mutations can cause diseases. Natural selection favours beneficial mutations over time.</div>` }],
  },

  chemistry: {
    early: [{ id:'chem-e1', title:'Matter Around Us', time:'20 min', points:50, body:`<h3>What is Matter?</h3><p>Matter is anything that has mass and takes up space. Everything around you is made of matter!</p><div class="highlight-box">💧 <strong>Solid:</strong> fixed shape and volume (rock, wood)<br>💧 <strong>Liquid:</strong> fixed volume, takes shape of container (water)<br>💨 <strong>Gas:</strong> no fixed shape or volume (air, steam)</div>` }],
    middle: [{ id:'chem-m1', title:'Atoms, Elements and Compounds', time:'30 min', points:50, body:`<h3>The Atom</h3><p>Atoms are the building blocks of matter. Everything is made of atoms!</p><div class="example-box">Protons (+) → in nucleus\nNeutrons (0) → in nucleus\nElectrons (-) → orbit nucleus</div><div class="highlight-box">🔬 An <strong>element</strong> has only one type of atom (e.g. gold = Au). A <strong>compound</strong> has two or more elements bonded together (e.g. water = H₂O).</div>` }],
    lower: [{ id:'chem-l1', title:'Chemical Reactions & Equations', time:'35 min', points:50, body:`<h3>Chemical Equations</h3><p>A chemical equation shows what happens during a reaction. Reactants → Products.</p><div class="example-box">2H₂ + O₂ → 2H₂O\n(Hydrogen + Oxygen → Water)</div><div class="highlight-box">⚖️ Law of Conservation of Mass: atoms are neither created nor destroyed — they are rearranged. Balance equations to reflect this!</div>` }],
    upper: [{ id:'chem-u1', title:'Electrochemistry & Redox Reactions', time:'45 min', points:50, body:`<h3>Oxidation and Reduction</h3><div class="highlight-box">OIL RIG:<br><strong>O</strong>xidation <strong>I</strong>s <strong>L</strong>oss of electrons<br><strong>R</strong>eduction <strong>I</strong>s <strong>G</strong>ain of electrons</div><h3>Electrochemical Cells</h3><div class="example-box">Galvanic cell → spontaneous reaction produces electricity\nElectrolytic cell → electricity forces a non-spontaneous reaction\nExample: electroplating chrome onto car parts</div>` }],
  },

  physics: {
    early: [{ id:'phy-e1', title:'Forces and Motion', time:'20 min', points:50, body:`<h3>What is a Force?</h3><p>A force is a push or pull. Forces can make objects move, stop, or change direction.</p><div class="highlight-box">🏈 Push: kicking a football away from you<br>🧲 Pull: a magnet attracting iron objects<br>🌍 Gravity: the force that pulls everything toward Earth</div>` }],
    middle: [{ id:'phy-m1', title:"Newton's Laws of Motion", time:'35 min', points:50, body:`<h3>Newton's Three Laws</h3><div class="highlight-box">1️⃣ <strong>Inertia:</strong> An object stays at rest or in motion unless a force acts on it.<br><br>2️⃣ <strong>F = ma:</strong> Force = mass × acceleration. More mass needs more force to accelerate.<br><br>3️⃣ <strong>Action-Reaction:</strong> Every action has an equal and opposite reaction.</div><h3>Real World Application</h3><div class="example-box">A car of mass 1000 kg accelerates at 3 m/s²\nForce = 1000 × 3 = 3000 N</div>` }],
    lower: [{ id:'phy-l1', title:'Electricity and Circuits', time:'35 min', points:50, body:`<h3>Electric Current</h3><p>Current is the flow of electrons through a conductor. Measured in <strong>Amperes (A)</strong>.</p><div class="example-box">Ohm's Law: V = IR\nV = Voltage (Volts), I = Current (Amps), R = Resistance (Ohms)</div><div class="highlight-box">🔌 Series circuit: all components in one loop. If one breaks, all stop.<br>⚡ Parallel circuit: multiple paths. If one breaks, others continue.</div>` }],
    upper: [{ id:'phy-u1', title:'Waves and Electromagnetic Spectrum', time:'40 min', points:50, body:`<h3>Wave Properties</h3><div class="example-box">Wavelength (λ) — distance between two peaks\nFrequency (f) — waves per second (Hz)\nAmplitude — height of wave\nSpeed: v = fλ</div><h3>The EM Spectrum</h3><div class="highlight-box">📻 Radio → Microwave → Infrared → Visible Light → UV → X-rays → Gamma rays<br><br>Higher frequency = more energy = more dangerous</div>` }],
  },

  economics: {
    lower: [{ id:'eco-l1', title:'Introduction to Economics', time:'30 min', points:50, body:`<h3>What is Economics?</h3><p>Economics studies how people, businesses, and governments make choices about scarce resources.</p><div class="highlight-box">🤔 The central economic problem: unlimited wants vs limited resources.<br>This forces us to make choices — and choices have <strong>opportunity costs</strong>.</div><h3>Key Concepts</h3><div class="example-box">Scarcity → not enough resources for all wants\nOpportunity Cost → the next best alternative given up\nProduction Possibility Frontier (PPF) → max output combinations</div>` }],
    upper: [{ id:'eco-u1', title:'Supply, Demand & Market Equilibrium', time:'40 min', points:50, body:`<h3>The Law of Demand</h3><p>As price rises, quantity demanded falls (inverse relationship) — ceteris paribus.</p><h3>The Law of Supply</h3><p>As price rises, quantity supplied rises (direct relationship).</p><h3>Market Equilibrium</h3><div class="example-box">Where supply curve meets demand curve.\nAt equilibrium: Qs = Qd\nAbove equilibrium → surplus\nBelow equilibrium → shortage</div><div class="highlight-box">🌍 In Africa, food price shocks often occur due to drought (supply shifts left) → price rises sharply.</div>` }],
  },

  accounting: {
    lower: [{ id:'acc-l1', title:'Introduction to Accounting', time:'30 min', points:50, body:`<h3>What is Accounting?</h3><p>Accounting is the process of recording, summarising, and reporting financial transactions of a business.</p><div class="highlight-box">📊 The Accounting Equation:<br><strong>Assets = Liabilities + Owner's Equity</strong></div><h3>Key Terms</h3><div class="example-box">Assets → what the business owns (cash, equipment)\nLiabilities → what the business owes (loans, creditors)\nEquity → owner's share of the business</div>` }],
    upper: [{ id:'acc-u1', title:'Financial Statements', time:'45 min', points:50, body:`<h3>The Income Statement</h3><div class="example-box">Revenue\n− Cost of Goods Sold\n= Gross Profit\n− Expenses\n= Net Profit (or Loss)</div><h3>The Balance Sheet</h3><div class="example-box">ASSETS\nCurrent Assets: cash, stock, debtors\nFixed Assets: land, machinery\n\nLIABILITIES & EQUITY\nCurrent Liabilities: creditors, bank overdraft\nLong-term Liabilities: loans\nEquity: capital + retained profit</div>` }],
  },

  english: {
    early: [{ id:'eng-e1', title:'Alphabet and Phonics', time:'15 min', points:50, body:`<h3>The English Alphabet</h3><p>There are 26 letters: <strong>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</strong></p><div class="highlight-box">🗣️ Vowels (A, E, I, O, U) make long and short sounds.<br>Consonants make other sounds.</div><h3>Simple Words</h3><div class="example-box">cat, dog, sun, mum, run, fun, hot, pot</div><p>Sounding out each letter helps you read new words — this is called <strong>phonics</strong>!</p>` }],
    middle: [{ id:'eng-m1', title:'Parts of Speech', time:'25 min', points:50, body:`<h3>The 8 Parts of Speech</h3><div class="highlight-box">🔵 <strong>Noun</strong> — person, place, thing (Nairobi, teacher)<br>🟢 <strong>Verb</strong> — action or state (run, is, think)<br>🟡 <strong>Adjective</strong> — describes noun (clever, tall)<br>🔴 <strong>Adverb</strong> — describes verb (quickly, always)<br>🟣 <strong>Pronoun</strong> — replaces noun (he, she, they)<br>🟠 <strong>Preposition</strong> — shows position (in, on, under)<br>⚪ <strong>Conjunction</strong> — joins clauses (and, but, because)<br>🔷 <strong>Interjection</strong> — expresses emotion (Oh! Wow!)</div>` }],
    lower: [{ id:'eng-l1', title:'Essay Writing Techniques', time:'35 min', points:50, body:`<h3>Essay Structure</h3><div class="highlight-box">📝 <strong>Introduction:</strong> Hook + Background + Thesis statement<br><strong>Body Paragraphs:</strong> Topic sentence + Evidence + Analysis + Link back<br><strong>Conclusion:</strong> Restate thesis + Summarise key points + Final thought</div><h3>The PEEL Method</h3><div class="example-box">P - Point: state your argument\nE - Evidence: quote or example\nE - Explain: analyse the evidence\nL - Link: connect back to the question</div>` }],
    upper: [{ id:'eng-u1', title:'Literary Analysis & Criticism', time:'45 min', points:50, body:`<h3>Analysing Literature</h3><p>Literary analysis examines how an author uses language, structure, and form to create meaning.</p><div class="highlight-box">🔍 <strong>Theme</strong> — central idea (love, justice, identity)<br><strong>Tone</strong> — author's attitude (melancholic, ironic)<br><strong>Imagery</strong> — sensory language that creates pictures<br><strong>Symbolism</strong> — objects representing bigger ideas</div><h3>The SMILE Framework</h3><div class="example-box">S - Structure and form\nM - Mood and tone\nI - Imagery and language\nL - Language devices\nE - Effect on reader</div>` }],
  },

  commerce: {
    lower: [{ id:'com-l1', title:'Introduction to Trade', time:'25 min', points:50, body:`<h3>What is Commerce?</h3><p>Commerce covers all activities involved in the buying and selling of goods and services.</p><div class="highlight-box">🏪 <strong>Home Trade</strong> — buying and selling within a country<br>🌍 <strong>Foreign Trade</strong> — buying (import) and selling (export) between countries</div><h3>Channels of Distribution</h3><div class="example-box">Producer → Wholesaler → Retailer → Consumer\nOr: Producer → Consumer (direct sale)</div>` }],
    upper: [{ id:'com-u1', title:'Banking and Finance', time:'35 min', points:50, body:`<h3>Functions of a Bank</h3><div class="highlight-box">💰 Accept deposits → Keep money safe<br>💳 Give loans → Earn interest income<br>🔄 Transfer money → Facilitate trade<br>📊 Invest → Grow the economy</div><h3>Types of Accounts</h3><div class="example-box">Current Account → for frequent transactions, cheque book\nSavings Account → earns interest, limited withdrawals\nFixed Deposit → locked for a term, higher interest</div>` }],
  },

  business: {
    lower: [{ id:'bus-l1', title:'Introduction to Business', time:'25 min', points:50, body:`<h3>What is a Business?</h3><p>A business is an organisation that produces goods or provides services to satisfy customer needs and make a profit.</p><div class="highlight-box">🎯 <strong>Primary sector</strong> — extracting natural resources (farming, mining)<br>🏭 <strong>Secondary sector</strong> — manufacturing (factories, construction)<br>🛒 <strong>Tertiary sector</strong> — services (banking, retail, transport)</div>` }],
    upper: [{ id:'bus-u1', title:'Marketing Mix (4Ps)', time:'35 min', points:50, body:`<h3>The 4 Ps of Marketing</h3><div class="highlight-box">📦 <strong>Product</strong> — What are you selling? Features, quality, branding<br>💰 <strong>Price</strong> — Penetration, skimming, competitive pricing<br>🏪 <strong>Place</strong> — Where/how customers buy it (distribution channels)<br>📣 <strong>Promotion</strong> — Advertising, social media, word of mouth</div><h3>African Business Context</h3><div class="example-box">M-Pesa (Kenya): revolutionised mobile money\nJumia: Africa's e-commerce leader\nDangote Group: Africa's largest conglomerate</div>` }],
  },

  history: {
    early: [{ id:'hist-e1', title:'My Family and Community', time:'15 min', points:50, body:`<h3>Your Family History</h3><p>History is about the past — and it starts with YOUR family! Your parents, grandparents, and great-grandparents are part of history.</p><div class="highlight-box">👴 <strong>Grandparents</strong> — the generation before your parents<br>🏡 <strong>Community</strong> — the people who live near you<br>📖 <strong>Oral History</strong> — stories passed down through generations by talking, not writing</div>` }],
    middle: [{ id:'hist-m1', title:'Ancient African Kingdoms', time:'30 min', points:50, body:`<h3>Great African Kingdoms</h3><div class="highlight-box">🏛️ <strong>Ancient Egypt</strong> — One of the world's first civilisations. Built pyramids, developed writing (hieroglyphics), advanced medicine.<br><br>🌍 <strong>Kingdom of Mali</strong> — Mansa Musa was possibly the wealthiest person in history. Timbuktu was a centre of Islamic scholarship.<br><br>⛏️ <strong>Kingdom of Zimbabwe</strong> — Built the Great Zimbabwe stone structures, a major trading power 900–1400 CE.</div>` }],
    lower: [{ id:'hist-l1', title:'African Independence Movements', time:'35 min', points:50, body:`<h3>Colonialism in Africa</h3><p>By the early 1900s, European powers controlled most of Africa, exploiting resources and people.</p><div class="highlight-box">🇬🇭 <strong>Ghana 1957</strong> — Kwame Nkrumah led first sub-Saharan independence<br>🇰🇪 <strong>Kenya 1963</strong> — Jomo Kenyatta became first PM after Mau Mau uprising<br>🇿🇦 <strong>South Africa 1994</strong> — Apartheid ended; Nelson Mandela elected president<br>🇿🇲 <strong>Zambia 1964</strong> — Kenneth Kaunda led independence from Britain</div>` }],
    upper: [{ id:'hist-u1', title:'Cold War and Africa', time:'40 min', points:50, body:`<h3>Cold War Impact on Africa</h3><p>The Cold War (1947–1991) was a geopolitical struggle between the USA and USSR. Africa became a battleground for influence.</p><div class="highlight-box">🇦🇴 <strong>Angola Civil War</strong> — Soviet/Cuba backed MPLA vs US-backed UNITA<br>🇨🇩 <strong>Congo Crisis</strong> — USA backed the overthrow of Patrice Lumumba (1961)<br>🇸🇴 <strong>Ethiopia/Somalia</strong> — Superpowers switched sides during the Ogaden War</div>` }],
  },

  geography: {
    early: [{ id:'geo-e1', title:'My Local Area', time:'15 min', points:50, body:`<h3>Learning About Where You Live</h3><p>Geography starts with understanding your own neighbourhood and country!</p><div class="highlight-box">🏠 <strong>Village/Town</strong> — where you live<br>🗺️ <strong>Map</strong> — a drawing that shows places from above<br>🧭 <strong>Compass</strong> — helps us find directions: North, South, East, West</div>` }],
    middle: [{ id:'geo-m1', title:"Africa's Landforms and Biomes", time:'30 min', points:50, body:`<h3>Major Landforms</h3><div class="highlight-box">🏜️ <strong>Sahara Desert</strong> — world's largest hot desert<br>🌿 <strong>Congo Rainforest</strong> — 2nd largest rainforest<br>🏔️ <strong>Mount Kilimanjaro</strong> — 5,895m, Tanzania<br>🌊 <strong>Nile River</strong> — 6,650km, world's longest river<br>🦒 <strong>Serengeti</strong> — world's largest wildlife migration</div>` }],
    lower: [{ id:'geo-l1', title:'Population and Urbanisation in Africa', time:'35 min', points:50, body:`<h3>Population Growth</h3><p>Africa has the world's fastest-growing population. By 2050, Africa will have over 2 billion people.</p><div class="highlight-box">📈 <strong>Urbanisation</strong> — movement of people from rural areas to cities<br>🏙️ <strong>Mega-cities:</strong> Lagos (25M+), Cairo (21M+), Kinshasa (16M+), Nairobi (5M+)</div><h3>Challenges of Rapid Urbanisation</h3><div class="example-box">+ Economic opportunities, better services\n- Informal settlements (slums), traffic, pollution, unemployment</div>` }],
    upper: [{ id:'geo-u1', title:'Climate Change and Africa', time:'40 min', points:50, body:`<h3>Africa's Climate Vulnerability</h3><p>Despite contributing less than 4% of global emissions, Africa faces the most severe impacts of climate change.</p><div class="highlight-box">🌡️ Rising temperatures → more intense droughts<br>🌊 Rising sea levels → flooding in coastal cities<br>🌧️ Erratic rainfall → failed harvests, food insecurity<br>🦟 Expanded malaria zones → health crisis</div><h3>African Solutions</h3><div class="example-box">Great Green Wall — planting trees across the Sahel\nM-Kopa Solar — solar power for off-grid homes in Kenya</div>` }],
  },

  literature: {
    lower: [{ id:'lit-l1', title:'Introduction to Poetry', time:'30 min', points:50, body:`<h3>What is Poetry?</h3><p>Poetry uses language in a concentrated, musical way to express feelings, ideas, and experiences.</p><div class="highlight-box">🎵 <strong>Rhythm</strong> — the beat of a poem<br>🔤 <strong>Rhyme</strong> — words that sound alike (moon/June)<br>📸 <strong>Imagery</strong> — words that create mental pictures<br>🔄 <strong>Repetition</strong> — words repeated for emphasis</div><h3>African Poetry Tradition</h3><p>Africa has a rich oral poetry tradition. Praise poetry (like Zulu <em>izibongo</em>) celebrates ancestors, kings, and community heroes.</p>` }],
    upper: [{ id:'lit-u1', title:'African Literature: Chinua Achebe', time:'45 min', points:50, body:`<h3>Chinua Achebe (1930–2013)</h3><p>Nigerian author Chinua Achebe is considered the "father of African literature." His novel <em>Things Fall Apart</em> (1958) was the first widely read African novel in English.</p><div class="highlight-box">📖 <strong>Things Fall Apart</strong> — follows Okonkwo, an Igbo warrior whose world is destroyed by colonial Christianity and British rule<br><strong>Theme:</strong> clash of cultures, colonialism, masculinity, tradition vs change<br><strong>Narrative style:</strong> uses Igbo proverbs and folklore</div>` }],
  },

  religious: {
    middle: [{ id:'rel-m1', title:'World Religions Overview', time:'25 min', points:50, body:`<h3>Major World Religions</h3><div class="highlight-box">☪️ <strong>Islam</strong> — 1.9 billion followers. 5 pillars: Shahada, Salat, Zakat, Sawm, Hajj. Sacred text: Quran.<br><br>✝️ <strong>Christianity</strong> — 2.4 billion followers. Based on teachings of Jesus Christ. Sacred text: Bible.<br><br>🕉️ <strong>Hinduism</strong> — 1.2 billion followers. Multiple deities, karma, reincarnation.<br><br>✡️ <strong>Judaism</strong> — 15 million followers. Monotheistic, Torah, covenant with God.</div>` }],
    upper: [{ id:'rel-u1', title:'Ethics and Moral Philosophy', time:'35 min', points:50, body:`<h3>Ethical Frameworks</h3><div class="highlight-box">⚖️ <strong>Utilitarianism</strong> (Bentham, Mill) — the right action is the one that produces the greatest good for the greatest number<br><br>📋 <strong>Kantian Ethics</strong> (Kant) — act only according to rules you'd want to be universal laws<br><br>🌱 <strong>Ubuntu Philosophy</strong> (African) — "I am because we are" — community and relationship-centred ethics</div>` }],
  },

  computer: {
    early: [{ id:'comp-e1', title:'What is a Computer?', time:'15 min', points:50, body:`<h3>Computer Basics</h3><p>A computer is a machine that can store and process information. It follows instructions given by programs.</p><div class="highlight-box">🖥️ <strong>Monitor</strong> — the screen you look at<br>⌨️ <strong>Keyboard</strong> — to type letters and numbers<br>🖱️ <strong>Mouse</strong> — to point and click<br>💾 <strong>CPU</strong> — the brain of the computer</div>` }],
    middle: [{ id:'comp-m1', title:'Introduction to the Internet', time:'25 min', points:50, body:`<h3>What is the Internet?</h3><p>The internet is a global network of connected computers that share information.</p><div class="highlight-box">🌐 <strong>Website</strong> — pages of information (like Google, Wikipedia)<br>📧 <strong>Email</strong> — electronic messages<br>📱 <strong>Social Media</strong> — platforms for sharing (Facebook, Twitter, TikTok)<br>🔒 <strong>Cybersecurity</strong> — protecting yourself online</div><h3>Staying Safe Online</h3><div class="example-box">✅ Use strong passwords\n✅ Don't share personal information\n✅ Tell a trusted adult if something feels wrong</div>` }],
    lower: [{ id:'comp-l1', title:'Introduction to Programming', time:'35 min', points:50, body:`<h3>What is a Program?</h3><p>A program is a set of instructions that tells a computer what to do. We write programs using <strong>programming languages</strong>.</p><div class="highlight-box">🐍 <strong>Python</strong> — great for beginners, used in AI and data science<br>🌐 <strong>HTML/CSS</strong> — builds websites<br>☕ <strong>Java</strong> — used for Android apps<br>📱 <strong>JavaScript</strong> — makes websites interactive</div><div class="example-box">Python "Hello World":\nprint("Hello, Africa! 🌍")</div>` }],
    upper: [{ id:'comp-u1', title:'Databases and SQL', time:'40 min', points:50, body:`<h3>What is a Database?</h3><p>A database is an organised collection of data. SQL (Structured Query Language) is used to manage relational databases.</p><div class="example-box">-- Create a table\nCREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  grade VARCHAR(20)\n);\n\n-- Query data\nSELECT name, grade FROM students\nWHERE grade = 'Grade 10';</div>` }],
  },

  kiswahili: {
    early: [{ id:'kis-e1', title:'Alfabeti ya Kiswahili', time:'15 min', points:50, body:`<h3>Alfabeti</h3><p>Kiswahili kinatumia alfabeti ya Kilatini. Kuna herufi 24 katika alfabeti ya Kiswahili.</p><div class="highlight-box">🔤 A, B, Ch, D, E, F, G, H, I, J, K, L, M, N, O, P, R, S, T, U, V, W, Y, Z</div><h3>Maneno Rahisi</h3><div class="example-box">Habari → Hello / How are you?\nNzuri → Fine / Good\nAsante → Thank you\nTafadhali → Please\nKaribu → Welcome</div>` }],
    middle: [{ id:'kis-m1', title:'Sarufi: Ngeli za Kiswahili', time:'30 min', points:50, body:`<h3>Ngeli (Noun Classes)</h3><p>Kiswahili kina ngeli nyingi ambazo zinaathiri viambishi vya vitenzi na vivumishi.</p><div class="highlight-box">👤 <strong>M/WA</strong> — watu: mtu/watu, mtoto/watoto<br>🌳 <strong>M/MI</strong> — miti: mti/miti<br>📚 <strong>KI/VI</strong> — vitu: kitu/vitu, kitabu/vitabu<br>🏠 <strong>N/N</strong> — nyumba, ndege, nchi</div>` }],
  },

  agriculture: {
    middle: [{ id:'agr-m1', title:'Soil and Crop Production', time:'30 min', points:50, body:`<h3>Types of Soil</h3><div class="highlight-box">🌱 <strong>Loam</strong> — best for farming; mixture of sand, silt, clay<br>🏖️ <strong>Sandy</strong> — drains fast, poor nutrients<br>🧱 <strong>Clay</strong> — holds water, can become waterlogged<br>⚫ <strong>Black Cotton</strong> — fertile but cracks when dry (common in East Africa)</div><h3>Crop Calendar (East Africa)</h3><div class="example-box">Long Rains (Mar-May): maize, beans, potatoes\nShort Rains (Oct-Dec): sorghum, millet\nIrrigation farming: tomatoes, onions (year-round)</div>` }],
    upper: [{ id:'agr-u1', title:'Modern Farming Technologies', time:'35 min', points:50, body:`<h3>Technology in African Agriculture</h3><div class="highlight-box">🛰️ <strong>Precision Farming</strong> — using GPS and sensors to optimise inputs<br>💧 <strong>Drip Irrigation</strong> — delivers water directly to roots, saves 60% water<br>🌱 <strong>Hydroponics</strong> — growing crops without soil in nutrient solution<br>📱 <strong>AgriTech Apps</strong> — M-Farm, Twiga Foods connect farmers to markets</div>` }],
  },
};

// Flatten all lessons for quiz generation
function getAllLessonsForStudent(student) {
  const level = getGradeLevel(student.grade || 'Grade 7');
  const allLessons = [];
  Object.keys(LESSONS).forEach(subj => {
    const subjLessons = LESSONS[subj];
    const levelKey = ['early','middle','lower','upper'].find(l => subjLessons[l]) || 'middle';
    const actual = subjLessons[level] || subjLessons[levelKey] || [];
    actual.forEach(l => allLessons.push({ ...l, subject: subj }));
  });
  return allLessons;
}

// ── QUIZ QUESTIONS BY SUBJECT & GRADE ───────────────────────────
const QUIZ_QUESTIONS = {
  math: {
    early: [
      { q:'What is 3 + 4?', opts:['5','6','7','8'], ans:2, explain:'3 + 4 = 7. Count on from 3: four, five, six, seven!' },
      { q:'What shape has 3 sides?', opts:['Circle','Square','Triangle','Rectangle'], ans:2, explain:'A triangle has exactly 3 sides and 3 corners.' },
      { q:'Which number comes after 9?', opts:['8','10','11','12'], ans:1, explain:'After 9 comes 10. We move to a new "ten".' },
      { q:'What is 10 - 4?', opts:['4','5','6','7'], ans:2, explain:'10 - 4 = 6. Count back 4 from 10.' },
      { q:'How many sides does a square have?', opts:['3','4','5','6'], ans:1, explain:'A square has 4 equal sides and 4 equal corners.' },
      { q:'What is 5 × 2?', opts:['7','8','10','12'], ans:2, explain:'5 × 2 = 10. Multiplication is repeated addition: 5+5=10.' },
      { q:'Which number is biggest?', opts:['17','71','7','70'], ans:1, explain:'71 is the biggest. Look at the tens digit first — 7 tens is more than 1 ten.' },
      { q:'What is half of 8?', opts:['2','3','4','5'], ans:2, explain:'Half of 8 is 4. We split 8 into two equal groups: 4 and 4.' },
      { q:'How many minutes are in one hour?', opts:['30','50','60','100'], ans:2, explain:'There are 60 minutes in one hour. Clock hands go all the way around in 60 minutes.' },
      { q:'A triangle has how many corners?', opts:['2','3','4','5'], ans:1, explain:'A triangle has 3 corners (called vertices) and 3 sides.' },
    ],
    middle: [
      { q:'What is 3/4 + 1/4?', opts:['1/2','1','4/4','3/8'], ans:1, explain:'Same denominators: add numerators → 3+1=4, so 4/4 = 1 whole.' },
      { q:'Solve: x + 7 = 15', opts:['x=7','x=8','x=9','x=22'], ans:1, explain:'x = 15 - 7 = 8. Whatever you do to one side, do to the other.' },
      { q:'What is 25% of 200?', opts:['25','50','75','100'], ans:1, explain:'25% = 1/4. 200 ÷ 4 = 50.' },
      { q:'What is the area of a rectangle 6cm by 4cm?', opts:['10 cm²','20 cm²','24 cm²','48 cm²'], ans:2, explain:'Area = length × width = 6 × 4 = 24 cm².' },
      { q:'A ratio is 2:3. If the first part is 10, what is the second?', opts:['12','15','20','6'], ans:1, explain:'Scale factor: 10÷2=5. Second part: 3×5=15.' },
      { q:'What is the value of 2³?', opts:['6','8','9','12'], ans:1, explain:'2³ = 2×2×2 = 8. The exponent tells you how many times to multiply the base by itself.' },
      { q:'What is the perimeter of a square with side 5cm?', opts:['10cm','15cm','20cm','25cm'], ans:2, explain:'Perimeter = 4 × side = 4 × 5 = 20cm. Add all 4 sides together.' },
      { q:'Which of these is a prime number?', opts:['9','15','17','21'], ans:2, explain:'17 is prime — it can only be divided by 1 and itself. 9=3×3, 15=3×5, 21=3×7.' },
      { q:'If a shirt costs $12 and is 50% off, the new price is:', opts:['$4','$6','$8','$10'], ans:1, explain:'50% = half. $12 ÷ 2 = $6.' },
      { q:'What is the LCM of 4 and 6?', opts:['2','8','12','24'], ans:2, explain:'LCM is the smallest number both divide into. Multiples of 4: 4,8,12. Multiples of 6: 6,12. LCM = 12.' },
    ],
    lower: [
      { q:'Solve: 2x + 3 = 11', opts:['x=3','x=4','x=5','x=7'], ans:1, explain:'2x = 11-3 = 8, x = 4.' },
      { q:'What is the sum of angles in a triangle?', opts:['90°','180°','270°','360°'], ans:1, explain:'All triangles have interior angles summing to 180°.' },
      { q:'Simplify: 3x + 2y - x + 4y', opts:['2x+6y','4x+6y','2x+2y','3x+4y'], ans:0, explain:'Collect like terms: (3x-x) + (2y+4y) = 2x + 6y.' },
      { q:'The gradient of y = 3x + 5 is:', opts:['5','3','8','1/3'], ans:1, explain:'In y = mx + c, m is the gradient. Here m = 3.' },
      { q:'What is 5! (5 factorial)?', opts:['25','60','120','720'], ans:2, explain:'5! = 5×4×3×2×1 = 120.' },
      { q:'The hypotenuse of a right triangle with legs 3 and 4 is:', opts:['5','6','7','8'], ans:0, explain:'Pythagoras: c² = 3² + 4² = 9+16 = 25. √25 = 5.' },
      { q:'Expand: 3(2x - 4)', opts:['6x-4','6x-12','6x+12','5x-12'], ans:1, explain:'Multiply each term: 3×2x = 6x and 3×(-4) = -12. So 6x - 12.' },
      { q:'What is the mean of 4, 8, 6, 10, 2?', opts:['5','6','7','8'], ans:1, explain:'Mean = sum ÷ count = (4+8+6+10+2)÷5 = 30÷5 = 6.' },
      { q:'Factorise: x² - 9', opts:['(x-3)(x-3)','(x+3)(x-3)','(x+9)(x-1)','(x-9)(x+1)'], ans:1, explain:'Difference of two squares: a²-b² = (a+b)(a-b). So x²-9 = (x+3)(x-3).' },
      { q:'The interior angle of a regular hexagon is:', opts:['90°','108°','120°','135°'], ans:2, explain:'Sum of interior angles = (n-2)×180 = (6-2)×180 = 720°. Each angle = 720÷6 = 120°.' },
    ],
    upper: [
      { q:'Solve x² - 5x + 6 = 0', opts:['x=2 or x=3','x=-2 or x=-3','x=1 or x=6','x=5 or x=1'], ans:0, explain:'Factorise: (x-2)(x-3)=0, so x=2 or x=3.' },
      { q:'d/dx(4x³) = ?', opts:['4x²','12x²','12x³','3x²'], ans:1, explain:'Power rule: d/dx(xⁿ)=nxⁿ⁻¹. So 4×3×x² = 12x².' },
      { q:'The discriminant of ax²+bx+c is:', opts:['b²-4ac','b+4ac','-b/2a','√(b²-4ac)'], ans:0, explain:'Discriminant = b²-4ac. Determines nature of roots.' },
      { q:'log₁₀(1000) = ?', opts:['2','3','10','100'], ans:1, explain:'10³ = 1000, so log₁₀(1000) = 3.' },
      { q:'∫2x dx = ?', opts:['x²+C','2x²+C','x+C','2+C'], ans:0, explain:'∫2x dx = 2×(x²/2)+C = x²+C.' },
      { q:'If sin θ = 0.5, what is θ?', opts:['30°','45°','60°','90°'], ans:0, explain:'sin 30° = 0.5. This is a standard angle to memorise.' },
      { q:'The sum of an infinite geometric series with a=4, r=0.5 is:', opts:['6','8','10','12'], ans:1, explain:'S∞ = a/(1-r) = 4/(1-0.5) = 4/0.5 = 8. Only valid when |r|<1.' },
      { q:'What is the range of f(x) = x² + 1?', opts:['All real numbers','y ≥ 0','y ≥ 1','y > 1'], ans:2, explain:'x² ≥ 0, so x² + 1 ≥ 1. The minimum value is 1, reached when x=0.' },
      { q:'Solve: e^x = 7 (to 3 s.f.)', opts:['1.95','1.95','1.95','0.845'], ans:0, explain:'Take natural log of both sides: x = ln(7) ≈ 1.95.' },
      { q:'The angle between vectors (1,0) and (0,1) is:', opts:['0°','45°','90°','180°'], ans:2, explain:'These are perpendicular unit vectors. Their dot product = 0, confirming 90°.' },
    ],
  },
  biology: {
    early: [
      { q:'Which of these is a living thing?', opts:['Rock','Water','Plant','Sand'], ans:2, explain:'Plants are living — they grow, feed, reproduce and respond to their environment.' },
      { q:'What do plants need to make food?', opts:['Soil only','Water only','Sunlight and water','Darkness'], ans:2, explain:'Plants need sunlight, water and carbon dioxide to make food through photosynthesis.' },
      { q:'Which animal lays eggs?', opts:['Dog','Cat','Hen','Cow'], ans:2, explain:'Hens (chickens) lay eggs. Birds and reptiles are egg-laying animals.' },
      { q:'What do we call a baby frog?', opts:['Cub','Tadpole','Lamb','Kitten'], ans:1, explain:'A baby frog is called a tadpole. It lives in water and slowly grows legs.' },
      { q:'Where do fish live?', opts:['Land','Air','Water','Trees'], ans:2, explain:'Fish live in water — oceans, rivers, lakes and ponds.' },
      { q:'Which part of the plant makes food?', opts:['Root','Stem','Leaf','Flower'], ans:2, explain:'Leaves make food using sunlight — this is called photosynthesis.' },
    ],
    middle: [
      { q:'Which organelle controls cell activities?', opts:['Mitochondria','Cell membrane','Nucleus','Ribosome'], ans:2, explain:'The nucleus is the "control centre" of the cell — it contains DNA and directs all activities.' },
      { q:'What gas do plants absorb during photosynthesis?', opts:['Oxygen','Carbon dioxide','Nitrogen','Hydrogen'], ans:1, explain:'Plants absorb CO₂ and release O₂ during photosynthesis.' },
      { q:'The digestive system breaks down:', opts:['Air','Food','Blood','Water'], ans:1, explain:'The digestive system breaks food into small molecules that the body can absorb and use.' },
      { q:'Red blood cells carry:', opts:['Nutrients','Oxygen','Waste','Hormones'], ans:1, explain:'Red blood cells contain haemoglobin which carries oxygen from the lungs to all body parts.' },
      { q:'Which part of the plant absorbs water from soil?', opts:['Leaves','Flowers','Stem','Roots'], ans:3, explain:'Roots absorb water and minerals from the soil for the plant.' },
      { q:'MRS GREN stands for the characteristics of:', opts:['Plants only','Animals only','All living things','Cells only'], ans:2, explain:'MRS GREN (Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition) applies to ALL living organisms.' },
    ],
    lower: [
      { q:'Which organelle is called the "powerhouse" of the cell?', opts:['Nucleus','Ribosome','Mitochondria','Chloroplast'], ans:2, explain:'Mitochondria produce ATP (energy) through cellular respiration.' },
      { q:'Photosynthesis produces:', opts:['CO₂ and water','Glucose and oxygen','ATP only','Proteins'], ans:1, explain:'Photosynthesis: CO₂ + H₂O + light → glucose + O₂.' },
      { q:'DNA stands for:', opts:['Deoxyribose Nucleotide Acid','Deoxyribonucleic Acid','Double Nitrogen Acid','Diribose Acid'], ans:1, explain:'DNA = Deoxyribonucleic Acid — the molecule carrying genetic information.' },
      { q:'Aerobic respiration requires:', opts:['Carbon dioxide','No oxygen','Oxygen','Sunlight'], ans:2, explain:'Aerobic respiration uses oxygen to break down glucose and release energy (ATP).' },
      { q:'The equation for photosynthesis is:', opts:['O₂ + H₂O → CO₂ + sugar','CO₂ + H₂O → glucose + O₂','Glucose + O₂ → CO₂ + H₂O','H₂O + O₂ → glucose + CO₂'], ans:1, explain:'Plants use CO₂ + H₂O + light energy → C₆H₁₂O₆ (glucose) + O₂.' },
      { q:'Which blood type is the universal donor?', opts:['A','B','AB','O negative'], ans:3, explain:'O negative blood can be given to anyone because it has no A, B or Rh antigens.' },
      { q:'Osmosis is the movement of:', opts:['Glucose through a membrane','Water through a semi-permeable membrane','Minerals into roots','Oxygen into cells'], ans:1, explain:'Osmosis = movement of water from high concentration to low concentration through a semi-permeable membrane.' },
      { q:'Which type of disease is malaria?', opts:['Viral','Bacterial','Parasitic','Fungal'], ans:2, explain:'Malaria is caused by Plasmodium — a parasite spread by female Anopheles mosquitoes.' },
    ],
    upper: [
      { q:'What is the base pairing rule in DNA?', opts:['A-G, T-C','A-T, G-C','A-C, T-G','All bases pair freely'], ans:1, explain:'Adenine pairs with Thymine (A-T); Guanine pairs with Cytosine (G-C).' },
      { q:'Which type of mutation causes sickle cell anaemia?', opts:['Deletion','Insertion','Point mutation (substitution)','Translocation'], ans:2, explain:'A single nucleotide substitution changes glutamic acid to valine in haemoglobin.' },
      { q:'In Mendel\'s cross of Tt × Tt, what ratio of phenotypes would appear?', opts:['1:1','1:2:1','3:1','2:1'], ans:2, explain:'Cross Tt × Tt gives TT, Tt, Tt, tt. 3 show dominant trait (T_): 1 recessive (tt) = 3:1.' },
      { q:'The process of mRNA production from DNA is called:', opts:['Translation','Replication','Transcription','Mutation'], ans:2, explain:'Transcription = DNA → mRNA in the nucleus. Translation = mRNA → protein at ribosomes.' },
      { q:'Which hormone controls blood sugar levels?', opts:['Adrenaline','Oestrogen','Insulin','Thyroxine'], ans:2, explain:'Insulin (produced by the pancreas) lowers blood glucose by stimulating cells to absorb glucose.' },
      { q:'Natural selection was proposed by:', opts:['Gregor Mendel','Louis Pasteur','Charles Darwin','Robert Hooke'], ans:2, explain:'Charles Darwin proposed natural selection in "On the Origin of Species" (1859).' },
    ],
  },
  chemistry: {
    early: [
      { q:'Water is a:', opts:['Solid','Liquid','Gas','Mixture'], ans:1, explain:'At room temperature, water is a liquid. It becomes ice (solid) when frozen and steam (gas) when boiled.' },
      { q:'Which state of matter has a fixed shape?', opts:['Gas','Liquid','Solid','Plasma'], ans:2, explain:'Solids have a fixed shape and fixed volume because their particles are tightly packed together.' },
      { q:'What happens to ice when it is heated?', opts:['It becomes harder','It melts into water','It becomes gas immediately','Nothing happens'], ans:1, explain:'Ice melts into liquid water when heated — this is called melting.' },
    ],
    middle: [
      { q:'Water is made of:', opts:['Hydrogen only','Oxygen only','Hydrogen and Oxygen','Carbon and Oxygen'], ans:2, explain:'Water = H₂O — two hydrogen atoms bonded to one oxygen atom.' },
      { q:'What is the chemical symbol for Gold?', opts:['Go','Gd','Au','Ag'], ans:2, explain:'Au comes from the Latin word "Aurum" meaning gold.' },
      { q:'How many elements are in the periodic table (approximately)?', opts:['50','80','118','200'], ans:2, explain:'There are 118 confirmed elements in the periodic table, from Hydrogen (1) to Oganesson (118).' },
      { q:'What is the charge of an electron?', opts:['Positive','Negative','Neutral','It varies'], ans:1, explain:'Electrons carry a negative charge (-1). Protons are positive (+1), neutrons are neutral (0).' },
      { q:'Which gas makes up most of Earth\'s atmosphere?', opts:['Oxygen','Carbon dioxide','Nitrogen','Hydrogen'], ans:2, explain:'Nitrogen (N₂) makes up about 78% of air. Oxygen is about 21%.' },
      { q:'A compound is:', opts:['Two or more elements mixed','Two or more elements chemically bonded','One pure element','A mixture of metals'], ans:1, explain:'A compound has elements chemically bonded in fixed ratios — like H₂O or NaCl. Mixtures are not chemically bonded.' },
    ],
    lower: [
      { q:'In OIL RIG, what does OIL mean?', opts:['Oxidation Is Loss','Oxygen Is Lost','Oxidation Increases Loss','Only In Labs'], ans:0, explain:'OIL RIG: Oxidation Is Loss of electrons, Reduction Is Gain.' },
      { q:'The pH of a neutral solution is:', opts:['0','7','14','1'], ans:1, explain:'pH 7 is neutral. Below 7 = acidic, above 7 = alkaline.' },
      { q:'What type of reaction produces a salt and water?', opts:['Decomposition','Combustion','Neutralisation','Displacement'], ans:2, explain:'Neutralisation: acid + base → salt + water. E.g., HCl + NaOH → NaCl + H₂O.' },
      { q:'What is the chemical formula for table salt?', opts:['KCl','NaOH','NaCl','CaCl₂'], ans:2, explain:'Table salt is sodium chloride: NaCl — one sodium ion (Na⁺) bonded to one chloride ion (Cl⁻).' },
      { q:'Which type of bond involves sharing electrons?', opts:['Ionic','Covalent','Metallic','Hydrogen'], ans:1, explain:'Covalent bonds form when atoms share pairs of electrons. Common in non-metals like H₂O and CO₂.' },
      { q:'Rusting is an example of:', opts:['Physical change','Reduction','Oxidation','Decomposition'], ans:2, explain:'Rusting = iron reacting with oxygen and water (oxidation). Iron gains oxygen to form iron oxide (rust).' },
      { q:'What is the molar mass of CO₂?', opts:['28 g/mol','40 g/mol','44 g/mol','56 g/mol'], ans:2, explain:'C=12, O=16. CO₂ = 12 + (2×16) = 12+32 = 44 g/mol.' },
    ],
    upper: [
      { q:'In OIL RIG, what does OIL mean?', opts:['Oxidation Is Loss','Oxygen Is Lost','Oxidation Increases Loss','Only In Labs'], ans:0, explain:'OIL RIG: Oxidation Is Loss of electrons, Reduction Is Gain.' },
      { q:'The pH of a neutral solution is:', opts:['0','7','14','1'], ans:1, explain:'pH 7 is neutral. Below 7 = acidic, above 7 = alkaline.' },
      { q:'What is Avogadro\'s number?', opts:['6.02×10²²','6.02×10²³','6.02×10²⁴','3.14×10²³'], ans:1, explain:'Avogadro\'s number = 6.02×10²³. It is the number of particles in one mole of a substance.' },
      { q:'In electrolysis, the cathode is:', opts:['Positive','Negative','Neutral','It alternates'], ans:1, explain:'The cathode is the negative electrode. Cations (positive ions) move towards it and are reduced.' },
      { q:'Hess\'s Law states that:', opts:['Energy is always released','Enthalpy change is path independent','Temperature always increases','Reactions are reversible'], ans:1, explain:'Hess\'s Law: total enthalpy change is the same regardless of the route taken.' },
      { q:'What is the hybridisation of carbon in methane (CH₄)?', opts:['sp','sp²','sp³','sp³d'], ans:2, explain:'In CH₄, carbon forms 4 sigma bonds using sp³ hybridised orbitals — tetrahedral geometry.' },
    ],
  },
  physics: {
    early: [
      { q:'What force pulls objects to the ground?', opts:['Magnetism','Friction','Gravity','Push'], ans:2, explain:'Gravity is the force that pulls everything towards the Earth.' },
      { q:'Which travels faster — sound or light?', opts:['Sound','Light','They are equal','It depends'], ans:1, explain:'Light travels at 300,000 km/s. Sound travels at only 343 m/s. Light is about a million times faster!' },
      { q:'A magnet attracts:', opts:['All metals','Wood','Iron and steel','Plastic'], ans:2, explain:'Magnets attract iron, steel, nickel and cobalt — not all metals. Wood and plastic are not attracted.' },
    ],
    middle: [
      { q:'What is the unit of force?', opts:['Joule','Watt','Newton','Pascal'], ans:2, explain:'Force is measured in Newtons (N), named after Isaac Newton. F = ma.' },
      { q:'Newton\'s second law states F = ?', opts:['m/a','ma','m+a','m-a'], ans:1, explain:'F = ma (Force = mass × acceleration). Doubling mass doubles the force needed for the same acceleration.' },
      { q:'What type of energy does a moving car have?', opts:['Potential','Thermal','Kinetic','Nuclear'], ans:2, explain:'Kinetic energy is the energy of motion. KE = ½mv².' },
      { q:'Current is measured in:', opts:['Volts','Ohms','Amperes','Watts'], ans:2, explain:'Current (flow of charge) is measured in Amperes (A). Voltage in Volts (V), resistance in Ohms (Ω).' },
      { q:'In a series circuit, if one bulb goes out:', opts:['Others get brighter','Others stay on','All others go out','Nothing changes'], ans:2, explain:'In series, there is only one path for current. If one component breaks, the circuit is broken and all stop.' },
      { q:'What is the speed of light in a vacuum?', opts:['300 km/s','3,000 km/s','300,000 km/s','3,000,000 km/s'], ans:2, explain:'Light travels at approximately 300,000 km/s (3×10⁸ m/s) in a vacuum.' },
    ],
    lower: [
      { q:'Ohm\'s Law states V = ?', opts:['I/R','IR','I+R','I-R'], ans:1, explain:'V = IR (Voltage = Current × Resistance). This is Ohm\'s Law — the foundation of circuit analysis.' },
      { q:'What is the unit of electrical resistance?', opts:['Volt','Ampere','Watt','Ohm'], ans:3, explain:'Resistance is measured in Ohms (Ω), named after Georg Simon Ohm.' },
      { q:'Which type of wave requires a medium to travel?', opts:['Light','Radio waves','Sound','X-rays'], ans:2, explain:'Sound is a mechanical wave — it needs particles to vibrate through (air, water, solid). Light needs no medium.' },
      { q:'The speed of a wave is given by:', opts:['v = f/λ','v = fλ','v = λ/f','v = f+λ'], ans:1, explain:'Wave speed = frequency × wavelength (v = fλ). Doubling frequency halves wavelength if speed stays constant.' },
      { q:'Pressure = Force ÷ ?', opts:['Mass','Volume','Area','Distance'], ans:2, explain:'P = F/A. Pressure = force ÷ area. A sharp knife has small area = high pressure for same force.' },
      { q:'Which lens converges light rays?', opts:['Concave','Convex','Plane','Diverging'], ans:1, explain:'Convex (converging) lenses bring light rays together at a focal point. Used in magnifying glasses and cameras.' },
      { q:'Nuclear fusion occurs in:', opts:['Nuclear power stations','The Sun','Atomic bombs','Batteries'], ans:1, explain:'The Sun\'s energy comes from nuclear fusion — hydrogen nuclei fuse to form helium, releasing enormous energy.' },
    ],
    upper: [
      { q:'What is the unit of power?', opts:['Joule','Newton','Watt','Pascal'], ans:2, explain:'Power is measured in Watts (W). Power = Energy/Time = Work/Time.' },
      { q:'Einstein\'s mass-energy equivalence is:', opts:['E=mv²','E=mc²','E=m/c','E=mc/2'], ans:1, explain:'E=mc² — energy equals mass times the speed of light squared. Even a tiny mass contains enormous energy.' },
      { q:'The photoelectric effect showed light behaves as:', opts:['Waves only','Particles (photons)','Neither','Both simultaneously'], ans:1, explain:'The photoelectric effect (Einstein, 1905) proved light comes in discrete packets called photons — wave-particle duality.' },
      { q:'In radioactive decay, alpha particles are:', opts:['Electrons','Photons','Helium-4 nuclei','Protons'], ans:2, explain:'Alpha particles are helium-4 nuclei (2 protons + 2 neutrons). They have high ionising power but low penetration.' },
      { q:'The frequency of AC mains electricity in most African countries is:', opts:['50 Hz','60 Hz','100 Hz','120 Hz'], ans:0, explain:'Most African and European countries use 50 Hz AC at 220-240V. The USA uses 60 Hz at 110-120V.' },
      { q:'Snell\'s Law relates to:', opts:['Reflection','Refraction','Diffraction','Interference'], ans:1, explain:'Snell\'s Law: n₁sinθ₁ = n₂sinθ₂. It describes how light bends when passing between different media.' },
    ],
  },
  english: {
    early: [
      { q:'Which is a vowel?', opts:['B','C','E','D'], ans:2, explain:'Vowels are A, E, I, O, U. E is a vowel. All other letters are consonants.' },
      { q:'"The dog runs fast." What is the verb?', opts:['dog','fast','the','runs'], ans:3, explain:'A verb is an action word. "Runs" is the action in this sentence.' },
      { q:'Which word is a noun?', opts:['Run','Happy','Mango','Quickly'], ans:2, explain:'A noun is a person, place or thing. "Mango" is a thing — it is a noun.' },
      { q:'How many letters are in the English alphabet?', opts:['24','25','26','27'], ans:2, explain:'The English alphabet has 26 letters, from A to Z.' },
      { q:'"She ___ to school every day." Which word fits?', opts:['go','goes','going','gone'], ans:1, explain:'"She goes" — we add -s/-es to verbs when the subject is he/she/it in present simple tense.' },
    ],
    middle: [
      { q:'An adjective describes a:', opts:['Verb','Noun','Adverb','Conjunction'], ans:1, explain:'Adjectives describe or modify nouns. E.g., "The tall girl" — "tall" is the adjective.' },
      { q:'Which sentence is correct?', opts:['She don\'t like mangoes.','She doesn\'t like mangoes.','She not like mangoes.','She likes not mangoes.'], ans:1, explain:'With "she/he/it" in present simple, use "doesn\'t" (does not) for negatives.' },
      { q:'A conjunction joins:', opts:['Nouns','Two verbs only','Clauses or sentences','Adjectives'], ans:2, explain:'Conjunctions join words, phrases or clauses. Examples: and, but, because, although, however.' },
      { q:'The opposite of "generous" is:', opts:['Kind','Mean','Brave','Honest'], ans:1, explain:'"Mean" (selfish, unkind) is the antonym of "generous" (giving, sharing freely).' },
      { q:'Which tense is "She has eaten"?', opts:['Simple past','Present perfect','Past continuous','Future'], ans:1, explain:'"Has/have + past participle" forms the present perfect tense — used for actions that just happened or connect past to now.' },
      { q:'A synonym for "happy" is:', opts:['Sad','Angry','Joyful','Tired'], ans:2, explain:'"Joyful" means very happy. Synonyms are words with similar meanings.' },
    ],
    lower: [
      { q:'What literary device is "The wind screamed"?', opts:['Metaphor','Simile','Personification','Alliteration'], ans:2, explain:'Personification gives human qualities to non-human things. Wind cannot actually scream.' },
      { q:'A Shakespearean sonnet has:', opts:['10 lines','12 lines','14 lines','16 lines'], ans:2, explain:'A sonnet has 14 lines. Shakespearean: 3 quatrains + 1 couplet, rhyming ABAB CDCD EFEF GG.' },
      { q:'A simile compares using:', opts:['Metaphor','Like or as','Exaggeration','Repetition'], ans:1, explain:'Similes use "like" or "as" to compare. E.g., "brave as a lion", "runs like the wind".' },
      { q:'The passive voice of "The boy broke the window" is:', opts:['The window was broke','The window was broken by the boy','The boy has broken the window','The window broke'], ans:1, explain:'Passive: Object + was/were + past participle + by + subject. "The window was broken by the boy."' },
      { q:'"Despite the rain, she went to school." This is a:', opts:['Simple sentence','Compound sentence','Complex sentence','Fragment'], ans:2, explain:'A complex sentence has one main clause and one or more subordinate clauses. "Despite the rain" is a subordinate clause.' },
      { q:'Alliteration is:', opts:['Repetition of end sounds','Repetition of initial consonant sounds','Comparison using like','Exaggeration'], ans:1, explain:'Alliteration = repetition of the same consonant sound at the start of nearby words. E.g., "Peter Piper picked a peck."' },
    ],
    upper: [
      { q:'In "Things Fall Apart", what is the name of the protagonist?', opts:['Nwoye','Obierika','Okonkwo','Ikemefuna'], ans:2, explain:'Okonkwo is the protagonist of Chinua Achebe\'s "Things Fall Apart" — a proud Igbo warrior undone by colonialism and his own pride.' },
      { q:'A rhetorical question is asked:', opts:['To get information','For dramatic effect, not a real answer','By a politician','In an exam'], ans:1, explain:'Rhetorical questions are asked for effect — the speaker doesn\'t expect a real answer. E.g., "How could you do this?"' },
      { q:'Which figure of speech uses extreme exaggeration?', opts:['Metaphor','Hyperbole','Oxymoron','Irony'], ans:1, explain:'Hyperbole is deliberate exaggeration for emphasis. E.g., "I\'ve told you a million times!"' },
      { q:'A Bildungsroman is a novel about:', opts:['War','A person\'s moral growth','Love','Mystery'], ans:1, explain:'Bildungsroman (German: "novel of formation") follows a character\'s moral, psychological and social growth from youth to adulthood.' },
      { q:'The term "unreliable narrator" means:', opts:['The narrator lies deliberately','The narrator\'s account may be inaccurate or biased','The narrator is fictional','The story has no narrator'], ans:1, explain:'An unreliable narrator\'s account cannot be fully trusted — due to bias, limited knowledge, mental state or self-interest.' },
    ],
  },
  history: {
    early: [
      { q:'What do historians study?', opts:['The future','The past','Science','Maths'], ans:1, explain:'Historians study the past — events, people, and places from long ago.' },
      { q:'A person who lived a very long time ago is called:', opts:['A scientist','An ancestor','A teacher','A farmer'], ans:1, explain:'Ancestors are relatives from the past — grandparents, great-grandparents and those who lived before us.' },
    ],
    middle: [
      { q:'Who led Ghana to independence in 1957?', opts:['Nelson Mandela','Kwame Nkrumah','Jomo Kenyatta','Julius Nyerere'], ans:1, explain:'Kwame Nkrumah led Ghana to become the first sub-Saharan African country to gain independence from Britain.' },
      { q:'The slave trade lasted approximately:', opts:['50 years','100 years','400 years','1000 years'], ans:2, explain:'The transatlantic slave trade lasted roughly 400 years (1400s–1800s), with over 12 million Africans enslaved.' },
      { q:'Who built the Great Zimbabwe ruins?', opts:['European settlers','The Shona people','The Zulu kingdom','Arab traders'], ans:1, explain:'The Great Zimbabwe stone enclosures were built by the Shona people between 1100–1450 CE. They are now a UNESCO World Heritage Site.' },
      { q:'The Berlin Conference of 1884-85 was about:', opts:['Ending the slave trade','Dividing Africa among European powers','Creating the African Union','Trade agreements'], ans:1, explain:'European powers met in Berlin to divide Africa without African representation — the "Scramble for Africa".' },
      { q:'Mansa Musa of Mali was famous for his:', opts:['Military conquests','Immense wealth and pilgrimage','Scientific discoveries','Building the pyramids'], ans:1, explain:'Mansa Musa (1280-1337) was possibly the wealthiest person in history. His pilgrimage to Mecca in 1324 was legendary.' },
    ],
    lower: [
      { q:'Apartheid ended in South Africa in:', opts:['1980','1990','1994','2000'], ans:2, explain:'South Africa held its first democratic elections in April 1994, ending apartheid. Nelson Mandela became president.' },
      { q:'The Organisation of African Unity (OAU) was founded in:', opts:['1957','1963','1970','1980'], ans:1, explain:'The OAU was founded in Addis Ababa, Ethiopia on 25 May 1963. It became the African Union in 2002.' },
      { q:'Kenya gained independence from Britain in:', opts:['1957','1960','1963','1970'], ans:2, explain:'Kenya became independent on 12 December 1963. Jomo Kenyatta became the first Prime Minister, then President.' },
      { q:'The Mau Mau uprising was a resistance movement in:', opts:['Ghana','Nigeria','Kenya','Zimbabwe'], ans:2, explain:'The Mau Mau uprising (1952-1960) was a Kenyan rebellion against British colonial rule — a major catalyst for independence.' },
      { q:'Zambia gained independence in:', opts:['1960','1962','1964','1966'], ans:2, explain:'Zambia (formerly Northern Rhodesia) gained independence on 24 October 1964. Kenneth Kaunda became the first president.' },
    ],
    upper: [
      { q:'The Cold War was primarily between:', opts:['UK and France','USA and China','USA and USSR','Europe and Africa'], ans:2, explain:'The Cold War (1947-1991) was an ideological struggle between the capitalist USA and communist Soviet Union (USSR).' },
      { q:'Nelson Mandela was imprisoned on Robben Island for approximately:', opts:['10 years','18 years','27 years','35 years'], ans:2, explain:'Mandela was imprisoned from 1964-1990 — 27 years. He spent 18 of those years on Robben Island.' },
      { q:'The African Union replaced the OAU in:', opts:['1999','2000','2002','2005'], ans:2, explain:'The African Union was formally established on 9 July 2002 in Durban, South Africa, replacing the OAU.' },
      { q:'Which country was never formally colonised in Africa?', opts:['Ghana','Nigeria','Ethiopia','Kenya'], ans:2, explain:'Ethiopia successfully resisted Italian invasion at the Battle of Adwa (1896) and was never colonised, except briefly 1936-1941.' },
      { q:'The Rwandan Genocide occurred in:', opts:['1990','1992','1994','1996'], ans:2, explain:'The Rwandan Genocide took place in 1994. Over 800,000 Tutsi and moderate Hutu were killed in approximately 100 days.' },
    ],
  },
  geography: {
    early: [
      { q:'A map is:', opts:['A photograph from space','A drawing showing places from above','A list of countries','A painting of nature'], ans:1, explain:'A map is a drawing that shows places from a bird\'s-eye view — it helps us find our way around.' },
      { q:'Which direction does the sun rise?', opts:['North','South','East','West'], ans:2, explain:'The sun rises in the East and sets in the West. This helps us find direction.' },
    ],
    middle: [
      { q:"Africa's highest mountain is:", opts:['Mount Kenya','Mount Kilimanjaro','Mount Elgon','Drakensberg'], ans:1, explain:'Mount Kilimanjaro (5,895m) in Tanzania is Africa\'s highest peak. It is an extinct volcano.' },
      { q:"The world's longest river is:", opts:['Amazon','Congo','Niger','Nile'], ans:3, explain:'The Nile River (6,650km) flows through 11 African countries and is the world\'s longest river.' },
      { q:'The Sahara Desert is in:', opts:['Southern Africa','East Africa','North Africa','Central Africa'], ans:2, explain:'The Sahara is in North Africa — it is the world\'s largest hot desert, covering about 9 million km².' },
      { q:'Which ocean lies to the east of Africa?', opts:['Atlantic','Pacific','Arctic','Indian'], ans:3, explain:'The Indian Ocean lies to the east of Africa. The Atlantic Ocean lies to the west.' },
      { q:'What is the capital city of Kenya?', opts:['Mombasa','Kisumu','Nakuru','Nairobi'], ans:3, explain:'Nairobi is the capital and largest city of Kenya. It is also the country\'s economic hub.' },
    ],
    lower: [
      { q:'Which African country has the largest population?', opts:['Ethiopia','DRC Congo','South Africa','Nigeria'], ans:3, explain:'Nigeria has over 220 million people — the most populous country in Africa and the seventh in the world.' },
      { q:'The Great Rift Valley runs through:', opts:['West Africa','North Africa','East Africa','Southern Africa'], ans:2, explain:'The East African Rift Valley stretches 6,000km from Ethiopia through Kenya, Tanzania to Mozambique.' },
      { q:'Which type of climate does most of Central Africa have?', opts:['Desert','Mediterranean','Equatorial/Tropical rainforest','Polar'], ans:2, explain:'Central Africa (around the Congo Basin) has an equatorial climate — hot and wet year-round, with dense rainforest.' },
      { q:'What is urbanisation?', opts:['Building farms','Movement of people from rural to urban areas','Cutting down forests','Pollution in cities'], ans:1, explain:'Urbanisation = the process by which more people move from rural (countryside) to urban (city) areas.' },
      { q:'Which country contains the source of the River Nile?', opts:['Egypt','Sudan','Uganda','Ethiopia'], ans:2, explain:'The White Nile begins at Lake Victoria in Uganda. The Blue Nile begins in Ethiopia. They meet in Sudan.' },
    ],
    upper: [
      { q:'Which African country has the largest land area?', opts:['DRC Congo','Sudan','Libya','Algeria'], ans:3, explain:'Algeria is the largest country in Africa by area (2.38 million km²), since Sudan was split in 2011.' },
      { q:'The concept of plate tectonics explains:', opts:['Weather patterns','Movement of Earth\'s crustal plates','Ocean currents','Population growth'], ans:1, explain:'Plate tectonics explains how Earth\'s crust is divided into plates that move, causing earthquakes, volcanoes and mountain building.' },
      { q:'A country\'s HDI measures:', opts:['Only GDP','Military strength','Health, education and income combined','Population size'], ans:2, explain:'The Human Development Index (HDI) combines life expectancy, education level and per capita income into one measure.' },
      { q:'Which gas is the main cause of the enhanced greenhouse effect?', opts:['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'], ans:2, explain:'CO₂ from burning fossil fuels is the main driver of the enhanced greenhouse effect and climate change.' },
      { q:'The demographic transition model shows:', opts:['Migration patterns','Changes in birth and death rates over time','City growth patterns','Economic development stages'], ans:1, explain:'The demographic transition model shows how birth and death rates change as countries develop, affecting population growth.' },
    ],
  },
  economics: {
    lower: [
      { q:'What does economics study?', opts:['The weather','How scarce resources are allocated','Political systems','History of trade'], ans:1, explain:'Economics studies how individuals, businesses and governments allocate scarce resources to satisfy unlimited wants.' },
      { q:'Opportunity cost is:', opts:['The price of goods','The next best alternative given up','A type of tax','Production cost'], ans:1, explain:'Opportunity cost = the value of the best alternative you sacrifice when making a choice.' },
      { q:'Which type of economy is controlled entirely by the government?', opts:['Market economy','Mixed economy','Command/planned economy','Traditional economy'], ans:2, explain:'In a command economy, the government makes all economic decisions — what to produce, how and for whom. E.g., North Korea.' },
    ],
    upper: [
      { q:'What happens to demand when price increases?', opts:['Increases','Decreases','Stays same','Doubles'], ans:1, explain:'Law of Demand: higher price → lower quantity demanded (inverse relationship), ceteris paribus.' },
      { q:"What is 'opportunity cost'?", opts:['The cost of production','The next best alternative foregone','The price of goods','Tax on goods'], ans:1, explain:'Opportunity cost = the value of the best alternative you gave up to make a choice.' },
      { q:'A market with one seller is called:', opts:['Oligopoly','Monopoly','Perfect competition','Duopoly'], ans:1, explain:'Monopoly = one seller controls the entire market, with significant barriers to entry.' },
      { q:'GDP stands for:', opts:['General Development Plan','Gross Domestic Product','Government Development Policy','General Demand Price'], ans:1, explain:'GDP = Gross Domestic Product — the total monetary value of all goods and services produced in a country in a year.' },
      { q:'Inflation means:', opts:['Rising unemployment','Rising price levels over time','Falling GDP','Reduced trade'], ans:1, explain:'Inflation = a general rise in price levels over time, reducing purchasing power of money.' },
      { q:'A progressive tax system means:', opts:['Everyone pays the same amount','Higher earners pay a higher percentage','Lower earners pay more','There is no tax'], ans:1, explain:'Progressive taxes take a higher percentage from higher incomes. The more you earn, the higher your tax rate (e.g., income tax).' },
    ],
  },
  accounting: {
    lower: [
      { q:'What is the main purpose of accounting?', opts:['To make profit','To record and report financial information','To manage employees','To set prices'], ans:1, explain:'Accounting records, summarises and reports financial transactions to help decision-making.' },
      { q:'Assets are things a business:', opts:['Owes','Owns','Sells','Borrows'], ans:1, explain:'Assets are resources owned or controlled by a business that provide future economic benefits.' },
    ],
    upper: [
      { q:'The accounting equation is:', opts:['Assets = Revenue - Expenses','Assets = Liabilities + Equity','Revenue = Assets + Liabilities','Profit = Revenue × Costs'], ans:1, explain:'The fundamental accounting equation: Assets = Liabilities + Owner\'s Equity.' },
      { q:'Depreciation is:', opts:['An increase in asset value','A decrease in asset value over time','Cash paid to suppliers','Income earned'], ans:1, explain:'Depreciation records the reduction in value of fixed assets over their useful life.' },
      { q:'Gross profit = Revenue minus:', opts:['All expenses','Cost of goods sold','Tax','Interest'], ans:1, explain:'Gross Profit = Revenue − Cost of Goods Sold (COGS). Net profit deducts all other expenses too.' },
      { q:'A creditor is someone who:', opts:['Owes the business money','The business owes money to','Manages accounts','Audits the business'], ans:1, explain:'A creditor is owed money by the business (e.g. a supplier). A debtor owes money to the business.' },
      { q:'Double-entry bookkeeping means every transaction has:', opts:['Two invoices','A debit and a credit entry','Two receipts','Two bank accounts'], ans:1, explain:'Every financial transaction has two sides — a debit in one account and an equal credit in another. This keeps the books balanced.' },
      { q:'The going concern concept assumes:', opts:['Business will close soon','Business will continue operating indefinitely','Profit will always be made','Assets increase yearly'], ans:1, explain:'Going concern: we assume the business will continue operating for the foreseeable future when preparing financial statements.' },
    ],
  },
  computer: {
    early: [
      { q:'What is a computer used for?', opts:['Cooking food','Storing and processing information','Growing plants','Driving cars'], ans:1, explain:'Computers store, process and display information. They follow instructions from programs.' },
      { q:'Which part of the computer shows pictures and words?', opts:['Keyboard','Mouse','Monitor','Speaker'], ans:2, explain:'The monitor (screen) shows you what the computer is doing — text, pictures, videos.' },
      { q:'What do you use to type words on a computer?', opts:['Mouse','Monitor','Keyboard','Printer'], ans:2, explain:'The keyboard has letters and numbers that let you type information into the computer.' },
    ],
    middle: [
      { q:'What does WWW stand for?', opts:['World Wide Web','World Wireless Web','Wide World Web','World Web Wires'], ans:0, explain:'WWW = World Wide Web — the system of websites and web pages connected through the internet.' },
      { q:'What does CPU stand for?', opts:['Central Processing Unit','Computer Power Unit','Central Program Update','Computer Processing Upgrade'], ans:0, explain:'CPU = Central Processing Unit — the "brain" of the computer that executes instructions.' },
      { q:'Which of these is an input device?', opts:['Monitor','Printer','Mouse','Speaker'], ans:2, explain:'Input devices send data INTO the computer. Mouse, keyboard and microphone are input devices. Monitor and printer are output.' },
      { q:'What does RAM stand for?', opts:['Read All Memory','Random Access Memory','Run All Machines','Rapid Access Mode'], ans:1, explain:'RAM = Random Access Memory — temporary storage used while the computer is running. It is cleared when power off.' },
      { q:'The internet and World Wide Web are:', opts:['The same thing','Different — internet is infrastructure, web is content','Both created in 1960s','Only used by computers'], ans:1, explain:'The internet is the physical network of connected computers. The Web (invented 1989 by Tim Berners-Lee) is content accessed over it.' },
    ],
    lower: [
      { q:'Which programming language is best known for beginners?', opts:['C++','Assembly','Python','COBOL'], ans:2, explain:'Python is widely recommended for beginners — it has clean, readable syntax and is used in AI, web development and data science.' },
      { q:'HTML stands for:', opts:['Hyperlink Text Making Language','HyperText Markup Language','High Transfer Machine Learning','Hyper Tool Markup Language'], ans:1, explain:'HTML = HyperText Markup Language — the standard language for creating web pages.' },
      { q:'In binary, what is 1010 in decimal?', opts:['8','9','10','11'], ans:2, explain:'Binary 1010 = (1×8)+(0×4)+(1×2)+(0×1) = 8+0+2+0 = 10.' },
      { q:'What is a "bug" in programming?', opts:['A virus','An error in the code','A type of loop','A missing semicolon only'], ans:1, explain:'A bug is any error or flaw in a program that causes it to behave unexpectedly. "Debugging" is the process of finding and fixing bugs.' },
      { q:'Which of these is a database management system?', opts:['Microsoft Word','MySQL','Adobe Photoshop','Google Chrome'], ans:1, explain:'MySQL is a popular open-source relational database management system (RDBMS) used to store and query structured data.' },
    ],
    upper: [
      { q:'What does SQL stand for?', opts:['Simple Query Language','Structured Query Language','System Quality Language','Sequential Query Logic'], ans:1, explain:'SQL = Structured Query Language — used to manage and query relational databases.' },
      { q:'Which protocol is used to send web pages?', opts:['FTP','SMTP','HTTP','SSH'], ans:2, explain:'HTTP (HyperText Transfer Protocol) / HTTPS is used to transfer web pages between servers and browsers.' },
      { q:'An algorithm is:', opts:['A type of computer','A step-by-step set of instructions','A programming language','A database'], ans:1, explain:'An algorithm is a set of step-by-step instructions to solve a problem or complete a task.' },
      { q:'What is the time complexity of binary search?', opts:['O(n)','O(n²)','O(log n)','O(1)'], ans:2, explain:'Binary search has O(log n) time complexity — much faster than linear search O(n) for large sorted datasets.' },
      { q:'In object-oriented programming, "encapsulation" means:', opts:['Combining programs','Hiding internal data and exposing only what is needed','Inheriting properties','Overriding methods'], ans:1, explain:'Encapsulation bundles data and methods together in a class and restricts direct access to internal details — improving security.' },
    ],
  },
  literature: {
    lower: [
      { q:'What is a metaphor?', opts:['A comparison using like or as','A direct comparison without like or as','Repetition of sounds','Exaggeration'], ans:1, explain:'A metaphor makes a direct comparison without using "like" or "as". E.g., "Life is a journey."' },
      { q:'The main character in a story is called:', opts:['Antagonist','Narrator','Protagonist','Supporting character'], ans:2, explain:'The protagonist is the main character whose journey we follow. The antagonist opposes them.' },
      { q:'A haiku is a poem with:', opts:['14 lines','Rhyming couplets','3 lines of 5-7-5 syllables','Any number of lines'], ans:2, explain:'A traditional Japanese haiku has 3 lines: 5 syllables, 7 syllables, 5 syllables — 17 in total.' },
      { q:'What is the "theme" of a story?', opts:['The setting','The main character','The central message or idea','The plot events'], ans:2, explain:'Theme is the central message, idea or insight that the author communicates through the story — e.g., love, justice, identity.' },
    ],
    upper: [
      { q:'In "Things Fall Apart" by Chinua Achebe, what ultimately destroys Okonkwo?', opts:['His poverty','His fear of being seen as weak, and colonialism','His love for his daughter','A war with neighbours'], ans:1, explain:'Okonkwo is destroyed by his excessive fear of weakness (like his father) and his inability to adapt to colonial change.' },
      { q:'What is dramatic irony?', opts:['When the audience knows something characters don\'t','When a character says the opposite of what they mean','Exaggeration for effect','A humorous story'], ans:0, explain:'Dramatic irony occurs when the audience knows information that the characters do not, creating tension or dark humour.' },
      { q:'A "foil" character is used to:', opts:['Provide comic relief','Highlight traits of the protagonist by contrast','Tell the story','Be the villain'], ans:1, explain:'A foil is a character whose contrasting traits highlight the qualities of another character, usually the protagonist.' },
      { q:'The narrative technique "stream of consciousness" shows:', opts:['A character\'s unfiltered thought flow','Events in order','Multiple perspectives','A letter format'], ans:0, explain:'Stream of consciousness mimics the continuous, unfiltered flow of a character\'s thoughts and feelings — used by Virginia Woolf and James Joyce.' },
    ],
  },
  science: {
    early: [
      { q:'What do plants need to grow?', opts:['Only water','Only sunlight','Water, sunlight and soil/nutrients','Darkness and cold'], ans:2, explain:'Plants need sunlight, water, carbon dioxide and nutrients from soil to grow and make food.' },
      { q:'Which is the largest planet in our solar system?', opts:['Earth','Saturn','Jupiter','Mars'], ans:2, explain:'Jupiter is the largest planet — it is so big that all other planets could fit inside it.' },
      { q:'What state of matter is ice?', opts:['Gas','Liquid','Solid','Plasma'], ans:2, explain:'Ice is water in its solid state. Water can be solid (ice), liquid (water) or gas (steam).' },
    ],
    middle: [
      { q:'What is the chemical symbol for water?', opts:['WA','H₂O','HO₂','W₂O'], ans:1, explain:'Water = H₂O — two hydrogen atoms bonded to one oxygen atom.' },
      { q:'Which force keeps planets orbiting the Sun?', opts:['Magnetism','Friction','Gravity','Electricity'], ans:2, explain:'Gravity is the attractive force between masses. The Sun\'s gravity keeps planets in their orbits.' },
      { q:'What is photosynthesis?', opts:['How animals breathe','How plants make food from sunlight','How water evaporates','How rocks form'], ans:1, explain:'Photosynthesis is how plants use sunlight, water and CO₂ to make glucose (food) and release oxygen.' },
      { q:'Sound travels fastest through:', opts:['Air','Water','Vacuum','Solid'], ans:3, explain:'Sound travels fastest through solids because particles are closest together, then liquids, then gases.' },
    ],
    lower: [
      { q:'Which type of radiation is most penetrating?', opts:['Alpha','Beta','Gamma','X-ray'], ans:2, explain:'Gamma radiation is the most penetrating — it can pass through most materials and requires thick lead or concrete to stop.' },
      { q:'What is the powerhouse of the cell?', opts:['Nucleus','Ribosome','Mitochondria','Chloroplast'], ans:2, explain:'Mitochondria produce ATP (energy) through cellular respiration — they power all cellular activities.' },
      { q:'Newton\'s first law is about:', opts:['Force = mass × acceleration','Every action has a reaction','Objects stay in their state of motion unless a force acts','Gravity'], ans:2, explain:'Newton\'s first law (inertia): an object remains at rest or in uniform motion unless acted upon by an unbalanced force.' },
    ],
    upper: [
      { q:'E = mc² means:', opts:['Energy equals mass divided by speed','Energy equals mass times speed of light squared','Mass equals energy times speed','None of the above'], ans:1, explain:'Einstein\'s equation E=mc² shows mass and energy are interchangeable. c = speed of light (3×10⁸ m/s).' },
      { q:'The pH scale ranges from:', opts:['0 to 7','1 to 14','0 to 14','0 to 100'], ans:2, explain:'pH ranges from 0 (most acidic) to 14 (most alkaline), with 7 being neutral.' },
      { q:'Which gas do plants release during photosynthesis?', opts:['Carbon dioxide','Nitrogen','Oxygen','Hydrogen'], ans:2, explain:'Plants absorb CO₂ and release O₂ during photosynthesis — the opposite of respiration.' },
    ],
  },
};

function getQuizQuestionsForStudent(student, subjectId, count) {
  const level = getGradeLevel(student.grade || 'Grade 7');
  const subjectQs = QUIZ_QUESTIONS[subjectId] || QUIZ_QUESTIONS.math;
  const levelOrder = ['early','middle','lower','upper'];

  // Try to get questions at the student's exact grade level first
  let questions = subjectQs[level] ? [...subjectQs[level]] : [];

  // If not enough, pull from adjacent levels (smarter fallback)
  if (questions.length < count) {
    const levelIdx = levelOrder.indexOf(level);
    // Try adjacent levels first, then all
    const fallbackOrder = [
      levelOrder[levelIdx - 1],
      levelOrder[levelIdx + 1],
      ...levelOrder
    ].filter(Boolean);
    for (const l of fallbackOrder) {
      if (subjectQs[l]) {
        const extra = subjectQs[l].filter(q => !questions.includes(q));
        questions = [...questions, ...extra];
      }
      if (questions.length >= count) break;
    }
  }

  // If still not enough, pull from other subjects at the same level
  if (questions.length < count) {
    Object.keys(QUIZ_QUESTIONS).forEach(s => {
      if (s !== subjectId) {
        const sq = QUIZ_QUESTIONS[s];
        const extra = sq[level] || sq.middle || sq.lower || [];
        questions = [...questions, ...extra];
      }
    });
  }

  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ── AI SYSTEM PROMPT BUILDER ─────────────────────────────────────
function buildSystemPrompt(student) {
  const country = COUNTRY_NAMES[student.country] || 'Africa';
  const curriculum = COUNTRY_CURRICULUM[student.country] || {};
  const flag = COUNTRY_FLAGS[student.country] || '🌍';
  const gradeLevel = getGradeLevel(student.grade || 'Grade 7');

  return `You are EduStar AI Tutor — a warm, encouraging, expert educational assistant built specifically for African students.

STUDENT PROFILE:
- Name: ${student.name}
- Country: ${flag} ${country}
- Grade: ${student.grade}
- Curriculum system: ${curriculum.system || 'African national curriculum'}
- Key exams: ${(curriculum.keyExams || []).join(', ')}
- Grade level category: ${gradeLevel} (early/middle/lower/upper secondary)

YOUR TEACHING APPROACH:
1. Always tailor your explanations to ${student.grade} level — not too complex, not too simple
2. Use examples from ${country} and African contexts (local currencies, geography, culture, food, sports)
3. For ${country}: reference the ${curriculum.system || 'national curriculum'} when relevant
4. Be warm, encouraging, and patient. Celebrate effort and progress
5. Use the Socratic method — ask guiding questions to help students discover answers
6. Break complex topics into small steps. Use analogies to everyday African life
7. Format answers clearly: use numbered steps, bullet points, or tables when helpful
8. If a student is stuck, offer multiple explanations and approaches
9. Correct mistakes gently and explain WHY the answer was wrong
10. Reference real African scientists, leaders, and innovators as examples

CURRICULUM KNOWLEDGE:
- You know the ${country} ${curriculum.system || 'curriculum'} in detail
- You can explain any topic from Grade 1 through Grade 12/13 at the appropriate level
- You know African history, geography, literature, and context deeply
- You understand exam techniques for ${(curriculum.keyExams || ['national exams']).join(', ')}

SUBJECTS YOU TEACH: Mathematics, English, Science, Biology, Chemistry, Physics, History, Geography, Economics, Accounting, Commerce, Business Studies, Computer Studies, Literature, Religious Studies, Civics, Kiswahili, French, Agriculture, and more.

Always respond in a clear, structured, educational way. Keep responses concise but complete. Use emojis sparingly to keep the tone friendly without being distracting.`;
}

// ── TOAST UTILITY ────────────────────────────────────────────────
function toast(msg, type = 'success') {
  let container = document.getElementById('toasts');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toasts';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

// ── YOUNG LEARNER CHECK (Grade 3 and below, all countries) ───────
function isYoungLearner(student) {
  if (!student || !student.grade) return false;
  const YOUNG_GRADES = [
    'PP1','PP2',                                      // Kenya pre-primary
    'Grade 1','Grade 2','Grade 3',                    // Kenya/ZA/ZW/ZM/ET/MZ
    'Primary 1','Primary 2','Primary 3',              // Nigeria
    'Standard 1','Standard 2','Standard 3',           // Tanzania/Malawi/Botswana
    'P1','P2','P3',                                   // Uganda/Rwanda
    'Class 1','Class 2','Class 3',                    // Ghana
    'CI','CP','CE1','CP1','CP2',                      // Senegal/Côte d'Ivoire
  ];
  return YOUNG_GRADES.includes(student.grade);
}

// ── NAV BUILDER ──────────────────────────────────────────────────
function buildNav(student, activePage) {
  const flag = COUNTRY_FLAGS[student.country] || '🌍';
  const country = COUNTRY_NAMES[student.country] || '';
  return `
  <nav>
    <a href="/dashboard.html" class="logo">EduStar<span> AI</span></a>
    <div class="nav-right">
      <div class="nav-pill">${flag} ${country} · ${student.grade}</div>
      <div class="nav-pill">⭐ <span id="nav-points">${student.points || 0}</span> pts</div>
      <a href="/subjects.html" class="nav-btn${activePage==='subjects'?' primary':''}">📚 Subjects</a>
      <a href="/books.html" class="nav-btn${activePage==='books'?' primary':''}">📖 Books</a>
      <a href="/quiz.html" class="nav-btn${activePage==='quiz'?' primary':''}">🧠 Quiz</a>
      <a href="/community.html" class="nav-btn${activePage==='community'?' primary':''}">💬 Community</a>
      <a href="/support.html" class="nav-btn${activePage==='support'?' primary':''}">🎧 Support</a>
      ${isYoungLearner(student) ? `<a href="/funlearning.html" class="nav-btn${activePage==='funlearning'?' primary':''}" style="background:linear-gradient(135deg,#FF6B9D,#C77DFF);color:#fff;border:none;font-weight:700">🎨 Fun Learning</a>` : ''}
      <div class="student-badge">
        <div class="level-dot" id="nav-level">${student.level || 1}</div>
        <span>${student.name.split(' ')[0]}</span>
      </div>
      <a href="/settings.html" class="nav-btn${activePage==='settings'?' primary':''}">⚙️ Settings</a>
      <button class="nav-btn" onclick="logout()">↩ Logout</button>
    </div>
  </nav>`;
}
// ================================================================
// EduStar — Floating AI Tutor Chat Widget
// Drop <script src="/scripts/chat-widget.js"></script> on any page
// Requires data.js to be loaded first
// ================================================================
(function () {
  'use strict';

  // Only show for logged-in users
  const student = (function () {
    try { return JSON.parse(localStorage.getItem('edustar_current') || 'null'); } catch { return null; }
  })();
  if (!student) return;

  let chatHistory = [];
  let chatBusy    = false;
  let isOpen      = false;
  let hasGreeted  = false;

  // ── Inject styles ─────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Floating button */
    #ai-fab {
      position:fixed; bottom:1.5rem; right:1.5rem; z-index:9000;
      width:56px; height:56px; border-radius:50%;
      background:linear-gradient(135deg,#FF6B2B,#F5A623);
      border:none; cursor:pointer; box-shadow:0 4px 20px rgba(255,107,43,0.45);
      display:flex; align-items:center; justify-content:center;
      font-size:1.5rem; transition:transform 0.2s, box-shadow 0.2s;
      color:white;
    }
    #ai-fab:hover { transform:scale(1.1); box-shadow:0 6px 28px rgba(255,107,43,0.6); }
    #ai-fab .fab-badge {
      position:absolute; top:-2px; right:-2px;
      width:16px; height:16px; border-radius:50%;
      background:#00C9A7; border:2px solid #0D0D1A;
      display:none;
    }
    #ai-fab .fab-badge.show { display:block; }

    /* Chat window */
    #ai-chat-window {
      position:fixed; bottom:5.5rem; right:1.5rem; z-index:9000;
      width:360px; max-width:calc(100vw - 2rem);
      height:520px; max-height:calc(100vh - 8rem);
      background:#1A1A2E; border:1px solid rgba(255,107,43,0.25);
      border-radius:20px; overflow:hidden;
      box-shadow:0 20px 60px rgba(0,0,0,0.5);
      display:flex; flex-direction:column;
      opacity:0; transform:scale(0.92) translateY(12px);
      pointer-events:none;
      transition:opacity 0.25s, transform 0.25s;
      transform-origin:bottom right;
    }
    #ai-chat-window.open {
      opacity:1; transform:scale(1) translateY(0);
      pointer-events:auto;
    }

    /* Header */
    #ai-chat-header {
      background:linear-gradient(135deg,rgba(255,107,43,0.15),rgba(245,166,35,0.08));
      border-bottom:1px solid rgba(255,255,255,0.08);
      padding:0.9rem 1.1rem;
      display:flex; align-items:center; gap:0.7rem;
      flex-shrink:0;
    }
    #ai-chat-header .ai-avatar {
      width:36px; height:36px; border-radius:50%;
      background:linear-gradient(135deg,#FF6B2B,#F5A623);
      display:flex; align-items:center; justify-content:center;
      font-size:1.1rem; flex-shrink:0;
    }
    #ai-chat-header .ai-info { flex:1; min-width:0; }
    #ai-chat-header .ai-info strong { font-family:'Syne',sans-serif; font-size:0.9rem; display:block; color:#F0EDE8; }
    #ai-chat-header .ai-info span { font-size:0.72rem; color:#00C9A7; }
    #ai-chat-header .ai-close {
      background:rgba(255,255,255,0.08); border:none; color:#8A8A9A;
      width:28px; height:28px; border-radius:50%; cursor:pointer;
      font-size:0.85rem; display:flex; align-items:center; justify-content:center;
      transition:all 0.18s;
    }
    #ai-chat-header .ai-close:hover { background:rgba(255,71,87,0.2); color:#FF6B7A; }

    /* Messages */
    #ai-chat-msgs {
      flex:1; overflow-y:auto; padding:1rem;
      display:flex; flex-direction:column; gap:0.8rem;
    }
    #ai-chat-msgs::-webkit-scrollbar { width:3px; }
    #ai-chat-msgs::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
    .ai-msg { display:flex; gap:0.5rem; align-items:flex-start; }
    .ai-msg.user { flex-direction:row-reverse; }
    .ai-msg-av {
      width:28px; height:28px; border-radius:50%; flex-shrink:0;
      display:flex; align-items:center; justify-content:center; font-size:0.8rem;
    }
    .ai-msg-av.bot { background:linear-gradient(135deg,#FF6B2B,#F5A623); }
    .ai-msg-av.usr { background:rgba(0,201,167,0.15); border:1px solid rgba(0,201,167,0.3); color:#00C9A7; font-size:0.7rem; font-weight:700; font-family:'Syne',sans-serif; }
    .ai-msg-bubble {
      max-width:78%; padding:0.6rem 0.9rem;
      font-size:0.83rem; line-height:1.6; border-radius:14px;
      color:#F0EDE8; word-break:break-word;
    }
    .ai-msg.bot .ai-msg-bubble { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-top-left-radius:4px; }
    .ai-msg.user .ai-msg-bubble { background:linear-gradient(135deg,rgba(255,107,43,0.25),rgba(245,166,35,0.15)); border:1px solid rgba(255,107,43,0.22); border-top-right-radius:4px; }
    .ai-typing { display:flex; gap:5px; align-items:center; padding:0.4rem 0.2rem; }
    .ai-typing span { width:7px; height:7px; background:#8A8A9A; border-radius:50%; animation:aiDotBounce 1.2s infinite; }
    .ai-typing span:nth-child(2){animation-delay:0.2s}
    .ai-typing span:nth-child(3){animation-delay:0.4s}
    @keyframes aiDotBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }

    /* Suggestions */
    #ai-chat-suggestions {
      display:flex; flex-wrap:wrap; gap:0.4rem;
      padding:0 0.9rem 0.6rem; flex-shrink:0;
    }
    .ai-chip {
      background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
      color:#8A8A9A; border-radius:50px; padding:0.22rem 0.7rem;
      font-size:0.72rem; cursor:pointer; font-family:'DM Sans',sans-serif;
      transition:all 0.18s;
    }
    .ai-chip:hover { background:rgba(255,107,43,0.1); border-color:rgba(255,107,43,0.3); color:#FF6B2B; }

    /* Input */
    #ai-chat-input-row {
      border-top:1px solid rgba(255,255,255,0.08);
      padding:0.7rem 0.9rem;
      display:flex; gap:0.6rem; align-items:flex-end; flex-shrink:0;
    }
    #ai-chat-input {
      flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
      border-radius:10px; padding:0.6rem 0.8rem; color:#F0EDE8;
      font-family:'DM Sans',sans-serif; font-size:0.85rem;
      resize:none; min-height:38px; max-height:90px; outline:none;
      transition:border-color 0.2s;
    }
    #ai-chat-input:focus { border-color:rgba(255,107,43,0.5); }
    #ai-chat-input::placeholder { color:#8A8A9A; }
    #ai-chat-send {
      width:38px; height:38px; flex-shrink:0;
      background:linear-gradient(135deg,#FF6B2B,#F5A623);
      border:none; border-radius:9px; color:white; cursor:pointer;
      font-size:0.9rem; display:flex; align-items:center; justify-content:center;
      transition:all 0.2s;
    }
    #ai-chat-send:hover { transform:scale(1.08); box-shadow:0 3px 12px rgba(255,107,43,0.4); }
    #ai-chat-send:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

    @media(max-width:480px){
      #ai-chat-window { width:calc(100vw - 1rem); right:0.5rem; bottom:5rem; }
      #ai-fab { bottom:1rem; right:1rem; }
    }
  `;
  document.head.appendChild(style);

  // ── Build HTML ────────────────────────────────────────────────
  const fab = document.createElement('button');
  fab.id = 'ai-fab';
  fab.title = 'AI Tutor';
  fab.innerHTML = '🤖<span class="fab-badge" id="ai-fab-badge"></span>';
  fab.onclick = toggleChat;
  document.body.appendChild(fab);

  const win = document.createElement('div');
  win.id = 'ai-chat-window';
  win.innerHTML = `
    <div id="ai-chat-header">
      <div class="ai-avatar">🤖</div>
      <div class="ai-info">
        <strong>EduStar AI Tutor</strong>
        <span>● Always here to help</span>
      </div>
      <button class="ai-close" onclick="window._aiChatClose()" title="Close">✕</button>
    </div>
    <div id="ai-chat-msgs"></div>
    <div id="ai-chat-suggestions"></div>
    <div id="ai-chat-input-row">
      <textarea id="ai-chat-input" placeholder="Ask your question here..." rows="1"></textarea>
      <button id="ai-chat-send" onclick="window._aiChatSend()">➤</button>
    </div>
  `;
  document.body.appendChild(win);

  // ── Wire up input ─────────────────────────────────────────────
  const inp = document.getElementById('ai-chat-input');
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window._aiChatSend(); }
  });
  inp.addEventListener('input', () => {
    inp.style.height = 'auto';
    inp.style.height = Math.min(inp.scrollHeight, 90) + 'px';
  });

  // ── Toggle open/close ─────────────────────────────────────────
  function toggleChat() {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    fab.innerHTML = isOpen ? '✕<span class="fab-badge" id="ai-fab-badge"></span>' : '🤖<span class="fab-badge" id="ai-fab-badge"></span>';
    document.getElementById('ai-fab-badge').classList.remove('show');
    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      showGreeting();
      showSuggestions();
    }
    if (isOpen) setTimeout(() => inp.focus(), 280);
  }
  window._aiChatClose = () => { if (isOpen) toggleChat(); };

  // ── Greeting ──────────────────────────────────────────────────
  function showGreeting() {
    const country = (typeof COUNTRY_NAMES !== 'undefined' && COUNTRY_NAMES[student.country]) || 'Africa';
    addBotMsg(`👋 Hujambo, ${student.name}! I'm your EduStar AI Tutor. I know the ${country} curriculum for ${student.grade} inside out. What are you studying today?`);
  }

  function showSuggestions() {
    const country = (typeof COUNTRY_NAMES !== 'undefined' && COUNTRY_NAMES[student.country]) || 'Africa';
    const chips = [
      `Help with ${student.grade} Maths`,
      `Explain photosynthesis`,
      `Essay writing tips`,
      `${country} history`,
      `Exam strategies`,
    ];
    const el = document.getElementById('ai-chat-suggestions');
    el.innerHTML = chips.map(c =>
      `<button class="ai-chip" onclick="window._aiUseChip(this)">${c}</button>`
    ).join('');
  }

  window._aiUseChip = function(btn) {
    inp.value = btn.textContent;
    document.getElementById('ai-chat-suggestions').innerHTML = '';
    window._aiChatSend();
  };

  // ── Send message ──────────────────────────────────────────────
  window._aiChatSend = async function () {
    const msg = inp.value.trim();
    if (!msg || chatBusy) return;
    inp.value = ''; inp.style.height = 'auto';
    document.getElementById('ai-chat-suggestions').innerHTML = '';
    addUserMsg(msg);
    chatHistory.push({ role: 'user', content: msg });
    await getReply();
  };

  // ── Get AI reply ──────────────────────────────────────────────
  async function getReply() {
    chatBusy = true;
    document.getElementById('ai-chat-send').disabled = true;

    const typingId = 'ai-typing-' + Date.now();
    const typingEl = document.createElement('div');
    typingEl.className = 'ai-msg bot';
    typingEl.id = typingId;
    typingEl.innerHTML = `<div class="ai-msg-av bot">🤖</div><div class="ai-msg-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
    document.getElementById('ai-chat-msgs').appendChild(typingEl);
    scrollMsgs();

    const systemPrompt = (typeof buildSystemPrompt === 'function')
      ? buildSystemPrompt(student)
      : `You are a helpful educational AI tutor for ${student.name}, a student in ${student.grade}.`;

    try {
      let reply;

      // Primary: Pollinations OpenAI-compatible
      try {
        const res = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'openai',
            messages: [{ role: 'system', content: systemPrompt }, ...chatHistory],
            seed: Math.floor(Math.random() * 9999),
            private: true
          })
        });
        if (!res.ok) throw new Error('status ' + res.status);
        const data = await res.json();
        reply = data.choices?.[0]?.message?.content;
        if (!reply) throw new Error('empty');
      } catch (e1) {
        // Fallback: Pollinations simple GET
        const sys = systemPrompt.slice(0, 300);
        const last = chatHistory[chatHistory.length - 1]?.content || '';
        const prompt = encodeURIComponent(sys + '\n\nStudent: ' + last + '\n\nTutor:');
        const res2 = await fetch('https://text.pollinations.ai/' + prompt);
        if (!res2.ok) throw new Error('fallback failed');
        reply = await res2.text();
        if (!reply || reply.length < 3) throw new Error('empty fallback');
      }

      document.getElementById(typingId)?.remove();
      addBotMsg(reply);
      chatHistory.push({ role: 'assistant', content: reply });

      // +5 pts every 5 messages
      const userCount = chatHistory.filter(m => m.role === 'user').length;
      if (userCount % 5 === 0) {
        student.points = (student.points || 0) + 5;
        if (typeof saveStudent === 'function') saveStudent(student);
        if (typeof toast === 'function') toast('💬 +5 pts for studying with AI Tutor!');
      }

      // Badge on fab when window is closed
      if (!isOpen) {
        const badge = document.getElementById('ai-fab-badge');
        if (badge) badge.classList.add('show');
      }

    } catch (e) {
      document.getElementById(typingId)?.remove();
      addBotMsg('⚠️ The AI tutor is temporarily unavailable. Please try again in a moment!');
    }

    chatBusy = false;
    document.getElementById('ai-chat-send').disabled = false;
  }

  // ── Message renderers ─────────────────────────────────────────
  function addBotMsg(text) {
    const el = document.createElement('div');
    el.className = 'ai-msg bot';
    el.innerHTML = `<div class="ai-msg-av bot">🤖</div><div class="ai-msg-bubble">${text.replace(/\n/g,'<br>')}</div>`;
    document.getElementById('ai-chat-msgs').appendChild(el);
    scrollMsgs();
  }

  function addUserMsg(text) {
    const initials = (student.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const el = document.createElement('div');
    el.className = 'ai-msg user';
    el.innerHTML = `<div class="ai-msg-av usr">${initials}</div><div class="ai-msg-bubble">${escapeHtml(text)}</div>`;
    document.getElementById('ai-chat-msgs').appendChild(el);
    scrollMsgs();
  }

  function scrollMsgs() {
    const el = document.getElementById('ai-chat-msgs');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();