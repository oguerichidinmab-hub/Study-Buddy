import { ExamQuestion } from "../types";

export const PRACTICE_QUESTIONS: ExamQuestion[] = [
  // JAMB - Use of English
  {
    id: "jamb-eng-2023-01",
    subject: "English",
    year: 2023,
    examType: "JAMB",
    question: "Choose the option that best completes the sentence: The principal's speech was so ______ that many students were moved to tears.",
    options: ["redundant", "evocative", "monotonous", "superficial"],
    correctAnswer: 1,
    explanation: "'Evocative' means bringing strong images, memories, or feelings to mind, which explains why the students were moved to tears.",
    sourceType: "original"
  },
  {
    id: "jamb-eng-2023-02",
    subject: "English",
    year: 2023,
    examType: "JAMB",
    question: "Which of the following is the antonym of 'Meticulous'?",
    options: ["Careful", "Sloppy", "Detailed", "Precise"],
    correctAnswer: 1,
    explanation: "'Meticulous' means showing great attention to detail. 'Sloppy' is the opposite, meaning careless or unsystematic.",
    sourceType: "original"
  },
  // JAMB - Mathematics
  {
    id: "jamb-math-2023-01",
    subject: "Mathematics",
    year: 2023,
    examType: "JAMB",
    question: "If log 2 = 0.3010 and log 3 = 0.4771, find the value of log 6.",
    options: ["0.1761", "0.7781", "1.4313", "0.1431"],
    correctAnswer: 1,
    explanation: "log 6 = log (2 * 3) = log 2 + log 3 = 0.3010 + 0.4771 = 0.7781.",
    sourceType: "original"
  },
  {
    id: "jamb-math-2023-02",
    subject: "Mathematics",
    year: 2023,
    examType: "JAMB",
    question: "Solve for x: 2x + 5 = 13.",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    explanation: "2x = 13 - 5 => 2x = 8 => x = 4.",
    sourceType: "original"
  },
  // WAEC - Biology
  {
    id: "waec-bio-2023-01",
    subject: "Biology",
    year: 2023,
    examType: "WAEC",
    question: "The part of the mammalian brain responsible for maintaining balance and posture is the:",
    options: ["Cerebrum", "Cerebellum", "Medulla oblongata", "Hypothalamus"],
    correctAnswer: 1,
    explanation: "The cerebellum is primarily responsible for motor control, balance, and coordination of movement.",
    sourceType: "original"
  },
  {
    id: "waec-bio-2023-02",
    subject: "Biology",
    year: 2023,
    examType: "WAEC",
    question: "Which of the following is an example of a parasitic plant?",
    options: ["Mistletoe", "Hibiscus", "Maize", "Fern"],
    correctAnswer: 0,
    explanation: "Mistletoe is a partial parasite that grows on the branches of trees and shrubs, extracting water and nutrients from its host.",
    sourceType: "original"
  },
  // WAEC - Physics
  {
    id: "waec-phy-2023-01",
    subject: "Physics",
    year: 2023,
    examType: "WAEC",
    question: "Which of the following is a scalar quantity?",
    options: ["Velocity", "Force", "Work", "Acceleration"],
    correctAnswer: 2,
    explanation: "Work is a scalar quantity because it has only magnitude and no direction. Velocity, Force, and Acceleration are vector quantities.",
    sourceType: "original"
  },
  {
    id: "waec-phy-2023-02",
    subject: "Physics",
    year: 2023,
    examType: "WAEC",
    question: "The unit of electrical resistance is:",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correctAnswer: 2,
    explanation: "The Ohm (Ω) is the SI unit of electrical resistance.",
    sourceType: "original"
  },
  // JAMB - Chemistry
  {
    id: "jamb-chem-2023-01",
    subject: "Chemistry",
    year: 2023,
    examType: "JAMB",
    question: "The process by which a solid changes directly into a gas without passing through the liquid state is called:",
    options: ["Evaporation", "Condensation", "Sublimation", "Distillation"],
    correctAnswer: 2,
    explanation: "Sublimation is the transition of a substance directly from the solid to the gas state without passing through the liquid state.",
    sourceType: "original"
  },
  {
    id: "jamb-chem-2023-02",
    subject: "Chemistry",
    year: 2023,
    examType: "JAMB",
    question: "What is the atomic number of Carbon?",
    options: ["4", "6", "8", "12"],
    correctAnswer: 1,
    explanation: "Carbon has 6 protons, so its atomic number is 6.",
    sourceType: "original"
  },
  // WAEC - Government
  {
    id: "waec-gov-2023-01",
    subject: "Government",
    year: 2023,
    examType: "WAEC",
    question: "A system of government where power is shared between the central and state governments is called:",
    options: ["Unitary", "Federal", "Confederal", "Monarchy"],
    correctAnswer: 1,
    explanation: "Federalism is a system of government in which power is divided between a central authority and constituent political units.",
    sourceType: "original"
  },
  {
    id: "waec-gov-2023-02",
    subject: "Government",
    year: 2023,
    examType: "WAEC",
    question: "The first indigenous Governor-General of Nigeria was:",
    options: ["Herbert Macaulay", "Nnamdi Azikiwe", "Obafemi Awolowo", "Ahmadu Bello"],
    correctAnswer: 1,
    explanation: "Dr. Nnamdi Azikiwe became the first indigenous Governor-General of Nigeria in 1960.",
    sourceType: "original"
  },
  // JAMB - Economics
  {
    id: "jamb-eco-2023-01",
    subject: "Economics",
    year: 2023,
    examType: "JAMB",
    question: "The basic economic problem of all societies is:",
    options: ["Inflation", "Unemployment", "Scarcity", "Poverty"],
    correctAnswer: 2,
    explanation: "Scarcity is the fundamental economic problem of having seemingly unlimited human wants in a world of limited resources.",
    sourceType: "original"
  },
  {
    id: "jamb-eco-2023-02",
    subject: "Economics",
    year: 2023,
    examType: "JAMB",
    question: "Opportunity cost is also known as:",
    options: ["Real cost", "Money cost", "Variable cost", "Fixed cost"],
    correctAnswer: 0,
    explanation: "Opportunity cost is the 'real cost' of an item, representing what you give up to get it.",
    sourceType: "original"
  },
  // WAEC - Literature
  {
    id: "waec-lit-2023-01",
    subject: "Literature",
    year: 2023,
    examType: "WAEC",
    question: "A poem of fourteen lines with a specific rhyme scheme is a:",
    options: ["Ode", "Elegy", "Sonnet", "Ballad"],
    correctAnswer: 2,
    explanation: "A sonnet is a poetic form which originated at the Court of the Holy Roman Emperor Frederick II in Palermo, Sicily.",
    sourceType: "original"
  },
  {
    id: "waec-lit-2023-02",
    subject: "Literature",
    year: 2023,
    examType: "WAEC",
    question: "The use of like or as to compare two things is called:",
    options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
    correctAnswer: 1,
    explanation: "A simile is a figure of speech that directly compares two things using 'like' or 'as'.",
    sourceType: "original"
  },
  // Additional Questions
  // English
  {
    id: "jamb-eng-2023-03",
    subject: "English",
    year: 2023,
    examType: "JAMB",
    question: "Choose the option that is nearest in meaning to the underlined word: The manager's decision was **arbitrary**.",
    options: ["Reasonable", "Random", "Calculated", "Democratic"],
    correctAnswer: 1,
    explanation: "'Arbitrary' means based on random choice or personal whim, rather than any reason or system.",
    sourceType: "original"
  },
  {
    id: "waec-eng-2023-01",
    subject: "English",
    year: 2023,
    examType: "WAEC",
    question: "Neither the principal nor the teachers ______ present at the meeting.",
    options: ["was", "were", "is", "has been"],
    correctAnswer: 1,
    explanation: "In a 'neither...nor' construction, the verb agrees with the closer subject. 'Teachers' is plural, so 'were' is correct.",
    sourceType: "original"
  },
  // Mathematics
  {
    id: "jamb-math-2023-03",
    subject: "Mathematics",
    year: 2023,
    examType: "JAMB",
    question: "Find the roots of the equation: x^2 - 5x + 6 = 0.",
    options: ["2, 3", "-2, -3", "1, 6", "-1, -6"],
    correctAnswer: 0,
    explanation: "Factorizing x^2 - 5x + 6 gives (x-2)(x-3) = 0. So x = 2 or x = 3.",
    sourceType: "original"
  },
  {
    id: "waec-math-2023-01",
    subject: "Mathematics",
    year: 2023,
    examType: "WAEC",
    question: "The mean of 5, 8, 10, 12, and x is 10. Find the value of x.",
    options: ["10", "15", "13", "12"],
    correctAnswer: 1,
    explanation: "(5 + 8 + 10 + 12 + x) / 5 = 10 => 35 + x = 50 => x = 15.",
    sourceType: "original"
  },
  // Biology
  {
    id: "jamb-bio-2023-01",
    subject: "Biology",
    year: 2023,
    examType: "JAMB",
    question: "In a cross between a homozygous tall plant (TT) and a homozygous short plant (tt), what percentage of the offspring will be tall?",
    options: ["25%", "50%", "75%", "100%"],
    correctAnswer: 3,
    explanation: "All offspring will have the genotype Tt, and since T is dominant, 100% will be tall.",
    sourceType: "original"
  },
  {
    id: "waec-bio-2023-03",
    subject: "Biology",
    year: 2023,
    examType: "WAEC",
    question: "Which of the following organisms is a primary consumer in a food chain?",
    options: ["Grass", "Grasshopper", "Snake", "Hawk"],
    correctAnswer: 1,
    explanation: "A primary consumer is an herbivore that eats producers (like grass). A grasshopper fits this description.",
    sourceType: "original"
  },
  // Chemistry
  {
    id: "jamb-chem-2023-03",
    subject: "Chemistry",
    year: 2023,
    examType: "JAMB",
    question: "Which of the following elements has the highest electronegativity?",
    options: ["Chlorine", "Fluorine", "Oxygen", "Nitrogen"],
    correctAnswer: 1,
    explanation: "Fluorine is the most electronegative element on the periodic table.",
    sourceType: "original"
  },
  {
    id: "waec-chem-2023-01",
    subject: "Chemistry",
    year: 2023,
    examType: "WAEC",
    question: "The general formula for alkanes is:",
    options: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"],
    correctAnswer: 1,
    explanation: "Alkanes are saturated hydrocarbons with the general formula CnH2n+2.",
    sourceType: "original"
  },
  // Physics
  {
    id: "jamb-phy-2023-01",
    subject: "Physics",
    year: 2023,
    examType: "JAMB",
    question: "Newton's second law of motion states that Force is equal to:",
    options: ["Mass / Acceleration", "Mass * Acceleration", "Velocity / Time", "Mass * Velocity"],
    correctAnswer: 1,
    explanation: "F = ma, where F is force, m is mass, and a is acceleration.",
    sourceType: "original"
  },
  {
    id: "waec-phy-2023-03",
    subject: "Physics",
    year: 2023,
    examType: "WAEC",
    question: "The speed of sound is fastest in:",
    options: ["Air", "Water", "Steel", "Vacuum"],
    correctAnswer: 2,
    explanation: "Sound travels fastest in solids because the particles are more closely packed together.",
    sourceType: "original"
  },
  // Government
  {
    id: "jamb-gov-2023-01",
    subject: "Government",
    year: 2023,
    examType: "JAMB",
    question: "The 1999 Constitution of Nigeria is an example of a:",
    options: ["Written and Rigid Constitution", "Unwritten and Flexible Constitution", "Written and Flexible Constitution", "Unwritten and Rigid Constitution"],
    correctAnswer: 0,
    explanation: "The Nigerian constitution is documented (written) and requires a special procedure for amendment (rigid).",
    sourceType: "original"
  },
  {
    id: "waec-gov-2023-03",
    subject: "Government",
    year: 2023,
    examType: "WAEC",
    question: "The headquarters of the Economic Community of West African States (ECOWAS) is located in:",
    options: ["Lagos", "Accra", "Abuja", "Dakar"],
    correctAnswer: 2,
    explanation: "The ECOWAS Secretariat is located in Abuja, Nigeria.",
    sourceType: "original"
  },
  // Economics
  {
    id: "jamb-eco-2023-03",
    subject: "Economics",
    year: 2023,
    examType: "JAMB",
    question: "An increase in the price of a commodity usually leads to:",
    options: ["An increase in demand", "A decrease in demand", "An increase in supply", "No change in supply"],
    correctAnswer: 1,
    explanation: "According to the law of demand, as price increases, the quantity demanded decreases.",
    sourceType: "original"
  },
  {
    id: "waec-eco-2023-01",
    subject: "Economics",
    year: 2023,
    examType: "WAEC",
    question: "Which of the following is NOT a factor of production?",
    options: ["Land", "Labour", "Capital", "Money"],
    correctAnswer: 3,
    explanation: "The four factors of production are Land, Labour, Capital, and Entrepreneurship. Money is a medium of exchange.",
    sourceType: "original"
  },
  // Literature
  {
    id: "jamb-lit-2023-01",
    subject: "Literature",
    year: 2023,
    examType: "JAMB",
    question: "When a speaker says the opposite of what they mean, it is called:",
    options: ["Metaphor", "Irony", "Paradox", "Oxymoron"],
    correctAnswer: 1,
    explanation: "Verbal irony occurs when a person says or writes one thing and means another.",
    sourceType: "original"
  },
  {
    id: "waec-lit-2023-03",
    subject: "Literature",
    year: 2023,
    examType: "WAEC",
    question: "A play that ends on a sad note, usually with the death of the main character, is a:",
    options: ["Comedy", "Tragedy", "Tragicomedy", "Farce"],
    correctAnswer: 1,
    explanation: "A tragedy is a form of drama based on human suffering that invokes an accompanying catharsis.",
    sourceType: "original"
  },
  // Batch 3
  // English
  {
    id: "jamb-eng-2023-04",
    subject: "English",
    year: 2023,
    examType: "JAMB",
    question: "What is the meaning of the idiom 'to kick the bucket'?",
    options: ["To start a fight", "To die", "To be very happy", "To clean a room"],
    correctAnswer: 1,
    explanation: "'To kick the bucket' is an informal English idiom, meaning to die.",
    sourceType: "original"
  },
  {
    id: "waec-eng-2023-02",
    subject: "English",
    year: 2023,
    examType: "WAEC",
    question: "He is very good ______ playing the piano.",
    options: ["in", "at", "with", "for"],
    correctAnswer: 1,
    explanation: "The correct preposition to use with 'good' when referring to a skill is 'at'.",
    sourceType: "original"
  },
  // Mathematics
  {
    id: "jamb-math-2023-04",
    subject: "Mathematics",
    year: 2023,
    examType: "JAMB",
    question: "A bag contains 3 red balls and 5 blue balls. If a ball is picked at random, what is the probability that it is red?",
    options: ["3/5", "5/8", "3/8", "1/2"],
    correctAnswer: 2,
    explanation: "Probability = (Number of favorable outcomes) / (Total number of outcomes) = 3 / (3 + 5) = 3/8.",
    sourceType: "original"
  },
  {
    id: "waec-math-2023-02",
    subject: "Mathematics",
    year: 2023,
    examType: "WAEC",
    question: "The sum of angles in a triangle is:",
    options: ["90 degrees", "180 degrees", "270 degrees", "360 degrees"],
    correctAnswer: 1,
    explanation: "The interior angles of any triangle always add up to 180 degrees.",
    sourceType: "original"
  },
  // Biology
  {
    id: "jamb-bio-2023-02",
    subject: "Biology",
    year: 2023,
    examType: "JAMB",
    question: "The process by which green plants manufacture their food using sunlight is called:",
    options: ["Respiration", "Transpiration", "Photosynthesis", "Osmosis"],
    correctAnswer: 2,
    explanation: "Photosynthesis is the process used by plants and other organisms to convert light energy into chemical energy.",
    sourceType: "original"
  },
  {
    id: "waec-bio-2023-04",
    subject: "Biology",
    year: 2023,
    examType: "WAEC",
    question: "Which of the following blood vessels carries oxygenated blood from the lungs to the heart?",
    options: ["Pulmonary artery", "Pulmonary vein", "Aorta", "Vena cava"],
    correctAnswer: 1,
    explanation: "The pulmonary vein is the only vein that carries oxygenated blood (from the lungs to the left atrium of the heart).",
    sourceType: "original"
  },
  // Chemistry
  {
    id: "jamb-chem-2023-04",
    subject: "Chemistry",
    year: 2023,
    examType: "JAMB",
    question: "Boyle's Law states that at constant temperature, the volume of a fixed mass of gas is:",
    options: ["Directly proportional to its pressure", "Inversely proportional to its pressure", "Directly proportional to its absolute temperature", "Inversely proportional to its absolute temperature"],
    correctAnswer: 1,
    explanation: "Boyle's Law: P1V1 = P2V2, meaning pressure and volume are inversely proportional at constant temperature.",
    sourceType: "original"
  },
  {
    id: "waec-chem-2023-02",
    subject: "Chemistry",
    year: 2023,
    examType: "WAEC",
    question: "The electrode connected to the positive terminal of a battery during electrolysis is the:",
    options: ["Cathode", "Anode", "Electrolyte", "Ion"],
    correctAnswer: 1,
    explanation: "The anode is the positive electrode, while the cathode is the negative electrode.",
    sourceType: "original"
  },
  // Physics
  {
    id: "jamb-phy-2023-02",
    subject: "Physics",
    year: 2023,
    examType: "JAMB",
    question: "According to Ohm's Law, the current (I) flowing through a conductor is directly proportional to the:",
    options: ["Resistance (R)", "Potential Difference (V)", "Power (P)", "Energy (E)"],
    correctAnswer: 1,
    explanation: "V = IR, so I = V/R. Current is directly proportional to voltage (potential difference).",
    sourceType: "original"
  },
  {
    id: "waec-phy-2023-04",
    subject: "Physics",
    year: 2023,
    examType: "WAEC",
    question: "The bending of light as it passes from one medium to another is called:",
    options: ["Reflection", "Refraction", "Diffraction", "Interference"],
    correctAnswer: 1,
    explanation: "Refraction is the change in direction of a wave passing from one medium to another or from a gradual change in the medium.",
    sourceType: "original"
  },
  // Government
  {
    id: "jamb-gov-2023-02",
    subject: "Government",
    year: 2023,
    examType: "JAMB",
    question: "Which of the following was the first political party in Nigeria?",
    options: ["NCNC", "NPC", "AG", "NNDP"],
    correctAnswer: 3,
    explanation: "The Nigerian National Democratic Party (NNDP), founded by Herbert Macaulay in 1923, was the first political party in Nigeria.",
    sourceType: "original"
  },
  {
    id: "waec-gov-2023-04",
    subject: "Government",
    year: 2023,
    examType: "WAEC",
    question: "The main source of revenue for local governments in Nigeria is:",
    options: ["Personal Income Tax", "Federal Allocation", "Licence fees", "Market stalls"],
    correctAnswer: 1,
    explanation: "While local governments have internal revenue sources, they rely heavily on statutory allocations from the Federation Account.",
    sourceType: "original"
  },
  // Economics
  {
    id: "jamb-eco-2023-04",
    subject: "Economics",
    year: 2023,
    examType: "JAMB",
    question: "The primary function of money is to serve as a:",
    options: ["Store of value", "Medium of exchange", "Standard of deferred payment", "Unit of account"],
    correctAnswer: 1,
    explanation: "The most important function of money is that it acts as a medium of exchange to facilitate transactions.",
    sourceType: "original"
  },
  {
    id: "waec-eco-2023-02",
    subject: "Economics",
    year: 2023,
    examType: "WAEC",
    question: "A tax on imported goods is called a:",
    options: ["Quota", "Subsidy", "Tariff", "Embargo"],
    correctAnswer: 2,
    explanation: "A tariff is a tax imposed by a government on imported or exported goods.",
    sourceType: "original"
  },
  // Literature
  {
    id: "jamb-lit-2023-02",
    subject: "Literature",
    year: 2023,
    examType: "JAMB",
    question: "The pattern of rhymes at the end of each line of a poem is called:",
    options: ["Rhythm", "Meter", "Rhyme scheme", "Stanza"],
    correctAnswer: 2,
    explanation: "Rhyme scheme is the formal arrangement of rhymes in a stanza or a whole poem.",
    sourceType: "original"
  },
  {
    id: "waec-lit-2023-04",
    subject: "Literature",
    year: 2023,
    examType: "WAEC",
    question: "The main sequence of events in a story is the:",
    options: ["Theme", "Setting", "Plot", "Conflict"],
    correctAnswer: 2,
    explanation: "The plot is the sequence of events where each affects the next one through the principle of cause-and-effect.",
    sourceType: "original"
  }
];
