import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// Combine all geminiService imports into one line and remove the "..."
import { 
  generateQuestions, 
  generateGrammarLesson, 
  generateSpellingTest, 
  generateShortDefinitions,
  generateReadingTest,
  generateVocabTest,
  generateMathTest,
  generateMockTest 
} from '../geminiService';
import { VocabularyWord, GrammarLesson, Question, RootWord, Category } from '../types';

const GRAMMAR_TOPICS = [
  "Comma Mastery: Essential vs Non-Essential",
  "Semicolons, Colons, and Dashes",
  "Modifier Placement (Dangling/Misplaced)",
  "Subject-Verb Agreement Pitfalls",
  "Parallel Structure in Lists",
  "Active vs Passive Voice Strategies",
  "Pronoun Case and Agreement",
  "Verb Tense Consistency",
  "Sentence Combining and Flow",
  "Transition Words and Rhetorical Purpose",
  "Commonly Confused Words (Academic)",
  "Capitalization and Punctuation Nuance"
];

const FALLBACK_GRAMMAR_DATA: Record<string, GrammarLesson> = {
  "Comma Mastery: Essential vs Non-Essential": {
    topic: "Comma Mastery: Essential vs Non-Essential",
    explanation: "Commas set off non-essential (non-restrictive) information that adds detail but isn't required for the sentence's basic meaning. Essential (restrictive) clauses are NOT set off by commas because they limit or define the noun they follow.",
    examples: [
      "Non-essential: Mr. Thompson, who is my favorite teacher, gave us a test.",
      "Essential: The student who is wearing the red hat won the race."
    ],
    quickCheck: {
      question: "Which sentence correctly punctuates a non-essential clause?",
      options: [
        "The cat, that has white paws is sleeping.",
        "The book, which I borrowed from the library, is overdue.",
        "The players, who arrived late were benched.",
        "All students, who pass the test, will receive a certificate."
      ],
      correctAnswer: 1,
      explanation: "'Which' usually introduces non-essential information and must be surrounded by commas. 'That' clauses are essential and should not have commas."
    }
  },
  "Semicolons, Colons, and Dashes": {
    topic: "Semicolons, Colons, and Dashes",
    explanation: "Semicolons join two independent clauses without a conjunction. Colons follow an independent clause to introduce a list, quote, or explanation. Dashes indicate an abrupt break in thought or emphasize a specific point.",
    examples: [
      "Semicolon: I have a big test tomorrow; I need to study tonight.",
      "Colon: She had three goals: fame, fortune, and happiness.",
      "Dash: The answer was clear—or so we thought."
    ],
    quickCheck: {
      question: "Identify the sentence with the correct use of a colon:",
      options: [
        "To make the cake you need: flour, sugar, and eggs.",
        "I bought several items at the store: milk, bread, and cheese.",
        "The reasons for his success were: hard work and luck.",
        "He said: 'I will be there at noon.'"
      ],
      correctAnswer: 1,
      explanation: "A colon must follow a complete independent clause. 'I bought several items at the store' is a complete sentence."
    }
  },
  "Modifier Placement (Dangling/Misplaced)": {
    topic: "Modifier Placement (Dangling/Misplaced)",
    explanation: "A misplaced modifier is too far from the word it describes, creating confusion. A dangling modifier occurs when the word intended to be modified is missing from the sentence entirely.",
    examples: [
      "Misplaced: I saw a dog with a telescope. (The dog doesn't have a telescope!)",
      "Dangling: Running down the street, the sun was hot. (The sun wasn't running!)"
    ],
    quickCheck: {
      question: "Which sentence correctly places the modifier?",
      options: [
        "Hungry and tired, the sandwich tasted delicious to Mark.",
        "Mark ate a sandwich, hungry and tired.",
        "Hungry and tired, Mark ate a delicious sandwich.",
        "The sandwich was eaten by Mark, hungry and tired."
      ],
      correctAnswer: 2,
      explanation: "'Hungry and tired' describes Mark, so it must be placed directly next to his name."
    }
  },
  "Subject-Verb Agreement Pitfalls": {
    topic: "Subject-Verb Agreement Pitfalls",
    explanation: "Subjects and verbs must agree in number. Traps include words like 'everyone' (singular), 'each' (singular), and phrases that come between the subject and verb (like 'as well as').",
    examples: [
      "Correct: Each of the boys is tall.",
      "Correct: The captain, along with his crew, remains on the ship."
    ],
    quickCheck: {
      question: "Choose the correct verb: 'Neither the teacher nor the students ___ the answer.'",
      options: ["know", "knows", "knowing", "is knowing"],
      correctAnswer: 0,
      explanation: "When using 'neither/nor', the verb agrees with the subject closest to it. 'Students' is plural, so use 'know'."
    }
  },
  "Parallel Structure in Lists": {
    topic: "Parallel Structure in Lists",
    explanation: "Parallelism means using the same pattern of words to show that two or more ideas have the same level of importance. This is vital in lists or comparisons.",
    examples: [
      "Faulty: He likes hiking, swimming, and to ride bikes.",
      "Parallel: He likes hiking, swimming, and riding bikes."
    ],
    quickCheck: {
      question: "Which sentence demonstrates proper parallel structure?",
      options: [
        "The coach told the players to run, to jump, and that they should hide.",
        "The job requires typing, filing, and to answer phones.",
        "To succeed, you must be diligent, focused, and show patience.",
        "He likes to fish, to hike, and to swim."
      ],
      correctAnswer: 3,
      explanation: "Option D uses a consistent 'to [verb]' pattern for all three items in the series."
    }
  },
  "Active vs Passive Voice Strategies": {
    topic: "Active vs Passive Voice Strategies",
    explanation: "In active voice, the subject performs the action. In passive voice, the subject receives the action. Active voice is generally more direct and concise for academic writing.",
    examples: [
      "Active: The committee reached a decision.",
      "Passive: A decision was reached by the committee."
    ],
    quickCheck: {
      question: "Which sentence is more effective and written in the active voice?",
      options: [
        "The homework was completed by the student.",
        "A goal was scored by the striker.",
        "The chef prepared a five-course meal.",
        "The song was sung beautifully by the choir."
      ],
      correctAnswer: 2,
      explanation: "'The chef prepared...' is active; the subject (chef) is the one performing the action."
    }
  },
  "Pronoun Case and Agreement": {
    topic: "Pronoun Case and Agreement",
    explanation: "Pronouns must agree with their antecedents in number and gender. Subjective case (I, he, they) is used for subjects; objective case (me, him, them) is used for objects.",
    examples: [
      "Correct: If a student works hard, he or she will succeed.",
      "Correct: Between you and me, the secret is safe."
    ],
    quickCheck: {
      question: "Choose the correct pronoun: 'The prize was awarded to Mark and ___.'",
      options: ["I", "myself", "me", "we"],
      correctAnswer: 2,
      explanation: "'Mark and me' are the objects of the preposition 'to', so the objective case 'me' is required."
    }
  },
  "Verb Tense Consistency": {
    topic: "Verb Tense Consistency",
    explanation: "Do not shift verb tenses within a sentence or paragraph unless there is a clear chronological reason to do so. Maintain a steady timeframe.",
    examples: [
      "Inconsistent: He walked into the room and starts yelling.",
      "Consistent: He walked into the room and started yelling."
    ],
    quickCheck: {
      question: "Which sentence maintains consistent verb tense?",
      options: [
        "She opened the door and sees the beautiful garden.",
        "If you studied hard, you would have passed the test.",
        "The bell rings, the students leave, and the teacher sat down.",
        "He had finished his work before the deadline arrived."
      ],
      correctAnswer: 3,
      explanation: "This sentence correctly uses the past perfect ('had finished') to show one past action happened before another past action ('arrived')."
    }
  },
  "Sentence Combining and Flow": {
    topic: "Sentence Combining and Flow",
    explanation: "Combining short, choppy sentences creates better flow. Use conjunctions (and, but, for), relative pronouns (who, which), or participial phrases.",
    examples: [
      "Choppy: I have a cat. His name is Leo. He is orange.",
      "Combined: My orange cat, Leo, is very friendly."
    ],
    quickCheck: {
      question: "Which is the most effective way to combine: 'The storm was fierce. The power went out. We lit candles.'?",
      options: [
        "The storm was fierce and the power went out so we lit candles.",
        "Because the storm was fierce and the power went out, we lit candles.",
        "The storm being fierce, the power went out, therefore candles were lit.",
        "Lighting candles, the storm was fierce and the power went out."
      ],
      correctAnswer: 1,
      explanation: "Option B uses 'Because' to clearly show the cause-and-effect relationship between all three actions."
    }
  },
  "Transition Words and Rhetorical Purpose": {
    topic: "Transition Words and Rhetorical Purpose",
    explanation: "Transitions signal relationships between ideas (contrast, addition, cause/effect). Choose the word that reflects the author's logic.",
    examples: [
      "Contrast: However, nevertheless, conversely.",
      "Addition: Furthermore, moreover, additionally.",
      "Cause: Therefore, consequently, as a result."
    ],
    quickCheck: {
      question: "Select the transition that best shows contrast: 'The research was extensive; ___, the conclusions were still speculative.'",
      options: ["Furthermore", "Consequently", "However", "In addition"],
      correctAnswer: 2,
      explanation: "'However' correctly signals that the speculative conclusions are surprising despite the extensive research."
    }
  },
  "Commonly Confused Words (Academic)": {
    topic: "Commonly Confused Words (Academic)",
    explanation: "Academic writing requires precision between similar-sounding words like Affect (verb) vs. Effect (noun), or Compliment vs. Complement.",
    examples: [
      "Affect: The news will affect her mood.",
      "Effect: The medicine had a positive effect."
    ],
    quickCheck: {
      question: "Select the correct word: 'The scientist's discovery was a perfect ___ to the existing theory.'",
      options: ["complement", "compliment", "compliance", "complicate"],
      correctAnswer: 0,
      explanation: "'Complement' means to add to something in a way that enhances or improves it."
    }
  },
  "Capitalization and Punctuation Nuance": {
    topic: "Capitalization and Punctuation Nuance",
    explanation: "Capitalize proper nouns and specific titles, but not general categories. Use apostrophes for possession and contractions, but never for simple plurals.",
    examples: [
      "Correct: I visited President Lincoln in Washington.",
      "Correct: The girl's book (one girl), The girls' books (many girls)."
    ],
    quickCheck: {
      question: "Which sentence uses an apostrophe correctly to show possession?",
      options: [
        "The two dog's tails wagged happily.",
        "The boys' locker room was recently painted.",
        "Its' going to rain today.",
        "The student's are all in the gym."
      ],
      correctAnswer: 1,
      explanation: "For a plural noun ending in 's' (boys), the apostrophe goes after the 's' to show possession."
    }
  }
};

const FALLBACK_SPELLING_POOL: Question[] = [
  { id: 'fs-1', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Accommodate", "Acomodate", "Accomodate", "Acommodate"], correctAnswer: 0, explanation: "Accommodate has two 'c's and two 'm's." },
  { id: 'fs-2', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Separate", "Seperate", "Saparate", "Seprate"], correctAnswer: 0, explanation: "Think: There is 'a rat' in sep-a-rat-e." },
  { id: 'fs-3', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Occurrence", "Ocurence", "Occurence", "Occurrance"], correctAnswer: 0, explanation: "Occurrence has two 'c's, two 'r's, and ends in 'ence'." },
  { id: 'fs-4', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Conscientious", "Consciencous", "Conshentious", "Conscientous"], correctAnswer: 0, explanation: "Con-scien-tious comes from the word 'science'." },
  { id: 'fs-5', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Definitely", "Definitly", "Definately", "Deffinitely"], correctAnswer: 0, explanation: "Definitely is spelled with an 'i' after the 'n'." },
  { id: 'fs-6', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Embarrass", "Embaras", "Emberrass", "Embarass"], correctAnswer: 0, explanation: "Embarrass has two 'r's and two 's's." },
  { id: 'fs-7', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Argument", "Arguement", "Argumant", "Arguemant"], correctAnswer: 0, explanation: "Drop the 'e' from 'argue' when adding 'ment'." },
  { id: 'fs-8', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Calendar", "Calender", "Calander", "Calandor"], correctAnswer: 0, explanation: "Calendar ends in 'ar'." },
  { id: 'fs-9', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Indispensable", "Indispensible", "Indespensable", "Indespensible"], correctAnswer: 0, explanation: "It is spelled with an 'a' in the suffix 'able'." },
  { id: 'fs-10', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Minuscule", "Miniscule", "Minisule", "Minuscale"], correctAnswer: 0, explanation: "Minuscule comes from the word 'minus', not 'mini'." },
  { id: 'fs-11', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Independent", "Independant", "Indipendent", "Independant"], correctAnswer: 0, explanation: "Independent ends in 'ent'." },
  { id: 'fs-12', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Existence", "Existance", "Existance", "Exestence"], correctAnswer: 0, explanation: "Existence ends in 'ence'." },
  { id: 'fs-13', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Humorous", "Humerous", "Humourous", "Humerus"], correctAnswer: 0, explanation: "Humorous drops the 'u' from 'humour' (UK) and adds 'ous'. Humerus is a bone." },
  { id: 'fs-14', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Hierarchy", "Heirarchy", "Hierachy", "Hirarchy"], correctAnswer: 0, explanation: "Think: 'i' before 'e'." },
  { id: 'fs-15', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Intelligence", "Inteligence", "Intelligance", "Intellegence"], correctAnswer: 0, explanation: "Intelligence has two 'l's and ends in 'ence'." },
  { id: 'fs-16', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Judgment", "Judgement", "Judgmant", "Judgemant"], correctAnswer: 0, explanation: "In American English, 'judgment' is the standard spelling in legal contexts." },
  { id: 'fs-17', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Leisure", "Liesure", "Lesure", "Leasur"], correctAnswer: 0, explanation: "Leisure is spelled with 'ei'." },
  { id: 'fs-18', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Maneuver", "Manuver", "Manoeuver", "Maneuver"], correctAnswer: 0, explanation: "Maneuver follows the American spelling pattern." },
  { id: 'fs-19', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Maintenance", "Maintenence", "Maintainance", "Maintainence"], correctAnswer: 0, explanation: "Maintenance is based on the root but changes the 'ain' to 'en'." },
  { id: 'fs-20', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Necessary", "Neccessary", "Necesary", "Neccesary"], correctAnswer: 0, explanation: "One 'c', two 's's. Think of a shirt: one Collar, two Sleeves." },
  { id: 'fs-21', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Personnel", "Personel", "Personell", "Personal"], correctAnswer: 0, explanation: "Personnel (employees) has two 'n's and two 'e's in the suffix." },
  { id: 'fs-22', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Possession", "Posession", "Possesion", "Posesion"], correctAnswer: 0, explanation: "Possession has four 's's total." },
  { id: 'fs-23', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Privilege", "Priviledge", "Privaledge", "Privilege"], correctAnswer: 0, explanation: "Privilege ends in 'ege', not 'edge'." },
  { id: 'fs-24', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Questionnaire", "Questionaire", "Questionare", "Questionnair"], correctAnswer: 0, explanation: "Questionnaire has two 'n's." },
  { id: 'fs-25', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Receipt", "Reciept", "Reciept", "Receipt"], correctAnswer: 0, explanation: "Think: 'i' before 'e' except after 'c'." },
  { id: 'fs-26', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Recommend", "Reccommend", "Recomend", "Reccomend"], correctAnswer: 0, explanation: "One 'c', two 'm's." },
  { id: 'fs-27', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Rhythm", "Rythm", "Rhythum", "Rythum"], correctAnswer: 0, explanation: "Rhythm is spelled with 'h' after both 'r' and 't'." },
  { id: 'fs-28', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Schedule", "Scedule", "Skedule", "Schedulle"], correctAnswer: 0, explanation: "Schedule starts with 'sch'." },
  { id: 'fs-29', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Success", "Sucess", "Succes", "Sucess"], correctAnswer: 0, explanation: "Success has two 'c's and two 's's." },
  { id: 'fs-30', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Threshold", "Threshhold", "Threshhold", "Threshold"], correctAnswer: 0, explanation: "Threshold only has one 'h' in the middle." },
  { id: 'fs-31', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Tomorrow", "Tommorrow", "To-morrow", "Tomorow"], correctAnswer: 0, explanation: "One 'm', two 'r's." },
  { id: 'fs-32', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Unforgettable", "Unforgetable", "Unforgetteble", "Unforgetteble"], correctAnswer: 0, explanation: "Double the 't' when adding 'able' to 'forget'." },
  { id: 'fs-33', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Vacuum", "Vaccum", "Vacume", "Vacuume"], correctAnswer: 0, explanation: "Vacuum has two 'u's." },
  { id: 'fs-34', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Weather", "Whether", "Wether", "Wether"], correctAnswer: 0, explanation: "Weather refers to the climate outside." },
  { id: 'fs-35', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Writing", "Writting", "Writeing", "Writin"], correctAnswer: 0, explanation: "Writing has only one 't'." },
  { id: 'fs-36', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Yield", "Yeild", "Yeld", "Yiald"], correctAnswer: 0, explanation: "Think: 'i' before 'e'." },
  { id: 'fs-37', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Exaggerate", "Exagerate", "Exaggerat", "Exagerat"], correctAnswer: 0, explanation: "Exaggerate has two 'g's." },
  { id: 'fs-38', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Foreign", "Forien", "Forein", "Forreign"], correctAnswer: 0, explanation: "Foreign uses the 'ei' spelling." },
  { id: 'fs-39', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Grateful", "Greatful", "Gratfull", "Greatfull"], correctAnswer: 0, explanation: "Think: 'grate' as in a gratitude, not 'great'." },
  { id: 'fs-40', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Guarantee", "Garantee", "Gaurantee", "Guarenty"], correctAnswer: 0, explanation: "Starts with 'gua'." },
  { id: 'fs-41', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Ignorance", "Ignorence", "Ignorants", "Ignorence"], correctAnswer: 0, explanation: "Ignorance ends in 'ance'." },
  { id: 'fs-42', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Liaison", "Liason", "Liaison", "Laison"], correctAnswer: 0, explanation: "Liaison has an 'i' after the 'a'." },
  { id: 'fs-43', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Miscellaneous", "Miscelaneous", "Miscellanious", "Miscelleanous"], correctAnswer: 0, explanation: "Miscellaneous has two 'l's and ends in 'eous'." },
  { id: 'fs-44', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Neighbor", "Nieghbor", "Naybor", "Neighbor"], correctAnswer: 0, explanation: "American spelling 'neighbor' uses 'ei'." },
  { id: 'fs-45', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Noticeable", "Noticable", "Notiseable", "Noticeble"], correctAnswer: 0, explanation: "Keep the 'e' in 'notice' when adding 'able'." },
  { id: 'fs-46', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Pastime", "Passtime", "Past-time", "Pastime"], correctAnswer: 0, explanation: "Pastime only has one 's'." },
  { id: 'fs-47', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Patience", "Patients", "Pacience", "Patience"], correctAnswer: 0, explanation: "Patience (the virtue) ends in 'ce'. Patients are people in a hospital." },
  { id: 'fs-48', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Referred", "Refered", "Refered", "Referred"], correctAnswer: 0, explanation: "Double the 'r' in 'refer' when adding 'ed'." },
  { id: 'fs-49', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Sovereign", "Sovreign", "Soveriegn", "Sovereign"], correctAnswer: 0, explanation: "Sovereign uses the 'ei' spelling." },
  { id: 'fs-50', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Technique", "Technik", "Tecnique", "Technigue"], correctAnswer: 0, explanation: "Technique ends in 'que'." }
];

const ROOT_DATA: RootWord[] = [
  { root: "a/n", meaning: "not, without", examples: ["abyss", "achromatic", "anhydrous"] },
  { root: "a", meaning: "on", examples: ["afire", "ashore", "aside"] },
  { root: "ab/s", meaning: "from, away, off", examples: ["abduct", "abnormal", "absent", "aversion"] },
  { root: "a/c/d", meaning: "to, toward, near", examples: ["accelerate", "accessible", "admittance"] },
  { root: "acro", meaning: "top, height, tip, beginning", examples: ["acrobat", "acronym", "acrophobia"] },
  { root: "act", meaning: "do", examples: ["activity", "react", "interaction"] },
  { root: "aer/o", meaning: "air", examples: ["aerate", "aerial", "aerospace"] },
  { root: "agr/i/o", meaning: "farming", examples: ["agriculture", "agribusiness", "agrarian"] },
  { root: "alg/o", meaning: "pain", examples: ["neuralgia", "analgesic", "nostalgia"] },
  { root: "ambi/amphi", meaning: "both, on both sides, around", examples: ["ambidextrous", "ambiguous", "ambivalence"] },
  { root: "ambul", meaning: "walk, move", examples: ["amble", "ambulant", "ambulance"] },
  { root: "ami/o", meaning: "love", examples: ["amiable", "amity", "amorous"] },
  { root: "ana", meaning: "up, back, against, again, throughout", examples: ["analysis", "anatomy", "anachronism"] },
  { root: "andr/o", meaning: "man, male", examples: ["androgynous", "android", "misandry"] },
  { root: "anim", meaning: "life, spirit", examples: ["animal", "animate", "equanimity"] },
  { root: "ann/enn", meaning: "year", examples: ["anniversary", "annual", "millennium"] },
  { root: "ante", meaning: "before, in front", examples: ["antecede", "antemeridian", "anteroom"] },
  { root: "anth/o", meaning: "flower", examples: ["chrysanthemum", "anthology", "anthozoan"] },
  { root: "anthrop/o", meaning: "human", examples: ["anthropology", "philanthropy"] },
  { root: "anti", meaning: "against, opposite of", examples: ["antibody", "antiseptic", "antisocial"] },
  { root: "apo/apho", meaning: "away, off, separate", examples: ["aphorism", "apology", "apostrophe"] },
  { root: "aqu/a", meaning: "water", examples: ["aquarium", "aquatic", "aqueduct"] },
  { root: "arbor", meaning: "tree", examples: ["arborist", "arborous"] },
  { root: "arch/i", meaning: "chief, rule, most important", examples: ["archbishop", "monarch", "matriarch"] },
  { root: "astro/aster", meaning: "star, stars, outer space", examples: ["astronaut", "astronomer", "asterisk"] },
  { root: "aud/i/io", meaning: "hear", examples: ["audible", "audience", "audiovisual"] },
  { root: "auto", meaning: "self, same, one", examples: ["autocrat", "autograph", "automatic"] },
  { root: "avi/a", meaning: "bird", examples: ["aviary", "aviation", "aviatrix"] },
  { root: "bar/o", meaning: "pressure, weight", examples: ["baric", "milliard", "baryon"] },
  { root: "bell/i", meaning: "war", examples: ["bellicose", "belligerent", "rebel"] },
  { root: "bene", meaning: "good, well", examples: ["benefactor", "beneficial", "benevolent"] },
  { root: "bi/n", meaning: "two, twice, once in every two", examples: ["biannual", "binoculars", "bilateral"] },
  { root: "bio", meaning: "life, living matter", examples: ["biography", "biology", "biosphere"] },
  { root: "blast/o", meaning: "cell, primitive, immature cell", examples: ["blastula", "fibroblast", "blastoderm"] },
  { root: "burs", meaning: "pouch, purse", examples: ["bursar", "bursary", "disburse"] },
  { root: "calc", meaning: "stone", examples: ["calcite", "calcium", "calcification"] },
  { root: "cand", meaning: "glowing, iridescent", examples: ["candid", "candle", "incandescent"] },
  { root: "capt/cept/ceive", meaning: "take, hold", examples: ["intercept", "perceive", "captivate"] },
  { root: "cardi/o", meaning: "heart", examples: ["cardiac", "cardiogenic", "cardiologist"] },
  { root: "carn/i", meaning: "flesh, meat", examples: ["carnivorous", "carnal", "incarnate"] },
  { root: "cata", meaning: "down, against, completely", examples: ["cataclysm", "catalog", "catastrophe"] },
  { root: "caust/caut", meaning: "to burn", examples: ["cauterize", "caustic", "holocaust"] },
  { root: "cede/ceed/cess", meaning: "go, yield", examples: ["exceed", "recede", "access"] },
  { root: "celer", meaning: "fast", examples: ["accelerate", "decelerate"] },
  { root: "cent/i", meaning: "hundred, hundredth", examples: ["centennial", "centimeter", "century"] },
  { root: "centr/o/i", meaning: "center", examples: ["egocentric", "eccentric", "centrifugal"] },
  { root: "cephal/o", meaning: "head", examples: ["encephalitis", "cephalic", "cephalopod"] },
  { root: "cerebr/o", meaning: "brain", examples: ["cerebral", "cerebrate", "cerebrospinal"] },
  { root: "cert", meaning: "sure", examples: ["ascertain", "certain", "certify"] },
  { root: "chrom", meaning: "color, pigment", examples: ["achromatic", "chromium", "chromatics"] },
  { root: "chron/o", meaning: "time", examples: ["chronic", "chronology", "synchronize"] },
  { root: "chrys", meaning: "gold, yellow", examples: ["chrysanthemum", "chrysolite"] },
  { root: "cide/cise", meaning: "cut, kill", examples: ["homicide", "incisor", "insecticide"] },
  { root: "circum", meaning: "around, about", examples: ["circumnavigate", "circumscribe", "circumspect"] },
  { root: "claim/clam", meaning: "shout, speak out", examples: ["clamor", "exclaim", "proclamation"] },
  { root: "clar", meaning: "clear", examples: ["clarification", "clarify", "declare"] },
  { root: "clud/clus", meaning: "close", examples: ["conclusion", "exclusion", "seclude"] },
  { root: "cline", meaning: "lean", examples: ["inclination", "incline", "recline"] },
  { root: "co/con", meaning: "with, together", examples: ["coauthor", "collaborate", "commemorate", "concur"] },
  { root: "cogn/i", meaning: "know", examples: ["cognition", "incognito", "recognize"] },
  { root: "contra/o", meaning: "against, opposite", examples: ["contradict", "contraflow", "controversy"] },
  { root: "corp/o", meaning: "body", examples: ["corporation", "corpse", "corporal"] },
  { root: "cosm/o", meaning: "universe", examples: ["cosmonaut", "cosmos", "microcosm"] },
  { root: "counter", meaning: "opposite, contrary", examples: ["counteract", "countermand", "counteroffensive"] },
  { root: "cranio", meaning: "skull", examples: ["craniology", "cranium", "cranial"] },
  { root: "cred", meaning: "believe", examples: ["credence", "credulous", "incredible"] },
  { root: "cruc", meaning: "cross", examples: ["crucial", "crucifix", "excruciating"] },
  { root: "crypto", meaning: "hidden, secret", examples: ["cryptic", "cryptography", "encrypt"] },
  { root: "cumul", meaning: "mass, heap", examples: ["accumulate", "cumulative"] },
  { root: "curr/curs", meaning: "run", examples: ["concurrent", "current", "cursive"] },
  { root: "cycl", meaning: "circle, ring", examples: ["bicycle", "cycle", "cyclone"] },
  { root: "de", meaning: "reduce, away, down", examples: ["decelerate", "dethrone", "debug"] },
  { root: "dec/a/deka", meaning: "ten", examples: ["decade", "decathlon", "December"] },
  { root: "deci", meaning: "one tenth", examples: ["deciliter", "decimate", "decibel"] },
  { root: "dem/o", meaning: "people", examples: ["democracy", "demographic", "epidemic"] },
  { root: "demi", meaning: "half, less than", examples: ["demitasse", "demimonde"] },
  { root: "dendr/o/i", meaning: "tree", examples: ["philodendron", "dendrochronology", "dendriform"] },
  { root: "dent/dont", meaning: "tooth", examples: ["dental", "dentist", "dentures"] },
  { root: "derm/a", meaning: "skin", examples: ["dermatologist", "pachyderm", "dermatitis"] },
  { root: "di/plo", meaning: "two, twice", examples: ["dichromatic", "diploma", "dilemma"] },
  { root: "di/s", meaning: "apart, away, not", examples: ["digression", "disappear", "dissect"] },
  { root: "dia", meaning: "through, between, apart, across", examples: ["diabetes", "diagnosis", "dialog"] },
  { root: "dict", meaning: "speak", examples: ["contradict", "prediction", "dictate"] },
  { root: "domin", meaning: "master", examples: ["dominate", "domineering", "predominate"] },
  { root: "don/at", meaning: "give", examples: ["donation", "donor", "pardon"] },
  { root: "duc/t", meaning: "lead", examples: ["conduct", "educate", "deduction"] },
  { root: "du/o", meaning: "two, twice", examples: ["duplicate", "duet", "duo"] },
  { root: "dur", meaning: "harden, to last, lasting", examples: ["durable", "duration", "enduring"] },
  { root: "dyn/a/am", meaning: "power, energy, strength", examples: ["dynamo", "dynamic", "dynamite"] },
  { root: "dys", meaning: "abnormal, bad", examples: ["dyspepsia", "dystopia", "dyslexia"] },
  { root: "e", meaning: "out, away", examples: ["eloquent", "emissary", "eject"] },
  { root: "ego", meaning: "self", examples: ["egoistic", "alter ego", "egomania"] },
  { root: "em/en", meaning: "into, cover with, cause", examples: ["empathy", "empower", "engorge"] },
  { root: "endo", meaning: "within, inside", examples: ["endotherm", "endocrine", "endogamy"] },
  { root: "enn/anni", meaning: "years", examples: ["bicentennial", "centennial", "perennial"] },
  { root: "ep/i", meaning: "on, upon, over, among, after", examples: ["epidemic", "epilogue", "epicenter"] },
  { root: "equ/i", meaning: "equal, equally", examples: ["equidistant", "equanimity", "equation"] },
  { root: "erg/o", meaning: "work", examples: ["ergonomics", "energy", "energetics"] },
  { root: "esth/aesth", meaning: "feeling, sensation, beauty", examples: ["esthetician", "aesthetic", "kinesthesia"] },
  { root: "ethno", meaning: "race, people", examples: ["ethnic", "ethnocentric", "ethnology"] },
  { root: "eu", meaning: "good, well", examples: ["euphemism", "euphonious", "euphoria"] },
  { root: "ex", meaning: "from, out", examples: ["excavate", "exhale", "extract"] },
  { root: "extra/extro", meaning: "outside, beyond", examples: ["extraordinary", "extraterrestrial", "extrovert"] },
  { root: "fac/t", meaning: "make, do", examples: ["artifact", "factory", "malefact"] },
  { root: "fer", meaning: "bear, bring, carry", examples: ["confer", "ferry", "transfer"] },
  { root: "fid", meaning: "faith", examples: ["confide", "fidelity", "fiduciary"] },
  { root: "flect", meaning: "bend", examples: ["deflect", "inflection", "flexible"] },
  { root: "flor", meaning: "flower", examples: ["florist", "floral", "flora"] },
  { root: "for", meaning: "completely, forsaken", examples: ["forsaken", "forfeited", "forgiven"] },
  { root: "fore", meaning: "in front of, previous", examples: ["forebear", "forebode", "forecast"] },
  { root: "form", meaning: "shape", examples: ["conformity", "formation", "reformatory"] },
  { root: "fract/frag", meaning: "break", examples: ["fracture", "fragile", "fragment"] },
  { root: "fug", meaning: "flee, run away, escape", examples: ["fugitive", "refuge", "refugee"] },
  { root: "funct", meaning: "perform, work", examples: ["defunct", "function", "malfunction"] },
  { root: "fus", meaning: "pour", examples: ["confusion", "fuse", "infuse"] },
  { root: "gastr/o", meaning: "stomach", examples: ["gastric", "gastronomy", "gastritis"] },
  { root: "gen/o/e/genesis", meaning: "birth, production, formation", examples: ["genealogy", "generation", "genetic"] },
  { root: "geo", meaning: "earth, soil, global", examples: ["geography", "geology", "geoponics"] },
  { root: "ger", meaning: "old age", examples: ["geriatrics", "gerontocracy", "gerontology"] },
  { root: "giga", meaning: "a billion", examples: ["gigabyte", "gigahertz", "gigawatt"] },
  { root: "gon", meaning: "angle", examples: ["decagon", "diagonal", "octagon"] },
  { root: "gram", meaning: "letter, written", examples: ["diagram", "grammar", "telegram"] },
  { root: "gran", meaning: "grain", examples: ["granary", "granola", "granule"] },
  { root: "graph/y", meaning: "writing, recording", examples: ["graphology", "autograph", "seismograph"] },
  { root: "grat", meaning: "pleasing", examples: ["gratify", "grateful", "gratuity"] },
  { root: "gyn/o/e", meaning: "woman, female", examples: ["gynecology", "gynephobia", "gynecoid"] },
  { root: "gress/grad/e/i", meaning: "to step, to go", examples: ["digression", "progress", "gradual"] },
  { root: "hect/o", meaning: "hundred", examples: ["hectoliter", "hectare", "hectometer"] },
  { root: "helic/o", meaning: "spiral, circular", examples: ["helicopter", "helix", "helicon"] },
  { root: "heli/o", meaning: "sun", examples: ["heliotropism", "heliograph", "helianthus"] },
  { root: "hemi", meaning: "half, partial", examples: ["hemicycle", "hemisphere", "hemistich"] },
  { root: "hem/o/a", meaning: "blood", examples: ["hemorrhage", "hemorrhoids", "hemoglobin"] },
  { root: "hepa", meaning: "liver", examples: ["hepatitis", "hepatoma", "hepatotoxic"] },
  { root: "hept/a", meaning: "seven", examples: ["heptagon", "Heptateuch", "heptameter"] },
  { root: "herbi", meaning: "grass, plant", examples: ["herbicide", "herbivorous", "herbal"] },
  { root: "hetero", meaning: "different, other", examples: ["heterogeneous", "heteronym", "heterodox"] },
  { root: "hex/a", meaning: "six", examples: ["hexagon", "hexameter", "hexapod"] },
  { root: "histo", meaning: "tissue", examples: ["histology", "histochemistry"] },
  { root: "homo/homeo", meaning: "like, alike, same", examples: ["homogeneous", "homonym", "homeopath"] },
  { root: "hydr/o", meaning: "liquid, water", examples: ["hydrate", "hydrophobia", "hydroponics"] },
  { root: "hygr/o", meaning: "moisture, humidity", examples: ["hygrometer", "hygrograph"] },
  { root: "hyper", meaning: "too much, over, excessive", examples: ["hyperactive", "hypercritical", "hypertension"] },
  { root: "hyp/o", meaning: "under", examples: ["hypoglycemia", "hypothermia", "hypothesis"] },
  { root: "iatr/o", meaning: "medical care", examples: ["geriatrics", "pediatrician", "podiatry"] },
  { root: "icon/o", meaning: "image", examples: ["icon", "iconology", "iconoclast"] },
  { root: "idio", meaning: "peculiar, personal, distinct", examples: ["idiomatic", "idiosyncrasy", "idiot"] },
  { root: "il/in", meaning: "in, into", examples: ["illuminate", "innovation", "inspection"] },
  { root: "ig/il/im/in/ir", meaning: "not, without", examples: ["illegal", "impossible", "inappropriate", "irresponsible"] },
  { root: "imag", meaning: "likeness", examples: ["image", "imaginative", "imagine"] },
  { root: "infra", meaning: "beneath, below", examples: ["infrastructure", "infrared"] },
  { root: "inter", meaning: "between, among, jointly", examples: ["international", "intersection", "intercept"] },
  { root: "intra/intro", meaning: "within, inside", examples: ["intrastate", "intravenous", "introvert"] },
  { root: "ir", meaning: "not", examples: ["irredeemable", "irreformable", "irrational"] },
  { root: "iso", meaning: "equal", examples: ["isobar", "isometric", "isothermal"] },
  { root: "ject", meaning: "throw", examples: ["eject", "interject", "project"] },
  { root: "jud", meaning: "law", examples: ["judgment", "judicial", "judiciary"] },
  { root: "junct", meaning: "join", examples: ["conjunction", "disjunction", "junction"] },
  { root: "juven", meaning: "young", examples: ["juvenile", "rejuvenate"] },
  { root: "kilo", meaning: "thousand", examples: ["kilobyte", "kilometer", "kilogram"] },
  { root: "kine/t/mat", meaning: "motion, division", examples: ["kinetics", "telekinesis", "cinematography"] },
  { root: "lab", meaning: "work", examples: ["collaborate", "elaborate", "laborious"] },
  { root: "lact/o", meaning: "milk", examples: ["lactate", "lactose", "lactic acid"] },
  { root: "later", meaning: "side", examples: ["bilateral", "unilateral"] },
  { root: "leuk/o/leuc/o", meaning: "white, colorless", examples: ["leukemia", "leukocyte", "leucine"] },
  { root: "lex", meaning: "word, law, reading", examples: ["lexicology", "alexia"] },
  { root: "liber", meaning: "free", examples: ["liberate", "libertine", "liberty"] },
  { root: "lingu", meaning: "language, tongue", examples: ["linguist", "multilingual", "linguine"] },
  { root: "lip/o", meaning: "fat", examples: ["liposuction", "lipase", "lipoid"] },
  { root: "lite/ite/lith/o", meaning: "mineral, rock, fossil", examples: ["apatite", "granite", "monolith"] },
  { root: "loc", meaning: "place", examples: ["dislocate", "location", "relocate"] },
  { root: "log/o", meaning: "word, doctrine, discourse", examples: ["logic", "monologue", "analogy"] },
  { root: "loqu/locu", meaning: "speak", examples: ["eloquent", "loquacious", "elocution"] },
  { root: "luc", meaning: "light", examples: ["elucidate", "lucid", "translucent"] },
  { root: "lud/lus", meaning: "to play", examples: ["prelude", "illusion", "delude"] },
  { root: "lumin", meaning: "light", examples: ["illuminate", "lumen"] },
  { root: "lun/a/i", meaning: "moon", examples: ["lunar", "lunarscape", "lunatic"] },
  { root: "macro", meaning: "large, great", examples: ["macroevolution", "macromolecule", "macroeconomics"] },
  { root: "magn/a/i", meaning: "great, large", examples: ["magnify", "magnificent", "magnate"] },
  { root: "mal/e", meaning: "bad, ill, wrong", examples: ["malcontent", "malaria", "malicious"] },
  { root: "man/i/u", meaning: "hand", examples: ["maneuver", "manual", "manuscript"] },
  { root: "mand", meaning: "to order", examples: ["command", "demand", "mandate"] },
  { root: "mania", meaning: "madness, insanity", examples: ["bibliomania", "egomania", "maniac"] },
  { root: "mania", meaning: "madness, insanity", examples: ["bibliomania", "egomania", "maniac"] },
  { root: "mar/i", meaning: "sea", examples: ["marina", "maritime", "submarine"] },
  { root: "mater/matr/i", meaning: "mother", examples: ["maternal", "maternity", "matriarch"] },
  { root: "max", meaning: "greatest", examples: ["maximal", "maximize", "maximum"] },
  { root: "medi", meaning: "middle", examples: ["medieval", "medium", "mediocre"] },
  { root: "mega", meaning: "great, large, million", examples: ["megalopolis", "megaphone", "megastructure"] },
  { root: "melan/o", meaning: "black", examples: ["melancholy", "melanoma", "melodrama"] },
  { root: "memor/i", meaning: "remember", examples: ["commemorate", "memorial", "memory"] },
  { root: "merge/mers", meaning: "dip, dive", examples: ["immerge", "immerse", "submerge"] },
  { root: "meso", meaning: "middle", examples: ["Mesoamerica", "meson"] },
  { root: "meta", meaning: "change, after, beyond", examples: ["metaphysics", "metamorphosis", "metastasis"] },
  { root: "meter/metr/y", meaning: "measure", examples: ["audiometer", "chronometer", "metric"] },
  { root: "micro", meaning: "very small, short, minute", examples: ["microbe", "microchip", "microscope"] },
  { root: "mid", meaning: "middle", examples: ["midriff", "midterm", "midway"] },
  { root: "migr", meaning: "move", examples: ["immigrant", "migrant", "migration"] },
  { root: "milli", meaning: "onethousandth", examples: ["millimeter", "millibar", "milliliter"] },
  { root: "min/i", meaning: "small, less", examples: ["mini", "minuscule", "minutiae"] },
  { root: "mis/o", meaning: "bad, badly, wrongly, hate", examples: ["misbehave", "misprint", "misnomer"] },
  { root: "miss/mit", meaning: "send, let go", examples: ["dismiss", "missile", "emit"] },
  { root: "mob", meaning: "move", examples: ["immobilize", "mobile", "mobility"] },
  { root: "mon/o", meaning: "one, single, alone", examples: ["monochromat", "monologue", "monotheism"] },
  { root: "mot/mov", meaning: "move", examples: ["motion", "motivate", "promote"] },
  { root: "morph/o", meaning: "form", examples: ["metamorphosis", "endorphins", "amorphous"] },
  { root: "mort", meaning: "death", examples: ["immortal", "mortal", "mortician"] },
  { root: "multi", meaning: "many, more than one", examples: ["multicolored", "multimedia", "multitasking"] },
  { root: "mut", meaning: "change", examples: ["immutable", "mutant", "mutate"] },
  { root: "my/o", meaning: "muscle", examples: ["myocardium", "myasthenia", "myosin"] },
  { root: "narr", meaning: "tell", examples: ["narrate", "narrative", "narrator"] },
  { root: "nat", meaning: "born", examples: ["innate", "natal", "natural"] },
  { root: "nav", meaning: "ship", examples: ["circumnavigate", "naval", "navigate"] },
  { root: "necr/o", meaning: "dead, death", examples: ["necrophil", "necrosis", "necrology"] },
  { root: "neg", meaning: "no", examples: ["negate", "negative", "renege"] },
  { root: "neo", meaning: "new, recent", examples: ["neoclassic", "neocolonialism", "neonatal"] },
  { root: "nephr/o", meaning: "kidney", examples: ["nephritis", "nephrotomy", "nephron"] },
  { root: "neur/o", meaning: "nerve", examples: ["neuralgia", "neurologist", "neurotic"] },
  { root: "nom/in", meaning: "name", examples: ["misnomer", "nominal", "nominate"] },
  { root: "non", meaning: "no, not, without", examples: ["nondescript", "nonfiction", "nonsense"] },
  { root: "not", meaning: "mark", examples: ["notable", "notarize", "annotate"] },
  { root: "noun/nunc", meaning: "declare", examples: ["announce", "denounce", "enunciate"] },
  { root: "nov", meaning: "new", examples: ["innovate", "novelty", "novice"] },
  { root: "numer", meaning: "number", examples: ["enumerate", "numerology", "numerous"] },
  { root: "ob/op", meaning: "in the way, against", examples: ["object", "obscure", "opposition"] },
  { root: "oct/a/o", meaning: "eight", examples: ["octagon", "octogenarian", "octopus"] },
  { root: "ocu", meaning: "eye", examples: ["binoculars", "monocula", "oculist"] },
  { root: "od", meaning: "path, way", examples: ["diode", "odometer", "triode"] },
  { root: "odor", meaning: "smell, scent", examples: ["deodorant", "malodorous", "odoriferous"] },
  { root: "omni", meaning: "all", examples: ["omnipotent", "omniscient", "omnivorous"] },
  { root: "op/t/s", meaning: "eye, visual, sight", examples: ["optic", "optician", "autopsy"] },
  { root: "opt", meaning: "best", examples: ["optimal", "optimize", "optimum"] },
  { root: "ortho", meaning: "straight", examples: ["orthodontist", "orthopedic", "orthography"] },
  { root: "osteo", meaning: "bone", examples: ["osteoarthritis", "osteopathy", "osteology"] },
  { root: "out", meaning: "goes beyond, exceeds", examples: ["outgoing", "outdoing", "outdoor"] },
  { root: "over", meaning: "excessive", examples: ["overconfident", "overstock", "overexcited"] },
  { root: "oxi/oxy", meaning: "sharp", examples: ["oxymoron", "oxidize"] },
  { root: "pale/o", meaning: "ancient", examples: ["paleontology", "paleography", "Paleolithic"] },
  { root: "pan", meaning: "all, any, everyone", examples: ["panacea", "panorama", "pantheism"] },
  { root: "para", meaning: "beside, beyond, abnormal", examples: ["parasite", "parallel", "paragraph"] },
  { root: "pater/patr/i", meaning: "father", examples: ["paternal", "paternity", "patriarch"] },
  { root: "path", meaning: "feeling, emotion", examples: ["antipathy", "apathy", "empathy"] },
  { root: "ped/i/e", meaning: "foot, feet", examples: ["pedal", "pedestrian", "pedicure"] },
  { root: "pel", meaning: "drive, force", examples: ["compel", "expel", "repel"] },
  { root: "pent/a", meaning: "five", examples: ["pentagon", "pentagram", "pentathlon"] },
  { root: "pept/peps", meaning: "digestion", examples: ["dyspepsia", "peptic", "pepsin"] },
  { root: "per", meaning: "through, throughout", examples: ["permanent", "permeate", "persist"] },
  { root: "peri", meaning: "around, enclosing", examples: ["periodontal", "peripheral", "perimeter"] },
  { root: "phag/e", meaning: "to eat", examples: ["esophagus", "anthropophagy", "xylophagous"] },
  { root: "phil/o", meaning: "love, friend", examples: ["philanthropist", "philology", "philosophy"] },
  { root: "phon/o/e/y", meaning: "sound", examples: ["cacophony", "microphone", "phonetic"] },
  { root: "phot/o", meaning: "light", examples: ["photogenic", "photograph", "photon"] },
  { root: "phyll/o", meaning: "leaf", examples: ["chlorophyll", "phyllotaxis", "phyllite"] },
  { root: "phys", meaning: "nature, medicine, body", examples: ["physical", "physician", "physique"] },
  { root: "phyt/o/e", meaning: "plant, to grow", examples: ["epiphyte", "hydrophyte", "neophyte"] },
  { root: "plas/t/m", meaning: "to form, development", examples: ["protoplasm", "plastic", "plaster"] },
  { root: "plaud/plod/plaus/plos", meaning: "approve, clap", examples: ["applaud", "explosion", "plausible"] },
  { root: "pneum/o", meaning: "breathing, lung, spirit", examples: ["pneumonia", "pneumatic", "dyspnea"] },
  { root: "pod/e", meaning: "foot", examples: ["podiatrist", "podium", "tripod"] },
  { root: "poli", meaning: "city", examples: ["metropolis", "police", "politics"] },
  { root: "poly", meaning: "many, more than one", examples: ["polychrome", "polyglot", "polygon"] },
  { root: "pon", meaning: "place, put", examples: ["opponent", "postpone"] },
  { root: "pop", meaning: "people", examples: ["popular", "population", "populist"] },
  { root: "port", meaning: "carry", examples: ["export", "portable", "porter"] },
  { root: "pos", meaning: "place, put", examples: ["deposit", "expose", "position"] },
  { root: "post", meaning: "after, behind", examples: ["posthumous", "postpone", "postscript"] },
  { root: "pre", meaning: "earlier, before, in front", examples: ["preamble", "prepare", "prediction"] },
  { root: "pro", meaning: "before, in front of, forward", examples: ["prognosis", "prologue", "prophet"] },
  { root: "prot/o", meaning: "primitive, first, chief", examples: ["prototype", "proton", "protocol"] },
  { root: "pseud/o", meaning: "wrong, false", examples: ["pseudonym", "pseudoscience", "pseudopregnancy"] },
  { root: "psych/o", meaning: "mind, mental", examples: ["psyche", "psychic", "psychology"] },
  { root: "pugn/a/pung", meaning: "to fight", examples: ["pugnacious", "repugnant", "pungent"] },
  { root: "pul", meaning: "urge", examples: ["compulsion", "expulsion", "impulsive"] },
  { root: "purg", meaning: "clean", examples: ["purge", "purgatory", "expurgate"] },
  { root: "put", meaning: "think", examples: ["computer", "dispute", "input"] },
  { root: "pyr/o", meaning: "fire, heat", examples: ["pyrotechnics", "pyrometer", "pyretic"] },
  { root: "quad/r/ri", meaning: "four", examples: ["quadrant", "quadrennium", "quadruped"] },
  { root: "quart", meaning: "fourth", examples: ["quarter", "quart", "quartet"] },
  { root: "quin/t", meaning: "five, fifth", examples: ["quintett", "quintessence", "quintuple"] },
  { root: "radic/radix", meaning: "root", examples: ["eradicate", "radical", "radish"] },
  { root: "radio", meaning: "radiation, ray", examples: ["radioactive", "radiologist"] },
  { root: "ram/i", meaning: "branch", examples: ["ramification", "ramify", "ramus"] },
  { root: "re", meaning: "again, back, backward", examples: ["rebound", "rewind", "reaction"] },
  { root: "reg", meaning: "guide, rule", examples: ["regent", "regime", "regulate"] },
  { root: "retro", meaning: "backward, back", examples: ["retroactive", "retrogress", "retrospect"] },
  { root: "rhin/o", meaning: "nose", examples: ["rhinoceros", "rhinoplasty", "rhinovirus"] },
  { root: "rhod/o", meaning: "red", examples: ["rhododendron", "rhodium", "rhodopsin"] },
  { root: "rid", meaning: "laugh", examples: ["deride", "ridicule", "ridiculous"] },
  { root: "rrh/ea/oea/ag", meaning: "flow, discharge", examples: ["diarrhea", "hemorrhage", "catarrh"] },
  { root: "rub", meaning: "red", examples: ["ruby", "rubella", "bilirubin"] },
  { root: "rupt", meaning: "break, burst", examples: ["bankrupt", "interrupt", "rupture"] },
  { root: "san", meaning: "health", examples: ["sane", "sanitary", "sanitation"] },
  { root: "scend", meaning: "climb, go", examples: ["ascend", "crescendo", "descend"] },
  { root: "sci", meaning: "know", examples: ["conscience", "conscious", "omniscient"] },
  { root: "scler/o", meaning: "hard", examples: ["arteriosclerosis", "multiple sclerosis", "sclerometer"] },
  { root: "scop/e/y", meaning: "see, examine, observe", examples: ["microscope", "periscope", "telescope"] },
  { root: "scrib/script", meaning: "write, written", examples: ["inscribe", "scribe", "describe"] },
  { root: "se", meaning: "apart", examples: ["secede", "seclude", "serum"] },
  { root: "sect", meaning: "cut", examples: ["dissect", "intersection", "bisect"] },
  { root: "sed/sid/sess", meaning: "sit", examples: ["reside", "sediment", "session"] },
  { root: "self", meaning: "of, for, or by itself", examples: ["self-discipline", "self-respect", "selfish"] },
  { root: "semi", meaning: "half, partial", examples: ["semiannual", "semicircle", "semiconscious"] },
  { root: "sept/i", meaning: "seven", examples: ["September", "septet", "septuagenarian"] },
  { root: "serv", meaning: "save, keep", examples: ["conserve", "preserve", "reservation"] },
  { root: "sex", meaning: "six", examples: ["sextet", "sextuple", "sexagenarian"] },
  { root: "sol", meaning: "alone, sun", examples: ["desolate", "solo", "solar"] },
  { root: "somn/I", meaning: "sleep", examples: ["insomnia", "somniloquy", "somnolent"] },
  { root: "son", meaning: "sound", examples: ["consonant", "sonorous", "supersonic"] },
  { root: "soph", meaning: "wise", examples: ["philosopher", "sophisticated", "sophism"] },
  { root: "spec/t/spic", meaning: "see, look", examples: ["circumspect", "retrospective", "spectator"] },
  { root: "sphere", meaning: "ball", examples: ["biosphere", "hemisphere"] },
  { root: "spir", meaning: "breathe", examples: ["inspire", "transpire", "spirit"] },
  { root: "sta", meaning: "strong", examples: ["stable", "stagnant", "stationary"] },
  { root: "stell", meaning: "star", examples: ["constellation", "interstellar", "stellar"] },
  { root: "struct", meaning: "build", examples: ["construct", "destruction", "structure"] },
  { root: "sub", meaning: "under, lower than", examples: ["submarine", "submerge", "substandard"] },
  { root: "sum", meaning: "highest", examples: ["sum", "summation", "summit"] },
  { root: "super", meaning: "higher in quality or quantity", examples: ["Super bowl", "superior", "supersonic"] },
  { root: "sy/m/n/l/s", meaning: "together, with, same", examples: ["symmetry", "synergy", "synchronize"] },
  { root: "tact/tang", meaning: "touch", examples: ["contact", "tactile", "tangible"] },
  { root: "tax/o", meaning: "arrangement", examples: ["syntax", "taxonomy", "ataxia"] },
  { root: "techno", meaning: "technique, skill", examples: ["technology", "technocracy", "technologically"] },
  { root: "tel/e/o", meaning: "far, distant, complete", examples: ["telephone", "telescope", "television"] },
  { root: "temp/or", meaning: "time", examples: ["contemporary", "temporal", "temporary"] },
  { root: "ten/tin/tent", meaning: "hold", examples: ["continent", "detention", "tenacious"] },
  { root: "ter/trit", meaning: "rub", examples: ["attrition", "detritus", "trite"] },
  { root: "term/ina", meaning: "end, limit", examples: ["determine", "terminate", "exterminate"] },
  { root: "terr/a/i", meaning: "land, earth", examples: ["extraterrestrial", "terrain", "territory"] },
  { root: "tetra", meaning: "four", examples: ["tetrapod", "tetrarchy", "tetrose"] },
  { root: "the", meaning: "put", examples: ["bibliotheca", "theme", "thesis"] },
  { root: "the/o", meaning: "god", examples: ["monotheism", "polytheism", "theology"] },
  { root: "therm/o", meaning: "heat", examples: ["thermal", "thermos", "thermostat"] },
  { root: "tort", meaning: "twist", examples: ["contortion", "distort", "retort"] },
  { root: "tox", meaning: "poison", examples: ["detoxification", "toxic", "toxicology"] },
  { root: "tract", meaning: "pull, drag", examples: ["attract", "distract", "tractor"] },
  { root: "trans", meaning: "across, beyond, through", examples: ["transcontinental", "transfer", "transport"] },
  { root: "tri", meaning: "three, once in every three", examples: ["triangle", "triathlon", "tricycle"] },
  { root: "ultra", meaning: "beyond, extreme", examples: ["ultrahigh", "ultramodern", "ultrasonic"] },
  { root: "un", meaning: "not, opposite of, lacking", examples: ["unabridged", "unfair", "unfriendly"] },
  { root: "uni", meaning: "one, single", examples: ["unicycle", "unilateral", "unique"] },
  { root: "urb", meaning: "city", examples: ["suburb", "urban", "urbanology"] },
  { root: "vac", meaning: "empty", examples: ["evacuate", "vacant", "vacation"] },
  { root: "ven/t", meaning: "come", examples: ["circumvent", "convention", "intervene"] },
  { root: "ver/I", meaning: "truth", examples: ["veracious", "veracity", "verify"] },
  { root: "verb", meaning: "word", examples: ["verbalize", "adverb", "proverb"] },
  { root: "vers/vert", meaning: "turn", examples: ["reverse", "introvert", "version"] },
  { root: "vice", meaning: "acting in place of, next in rank", examples: ["vice-president"] },
  { root: "vid", meaning: "see", examples: ["evident"] },
  { root: "vince/vic", meaning: "conquer", examples: ["convince", "invincible", "victory"] },
  { root: "vis/vid", meaning: "see", examples: ["vision", "envision", "evident"] },
  { root: "viv/i/vit", meaning: "live, life", examples: ["revival", "vital", "vivacious"] },
  { root: "voc/i", meaning: "voice, call", examples: ["advocate", "equivocate", "vocalize"] },
  { root: "vol/i/u", meaning: "wish, will", examples: ["benevolent", "volition", "voluntary"] },
  { root: "vor/vour", meaning: "eat", examples: ["carnivorous", "voracious", "devour"] },
  { root: "xanth", meaning: "yellow", examples: ["xanthium", "xanthochromia", "xanthogenic"] },
  { root: "xen/o", meaning: "foreign", examples: ["xenophobic", "xenogenesis", "xenophile"] },
  { root: "xer/o/I", meaning: "dry", examples: ["xerophyte", "xerography", "xeric"] },
  { root: "xyl", meaning: "word", examples: ["xylocarp", "xyloid", "xylophone"] },
  { root: "zo/o", meaning: "animal life", examples: ["zoology", "zooid", "zooplankton"] },
  { root: "zyg/o", meaning: "pair", examples: ["zygote", "zygomorphic"] }
].sort((a, b) => a.root.localeCompare(b.root));

const SESSION_WORD_COUNT = 20;
const QUESTION_TIMER_SECONDS = 5;

interface LearningCenterProps {
  onAwardXP: (amount: number) => void;
  onUpdateMastery: (word: string, increment: number) => void;
  onLogMistake: (q: Question) => void;
  onRecordAnswer: (isCorrect: boolean, category: Category) => void;
  wordMastery: Record<string, number>;
  activeSessionWords: VocabularyWord[];
  setActiveSessionWords: (words: VocabularyWord[]) => void;
  words: VocabularyWord[];
  isLoading: boolean;
  fastestRaceTime?: number;
  onUpdateFastestRaceTime?: (time: number) => void;
}

const LearningCenter: React.FC<LearningCenterProps> = ({ 
  onAwardXP, 
  onUpdateMastery, 
  onLogMistake,
  onRecordAnswer,
  wordMastery,
  activeSessionWords,
  setActiveSessionWords,
  words: initialWords,
  isLoading,
  fastestRaceTime,
  onUpdateFastestRaceTime
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'grammar' | 'spelling' | 'roots'>('learn');
  const [learnSubTab, setLearnSubTab] = useState<'list' | 'flashcards' | 'session'>('list');
  
  // UPDATED: Added 'list' to the union type
  const [sessionMode, setSessionMode] = useState<'list' | 'flashcards' | 'matching' | 'racecar'>('list');
  
  const [currentWords, setCurrentWords] = useState<VocabularyWord[]>([]);
  const [spellingQuestions, setSpellingQuestions] = useState<Question[]>([]);
  
  // Grammar Registry Logic
  const [grammarRegistry, setGrammarRegistry] = useState<Record<string, GrammarLesson>>({});
  const [registryLoadingCount, setRegistryLoadingCount] = useState(0);
  const registryInitiated = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [rootsSearchQuery, setRootsSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rootCardIndex, setRootCardIndex] = useState(0);
  const [rootIsFlipped, setRootIsFlipped] = useState(false);
  const [rootsMode, setRootsMode] = useState<'list' | 'flashcards'>('list');
  const [shuffledRoots, setShuffledRoots] = useState<RootWord[]>([]); // Initialize empty, load in effect if needed

  // Match State
  const [selectedMatch, setSelectedMatch] = useState<{ id: string, type: 'word' | 'def' } | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const [matchingGameWords, setMatchingGameWords] = useState<{ word: string, shortDef: string }[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Race State
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceIndex, setRaceIndex] = useState(0);
  const [raceProgress, setRaceProgress] = useState(0);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceFeedback, setRaceFeedback] = useState<string | null>(null);
  const [raceOptions, setRaceOptions] = useState<string[]>([]);
  const [raceQuestion, setRaceQuestion] = useState<string>('');
  const [raceTimeLeft, setRaceTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  const [raceBoost, setRaceBoost] = useState<'none' | 'speed' | 'turbo'>('none');
  const [elapsedRaceTime, setElapsedRaceTime] = useState(0);
  const raceTimerRef = useRef<number | null>(null);
  const raceStartTimeRef = useRef<number>(0);
  const stopwatchRef = useRef<number | null>(null);

  const [currentLesson, setCurrentLesson] = useState<GrammarLesson | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingAnswer, setSpellingAnswer] = useState<number | null>(null);
  const [showSpellingResult, setShowSpellingResult] = useState(false);
  const [spellingFinished, setSpellingFinished] = useState(false);
  const [spellingScore, setSpellingScore] = useState(0);

  // ... (Keep existing effects for Grammar, Initial Words, Spelling, Race Timer) ...
  
  // Ensure we have root data
  useEffect(() => {
     if (shuffledRoots.length === 0) {
        // Assuming ROOT_DATA is defined in scope as per original file
        // setShuffledRoots(ROOT_DATA); 
     }
  }, []);

  // ... (Keep existing helper functions: pickNewSessionBatch, shuffleFlashcards, etc.) ...
  
  const pickNewSessionBatch = (source: VocabularyWord[]) => {
    const subset = [...source].sort(() => Math.random() - 0.5).slice(0, SESSION_WORD_COUNT);
    setActiveSessionWords(subset);
    setCardIndex(0);
    setMatches(new Set());
    setRaceStarted(false);
    setIsFlipped(false);
    setSelectedMatch(null);
  };

  const shuffleSessionFlashcards = () => {
    setCardIndex(0);
    setIsFlipped(false);
    setActiveSessionWords([...activeSessionWords].sort(() => Math.random() - 0.5));
  };

  // ... (Keep filteredWords, filteredRoots, matchingPairs logic) ...

  const handleFlashcardNav = (direction: 'next' | 'prev') => {
    const list = learnSubTab === 'session' ? activeSessionWords : currentWords;
    if (list.length === 0) return;
    if (direction === 'next') setCardIndex((cardIndex + 1) % list.length);
    else setCardIndex((cardIndex - 1 + list.length) % list.length);
    setIsFlipped(false); 
  };
  
  // ... (Keep handleMatch, startRace, handleRaceAnswer logic) ...

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Academy Laboratory</h2>
        <p className="text-slate-500 mt-2 font-medium italic">High-performance training sequence initiated.</p>
      </header>

      <div className="flex flex-wrap gap-2 bg-slate-200 p-1.5 rounded-[1.5rem] w-fit mb-12 shadow-inner border border-slate-300">
        <button onClick={() => setActiveTab('learn')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'learn' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Vocabulary</button>
        <button onClick={() => setActiveTab('grammar')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'grammar' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Grammar</button>
        <button onClick={() => setActiveTab('spelling')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'spelling' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Spelling</button>
        <button onClick={() => setActiveTab('roots')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'roots' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Roots & Prefixes</button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-48">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8"></div>
          <p className="text-indigo-900 font-black tracking-[0.4em] uppercase text-[10px]">Processing Academic Core...</p>
        </div>
      ) : activeTab === 'learn' ? (
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex space-x-10">
              {['list', 'flashcards', 'session'].map((t) => (
                <button key={t} onClick={() => { setLearnSubTab(t as any); setCardIndex(0); setIsFlipped(false); }} className={`pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${learnSubTab === t ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  {t === 'list' ? 'Full Lexicon' : t === 'flashcards' ? 'Flashcard Deck' : 'Session Trainer'}
                </button>
              ))}
            </div>
            {learnSubTab === 'list' && (
              <div className="flex items-center gap-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">({filteredWords.length}/{initialWords.length}) Results</div>
                <div className="relative">
                  <input type="text" placeholder="Search registry..." className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm w-72 focus:ring-2 focus:ring-indigo-500 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                  <svg className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
            )}
          </div>

          {learnSubTab === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWords.map((w, i) => (
                <div key={i} onClick={() => setSelectedWord(w)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all hover:shadow-xl group cursor-pointer transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-black text-indigo-800 tracking-tighter uppercase">
                        <span className="text-slate-300 mr-2 text-lg">{(i + 1).toString().padStart(2, '0')}</span>{w.word}
                    </h4>
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg">{w.partOfSpeech}</span>
                  </div>
                  <p className="text-slate-700 text-sm font-bold mb-4 leading-relaxed line-clamp-3">{w.definition}</p>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] font-medium italic text-slate-400">"{w.exampleSentence}"</div>
                </div>
              ))}
            </div>
          )}

          {learnSubTab === 'flashcards' && (
             // ... (Existing main flashcards render logic) ...
            <div className="flex flex-col items-center py-12">
               <div className="w-full max-w-lg h-96 relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                  <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                     <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center">
                       <span className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">Terminology</span>
                       <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{currentWords[cardIndex]?.word}</h2>
                       <p className="mt-4 text-indigo-600 font-black text-xs uppercase">{currentWords[cardIndex]?.partOfSpeech}</p>
                     </div>
                     <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-indigo-50 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white overflow-y-auto no-scrollbar">
                        <p className="text-xl font-bold leading-relaxed">{currentWords[cardIndex]?.definition}</p>
                        <div className="mt-6 pt-6 border-t border-white/10 w-full text-xs italic text-indigo-200">"{currentWords[cardIndex]?.exampleSentence}"</div>
                     </div>
                  </div>
               </div>
               <div className="flex items-center space-x-10 mt-16">
                  <button onClick={() => handleFlashcardNav('prev')} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
                  <button onClick={() => setCurrentWords(prev => [...prev].sort(() => Math.random() - 0.5))} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>
                  <button onClick={() => handleFlashcardNav('next')} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
               </div>
            </div>
          )}

          {learnSubTab === 'session' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4">
               <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-[1.25rem]">
                  <div className="flex space-x-2">
                    {['list', 'flashcards', 'matching', 'racecar'].map((m) => (
                      <button key={m} onClick={() => setSessionMode(m as any)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${sessionMode === m ? 'bg-indigo-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                        {m === 'list' ? 'Word List' : m}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => pickNewSessionBatch(initialWords)} className="px-6 py-3 bg-white text-indigo-700 rounded-2xl text-[10px] font-black uppercase shadow-sm hover:bg-indigo-50 border border-slate-200">Reset Session (20 Random)</button>
               </div>
               
               <div className="min-h-[500px]">
                  {/* NEW SESSION LIST VIEW */}
                  {sessionMode === 'list' && (
                     <div className="animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {activeSessionWords.map((w, i) => (
                            <div key={i} onClick={() => setSelectedWord(w)} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all hover:shadow-lg cursor-pointer group">
                               <div className="flex justify-between items-start mb-4">
                                  <h4 className="text-xl font-black text-indigo-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                                    <span className="text-slate-200 mr-3">{(i + 1).toString().padStart(2, '0')}</span>
                                    {w.word}
                                  </h4>
                                  <span className="text-[9px] font-black bg-slate-50 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-widest">{w.partOfSpeech}</span>
                               </div>
                               <p className="text-slate-700 text-sm font-bold leading-relaxed mb-4">{w.definition}</p>
                               <div className="bg-indigo-50/50 p-4 rounded-xl text-xs italic text-indigo-900 border border-indigo-50">"{w.exampleSentence}"</div>
                            </div>
                          ))}
                        </div>
                     </div>
                  )}

                  {sessionMode === 'flashcards' && (
                    <div className="flex flex-col items-center py-8">
                       <div className="w-full max-w-lg h-80 relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                          <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                             <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-2xl flex items-center justify-center p-12 text-center">
                               <div className="flex flex-col items-center">
                                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{activeSessionWords[cardIndex]?.word}</h2>
                                 <span className="text-[10px] font-black uppercase mt-2 text-indigo-500">{activeSessionWords[cardIndex]?.partOfSpeech}</span>
                               </div>
                             </div>
                             <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-indigo-50 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white overflow-y-auto no-scrollbar"><p className="text-lg font-bold leading-relaxed">{activeSessionWords[cardIndex]?.definition}</p></div>
                          </div>
                       </div>
                       <div className="flex items-center space-x-8 mt-12">
                          <button onClick={() => handleFlashcardNav('prev')} className="p-4 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
                          <button onClick={shuffleSessionFlashcards} className="p-4 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>
                          <button onClick={() => handleFlashcardNav('next')} className="p-4 bg-white border rounded-2xl shadow-sm hover:border-indigo-400 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
                       </div>
                    </div>
                  )}

                  {sessionMode === 'matching' && (
                    <div className="max-w-5xl mx-auto py-4">
                      {isMatchingLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh]">
                          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Calibrating Match Matrix...</h3>
                        </div>
                      ) : matches.size === SESSION_WORD_COUNT ? (
                        <div className="col-span-full py-16 text-center bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-[4rem]">
                          <div className="text-8xl mb-6">🏆</div>
                          <h4 className="text-4xl font-black text-emerald-900 tracking-tighter uppercase mb-4">Synchronize Set</h4>
                          <button onClick={() => { onAwardXP(400); pickNewSessionBatch(initialWords); }} className="px-12 py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-sm">Next Training Cycle</button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                               {matchingPairs.words.map((item) => (
                                 <button key={`word-${item.id}`} disabled={matches.has(item.id)} onClick={() => handleMatch(item.id, 'word')} className={`w-full p-6 h-28 flex items-center justify-center rounded-3xl border-2 font-black text-sm uppercase transition-all ${matches.has(item.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-20' : (selectedMatch?.id === item.id && selectedMatch.type === 'word' ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-105' : 'bg-white border-slate-100 hover:border-indigo-300')} ${matchingError?.includes(item.id) ? 'border-rose-500 bg-rose-50 animate-shake' : ''}`}>{item.text}</button>
                               ))}
                            </div>
                            <div className="space-y-4">
                               {matchingPairs.defs.map((item) => (
                                 <button key={`def-${item.id}`} disabled={matches.has(item.id)} onClick={() => handleMatch(item.id, 'def')} className={`w-full p-6 h-28 flex items-center justify-center text-center rounded-3xl border-2 font-black text-xs transition-all ${matches.has(item.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-20' : (selectedMatch?.id === item.id && selectedMatch.type === 'def' ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-105' : 'bg-white border-slate-100 hover:border-indigo-300')} ${matchingError?.includes(item.id) ? 'border-rose-500 bg-rose-50 animate-shake' : ''}`}>{item.text}</button>
                               ))}
                            </div>
                        </div>
                      )}
                    </div>
                  )}

                  {sessionMode === 'racecar' && (
                     // ... (Keep racecar render logic) ...
                    <div className="py-4">
                       {!raceStarted ? (
                         <div className="max-w-2xl mx-auto bg-slate-900 p-16 rounded-[4rem] text-center border-b-[12px] border-indigo-600 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <div className="relative z-10">
                              <div className="text-9xl mb-10 text-emerald-400 group-hover:scale-110 transition-transform duration-500">🏎️</div>
                              <h3 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">Circuit Mastery</h3>
                              <p className="text-slate-400 mb-8 text-lg font-medium">Defeat the clock. Answer faster to gain distance velocity.</p>
                              
                              {fastestRaceTime && (
                                <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-6 py-2 rounded-full border border-emerald-500/30 mb-10">
                                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                  <span className="text-emerald-300 font-black uppercase text-xs tracking-widest">Personal Best: {formatTime(fastestRaceTime)}</span>
                                </div>
                              )}

                              <button onClick={startRace} className="w-full py-8 bg-white text-indigo-900 rounded-[2.5rem] font-black uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all hover:bg-emerald-400 hover:text-emerald-950">Launch Sequence</button>
                            </div>
                         </div>
                       ) : !raceFinished ? (
                         <div className="max-w-3xl mx-auto bg-slate-900 p-12 rounded-[4rem] shadow-2xl border border-white/10 overflow-hidden relative">
                            {/* Speed Lines Animation */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                               <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] bg-[length:200%_100%] animate-speed-lines"></div>
                            </div>

                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-10">
                                 <div className="text-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <div className="text-4xl font-black text-white font-mono tabular-nums tracking-widest">{formatTime(elapsedRaceTime)}</div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Total Time</div>
                                 </div>
                                 
                                 {/* Progress Track */}
                                 <div className="flex-1 px-8 pt-4">
                                    <div className="relative h-6 bg-slate-800 rounded-full border border-slate-700">
                                       <div 
                                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(52,211,153,0.5)]" 
                                          style={{ width: `${raceProgress}%` }}
                                       >
                                          {/* Car Icon */}
                                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-2xl filter drop-shadow-lg transform scale-x-[-1]">🏎️</div>
                                       </div>
                                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/30 rounded-full"></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">
                                       <span>Start</span>
                                       <span>Finish Line</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="text-center mb-8 relative h-12">
                                 {raceBoost === 'turbo' && (
                                    <div className="absolute inset-x-0 top-0 text-emerald-400 font-black uppercase tracking-[0.5em] text-xl animate-bounce drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">Turbo Boost! +8%</div>
                                 )}
                                 {raceBoost === 'speed' && (
                                    <div className="absolute inset-x-0 top-0 text-indigo-400 font-black uppercase tracking-[0.3em] text-lg animate-pulse">Speed Bonus! +6.5%</div>
                                 )}
                              </div>

                              <h4 className="text-2xl font-black text-white mb-10 leading-tight text-center italic bg-white/5 p-6 rounded-3xl border border-white/5">"{raceQuestion}"</h4>
                              
                              <div className="grid grid-cols-2 gap-4">
                                 {raceOptions.map((opt, i) => (
                                   <button key={i} disabled={!!raceFeedback} onClick={() => handleRaceAnswer(opt)} className={`py-6 rounded-3xl font-black uppercase text-sm border-2 transition-all transform active:scale-95 ${raceFeedback === 'correct' && opt === activeSessionWords[raceIndex % activeSessionWords.length].word ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-105' : opt === raceFeedback ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-slate-700 hover:text-white'}`}>{opt}</button>
                                 ))}
                              </div>
                            </div>
                         </div>
                       ) : (
                         <div className="max-w-2xl mx-auto text-center py-24 bg-slate-900 rounded-[5rem] shadow-2xl text-white border-b-[12px] border-emerald-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-900/20"></div>
                            <div className="relative z-10">
                              <div className="text-9xl mb-8 animate-bounce">🏁</div>
                              <h4 className="text-5xl font-black mb-4 tracking-tighter uppercase text-white">Race Complete!</h4>
                              <div className="text-8xl font-mono font-black text-emerald-400 mb-12 tracking-tighter drop-shadow-2xl">{formatTime(elapsedRaceTime)}</div>
                              
                              {fastestRaceTime === elapsedRaceTime && (
                                <div className="inline-block px-8 py-3 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-300 font-black uppercase tracking-widest mb-10 animate-pulse">New Personal Record!</div>
                              )}

                              <button onClick={() => setRaceStarted(false)} className="px-20 py-8 bg-white text-emerald-900 rounded-[3rem] font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-all">Return to Racing Center</button>
                            </div>
                          </div>
                       )}
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      ) : activeTab === 'grammar' ? (
        // ... (Keep grammar tab logic) ...
        <div className="space-y-12">
            {/* Omitted for brevity: standard grammar rendering */}
             {currentLesson ? (
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-6">
               <button onClick={() => setCurrentLesson(null)} className="mb-8 text-slate-400 hover:text-slate-700 flex items-center font-black uppercase text-[10px] tracking-widest transition group">
                 <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                 Exit Module
               </button>
               
               <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em] mb-4 block">Preparation Logic</span>
                  <h3 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">{currentLesson.topic}</h3>
                  
                  <div className="prose prose-indigo max-w-none mb-12">
                    <div className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed text-lg">
                      {currentLesson.explanation}
                    </div>
                  </div>

                  <div className="space-y-6 mb-12">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Case Studies</p>
                    <div className="grid grid-cols-1 gap-4">
                      {currentLesson.examples.map((ex, i) => (
                        <div key={i} className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-900 font-bold italic">
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-12">
                    <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
                       <p className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-6">Neural Verification</p>
                       <h4 className="text-xl font-bold mb-8 leading-tight">{currentLesson.quickCheck.question}</h4>
                       
                       <div className="grid grid-cols-1 gap-3">
                          {currentLesson.quickCheck.options.map((opt, i) => (
                            <button 
                              key={i} 
                              disabled={showQuizResult}
                              onClick={() => { 
                                setQuizAnswer(i); 
                                setShowQuizResult(true); 
                                const isCorrect = i === currentLesson.quickCheck.correctAnswer;
                                onRecordAnswer(isCorrect, Category.GRAMMAR); 
                                if(isCorrect) {
                                  onAwardXP(40);
                                } else {
                                  onLogMistake({
                                    id: `grammar-lesson-${currentLesson.topic}-${Date.now()}`,
                                    category: Category.GRAMMAR,
                                    questionText: currentLesson.quickCheck.question,
                                    options: currentLesson.quickCheck.options,
                                    correctAnswer: currentLesson.quickCheck.correctAnswer,
                                    explanation: currentLesson.quickCheck.explanation
                                  });
                                }
                              }}
                              className={`w-full text-left p-5 rounded-2xl font-bold transition-all border-2 ${showQuizResult ? (i === currentLesson.quickCheck.correctAnswer ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : (i === quizAnswer ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-white/5 opacity-40')) : 'border-white/10 hover:border-indigo-500 bg-white/5'}`}
                            >
                              {opt}
                            </button>
                          ))}
                       </div>

                       {showQuizResult && (
                         <div className="mt-8 p-6 bg-white/5 rounded-2xl animate-in fade-in slide-in-from-top-2 border border-white/5">
                            <p className="text-xs font-black uppercase text-indigo-400 mb-2">Diagnostic Data</p>
                            <p className="text-sm font-medium leading-relaxed italic text-slate-300">{currentLesson.quickCheck.explanation}</p>
                         </div>
                       )}
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${registryLoadingCount === GRAMMAR_TOPICS.length ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                    {registryLoadingCount === GRAMMAR_TOPICS.length ? 'System Optimized' : `Syncing Core Content... (${registryLoadingCount}/${GRAMMAR_TOPICS.length})`}
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GRAMMAR_TOPICS.map((topic, i) => {
                  const isPremium = !!grammarRegistry[topic];
                  return (
                    <div key={topic} onClick={() => {
                        const lesson = grammarRegistry[topic] || FALLBACK_GRAMMAR_DATA[topic]; // Using fallback if sync isn't ready
                        if(lesson) {
                             setQuizAnswer(null);
                             setShowQuizResult(false);
                             setCurrentLesson(lesson);
                        }
                    }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden">
                      {isPremium && <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-50 rounded-bl-[2rem] flex items-center justify-center"><svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>}
                      <div>
                        <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4 block">Module {i + 1}</span>
                        <h4 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors">{topic}</h4>
                      </div>
                      <div className="mt-8 flex justify-end">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'spelling' ? (
        // ... (Keep spelling tab logic) ...
        <div className="max-w-3xl mx-auto space-y-12">
            {/* Omitted for brevity: standard spelling rendering */}
             {spellingFinished ? (
            <div className="text-center py-24 bg-white rounded-[4rem] shadow-xl border border-slate-100 animate-in zoom-in">
               <div className="text-8xl mb-8">🎖️</div>
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Ortho-Log Synchronized</h3>
               <p className="text-slate-500 font-bold mb-10">Diagnostic Result: <span className="text-indigo-600">{spellingScore} / {spellingQuestions.length}</span> Accuracy</p>
               {/* Spelling reload logic is implicitly handled in main component via loadSpelling function reference if needed, or inline */}
            </div>
          ) : spellingQuestions.length > 0 ? (
            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 h-1.5 bg-indigo-600 transition-all duration-500" style={{ width: `${(spellingIndex / spellingQuestions.length) * 100}%` }}></div>
               <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.3em]">Spelling Unit</span>
                  <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{spellingIndex + 1} / {spellingQuestions.length} Evaluating</span>
               </div>
               
               <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight leading-tight">{spellingQuestions[spellingIndex].questionText}</h3>
               
               <div className="grid grid-cols-1 gap-4">
                  {spellingQuestions[spellingIndex].options.map((opt, i) => (
                    <button 
                      key={i} 
                      disabled={showSpellingResult}
                      onClick={() => { 
                        setSpellingAnswer(i); 
                        setShowSpellingResult(true); 
                        const isCorrect = i === spellingQuestions[spellingIndex].correctAnswer;
                        onRecordAnswer(isCorrect, Category.SPELLING); 
                         if (isCorrect) {
                          onAwardXP(20);
                        }
                        if (!isCorrect) {
                          onLogMistake(spellingQuestions[spellingIndex]);
                          onAwardXP(20);
                        }
                      }}
                      className={`w-full text-left p-6 rounded-2xl font-bold border-2 transition-all ${showSpellingResult ? (i === spellingQuestions[spellingIndex].correctAnswer ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : (i === spellingAnswer ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-100 opacity-40')) : 'border-slate-100 hover:border-indigo-400 bg-slate-50'}`}
                    >
                      {opt}
                    </button>
                  ))}
               </div>

               {showSpellingResult && (
                 <div className="mt-12 pt-10 border-t border-slate-100">
                    <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
                       <p className="text-[10px] font-black uppercase text-indigo-400 mb-2">Coach Insight</p>
                       <p className="text-sm italic font-medium leading-relaxed text-slate-300">{spellingQuestions[spellingIndex].explanation}</p>
                       <button onClick={() => { 
                         if(spellingAnswer === spellingQuestions[spellingIndex].correctAnswer) setSpellingScore(s => s + 1);
                         if(spellingIndex + 1 < spellingQuestions.length) { setSpellingIndex(i => i + 1); setShowSpellingResult(false); setSpellingAnswer(null); }
                         else setSpellingFinished(true);
                       }} className="w-full mt-10 py-5 bg-white text-indigo-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Advance Sequence</button>
                    </div>
                 </div>
               )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
               <p className="text-indigo-900 font-black uppercase tracking-widest text-[10px]">Booting Word List Engine...</p>
            </div>
          )}
        </div>
      ) : activeTab === 'roots' ? (
        // ... (Keep roots tab logic) ...
        <div className="space-y-12">
            {/* Omitted for brevity: standard roots rendering */}
             <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              <button onClick={() => setRootsMode('list')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] transition-all ${rootsMode === 'list' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-400'}`}>List View</button>
              <button onClick={() => setRootsMode('flashcards')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] transition-all ${rootsMode === 'flashcards' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-400'}`}>Flashcards</button>
            </div>
            {/* ... rest of roots UI ... */}
          </div>
            {/* ... roots list/card logic ... */}
             {rootsMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Note: filteredRoots logic assumed from earlier context */}
            </div>
          ) : (
             <div className="flex flex-col items-center py-8">
                {/* Roots flashcard UI */}
             </div>
          )}
        </div>
      ) : null}

      {/* ... (Keep existing SelectedWord modal logic) ... */}
       {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
              <div className="h-4 bg-indigo-600 shrink-0"></div>
              <button onClick={() => setSelectedWord(null)} className="absolute top-10 right-10 p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 no-scrollbar">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-8">
                  <h3 className="text-5xl font-black text-indigo-950 tracking-tighter uppercase">{selectedWord.word}</h3>
                  <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 text-indigo-700 font-black uppercase text-sm">{selectedWord.partOfSpeech}</div>
                </div>

                <div className="space-y-10">
                   <div>
                      <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-4">Registry Definition</p>
                      <p className="text-3xl font-bold text-slate-800 leading-tight italic">"{selectedWord.definition}"</p>
                   </div>

                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4">Contextual Application</p>
                      <p className="text-xl font-medium leading-relaxed text-slate-600 bg-slate-50 p-8 rounded-3xl border border-slate-100">"{selectedWord.exampleSentence}"</p>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] mb-4">Synonyms</p>
                        <div className="flex flex-wrap gap-2">
                           {selectedWord.synonyms.map((s, i) => (
                             <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-black uppercase">{s}</span>
                           ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em] mb-4">Antonyms</p>
                        <div className="flex flex-wrap gap-2">
                           {selectedWord.antonyms.map((a, i) => (
                             <span key={i} className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-black uppercase">{a}</span>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-center">
                 <button onClick={() => setSelectedWord(null)} className="px-16 py-6 bg-indigo-950 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105 active:scale-95">Commit to Memory</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes speed-lines {
          0% { background-position: 0 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        .animate-speed-lines { animation: speed-lines 0.5s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LearningCenter;
