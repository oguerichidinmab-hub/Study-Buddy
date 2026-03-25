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
  }
];
