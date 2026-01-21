import { Category, Question, VocabularyWord, GrammarLesson } from "./types";
import { fullReadingData } from "./data/readingData"; 

export const GRAMMAR_TOPICS = [
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

export const FALLBACK_GRAMMAR_DATA: Record<string, GrammarLesson> = {
  "Comma Mastery: Essential vs Non-Essential": {
    topic: "Comma Mastery: Essential vs Non-Essential",
    explanation: "Commas set off non-essential information. Essential clauses are NOT set off by commas.",
    examples: ["Non-essential: Mr. Thompson, who is my favorite teacher, gave us a test.", "Essential: The student who is wearing the red hat won the race."],
    quickCheck: {
      question: "Which sentence correctly punctuates a non-essential clause?",
      options: ["The cat, that has white paws is sleeping.", "The book, which I borrowed from the library, is overdue.", "The players, who arrived late were benched.", "All students, who pass the test, will receive a certificate."],
      correctAnswer: 1,
      explanation: "'Which' usually introduces non-essential information and must be surrounded by commas."
    }
  }
};

const PDF_READING_DATA = fullReadingData;

export const FULL_PREP_VOCAB: VocabularyWord[] = [
  {
    "word": "Abject",
    "partOfSpeech": "adj.",
    "definition": "Extremely bad, unpleasant, or degrading.",
    "example Sentence": "They lived in abject poverty.",
    "synonyms": [
      "Wretched",
      "base"
    ],
    "antonyms": [
      "Magnificent",
      "noble"
    ]
  },
  {
    "word": "Abortive",
    "partOfSpeech": "adj.",
    "definition": "Failing to produce intended results.",
    "example Sentence": "The rescue mission proved abortive.",
    "synonyms": [
      "Futile",
      "vain"
    ],
    "antonyms": [
      "Productive",
      "successful"
    ]
  },
  {
    "word": "Abstemious",
    "partOfSpeech": "adj.",
    "definition": "Not self-indulgent in food or drink.",
    "example Sentence": "He was abstemious at the buffet.",
    "synonyms": [
      "Temperate",
      "ascetic"
    ],
    "antonyms": [
      "Gluttonous",
      "greedy"
    ]
  },
  {
    "word": "Abstruse",
    "partOfSpeech": "adj.",
    "definition": "Difficult to understand; obscure.",
    "example Sentence": "The theory was too abstruse.",
    "synonyms": [
      "Recondite",
      "arcane"
    ],
    "antonyms": [
      "Lucid",
      "simple"
    ]
  },
  {
    "word": "Abundant",
    "partOfSpeech": "adj.",
    "definition": "Existing in large quantities.",
    "example Sentence": "An abundant supply of food.",
    "synonyms": [
      "Plentiful",
      "ample"
    ],
    "antonyms": [
      "Scarce",
      "sparse"
    ]
  },
  {
    "word": "Abstract",
    "partOfSpeech": "adj.",
    "definition": "Existing in thought, but not physical.",
    "example Sentence": "Justice is an abstract concept.",
    "synonyms": [
      "Conceptual",
      "theoretical"
    ],
    "antonyms": [
      "Concrete",
      "tangible"
    ]
  },
  {
    "word": "Acerbic",
    "partOfSpeech": "adj.",
    "definition": "Sharp and forthright in speech.",
    "example Sentence": "She is known for her acerbic wit.",
    "synonyms": [
      "Caustic",
      "biting"
    ],
    "antonyms": [
      "Mild",
      "kind"
    ]
  },
  {
    "word": "Acrimonious",
    "partOfSpeech": "adj.",
    "definition": "Angry and bitter.",
    "example Sentence": "It was an acrimonious divorce.",
    "synonyms": [
      "Rancorous",
      "vitriolic"
    ],
    "antonyms": [
      "Harmonious",
      "gentle"
    ]
  },
  {
    "word": "Acute",
    "partOfSpeech": "adj.",
    "definition": "Perceptive understanding or insight.",
    "example Sentence": "She has an acute sense of hearing.",
    "synonyms": [
      "Sharp",
      "keen"
    ],
    "antonyms": [
      "Dull",
      "obtuse"
    ]
  },
  {
    "word": "Adamant",
    "partOfSpeech": "adj.",
    "definition": "Refusing to be persuaded.",
    "example Sentence": "He was adamant about not going.",
    "synonyms": [
      "Inflexible",
      "resolute"
    ],
    "antonyms": [
      "Yielding",
      "soft"
    ]
  },
  {
    "word": "Adroit",
    "partOfSpeech": "adj.",
    "definition": "Skillful in using hands or mind.",
    "example Sentence": "He was adroit at tax avoidance.",
    "synonyms": [
      "Deft",
      "adept"
    ],
    "antonyms": [
      "Clumsy",
      "inept"
    ]
  },
  {
    "word": "Adulatory",
    "partOfSpeech": "adj.",
    "definition": "Excessively praising.",
    "example Sentence": "The adulatory reviews were suspicious.",
    "synonyms": [
      "Fawning",
      "sycophantic"
    ],
    "antonyms": [
      "Critical",
      "disparaging"
    ]
  },
  {
    "word": "Aesthetic",
    "partOfSpeech": "adj.",
    "definition": "Concerned with beauty.",
    "example Sentence": "The building has aesthetic appeal.",
    "synonyms": [
      "Artistic",
      "visual"
    ],
    "antonyms": [
      "Ugly",
      "tasteless"
    ]
  },
  {
    "word": "Affable",
    "partOfSpeech": "adj.",
    "definition": "Friendly and easy to talk to.",
    "example Sentence": "She was an affable host.",
    "synonyms": [
      "Amiable",
      "genial"
    ],
    "antonyms": [
      "Surly",
      "unfriendly"
    ]
  },
  {
    "word": "Agrarian",
    "partOfSpeech": "adj.",
    "definition": "Relating to cultivated land.",
    "example Sentence": "It was an agrarian society.",
    "synonyms": [
      "Rural",
      "farming"
    ],
    "antonyms": [
      "Urban",
      "industrial"
    ]
  },
  {
    "word": "Alacritous",
    "partOfSpeech": "adj.",
    "definition": "Brisk and cheerful readiness.",
    "example Sentence": "He responded with alacritous speed.",
    "synonyms": [
      "Eager",
      "prompt"
    ],
    "antonyms": [
      "Lethargic",
      "slow"
    ]
  },
  {
    "word": "Alien",
    "partOfSpeech": "adj.",
    "definition": "Belonging to a foreign country.",
    "example Sentence": "The customs were alien.",
    "synonyms": [
      "Exotic",
      "strange"
    ],
    "antonyms": [
      "Native",
      "familiar"
    ]
  },
  {
    "word": "Aloof",
    "partOfSpeech": "adj.",
    "definition": "Not friendly or forthcoming; cool.",
    "example Sentence": "He stood aloof from the group.",
    "synonyms": [
      "Detached",
      "distant"
    ],
    "antonyms": [
      "Friendly",
      "social"
    ]
  },
  {
    "word": "Altruistic",
    "partOfSpeech": "adj.",
    "definition": "Selfless concern for others.",
    "example Sentence": "A benevolent altruistic donor.",
    "synonyms": [
      "Unselfish",
      "kind"
    ],
    "antonyms": [
      "Selfish",
      "greedy"
    ]
  },
  {
    "word": "Ambiguous",
    "partOfSpeech": "adj.",
    "definition": "Open to more than one interpretation.",
    "example Sentence": "The ending was ambiguous.",
    "synonyms": [
      "Vague",
      "equivocal"
    ],
    "antonyms": [
      "Clear",
      "explicit"
    ]
  },
  {
    "word": "Ambivalent",
    "partOfSpeech": "adj.",
    "definition": "Having mixed or contradictory feelings.",
    "example Sentence": "She felt ambivalent about the promotion.",
    "synonyms": [
      "Uncertain",
      "equivocal"
    ],
    "antonyms": [
      "Certain",
      "resolute"
    ]
  },
  {
    "word": "Amenable",
    "partOfSpeech": "adj.",
    "definition": "Responsive to suggestion.",
    "example Sentence": "They were amenable to the changes.",
    "synonyms": [
      "Compliant",
      "docile"
    ],
    "antonyms": [
      "Stubborn",
      "obstinate"
    ]
  },
  {
    "word": "Amicable",
    "partOfSpeech": "adj.",
    "definition": "Characterized by friendliness.",
    "example Sentence": "The meeting ended on an amicable note.",
    "synonyms": [
      "Harmonious",
      "friendly"
    ],
    "antonyms": [
      "Hostile",
      "bitter"
    ]
  },
  {
    "word": "Amorphous",
    "partOfSpeech": "adj.",
    "definition": "Without a clearly defined shape.",
    "example Sentence": "An amorphous cloud of smoke.",
    "synonyms": [
      "Shapeless",
      "vague"
    ],
    "antonyms": [
      "Structured",
      "distinct"
    ]
  },
  {
    "word": "Anachronistic",
    "partOfSpeech": "adj.",
    "definition": "Out of its proper time.",
    "example Sentence": "A typewriter is anachronistic today.",
    "synonyms": [
      "Antiquated",
      "archaic"
    ],
    "antonyms": [
      "Modern",
      "current"
    ]
  },
  {
    "word": "Analogous",
    "partOfSpeech": "adj.",
    "definition": "Comparable in a way that clarifies.",
    "example Sentence": "Brain is analogous to a processor.",
    "synonyms": [
      "Comparable",
      "parallel"
    ],
    "antonyms": [
      "Dissimilar",
      "unrelated"
    ]
  },
  {
    "word": "Anomalous",
    "partOfSpeech": "adj.",
    "definition": "Deviating from what is standard.",
    "example Sentence": "The lab result was anomalous.",
    "synonyms": [
      "Abnormal",
      "atypical"
    ],
    "antonyms": [
      "Standard",
      "normal"
    ]
  },
  {
    "word": "Antagonist",
    "partOfSpeech": "adj.",
    "definition": "Active opposition or hostility.",
    "example Sentence": "He had an antagonistic relationship.",
    "synonyms": [
      "Hostile",
      "clashing"
    ],
    "antonyms": [
      "Friendly",
      "kind"
    ]
  },
  {
    "word": "Antediluvian",
    "partOfSpeech": "adj.",
    "definition": "Prehistoric or extremely old.",
    "example Sentence": "Museum displayed antediluvian tools.",
    "synonyms": [
      "Ancient",
      "archaic"
    ],
    "antonyms": [
      "Modern",
      "fresh"
    ]
  },
  {
    "word": "Antithetical",
    "partOfSpeech": "adj.",
    "definition": "Directly opposed or contrasted.",
    "example Sentence": "Greed is antithetical to charity.",
    "synonyms": [
      "Contrary",
      "inverse"
    ],
    "antonyms": [
      "Identical",
      "same"
    ]
  },
  {
    "word": "Apathetic",
    "partOfSpeech": "adj.",
    "definition": "Showing no interest or concern.",
    "example Sentence": "Citizens had grown apathetic toward politics.",
    "synonyms": [
      "Indifferent",
      "unmoved"
    ],
    "antonyms": [
      "Enthusiastic",
      "eager"
    ]
  },
  {
    "word": "Apposite",
    "partOfSpeech": "adj.",
    "definition": "Apt in the circumstances.",
    "example Sentence": "The quote was apposite.",
    "synonyms": [
      "Pertinent",
      "germane"
    ],
    "antonyms": [
      "Irrelevant",
      "inept"
    ]
  },
  {
    "word": "Arbitrary",
    "partOfSpeech": "adj.",
    "definition": "Based on random choice.",
    "example Sentence": "An arbitrary decision.",
    "synonyms": [
      "Random",
      "erratic"
    ],
    "antonyms": [
      "Logical",
      "consistent"
    ]
  },
  {
    "word": "Archaic",
    "partOfSpeech": "adj.",
    "definition": "Very old or old-fashioned.",
    "example Sentence": "The company's archaic computer system.",
    "synonyms": [
      "Obsolete",
      "ancient"
    ],
    "antonyms": [
      "Modern",
      "current"
    ]
  },
  {
    "word": "Ardent",
    "partOfSpeech": "adj.",
    "definition": "Enthusiastic or passionate.",
    "example Sentence": "An ardent supporter of causes.",
    "synonyms": [
      "Fervent",
      "zealous"
    ],
    "antonyms": [
      "Apathetic",
      "cold"
    ]
  },
  {
    "word": "Arduous",
    "partOfSpeech": "adj.",
    "definition": "Involving strenuous effort.",
    "example Sentence": "It was an arduous climb.",
    "synonyms": [
      "Laborious",
      "taxing"
    ],
    "antonyms": [
      "Effortless",
      "easy"
    ]
  },
  {
    "word": "Arid",
    "partOfSpeech": "adj.",
    "definition": "Too dry to support vegetation.",
    "example Sentence": "The arid desert landscape.",
    "synonyms": [
      "Parched",
      "dry"
    ],
    "antonyms": [
      "Humid",
      "fertile"
    ]
  },
  {
    "word": "Ascetic",
    "partOfSpeech": "adj.",
    "definition": "Suggesting severe self-discipline.",
    "example Sentence": "The monk led an ascetic life.",
    "synonyms": [
      "Austere",
      "frugal"
    ],
    "antonyms": [
      "Hedonistic",
      "lush"
    ]
  },
  {
    "word": "Assiduous",
    "partOfSpeech": "adj.",
    "definition": "Showing great care and perseverance.",
    "example Sentence": "Mastered concepts through assiduous study.",
    "synonyms": [
      "Diligent",
      "meticulous"
    ],
    "antonyms": [
      "Lazy",
      "negligent"
    ]
  },
  {
    "word": "Astute",
    "partOfSpeech": "adj.",
    "definition": "Ability to accurately assess situations.",
    "example Sentence": "The astute investor bought stocks.",
    "synonyms": [
      "Shrewd",
      "perceptive"
    ],
    "antonyms": [
      "Gullible",
      "naive"
    ]
  },
  {
    "word": "Atrophied",
    "partOfSpeech": "adj.",
    "definition": "Wasted away or rudimentary.",
    "example Sentence": "Muscles were atrophied from bedrest.",
    "synonyms": [
      "Shriveled",
      "withered"
    ],
    "antonyms": [
      "Robust",
      "healthy"
    ]
  },
  {
    "word": "Audacious",
    "partOfSpeech": "adj.",
    "definition": "Willingness to take bold risks.",
    "example Sentence": "An audacious plan to escape.",
    "synonyms": [
      "Bold",
      "intrepid"
    ],
    "antonyms": [
      "Timid",
      "cowardly"
    ]
  },
  {
    "word": "Austere",
    "partOfSpeech": "adj.",
    "definition": "Severe or strict in manner.",
    "example Sentence": "The room was austere and cold.",
    "synonyms": [
      "Stark",
      "spartan"
    ],
    "antonyms": [
      "Ornate",
      "lavish"
    ]
  },
  {
    "word": "Authentic",
    "partOfSpeech": "adj.",
    "definition": "Of undisputed origin; genuine.",
    "example Sentence": "Authentic Roman sword.",
    "synonyms": [
      "Real",
      "valid"
    ],
    "antonyms": [
      "Fake",
      "false"
    ]
  },
  {
    "word": "Authoritative",
    "partOfSpeech": "adj.",
    "definition": "Trusted as being accurate.",
    "example Sentence": "Authoritative account of the event.",
    "synonyms": [
      "Reliable",
      "valid"
    ],
    "antonyms": [
      "Doubtful",
      "weak"
    ]
  },
  {
    "word": "Avaricious",
    "partOfSpeech": "adj.",
    "definition": "Having extreme greed for wealth.",
    "example Sentence": "The avaricious banker stole funds.",
    "synonyms": [
      "Rapacious",
      "greedy"
    ],
    "antonyms": [
      "Generous",
      "giving"
    ]
  },
  {
    "word": "Avuncular",
    "partOfSpeech": "adj.",
    "definition": "Like an uncle; kind and friendly.",
    "example Sentence": "He gave us avuncular advice.",
    "synonyms": [
      "Kind",
      "benevolent"
    ],
    "antonyms": [
      "Hostile",
      "cold"
    ]
  },
  {
    "word": "Baleful",
    "partOfSpeech": "adj.",
    "definition": "Threatening harm; menacing.",
    "example Sentence": "He shot a baleful glance.",
    "synonyms": [
      "Sinister",
      "malign"
    ],
    "antonyms": [
      "Benign",
      "friendly"
    ]
  },
  {
    "word": "Banal",
    "partOfSpeech": "adj.",
    "definition": "Lacking in originality; boring.",
    "example Sentence": "The plot was banal and predictable.",
    "synonyms": [
      "Trite",
      "hackneyed"
    ],
    "antonyms": [
      "Original",
      "unique"
    ]
  },
  {
    "word": "Barbarous",
    "partOfSpeech": "adj.",
    "definition": "Savagely cruel; brutal.",
    "example Sentence": "Treatment was barbarous.",
    "synonyms": [
      "Vicious",
      "crude"
    ],
    "antonyms": [
      "Civilized",
      "humane"
    ]
  },
  {
    "word": "Baroque",
    "partOfSpeech": "adj.",
    "definition": "Highly ornate and extravagant.",
    "example Sentence": "Church decorated in baroque style.",
    "synonyms": [
      "Ornate",
      "florid"
    ],
    "antonyms": [
      "Plain",
      "simple"
    ]
  },
  {
    "word": "Barren",
    "partOfSpeech": "adj.",
    "definition": "Too poor to produce vegetation.",
    "example Sentence": "Barren soil could not support crops.",
    "synonyms": [
      "Desolate",
      "sterile"
    ],
    "antonyms": [
      "Fertile",
      "lush"
    ]
  },
  {
    "word": "Bellicose",
    "partOfSpeech": "adj.",
    "definition": "Willingness to fight.",
    "example Sentence": "The bellicose tribe attacked.",
    "synonyms": [
      "Pugnacious",
      "hostile"
    ],
    "antonyms": [
      "Pacific",
      "calm"
    ]
  },
  {
    "word": "Belligerent",
    "partOfSpeech": "adj.",
    "definition": "Hostile and aggressive.",
    "example Sentence": "He became belligerent.",
    "synonyms": [
      "Pugnacious",
      "bellicose"
    ],
    "antonyms": [
      "Peaceful",
      "friendly"
    ]
  },
  {
    "word": "Benevolent",
    "partOfSpeech": "adj.",
    "definition": "Well-meaning and kindly.",
    "example Sentence": "A benevolent billionaire donated millions.",
    "synonyms": [
      "Altruistic",
      "kind"
    ],
    "antonyms": [
      "Malevolent",
      "cruel"
    ]
  },
  {
    "word": "Benign",
    "partOfSpeech": "adj.",
    "definition": "Gentle and kindly; not harmful.",
    "example Sentence": "The tumor was benign.",
    "synonyms": [
      "Harmless",
      "mild"
    ],
    "antonyms": [
      "Malignant",
      "toxic"
    ]
  },
  {
    "word": "Bilious",
    "partOfSpeech": "adj.",
    "definition": "Spiteful; bad-tempered.",
    "example Sentence": "He was in a bilious mood.",
    "synonyms": [
      "Irascible",
      "peevish"
    ],
    "antonyms": [
      "Genial",
      "pleasant"
    ]
  },
  {
    "word": "Blase",
    "partOfSpeech": "adj.",
    "definition": "Unimpressed or indifferent.",
    "example Sentence": "Blase about luxury hotels.",
    "synonyms": [
      "Unimpressed"
    ],
    "antonyms": [
      "Anticipation"
    ]
  },
  {
    "word": "Boisterous",
    "partOfSpeech": "adj.",
    "definition": "Noisy, energetic, and rowdy.",
    "example Sentence": "The boisterous crowd cheered.",
    "synonyms": [
      "Rowdy",
      "loud"
    ],
    "antonyms": [
      "Quiet",
      "calm"
    ]
  },
  {
    "word": "Bona Fide",
    "partOfSpeech": "adj.",
    "definition": "Genuine or true.",
    "example Sentence": "The signature was bona fide.",
    "synonyms": [
      "Genuine",
      "true"
    ],
    "antonyms": [
      "Fake"
    ]
  },
  {
    "word": "Boorish",
    "partOfSpeech": "adj.",
    "definition": "Rough and bad-mannered.",
    "example Sentence": "Boorish behavior ruined dinner.",
    "synonyms": [
      "Loutish",
      "uncouth"
    ],
    "antonyms": [
      "Refined",
      "polite"
    ]
  },
  {
    "word": "Brusque",
    "partOfSpeech": "adj.",
    "definition": "Abrupt or offhand.",
    "example Sentence": "The receptionist was brusque.",
    "synonyms": [
      "Abrupt"
    ],
    "antonyms": [
      "Polite"
    ]
  },
  {
    "word": "Bucolic",
    "partOfSpeech": "adj.",
    "definition": "Relating to the countryside.",
    "example Sentence": "We enjoyed the bucolic scenery.",
    "synonyms": [
      "Pastoral",
      "rustic"
    ],
    "antonyms": [
      "Urban",
      "city"
    ]
  },
  {
    "word": "Burgeoning",
    "partOfSpeech": "adj.",
    "definition": "Flourishing; growing quickly.",
    "example Sentence": "Burgeoning market for EVs.",
    "synonyms": [
      "Expanding",
      "thriving"
    ],
    "antonyms": [
      "Shrinking",
      "dying"
    ]
  },
  {
    "word": "Callous",
    "partOfSpeech": "adj.",
    "definition": "Insensitive and cruel disregard.",
    "example Sentence": "Dictator's callous treatment.",
    "synonyms": [
      "Heartless",
      "cold"
    ],
    "antonyms": [
      "Compassionate",
      "kind"
    ]
  },
  {
    "word": "Callow",
    "partOfSpeech": "adj.",
    "definition": "Inexperienced and immature.",
    "example Sentence": "A callow youth started the job.",
    "synonyms": [
      "Naive",
      "green"
    ],
    "antonyms": [
      "Mature",
      "seasoned"
    ]
  },
  {
    "word": "Calumnious",
    "partOfSpeech": "adj.",
    "definition": "False and defamatory.",
    "example Sentence": "The article was a calumnious attack.",
    "synonyms": [
      "Slanderous",
      "libelous"
    ],
    "antonyms": [
      "Laudatory",
      "true"
    ]
  },
  {
    "word": "Cantankerous",
    "partOfSpeech": "adj.",
    "definition": "Cranky or grumpy.",
    "example Sentence": "The cantankerous old man.",
    "synonyms": [
      "Cranky",
      "grumpy"
    ],
    "antonyms": [
      "Pleasant"
    ]
  },
  {
    "word": "Capricious",
    "partOfSpeech": "adj.",
    "definition": "Sudden changes of mood.",
    "example Sentence": "Capricious child changed her mind.",
    "synonyms": [
      "Fickle",
      "erratic"
    ],
    "antonyms": [
      "Constant",
      "steady"
    ]
  },
  {
    "word": "Captious",
    "partOfSpeech": "adj.",
    "definition": "Tending to find fault.",
    "example Sentence": "Captious boss hates everything.",
    "synonyms": [
      "Carping",
      "nitpicking"
    ],
    "antonyms": [
      "Encouraging"
    ]
  },
  {
    "word": "Circumspect",
    "partOfSpeech": "adj.",
    "definition": "Wary and unwilling to take risks.",
    "example Sentence": "Circumspect about sharing opinions.",
    "synonyms": [
      "Cautious",
      "prudent"
    ],
    "antonyms": [
      "Reckless",
      "rash"
    ]
  },
  {
    "word": "Clamorous",
    "partOfSpeech": "adj.",
    "definition": "Loud and confused noise.",
    "example Sentence": "The clamorous crowd waited.",
    "synonyms": [
      "Noisy",
      "vociferous"
    ],
    "antonyms": [
      "Quiet",
      "silent"
    ]
  },
  {
    "word": "Clandestine",
    "partOfSpeech": "adj.",
    "definition": "Kept secret or done secretively.",
    "example Sentence": "They had a clandestine meeting.",
    "synonyms": [
      "Covert",
      "furtive"
    ],
    "antonyms": [
      "Public",
      "open"
    ]
  },
  {
    "word": "Cogent",
    "partOfSpeech": "adj.",
    "definition": "Clear, logical, and convincing.",
    "example Sentence": "A cogent argument for peace.",
    "synonyms": [
      "Compelling"
    ]
  },
  {
    "word": "Confluent",
    "partOfSpeech": "adj.",
    "definition": "Flowing together or merging.",
    "example Sentence": "Confluent streams formed a river.",
    "synonyms": [
      "Merged",
      "united"
    ],
    "antonyms": [
      "Divergent",
      "separate"
    ]
  },
  {
    "word": "Conspicuous",
    "partOfSpeech": "adj.",
    "definition": "Standing out to be clearly visible.",
    "example Sentence": "The bird's feathers were conspicuous.",
    "synonyms": [
      "Noticeable"
    ]
  },
  {
    "word": "Cryptic",
    "partOfSpeech": "adj.",
    "definition": "Having mysterious meaning.",
    "example Sentence": "He left a cryptic message.",
    "synonyms": [
      "Enigmatic",
      "puzzling"
    ],
    "antonyms": [
      "Clear",
      "obvious"
    ]
  },
  {
    "word": "Culpable",
    "partOfSpeech": "adj.",
    "definition": "Deserving blame.",
    "example Sentence": "Driver was found culpable.",
    "synonyms": [
      "Guilty",
      "blameworthy"
    ],
    "antonyms": [
      "Innocent",
      "blameless"
    ]
  },
  {
    "word": "Cursory",
    "partOfSpeech": "adj.",
    "definition": "Hasty and not thorough.",
    "example Sentence": "A cursory glance at the paper.",
    "synonyms": [
      "Perfunctory",
      "brief"
    ],
    "antonyms": [
      "Thorough",
      "detailed"
    ]
  },
  {
    "word": "Deleterious",
    "partOfSpeech": "adj.",
    "definition": "Causing harm or damage.",
    "example Sentence": "Stress is deleterious to health.",
    "synonyms": [
      "Pernicious",
      "harmful"
    ],
    "antonyms": [
      "Beneficial",
      "helpful"
    ]
  },
  {
    "word": "Demure",
    "partOfSpeech": "adj.",
    "definition": "Reserved, modest, and shy.",
    "example Sentence": "She gave a demure smile.",
    "synonyms": [
      "Modest"
    ]
  },
  {
    "word": "Despondent",
    "partOfSpeech": "adj.",
    "definition": "Low spirits from loss of hope.",
    "example Sentence": "Grew despondent after failure.",
    "synonyms": [
      "Dejected",
      "forlorn"
    ],
    "antonyms": [
      "Cheerful",
      "elated"
    ]
  },
  {
    "word": "Destitute",
    "partOfSpeech": "adj.",
    "definition": "Without basic necessities.",
    "example Sentence": "Charity helps the destitute.",
    "synonyms": [
      "Impoverished",
      "poor"
    ],
    "antonyms": [
      "Wealthy",
      "rich"
    ]
  },
  {
    "word": "Desultory",
    "partOfSpeech": "adj.",
    "definition": "Lacking a plan or purpose.",
    "example Sentence": "A desultory conversation.",
    "synonyms": [
      "Haphazard",
      "aimless"
    ],
    "antonyms": [
      "Focused",
      "systematic"
    ]
  },
  {
    "word": "Detached",
    "partOfSpeech": "adj.",
    "definition": "Aloof or objective.",
    "example Sentence": "Judge remained detached.",
    "synonyms": [
      "Unbiased",
      "disinterested"
    ],
    "antonyms": [
      "Biased",
      "involved"
    ]
  },
  {
    "word": "Diminutive",
    "partOfSpeech": "adj.",
    "definition": "Extremely or unusually small.",
    "example Sentence": "Diminutive puppy fit in his hand.",
    "synonyms": [
      "Tiny",
      "petite"
    ],
    "antonyms": [
      "Huge",
      "enormous"
    ]
  },
  {
    "word": "Discerning",
    "partOfSpeech": "adj.",
    "definition": "Having or showing good judgment.",
    "example Sentence": "Discerning customer can tell the difference.",
    "synonyms": [
      "Perceptive",
      "sharp"
    ],
    "antonyms": [
      "Ignorant",
      "obtuse"
    ]
  },
  {
    "word": "Distant",
    "partOfSpeech": "adj.",
    "definition": "Far away in space or time.",
    "example Sentence": "Distant sound of thunder.",
    "synonyms": [
      "Far",
      "remote"
    ],
    "antonyms": [
      "Near",
      "close"
    ]
  },
  {
    "word": "Divergent",
    "partOfSpeech": "adj.",
    "definition": "Tending to be different or go apart.",
    "example Sentence": "Friends had divergent opinions.",
    "synonyms": [
      "Differing",
      "clashing"
    ],
    "antonyms": [
      "Similar",
      "matching"
    ]
  },
  {
    "word": "Docile",
    "partOfSpeech": "adj.",
    "definition": "Ready to accept control; submissive.",
    "example Sentence": "The docile elephant followed commands.",
    "synonyms": [
      "Compliant",
      "gentle"
    ],
    "antonyms": [
      "Stubborn",
      "wild"
    ]
  },
  {
    "word": "Dogmatic",
    "partOfSpeech": "adj.",
    "definition": "Principles laid down as incontrovertibly true.",
    "example Sentence": "Very dogmatic about his beliefs.",
    "synonyms": [
      "Opinonated"
    ],
    "antonyms": [
      "Open-minded"
    ]
  },
  {
    "word": "Edifying",
    "partOfSpeech": "adj.",
    "definition": "Providing moral instruction.",
    "example Sentence": "It was an edifying experience.",
    "synonyms": [
      "Enlightening",
      "didactic"
    ],
    "antonyms": [
      "Corrupting",
      "dark"
    ]
  },
  {
    "word": "Effete",
    "partOfSpeech": "adj.",
    "definition": "Worn out; no longer effective.",
    "example Sentence": "The effete aristocracy declined.",
    "synonyms": [
      "Enfeebled",
      "decadent"
    ],
    "antonyms": [
      "Vigorous",
      "strong"
    ]
  },
  {
    "word": "Emollient",
    "partOfSpeech": "adj.",
    "definition": "Softening or soothing effect.",
    "example Sentence": "His emollient words helped.",
    "synonyms": [
      "Conciliatory",
      "soothing"
    ],
    "antonyms": [
      "Abrasive",
      "harsh"
    ]
  },
  {
    "word": "Empirical",
    "partOfSpeech": "adj.",
    "definition": "Based on observation rather than theory.",
    "example Sentence": "Empirical evidence is needed.",
    "synonyms": [
      "Factual",
      "observed"
    ],
    "antonyms": [
      "Theoretical",
      "vague"
    ]
  },
  {
    "word": "Enervated",
    "partOfSpeech": "adj.",
    "definition": "Drained of energy.",
    "example Sentence": "Felt enervated by the heat.",
    "synonyms": [
      "Exhausted",
      "weak"
    ],
    "antonyms": [
      "Energetic",
      "fresh"
    ]
  },
  {
    "word": "Erroneous",
    "partOfSpeech": "adj.",
    "definition": "Wrong; incorrect.",
    "example Sentence": "Report contained several erroneous assumptions.",
    "synonyms": [
      "False",
      "mistaken"
    ],
    "antonyms": [
      "Correct",
      "true"
    ]
  },
  {
    "word": "Erudite",
    "partOfSpeech": "adj.",
    "definition": "Having or showing great knowledge.",
    "example Sentence": "An erudite professor.",
    "synonyms": [
      "Scholarly",
      "learned"
    ],
    "antonyms": [
      "Ignorant",
      "uneducated"
    ]
  },
  {
    "word": "Esoteric",
    "partOfSpeech": "adj.",
    "definition": "Understood by only a small number.",
    "example Sentence": "Esoteric knowledge of symbols.",
    "synonyms": [
      "Abstruse",
      "arcane"
    ],
    "antonyms": [
      "Common",
      "known"
    ]
  },
  {
    "word": "Ethereal",
    "partOfSpeech": "adj.",
    "definition": "Extremely delicate and light.",
    "example Sentence": "Her ethereal beauty was haunting.",
    "synonyms": [
      "Heavenly",
      "fragile"
    ],
    "antonyms": [
      "Earthly",
      "heavy"
    ]
  },
  {
    "word": "Exiguous",
    "partOfSpeech": "adj.",
    "definition": "Very small in size or amount.",
    "example Sentence": "An exiguous income.",
    "synonyms": [
      "Meager",
      "scanty"
    ],
    "antonyms": [
      "Ample",
      "large"
    ]
  },
  {
    "word": "Exorbitant",
    "partOfSpeech": "adj.",
    "definition": "Unreasonably high price.",
    "example Sentence": "The rent was exorbitant.",
    "synonyms": [
      "Excessive",
      "steep"
    ],
    "antonyms": [
      "Cheap",
      "low"
    ]
  },
  {
    "word": "Exotic",
    "partOfSpeech": "adj.",
    "definition": "Originating in a distant country.",
    "example Sentence": "Saw many exotic birds.",
    "synonyms": [
      "Unusual",
      "foreign"
    ],
    "antonyms": [
      "Common",
      "local"
    ]
  },
  {
    "word": "Expedient",
    "partOfSpeech": "adj.",
    "definition": "Convenient and practical; possibly improper.",
    "example Sentence": "It was politically expedient.",
    "synonyms": [
      "Practical",
      "useful"
    ],
    "antonyms": [
      "Unwise"
    ]
  },
  {
    "word": "Fallible",
    "partOfSpeech": "adj.",
    "definition": "Capable of making mistakes.",
    "example Sentence": "Even experts are fallible.",
    "synonyms": [
      "Imperfect",
      "errant"
    ],
    "antonyms": [
      "Infallible",
      "perfect"
    ]
  },
  {
    "word": "Fastidious",
    "partOfSpeech": "adj.",
    "definition": "Very attentive to accuracy and detail.",
    "example Sentence": "Fastidious about cleaning.",
    "synonyms": [
      "Scrupulous",
      "picky"
    ],
    "antonyms": [
      "Careless",
      "sloppy"
    ]
  },
  {
    "word": "Feasible",
    "partOfSpeech": "adj.",
    "definition": "Possible to do easily.",
    "example Sentence": "Not feasible to build in two weeks.",
    "synonyms": [
      "Achievable",
      "viable"
    ],
    "antonyms": [
      "Impossible",
      "impractical"
    ]
  },
  {
    "word": "Fervent",
    "partOfSpeech": "adj.",
    "definition": "Passionate intensity.",
    "example Sentence": "Fervent believer in education.",
    "synonyms": [
      "Passionate",
      "ardent"
    ],
    "antonyms": [
      "Apathetic",
      "cold"
    ]
  },
  {
    "word": "Fickle",
    "partOfSpeech": "adj.",
    "definition": "Changing frequently.",
    "example Sentence": "The fickle public forgot him.",
    "synonyms": [
      "Inconstant",
      "erratic"
    ],
    "antonyms": [
      "Stable",
      "steady"
    ]
  },
  {
    "word": "Fractious",
    "partOfSpeech": "adj.",
    "definition": "Irritable and quarrelsome.",
    "example Sentence": "The fractious toddler.",
    "synonyms": [
      "Refractory",
      "unruly"
    ],
    "antonyms": [
      "Docile",
      "calm"
    ]
  },
  {
    "word": "Fragile",
    "partOfSpeech": "adj.",
    "definition": "Easily broken or damaged.",
    "example Sentence": "Fragile glass vase.",
    "synonyms": [
      "Delicate",
      "frail"
    ],
    "antonyms": [
      "Strong",
      "tough"
    ]
  },
  {
    "word": "Fraudulent",
    "partOfSpeech": "adj.",
    "definition": "Obtained by involving deception.",
    "example Sentence": "Arrested for fraudulent activities.",
    "synonyms": [
      "Deceitful",
      "fake"
    ],
    "antonyms": [
      "Honest",
      "genuine"
    ]
  },
  {
    "word": "Genial",
    "partOfSpeech": "adj.",
    "definition": "Friendly and cheerful.",
    "example Sentence": "The host was a genial man.",
    "synonyms": [
      "Amiable",
      "affable"
    ],
    "antonyms": [
      "Grumpy",
      "cold"
    ]
  },
  {
    "word": "Germane",
    "partOfSpeech": "adj.",
    "definition": "Relevant to a subject.",
    "example Sentence": "That point is not germane.",
    "synonyms": [
      "Pertinent",
      "apposite"
    ],
    "antonyms": [
      "Irrelevant"
    ]
  },
  {
    "word": "Giddy",
    "partOfSpeech": "adj.",
    "definition": "Sensation of whirling; excitement.",
    "example Sentence": "She felt giddy with excitement.",
    "synonyms": [
      "Dizzy",
      "lightheaded"
    ],
    "antonyms": [
      "Serious",
      "steady"
    ]
  },
  {
    "word": "Gleeful",
    "partOfSpeech": "adj.",
    "definition": "Exuberantly happy.",
    "example Sentence": "Gleeful children opened presents.",
    "synonyms": [
      "Joyful",
      "merry"
    ],
    "antonyms": [
      "Sad",
      "morose"
    ]
  },
  {
    "word": "Glib",
    "partOfSpeech": "adj.",
    "definition": "Fluent but shallow and insincere.",
    "example Sentence": "Glib answer to the question.",
    "synonyms": [
      "Slick",
      "smooth"
    ],
    "antonyms": [
      "Sincere",
      "deep"
    ]
  },
  {
    "word": "Gullible",
    "partOfSpeech": "adj.",
    "definition": "Easily persuaded to believe something.",
    "example Sentence": "Targeting gullible consumers.",
    "synonyms": [
      "Naive",
      "trustful"
    ],
    "antonyms": [
      "Skeptical",
      "astute"
    ]
  },
  {
    "word": "Hackneyed",
    "partOfSpeech": "adj.",
    "definition": "Lacking significance; overused.",
    "example Sentence": "A hackneyed slogan.",
    "synonyms": [
      "Banal",
      "trite"
    ],
    "antonyms": [
      "Fresh",
      "new"
    ]
  },
  {
    "word": "Haggard",
    "partOfSpeech": "adj.",
    "definition": "Looking exhausted and unwell.",
    "example Sentence": "He looked haggard after shifts.",
    "synonyms": [
      "Gaunt",
      "drained"
    ],
    "antonyms": [
      "Healthy",
      "robust"
    ]
  },
  {
    "word": "Halcyon",
    "partOfSpeech": "adj.",
    "definition": "Idyllically happy and peaceful.",
    "example Sentence": "Halcyon summer days.",
    "synonyms": [
      "Serene",
      "tranquil"
    ],
    "antonyms": [
      "Chaotic",
      "stormy"
    ]
  },
  {
    "word": "Heinous",
    "partOfSpeech": "adj.",
    "definition": "Utterly wicked or abominable.",
    "example Sentence": "A heinous crime.",
    "synonyms": [
      "Atrocious",
      "odious"
    ],
    "antonyms": [
      "Noble",
      "good"
    ]
  },
  {
    "word": "Hermetic",
    "partOfSpeech": "adj.",
    "definition": "Airtight; insulated from influence.",
    "example Sentence": "A hermetic seal.",
    "synonyms": [
      "Sealed",
      "reclusive"
    ],
    "antonyms": [
      "Open",
      "exposed"
    ]
  },
  {
    "word": "Ignominious",
    "partOfSpeech": "adj.",
    "definition": "Deserving public disgrace.",
    "example Sentence": "An ignominious defeat.",
    "synonyms": [
      "Shameful",
      "disgraceful"
    ],
    "antonyms": [
      "Glorious",
      "honorable"
    ]
  },
  {
    "word": "Illicit",
    "partOfSpeech": "adj.",
    "definition": "Forbidden by law or custom.",
    "example Sentence": "Large supply of illicit drugs.",
    "synonyms": [
      "Illegal",
      "forbidden"
    ],
    "antonyms": [
      "Legal",
      "lawful"
    ]
  },
  {
    "word": "Imperative",
    "partOfSpeech": "adj.",
    "definition": "Of vital importance; crucial.",
    "example Sentence": "Imperative that you finish on time.",
    "synonyms": [
      "Essential",
      "vital"
    ],
    "antonyms": [
      "Trivial",
      "optional"
    ]
  },
  {
    "word": "Imperceptible",
    "partOfSpeech": "adj.",
    "definition": "Impossible to perceive.",
    "example Sentence": "Change was almost imperceptible.",
    "synonyms": [
      "Subtle",
      "faint"
    ],
    "antonyms": [
      "Obvious",
      "clear"
    ]
  },
  {
    "word": "Imperious",
    "partOfSpeech": "adj.",
    "definition": "Assuming power without justification.",
    "example Sentence": "An imperious gesture.",
    "synonyms": [
      "Domineering",
      "bossy"
    ],
    "antonyms": [
      "Submissive"
    ]
  },
  {
    "word": "Imperturable",
    "partOfSpeech": "adj.",
    "definition": "Unable to be upset; calm.",
    "example Sentence": "An imperturbable calm.",
    "synonyms": [
      "Placid",
      "serene"
    ],
    "antonyms": [
      "Excitable",
      "wild"
    ]
  },
  {
    "word": "Impervious",
    "partOfSpeech": "adj.",
    "definition": "Not allowing fluid to pass; unaffected.",
    "example Sentence": "Impervious to criticism.",
    "synonyms": [
      "Unaffected",
      "resistant"
    ],
    "antonyms": [
      "Porous",
      "vulnerable"
    ]
  },
  {
    "word": "Imprudent",
    "partOfSpeech": "adj.",
    "definition": "Not showing care for consequences.",
    "example Sentence": "Imprudent to leave keys in car.",
    "synonyms": [
      "Unwise",
      "reckless"
    ],
    "antonyms": [
      "Prudent",
      "wise"
    ]
  },
  {
    "word": "Inadvertent",
    "partOfSpeech": "adj.",
    "definition": "Not resulting from deliberate planning.",
    "example Sentence": "The deletion was purely inadvertent.",
    "synonyms": [
      "Unintentional",
      "accidental"
    ],
    "antonyms": [
      "Deliberate",
      "planned"
    ]
  },
  {
    "word": "Incoherent",
    "partOfSpeech": "adj.",
    "definition": "Expressed in confusing way.",
    "example Sentence": "Patient was incoherent.",
    "synonyms": [
      "Confused",
      "muddled"
    ],
    "antonyms": [
      "Coherent",
      "clear"
    ]
  },
  {
    "word": "Incompatible",
    "partOfSpeech": "adj.",
    "definition": "So opposed as to be unable to coexist.",
    "example Sentence": "Personalities were incompatible.",
    "synonyms": [
      "Conflicting",
      "clashing"
    ],
    "antonyms": [
      "Harmonious",
      "matching"
    ]
  },
  {
    "word": "Incongruous",
    "partOfSpeech": "adj.",
    "definition": "Not in harmony or keeping with.",
    "example Sentence": "Modern skyscraper looked incongruous.",
    "synonyms": [
      "Out of place"
    ],
    "antonyms": [
      "Harmonious"
    ]
  },
  {
    "word": "Inconspicuous",
    "partOfSpeech": "adj.",
    "definition": "Not clearly visible or attracting attention.",
    "example Sentence": "Remain inconspicuous in back of room.",
    "synonyms": [
      "Unobtrusive",
      "hidden"
    ],
    "antonyms": [
      "Conspicuous",
      "obvious"
    ]
  },
  {
    "word": "Incorrigible",
    "partOfSpeech": "adj.",
    "definition": "Not able to be corrected or reformed.",
    "example Sentence": "An incorrigible liar.",
    "synonyms": [
      "Inveterate",
      "habitual"
    ],
    "antonyms": [
      "Reformable",
      "obedient"
    ]
  },
  {
    "word": "Ineffable",
    "partOfSpeech": "adj.",
    "definition": "Too great to be expressed.",
    "example Sentence": "Ineffable joy.",
    "synonyms": [
      "Indescribable",
      "vast"
    ],
    "antonyms": [
      "Utterable",
      "small"
    ]
  },
  {
    "word": "Inept",
    "partOfSpeech": "adj.",
    "definition": "Having or showing no skill.",
    "example Sentence": "He was an inept cook.",
    "synonyms": [
      "Incompetent",
      "clumsy"
    ],
    "antonyms": [
      "Skillful",
      "adept"
    ]
  },
  {
    "word": "Inevitable",
    "partOfSpeech": "adj.",
    "definition": "Certain to happen; unavoidable.",
    "example Sentence": "Death is an inevitable part of life.",
    "synonyms": [
      "Unavoidable",
      "assured"
    ],
    "antonyms": [
      "Avoidable",
      "uncertain"
    ]
  },
  {
    "word": "Inordinate",
    "partOfSpeech": "adj.",
    "definition": "Unusually large; excessive.",
    "example Sentence": "Spent an inordinate amount of time.",
    "synonyms": [
      "Excessive",
      "undue"
    ],
    "antonyms": [
      "Moderate",
      "reasonable"
    ]
  },
  {
    "word": "Inscrutable",
    "partOfSpeech": "adj.",
    "definition": "Impossible to understand or interpret.",
    "example Sentence": "Face remained inscrutable.",
    "synonyms": [
      "Enigmatic",
      "cryptic"
    ],
    "antonyms": [
      "Transparent",
      "clear"
    ]
  },
  {
    "word": "Insidious",
    "partOfSpeech": "adj.",
    "definition": "Proceeding in gradual subtle way with harm.",
    "example Sentence": "The disease is insidious.",
    "synonyms": [
      "Stealthy",
      "treacherous"
    ],
    "antonyms": [
      "Obvious",
      "open"
    ]
  },
  {
    "word": "Intrepid",
    "partOfSpeech": "adj.",
    "definition": "Fearless; adventurous.",
    "example Sentence": "Explorer trekked through the Amazon.",
    "synonyms": [
      "Bold",
      "dauntless"
    ],
    "antonyms": [
      "Cowardly",
      "timid"
    ]
  },
  {
    "word": "Intrinsic",
    "partOfSpeech": "adj.",
    "definition": "Belonging naturally; essential.",
    "example Sentence": "Quality is an intrinsic part of the brand.",
    "synonyms": [
      "Inherent",
      "innate"
    ],
    "antonyms": [
      "Extrinsic",
      "external"
    ]
  },
  {
    "word": "Invaluable",
    "partOfSpeech": "adj.",
    "definition": "Extremely useful; indispensable.",
    "example Sentence": "Help was invaluable during crisis.",
    "synonyms": [
      "Priceless",
      "precious"
    ],
    "antonyms": [
      "Worthless",
      "cheap"
    ]
  },
  {
    "word": "Inured",
    "partOfSpeech": "adj.",
    "definition": "Accustomed to something unpleasant.",
    "example Sentence": "Inured to the cold.",
    "synonyms": [
      "Hardened",
      "seasoned"
    ],
    "antonyms": [
      "Sensitive"
    ]
  },
  {
    "word": "Jaded",
    "partOfSpeech": "adj.",
    "definition": "Tired or bored after too much.",
    "example Sentence": "Jaded by years of same office.",
    "synonyms": [
      "Bored",
      "weary"
    ],
    "antonyms": [
      "Fresh",
      "eager"
    ]
  },
  {
    "word": "Jejune",
    "partOfSpeech": "adj.",
    "definition": "Naive and simplistic.",
    "example Sentence": "A jejune argument.",
    "synonyms": [
      "Puerile",
      "shallow"
    ],
    "antonyms": [
      "Profound",
      "wise"
    ]
  },
  {
    "word": "Jocund",
    "partOfSpeech": "adj.",
    "definition": "Cheerful and happy.",
    "example Sentence": "Jocund atmosphere of festival.",
    "synonyms": [
      "Cheerful",
      "happy"
    ],
    "antonyms": [
      "Gloomy"
    ]
  },
  {
    "word": "Jovial",
    "partOfSpeech": "adj.",
    "definition": "Cheerful and friendly.",
    "example Sentence": "A jovial host.",
    "synonyms": [
      "Merry",
      "gleeful"
    ],
    "antonyms": [
      "Gloomy",
      "somber"
    ]
  },
  {
    "word": "Judicious",
    "partOfSpeech": "adj.",
    "definition": "Done with good judgment.",
    "example Sentence": "Judicious use of resources.",
    "synonyms": [
      "Wise",
      "sensible"
    ],
    "antonyms": [
      "Foolish",
      "rash"
    ]
  },
  {
    "word": "Lavish",
    "partOfSpeech": "adj.",
    "definition": "Sumptuously rich or luxurious.",
    "example Sentence": "Threw a lavish party.",
    "synonyms": [
      "Opulent",
      "extravagant"
    ],
    "antonyms": [
      "Frugal",
      "meager"
    ]
  },
  {
    "word": "Lethargic",
    "partOfSpeech": "adj.",
    "definition": "Sluggish and apathetic.",
    "example Sentence": "Felt lethargic all day.",
    "synonyms": [
      "Listless",
      "slow"
    ],
    "antonyms": [
      "Vivacious",
      "fast"
    ]
  },
  {
    "word": "Limpid",
    "partOfSpeech": "adj.",
    "definition": "Completely clear; transparent.",
    "example Sentence": "Limpid pools of water.",
    "synonyms": [
      "Pellucid",
      "lucid"
    ],
    "antonyms": [
      "Murky",
      "opaque"
    ]
  },
  {
    "word": "Maudlin",
    "partOfSpeech": "adj.",
    "definition": "Self-pitying or sentimental.",
    "example Sentence": "A maudlin drunk.",
    "synonyms": [
      "Mushy",
      "weepy"
    ],
    "antonyms": [
      "Stoic",
      "dry"
    ]
  },
  {
    "word": "Meager",
    "partOfSpeech": "adj.",
    "definition": "Lacking in quantity or quality.",
    "example Sentence": "Meager rations of water.",
    "synonyms": [
      "Scanty",
      "sparse"
    ],
    "antonyms": [
      "Ample",
      "abundant"
    ]
  },
  {
    "word": "Mordant",
    "partOfSpeech": "adj.",
    "definition": "Sharp, critical humor.",
    "example Sentence": "Mordant wit.",
    "synonyms": [
      "Acerbic",
      "caustic"
    ],
    "antonyms": [
      "Kind",
      "gentle"
    ]
  },
  {
    "word": "Morose",
    "partOfSpeech": "adj.",
    "definition": "Sullen and ill-tempered.",
    "example Sentence": "A morose teenager.",
    "synonyms": [
      "Gloomy",
      "moody"
    ],
    "antonyms": [
      "Cheerful",
      "happy"
    ]
  },
  {
    "word": "Mundane",
    "partOfSpeech": "adj.",
    "definition": "Lacking interest; dull.",
    "example Sentence": "Mundane daily chores.",
    "synonyms": [
      "Humdrum",
      "prosaic"
    ],
    "antonyms": [
      "Extraordinary",
      "exotic"
    ]
  },
  {
    "word": "Munificent",
    "partOfSpeech": "adj.",
    "definition": "More generous than usual.",
    "example Sentence": "A munificent donor.",
    "synonyms": [
      "Magnanimous",
      "lavish"
    ],
    "antonyms": [
      "Stingy",
      "greedy"
    ]
  },
  {
    "word": "Myopic",
    "partOfSpeech": "adj.",
    "definition": "Nearsighted; lacking foresight.",
    "example Sentence": "A myopic strategy.",
    "synonyms": [
      "Narrow-minded"
    ],
    "antonyms": [
      "Far-sighted"
    ]
  },
  {
    "word": "Naïve",
    "partOfSpeech": "adj.",
    "definition": "Showing lack of experience or judgment.",
    "example Sentence": "So naïve to believe that.",
    "synonyms": [
      "Innocent",
      "unsophisticated"
    ],
    "antonyms": [
      "Worldly",
      "cynical"
    ]
  },
  {
    "word": "Notorious",
    "partOfSpeech": "adj.",
    "definition": "Famous for bad quality.",
    "example Sentence": "Notorious gambler.",
    "synonyms": [
      "Infamous",
      "ill-famed"
    ],
    "antonyms": [
      "Reputable",
      "unknown"
    ]
  },
  {
    "word": "Novel",
    "partOfSpeech": "adj.",
    "definition": "New or unusual in interesting way.",
    "example Sentence": "A novel solution to energy.",
    "synonyms": [
      "Innovative",
      "fresh"
    ],
    "antonyms": [
      "Trite",
      "commonplace"
    ]
  },
  {
    "word": "Noxious",
    "partOfSpeech": "adj.",
    "definition": "Harmful or poisonous.",
    "example Sentence": "Noxious fumes from factory.",
    "synonyms": [
      "Toxic",
      "harmful"
    ],
    "antonyms": [
      "Wholesome",
      "safe"
    ]
  },
  {
    "word": "Obdurate",
    "partOfSpeech": "adj.",
    "definition": "Stubbornly refusing to change.",
    "example Sentence": "Obdurate in his belief.",
    "synonyms": [
      "Intransigent",
      "rigid"
    ],
    "antonyms": [
      "Pliable",
      "soft"
    ]
  },
  {
    "word": "Opaque",
    "partOfSpeech": "adj.",
    "definition": "Not able to be seen through.",
    "example Sentence": "Opaque windows.",
    "synonyms": [
      "Murky",
      "blurred"
    ],
    "antonyms": [
      "Transparent",
      "clear"
    ]
  },
  {
    "word": "Opprobrious",
    "partOfSpeech": "adj.",
    "definition": "Expressing scorn or criticism.",
    "example Sentence": "Opprobrious language.",
    "synonyms": [
      "Abusive",
      "vitriolic"
    ],
    "antonyms": [
      "Laudatory"
    ]
  },
  {
    "word": "Opulent",
    "partOfSpeech": "adj.",
    "definition": "Rich and luxurious.",
    "example Sentence": "Lived in an opulent palace.",
    "synonyms": [
      "Lavish",
      "wealthy"
    ],
    "antonyms": [
      "Poor",
      "destitute"
    ]
  },
  {
    "word": "Ornate",
    "partOfSpeech": "adj.",
    "definition": "Made in an intricate shape.",
    "example Sentence": "Ornate carvings.",
    "synonyms": [
      "Elaborate",
      "decorated"
    ],
    "antonyms": [
      "Plain",
      "simple"
    ]
  },
  {
    "word": "Rapacious",
    "partOfSpeech": "adj.",
    "definition": "Aggressively greedy.",
    "example Sentence": "Rapacious landlords.",
    "synonyms": [
      "Avaricious",
      "greedy"
    ],
    "antonyms": [
      "Generous",
      "kind"
    ]
  },
  {
    "word": "Raucous",
    "partOfSpeech": "adj.",
    "definition": "Harsh and loud noise.",
    "example Sentence": "Raucous laughter.",
    "synonyms": [
      "Strident",
      "piercing"
    ],
    "antonyms": [
      "Soft",
      "quiet"
    ]
  },
  {
    "word": "Reluctant",
    "partOfSpeech": "adj.",
    "definition": "Unwilling and hesitant.",
    "example Sentence": "Reluctant to leave chair.",
    "synonyms": [
      "Unwilling",
      "averse"
    ],
    "antonyms": [
      "Eager",
      "willing"
    ]
  },
  {
    "word": "Remiss",
    "partOfSpeech": "adj.",
    "definition": "Lacking care or attention.",
    "example Sentence": "Remiss in his job.",
    "synonyms": [
      "Negligent",
      "lax"
    ],
    "antonyms": [
      "Diligent",
      "careful"
    ]
  },
  {
    "word": "Reticent",
    "partOfSpeech": "adj.",
    "definition": "Not revealing thoughts readily.",
    "example Sentence": "Reticent about her past.",
    "synonyms": [
      "Reserved",
      "quiet"
    ],
    "antonyms": [
      "Outspoken",
      "bold"
    ]
  },
  {
    "word": "Robust",
    "partOfSpeech": "adj.",
    "definition": "Strong and healthy; vigorous.",
    "example Sentence": "Still robust at age 90.",
    "synonyms": [
      "Strong",
      "sturdy"
    ],
    "antonyms": [
      "Weak",
      "frail"
    ]
  },
  {
    "word": "Rudimentary",
    "partOfSpeech": "adj.",
    "definition": "Limited to basic principles.",
    "example Sentence": "Rudimentary knowledge of subject.",
    "synonyms": [
      "Basic",
      "simple"
    ],
    "antonyms": [
      "Advanced",
      "complex"
    ]
  },
  {
    "word": "Sedentary",
    "partOfSpeech": "adj.",
    "definition": "Much time seated; inactive.",
    "example Sentence": "Lived a sedentary life.",
    "synonyms": [
      "Inactive",
      "idle"
    ],
    "antonyms": [
      "Active",
      "energetic"
    ]
  },
  {
    "word": "Sedulous",
    "partOfSpeech": "adj.",
    "definition": "Showing dedication/diligence.",
    "example Sentence": "A sedulous student.",
    "synonyms": [
      "Assiduous",
      "careful"
    ],
    "antonyms": [
      "Idle",
      "lazy"
    ]
  },
  {
    "word": "Serene",
    "partOfSpeech": "adj.",
    "definition": "Calm, peaceful, untroubled.",
    "example Sentence": "View of lake was serene.",
    "synonyms": [
      "Placid",
      "quiet"
    ],
    "antonyms": [
      "Turbulent",
      "wild"
    ]
  },
  {
    "word": "Servile",
    "partOfSpeech": "adj.",
    "definition": "Excessive willingness to serve.",
    "example Sentence": "Gave a servile bow.",
    "synonyms": [
      "Submissive",
      "fawning"
    ],
    "antonyms": [
      "Arrogant",
      "haughty"
    ]
  },
  {
    "word": "Sparse",
    "partOfSpeech": "adj.",
    "definition": "Thinly dispersed/scattered.",
    "example Sentence": "Vegetation was sparse.",
    "synonyms": [
      "Scanty",
      "meager"
    ],
    "antonyms": [
      "Dense",
      "lush"
    ]
  },
  {
    "word": "Specious",
    "partOfSpeech": "adj.",
    "definition": "Plausible but actually wrong.",
    "example Sentence": "A specious argument.",
    "synonyms": [
      "Spurious",
      "misleading"
    ],
    "antonyms": [
      "Valid",
      "true"
    ]
  },
  {
    "word": "Spiteful",
    "partOfSpeech": "adj.",
    "definition": "Showing or caused by malice.",
    "example Sentence": "Made a spiteful comment.",
    "synonyms": [
      "Malicious",
      "cruel"
    ],
    "antonyms": [
      "Kind",
      "friendly"
    ]
  },
  {
    "word": "Splenetic",
    "partOfSpeech": "adj.",
    "definition": "Bad-tempered; spiteful.",
    "example Sentence": "A splenetic outburst.",
    "synonyms": [
      "Irascible",
      "bilious"
    ],
    "antonyms": [
      "Affable",
      "kind"
    ]
  },
  {
    "word": "Spontaneous",
    "partOfSpeech": "adj.",
    "definition": "Sudden inner impulse.",
    "example Sentence": "Spontaneous applause.",
    "synonyms": [
      "Impromptu",
      "rash"
    ],
    "antonyms": [
      "Planned",
      "forced"
    ]
  },
  {
    "word": "Stupefied",
    "partOfSpeech": "adj.",
    "definition": "Unable to think properly.",
    "example Sentence": "Stupefied by the news.",
    "synonyms": [
      "Dazed",
      "stunned"
    ],
    "antonyms": [
      "Aware",
      "alert"
    ]
  },
  {
    "word": "Submissive",
    "partOfSpeech": "adj.",
    "definition": "Ready to conform to authority.",
    "example Sentence": "Expected to be submissive.",
    "synonyms": [
      "Compliant",
      "docile"
    ],
    "antonyms": [
      "Defiant",
      "unruly"
    ]
  },
  {
    "word": "Subservient",
    "partOfSpeech": "adj.",
    "definition": "Prepared to obey unquestioningly.",
    "example Sentence": "Subservient to boss's whim.",
    "synonyms": [
      "Servile",
      "docile"
    ],
    "antonyms": [
      "Independent",
      "bold"
    ]
  },
  {
    "word": "Subtle",
    "partOfSpeech": "adj.",
    "definition": "So delicate as to be difficult to analyze.",
    "example Sentence": "Subtle difference in color.",
    "synonyms": [
      "Slight",
      "faint"
    ],
    "antonyms": [
      "Obvious",
      "blatant"
    ]
  },
  {
    "word": "Succinct",
    "partOfSpeech": "adj.",
    "definition": "Briefly and clearly expressed.",
    "example Sentence": "Keep answer succinct.",
    "synonyms": [
      "Concise",
      "brief"
    ],
    "antonyms": [
      "Verbose",
      "long"
    ]
  },
  {
    "word": "Sycophantic",
    "partOfSpeech": "adj.",
    "definition": "Behaving in obsequious way.",
    "example Sentence": "Sycophantic flatterers.",
    "synonyms": [
      "Fawning",
      "servile"
    ],
    "antonyms": [
      "Bold",
      "honest"
    ]
  },
  {
    "word": "Tacit",
    "partOfSpeech": "adj.",
    "definition": "Understood without being stated.",
    "example Sentence": "There was a tacit agreement.",
    "synonyms": [
      "Implicit",
      "inferred"
    ],
    "antonyms": [
      "Explicit",
      "stated"
    ]
  },
  {
    "word": "Taciturn",
    "partOfSpeech": "adj.",
    "definition": "Saying little.",
    "example Sentence": "Taciturn man rarely spoke.",
    "synonyms": [
      "Silent",
      "reserved"
    ],
    "antonyms": [
      "Loquacious",
      "talkative"
    ]
  },
  {
    "word": "Tactful",
    "partOfSpeech": "adj.",
    "definition": "Skill and sensitivity in dealing with others.",
    "example Sentence": "Gave a tactful critique.",
    "synonyms": [
      "Diplomatic",
      "polite"
    ],
    "antonyms": [
      "Rude",
      "tactless"
    ]
  },
  {
    "word": "Thrifty",
    "partOfSpeech": "adj.",
    "definition": "Using resources carefully.",
    "example Sentence": "Very thrifty using coupons.",
    "synonyms": [
      "Frugal",
      "stingy"
    ],
    "antonyms": [
      "Extravagant",
      "lavish"
    ]
  },
  {
    "word": "Timid",
    "partOfSpeech": "adj.",
    "definition": "Lack of courage/confidence.",
    "example Sentence": "Timid child hid behind mother.",
    "synonyms": [
      "Shy",
      "fearful"
    ],
    "antonyms": [
      "Bold",
      "brave"
    ]
  },
  {
    "word": "Timorous",
    "partOfSpeech": "adj.",
    "definition": "Showing nervousness/fear.",
    "example Sentence": "A timorous mouse.",
    "synonyms": [
      "Fearful",
      "shy"
    ],
    "antonyms": [
      "Bold",
      "brave"
    ]
  },
  {
    "word": "Transparent",
    "partOfSpeech": "adj.",
    "definition": "Allowing light to pass through.",
    "example Sentence": "Water was transparent.",
    "synonyms": [
      "Clear",
      "obvious"
    ],
    "antonyms": [
      "Opaque",
      "murky"
    ]
  },
  {
    "word": "Treacherous",
    "partOfSpeech": "adj.",
    "definition": "Guilty of betrayal/deception.",
    "example Sentence": "Mountain pass was treacherous.",
    "synonyms": [
      "Dangerous",
      "perfidious"
    ],
    "antonyms": [
      "Safe",
      "loyal"
    ]
  },
  {
    "word": "Trenchant",
    "partOfSpeech": "adj.",
    "definition": "Vigorous or incisive in expression.",
    "example Sentence": "Trenchant criticism.",
    "synonyms": [
      "Sharp",
      "biting"
    ],
    "antonyms": [
      "Weak",
      "vague"
    ]
  },
  {
    "word": "Unanimous",
    "partOfSpeech": "adj.",
    "definition": "Fully in agreement.",
    "example Sentence": "Jury reached unanimous verdict.",
    "synonyms": [
      "United",
      "agreed"
    ],
    "antonyms": [
      "Divided",
      "split"
    ]
  },
  {
    "word": "Uncanny",
    "partOfSpeech": "adj.",
    "definition": "Strange or mysterious.",
    "example Sentence": "Uncanny ability to guess.",
    "synonyms": [
      "Eerie",
      "weird"
    ],
    "antonyms": [
      "Normal",
      "typical"
    ]
  },
  {
    "word": "Unconscionable",
    "partOfSpeech": "adj.",
    "definition": "Not right or reasonable.",
    "example Sentence": "Unconscionable behavior.",
    "synonyms": [
      "Unethical",
      "wrong"
    ],
    "antonyms": [
      "Moral",
      "fair"
    ]
  },
  {
    "word": "Unctuous",
    "partOfSpeech": "adj.",
    "definition": "Excessively flattering; oily.",
    "example Sentence": "An unctuous greeting.",
    "synonyms": [
      "Fawning",
      "greasy"
    ],
    "antonyms": [
      "Blunt",
      "sincere"
    ]
  },
  {
    "word": "Underlying",
    "partOfSpeech": "adj.",
    "definition": "Significant cause; not obvious.",
    "example Sentence": "Underlying cause of problem.",
    "synonyms": [
      "Fundamental",
      "basic"
    ],
    "antonyms": [
      "Surface",
      "slight"
    ]
  },
  {
    "word": "Vacuous",
    "partOfSpeech": "adj.",
    "definition": "Lack of thought; mindless.",
    "example Sentence": "Gave a vacuous smile.",
    "synonyms": [
      "Inane",
      "empty"
    ],
    "antonyms": [
      "Intelligent",
      "sharp"
    ]
  },
  {
    "word": "Valid",
    "partOfSpeech": "adj.",
    "definition": "Sound basis in logic or fact.",
    "example Sentence": "Valid reason for absence.",
    "synonyms": [
      "Logical",
      "sound"
    ],
    "antonyms": [
      "Invalid",
      "false"
    ]
  },
  {
    "word": "Vapid",
    "partOfSpeech": "adj.",
    "definition": "Offering nothing challenging.",
    "example Sentence": "A vapid conversation.",
    "synonyms": [
      "Insipid",
      "bland"
    ],
    "antonyms": [
      "Lively",
      "zesty"
    ]
  },
  {
    "word": "Variable",
    "partOfSpeech": "adj.",
    "definition": "Not consistent; liable to change.",
    "example Sentence": "Weather is very variable.",
    "synonyms": [
      "Fickle",
      "shifting"
    ],
    "antonyms": [
      "Constant",
      "fixed"
    ]
  },
  {
    "word": "Vexatious",
    "partOfSpeech": "adj.",
    "definition": "Causing annoyance or worry.",
    "example Sentence": "A vexatious problem.",
    "synonyms": [
      "Annoying",
      "irksome"
    ],
    "antonyms": [
      "Pleasing",
      "easy"
    ]
  },
  {
    "word": "Viable",
    "partOfSpeech": "adj.",
    "definition": "Capable of working successfully.",
    "example Sentence": "Looking for viable solution.",
    "synonyms": [
      "Feasible",
      "possible"
    ],
    "antonyms": [
      "Impossible",
      "futile"
    ]
  },
  {
    "word": "Volatile",
    "partOfSpeech": "adj.",
    "definition": "Liable to change rapidly.",
    "example Sentence": "Political situation is volatile.",
    "synonyms": [
      "Unstable",
      "explosive"
    ],
    "antonyms": [
      "Stable",
      "calm"
    ]
  },
  {
    "word": "Voluble",
    "partOfSpeech": "adj.",
    "definition": "Speaking incessantly/fluently.",
    "example Sentence": "Voluble speaker could talk for hours.",
    "synonyms": [
      "Talkative",
      "loquacious"
    ],
    "antonyms": [
      "Taciturn",
      "silent"
    ]
  },
  {
    "word": "Voracious",
    "partOfSpeech": "adj.",
    "definition": "Wanting great quantities.",
    "example Sentence": "She is a voracious reader.",
    "synonyms": [
      "Insatiable",
      "greedy"
    ],
    "antonyms": [
      "Satisfied",
      "full"
    ]
  },
  {
    "word": "Vulnerable",
    "partOfSpeech": "adj.",
    "definition": "Susceptible to attack.",
    "example Sentence": "Defenses were vulnerable.",
    "synonyms": [
      "Weak",
      "exposed"
    ],
    "antonyms": [
      "Secure",
      "strong"
    ]
  },
  {
    "word": "Wry",
    "partOfSpeech": "adj.",
    "definition": "Expressing dry mocking humor.",
    "example Sentence": "Gave a wry smile.",
    "synonyms": [
      "Droll",
      "mocking"
    ],
    "antonyms": [
      "Sincere",
      "direct"
    ]
  },
  {
    "word": "Zealous",
    "partOfSpeech": "adj.",
    "definition": "Showing great energy/zeal.",
    "example Sentence": "A zealous supporter.",
    "synonyms": [
      "Ardent",
      "fervent"
    ],
    "antonyms": [
      "Apathetic",
      "lazy"
    ]
  },
  {
    "word": "Zenith",
    "partOfSpeech": "adj.",
    "definition": "Time at which something is peak.",
    "example Sentence": "The zenith of her fame.",
    "synonyms": [
      "Peak",
      "summit"
    ],
    "antonyms": [
      "Nadir",
      "bottom"
    ]
  }
];

const LOCAL_SPELLING_POOL: Question[] = [
  { id: 'fs-2', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Seperate", "Seprate", "Separate", "Saparate"], correctAnswer: 2, explanation: "Think: There is 'a rat' in sep-a-rat-e." },
  { id: 'fs-3', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Ocurence", "Occurence", "Occurrance", "Occurrence"], correctAnswer: 3, explanation: "Occurrence has two 'c's, two 'r's, and ends in 'ence'." },
  { id: 'fs-4', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Definately", "Definitely", "Definitly", "Deffinitely"], correctAnswer: 1, explanation: "Definitely is spelled with an 'i' after the 'n'." },
  { id: 'fs-5', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Embarrass", "Embaras", "Embarass", "Emberrass"], correctAnswer: 0, explanation: "Embarrass has two 'r's and two 's's." },
  { id: 'fs-6', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Liason", "Laiason", "Liaiason", "Liaison"], correctAnswer: 3, explanation: "Remember the pattern: l-i-a-i-s-o-n." },
  { id: 'fs-7', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Privelege", "Privilege", "Priviledge", "Priveldge"], correctAnswer: 1, explanation: "No 'd' in privilege. Ends in -ege." },
  { id: 'fs-8', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Beurocracy", "Burreaucracy", "Bureaucrasy", "Bureaucracy"], correctAnswer: 3, explanation: "Bureau-cracy. French root 'bureau'." },
  { id: 'fs-9', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Surveilance", "Surveillance", "Survaillance", "Survalance"], correctAnswer: 1, explanation: "Sur- (over) + veiller (watch). Double 'l'." },
  { id: 'fs-10', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Entreprenuer", "Entrepreneur", "Entrepenuer", "Entrepeneur"], correctAnswer: 1, explanation: "Ends in -eur." },
  { id: 'fs-11', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Questionaire", "Questionnare", "Questinnaire", "Questionnaire"], correctAnswer: 3, explanation: "Double 'n' in questionnaire." },
  { id: 'fs-12', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Connoisseur", "Conoisseur", "Connoiser", "Connaisseur"], correctAnswer: 0, explanation: "Double 'n', double 's'." },
  { id: 'fs-13', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Medeval", "Medieval", "Mideval", "Midieval"], correctAnswer: 1, explanation: "Medi- (middle) + eval (age)." },
  { id: 'fs-14', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Rythm", "Rhythym", "Rhythm", "Rithm"], correctAnswer: 2, explanation: "R-h-y-t-h-m. Two h's." },
  { id: 'fs-15', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Vaccum", "Vacume", "Vacuum", "Vacuume"], correctAnswer: 2, explanation: "One 'c', two 'u's." },
  { id: 'fs-16', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Millenium", "Milennium", "Millennium", "Millinium"], correctAnswer: 2, explanation: "Double 'l', double 'n'." },
  { id: 'fs-17', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Pharoah", "Pharao", "Pharaoh", "Pheroah"], correctAnswer: 2, explanation: "Ends in -aoh." },
  { id: 'fs-18', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Ecstacy", "Extasy", "Ecstasy", "Estacy"], correctAnswer: 2, explanation: "Ends in -sy." },
  { id: 'fs-19', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Pronunciation", "Pronounciation", "Pronunsiation", "Protonciation"], correctAnswer: 0, explanation: "No 'o' in the second syllable (unlike 'pronounce')." },
  { id: 'fs-20', category: Category.SPELLING, questionText: "Identify the correct spelling:", options: ["Supercede", "Supersede", "Superseed", "Superceed"], correctAnswer: 1, explanation: "The only word ending in -sede." },
  { id: 'fs-21', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Calendar", "Receipt", "Believe", "Doubtfull"], correctAnswer: 3, explanation: "Doubtful only has one 'l' at the end." },
  { id: 'fs-22', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Foreign", "Height", "Arguement", "Library"], correctAnswer: 2, explanation: "Argument drops the 'e' from 'argue'." },
  { id: 'fs-23', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Absence", "Gratefull", "License", "Weather"], correctAnswer: 1, explanation: "Grateful is spelled with one 'l'." },
  { id: 'fs-24', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Noticeable", "Truely", "Until", "Business"], correctAnswer: 1, explanation: "Truly drops the 'e' from 'true'." },
  { id: 'fs-25', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Acommodate", "Across", "Against", "Always"], correctAnswer: 0, explanation: "Accommodate needs two 'c's and two 'm's." },
  { id: 'fs-26', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Beginning", "Believe", "Bicycle", "Britian"], correctAnswer: 3, explanation: "Britain ends in -ain." },
  { id: 'fs-27', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Chief", "Colleague", "Coming", "Comittee"], correctAnswer: 3, explanation: "Committee has double 'm', double 't', and double 'e'." },
  { id: 'fs-28', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Decieve", "Decision", "Describe", "Dining"], correctAnswer: 0, explanation: "Deceive follows the 'i before e except after c' rule." },
  { id: 'fs-29', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Disappear", "Disappoint", "Dicipline", "Disease"], correctAnswer: 2, explanation: "Discipline includes a 'sc' after the 'di'." },
  { id: 'fs-30', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Eight", "Either", "Equiptment", "Exaggerate"], correctAnswer: 2, explanation: "Equipment does not have a 't' before the 'ment'." },
  { id: 'fs-31', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Excellent", "Exercise", "Existance", "Experience"], correctAnswer: 2, explanation: "Existence ends in -ence." },
  { id: 'fs-32', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["February", "Finally", "Foreign", "Fourty"], correctAnswer: 3, explanation: "Forty drops the 'u' (unlike 'four')." },
  { id: 'fs-33', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Friend", "Grammer", "Guarantee", "Guard"], correctAnswer: 1, explanation: "Grammar ends in -ar." },
  { id: 'fs-34', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Happened", "Health", "Hankerchief", "History"], correctAnswer: 2, explanation: "Handkerchief has a 'd' (think of a hand)." },
  { id: 'fs-35', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Imediately", "Independent", "Interrupt", "Island"], correctAnswer: 0, explanation: "Immediately needs two 'm's." },
  { id: 'fs-36', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Knowledge", "Laboratory", "Length", "Lightening"], correctAnswer: 3, explanation: "Lightning (the flash) has no 'e' after the 't'." },
  { id: 'fs-37', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Maintenance", "Marriage", "Medicin", "Minute"], correctAnswer: 2, explanation: "Medicine ends in -ine." },
  { id: 'fs-38', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Muscle", "Natural", "Niece", "Ninty"], correctAnswer: 3, explanation: "Ninety keeps the 'e' from 'nine'." },
  { id: 'fs-39', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Occasion", "Offered", "Omited", "Opposite"], correctAnswer: 2, explanation: "Omitted needs two 't's." },
  { id: 'fs-40', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Parallel", "Particuler", "Persuade", "Physical"], correctAnswer: 1, explanation: "Particular ends in -ar." },
  { id: 'fs-41', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Pleasant", "Politician", "Posess", "Possible"], correctAnswer: 2, explanation: "Possess has two double 's's (po-ss-e-ss)." },
  { id: 'fs-42', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Preffered", "Prepare", "Probably", "Publicly"], correctAnswer: 0, explanation: "Preferred needs two 'r's in the middle." },
  { id: 'fs-43', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Quiet", "Quite", "Receive", "Recomend"], correctAnswer: 3, explanation: "Recommend has one 'c' and two 'm's." },
  { id: 'fs-44', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Religious", "Remember", "Resisitance", "Restaurant"], correctAnswer: 2, explanation: "Resistance ends in -ance." },
  { id: 'fs-45', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Schedule", "Secretary", "Seperate", "Several"], correctAnswer: 2, explanation: "Separate has 'a rat' in it (sep-a-rate)." },
  { id: 'fs-46', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Sincerly", "Soldier", "Speech", "Stopped"], correctAnswer: 0, explanation: "Sincerely keeps the 'e' from 'sincere'." },
  { id: 'fs-47', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Straight", "Strategy", "Strenght", "Succeed"], correctAnswer: 2, explanation: "Strength ends in -gth." },
  { id: 'fs-48', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Success", "Surprise", "Thorough", "Tommorrow"], correctAnswer: 3, explanation: "Tomorrow has one 'm' and two 'r's." },
  { id: 'fs-49', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Tongue", "Twelve", "Unusal", "Usually"], correctAnswer: 2, explanation: "Unusual has two 'u's in the middle (un-u-su-al)." },
  { id: 'fs-50', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Writing", "Written", "Yield", "Acommodate"], correctAnswer: 3, explanation: "Accommodate needs two 'c's and two 'm's." },
  { id: 'fs-51', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Acquire", "Address", "Alcohol", "Alot"], correctAnswer: 3, explanation: "'A lot' is always two words." },
  { id: 'fs-52', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Amateur", "Analyze", "Anual", "Apparent"], correctAnswer: 2, explanation: "Annual requires two 'n's." },
  { id: 'fs-53', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Arctic", "Argument", "Athletic", "Attendence"], correctAnswer: 3, explanation: "Attendance ends in -ance." },
  { id: 'fs-54', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Barbecue", "Believe", "Benificial", "Breath"], correctAnswer: 2, explanation: "Beneficial uses an 'i' after the 'n'." },
  { id: 'fs-55', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Category", "Cemetery", "Changeable", "Coleshaw"], correctAnswer: 3, explanation: "Coleslaw is the correct spelling." },
  { id: 'fs-56', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Collectable", "Column", "Commitment", "Conscience"], correctAnswer: 0, explanation: "Collectible is standard with an 'i'." },
  { id: 'fs-57', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Consensus", "Cooly", "Copywriter", "Courteous"], correctAnswer: 1, explanation: "Coolly has two 'l's (cool + ly)." },
  { id: 'fs-58', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Definitely", "Desperate", "Deterence", "Develop"], correctAnswer: 2, explanation: "Deterrence needs two 'r's." },
  { id: 'fs-59', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Difference", "Dilema", "Disappear", "Disastrous"], correctAnswer: 1, explanation: "Dilemma has two 'm's." },
  { id: 'fs-60', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Drunkenness", "Dumbell", "Echoes", "Eighth"], correctAnswer: 1, explanation: "Dumbbell has two 'b's." },
  { id: 'fs-61', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Eligible", "Envelop", "Equipt", "Exceed"], correctAnswer: 2, explanation: "The correct spelling is 'Equipped'." },
  { id: 'fs-62', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Existence", "Experience", "Fary", "Fiery"], correctAnswer: 2, explanation: "Fairy is spelled f-a-i-r-y." },
  { id: 'fs-63', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Fluorescent", "Foreign", "Forfeit", "Fullfill"], correctAnswer: 3, explanation: "Fulfill is the standard spelling." },
  { id: 'fs-64', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Gauge", "Grateful", "Grievous", "Guidence"], correctAnswer: 3, explanation: "Guidance ends in -ance." },
  { id: 'fs-65', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Harass", "Hierarchy", "Humorous", "Idiosyncracy"], correctAnswer: 3, explanation: "Idiosyncrasy ends in -asy." },
  { id: 'fs-66', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Ignorance", "Imediate", "Independent", "Indispensable"], correctAnswer: 1, explanation: "Immediate needs two 'm's." },
  { id: 'fs-67', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Inoculate", "Intelligence", "Jewelery", "Judgment"], correctAnswer: 2, explanation: "Jewelry is the standard spelling." },
  { id: 'fs-68', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Kernel", "Leisure", "Liaison", "Lieutennant"], correctAnswer: 3, explanation: "Lieutenant is the correct spelling." },
  { id: 'fs-69', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Lightning", "Loose", "Lose", "Maintainance"], correctAnswer: 3, explanation: "Maintenance changes the 'ai' to an 'e'." },
  { id: 'fs-70', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Manoeuvre", "Millennium", "Miniature", "Mischeivous"], correctAnswer: 3, explanation: "Mischievous follows 'i' before 'e'." },
  { id: 'fs-71', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Misspell", "Neighbor", "Noticeable", "Occasionly"], correctAnswer: 3, explanation: "Occasionally needs two 'l's." },
  { id: 'fs-72', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Occurrence", "Omission", "Original", "Outragous"], correctAnswer: 3, explanation: "Outrageous keeps the 'e' from 'outrage'." },
  { id: 'fs-73', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Parliament", "Pavilion", "Perceive", "Persistance"], correctAnswer: 3, explanation: "Persistence ends in -ence." },
  { id: 'fs-74', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Personnel", "Playwright", "Possession", "Potatoe"], correctAnswer: 3, explanation: "Potato has no 'e' at the end." },
  { id: 'fs-75', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Precede", "Presence", "Priviledge", "Professor"], correctAnswer: 2, explanation: "Privilege has no 'd'." },
  { id: 'fs-76', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Publicly", "Questionnaire", "Quarentine", "Queue"], correctAnswer: 2, explanation: "Quarantine is spelled with an 'a'." },
  { id: 'fs-77', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Realize", "Reciept", "Recommend", "Referred"], correctAnswer: 1, explanation: "Receipt follows 'i before e except after c'." },
  { id: 'fs-78', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Relevant", "Religious", "Repetition", "Restarant"], correctAnswer: 3, explanation: "Restaurant includes 'au' (rest-au-rant)." },
  { id: 'fs-79', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Rhyme", "Rhythm", "Schedule", "Sissors"], correctAnswer: 3, explanation: "Scissors starts with 'sc'." },
  { id: 'fs-80', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Sensible", "Separate", "Siege", "Sincerly"], correctAnswer: 3, explanation: "Sincerely keeps the 'e' from 'sincere'." },
  { id: 'fs-81', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Successful", "Supersede", "Suprise", "Temperature"], correctAnswer: 2, explanation: "Surprise has an 'r' in the first syllable (sur-prise)." },
  { id: 'fs-82', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Their", "Thorough", "Threshold", "Tommorrow"], correctAnswer: 3, explanation: "Tomorrow has one 'm' and two 'r's." },
  { id: 'fs-83', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Twelfth", "Tyranny", "Unconscious", "Untill"], correctAnswer: 3, explanation: "Until only has one 'l'." },
  { id: 'fs-84', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Vaccum", "Vehicle", "Vicious", "Weather"], correctAnswer: 0, explanation: "Vacuum has one 'c' and two 'u's." },
  { id: 'fs-85', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Wednesday", "Wierd", "Whether", "Welfare"], correctAnswer: 1, explanation: "Weird is an exception to the 'i before e' rule." },
  { id: 'fs-86', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Withdrawal", "Writing", "Yield", "Acomodate"], correctAnswer: 3, explanation: "Accommodate needs two 'c's." },
  { id: 'fs-87', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Abbreviate", "Accessory", "Accidentally", "Aquire"], correctAnswer: 3, explanation: "Acquire needs a 'c' (ac-quire)." },
  { id: 'fs-88', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Acknowledge", "Allegiance", "Alowance", "Ambiguous"], correctAnswer: 2, explanation: "Allowance needs two 'l's." },
  { id: 'fs-89', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Anecdote", "Annihilate", "Anomoly", "Antiseptic"], correctAnswer: 2, explanation: "Anomaly ends in -aly." },
  { id: 'fs-90', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Apparatus", "Apropriate", "Architecture", "Assassination"], correctAnswer: 1, explanation: "Appropriate needs two 'p's." },
  { id: 'fs-91', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Auxillary", "Balloon", "Barbarous", "Beggar"], correctAnswer: 0, explanation: "Auxiliary has only one 'l'." },
  { id: 'fs-92', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Benifited", "Boundary", "Breathtaking", "Brilliant"], correctAnswer: 0, explanation: "Benefited is spelled with an 'e' (bene-fited)." },
  { id: 'fs-93', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Candidate", "Carribean", "Characteristic", "Chauffeur"], correctAnswer: 1, explanation: "Caribbean has one 'r' and two 'b's." },
  { id: 'fs-94', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Chysanthemum", "Circuit", "Coincidence", "Colonel"], correctAnswer: 0, explanation: "Chrysanthemum starts with 'chry'." },
  { id: 'fs-95', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Commemorate", "Commence", "Comission", "Comparison"], correctAnswer: 2, explanation: "Commission needs two 'm's." },
  { id: 'fs-96', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Competant", "Competition", "Conceivable", "Condemn"], correctAnswer: 0, explanation: "Competent ends in -ent." },
  { id: 'fs-97', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Conscience", "Conscientious", "Conscious", "Consistancy"], correctAnswer: 3, explanation: "Consistency ends in -ency." },
  { id: 'fs-98', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Controversial", "Convenience", "Corespondence", "Counterfeit"], correctAnswer: 2, explanation: "Correspondence needs two 'r's." },
  { id: 'fs-99', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Courageous", "Criticism", "Cruelty", "Curiocity"], correctAnswer: 3, explanation: "Curiosity is spelled with an 's'." },
  { id: 'fs-100', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Decieve", "Defendant", "Deferred", "Definite"], correctAnswer: 0, explanation: "Deceive follows the 'i before e except after c' rule." },
  { id: 'fs-101', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Definiton", "Delegated", "Deliberate", "Delirious"], correctAnswer: 0, explanation: "Definition has an 'i' in the third syllable (def-i-ni-tion)." },
  { id: 'fs-102', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Dependant", "Descendant", "Desirable", "Desperate"], correctAnswer: 0, explanation: "Dependent ends in -ent." },
  { id: 'fs-103', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Deteriorate", "Development", "Dictionary", "Differance"], correctAnswer: 3, explanation: "Difference ends in -ence." },
  { id: 'fs-104', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Delapidated", "Diphtheria", "Disappear", "Disappoint"], correctAnswer: 0, explanation: "Dilapidated starts with 'di'." },
  { id: 'fs-105', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Disastrous", "Disciple", "Dicipline", "Discussed"], correctAnswer: 2, explanation: "Discipline has a 'sc'." },
  { id: 'fs-106', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Disease", "Dispatch", "Disatisfied", "Dissipate"], correctAnswer: 2, explanation: "Dissatisfied needs two 's's (dis + satisfied)." },
  { id: 'fs-107', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Distinction", "Dividant", "Divine", "Division"], correctAnswer: 1, explanation: "Dividend ends in -end." },
  { id: 'fs-108', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Dormatary", "Drastic", "Drought", "Duplicate"], correctAnswer: 0, explanation: "Dormitory is spelled with an 'i' (dorm-i-tory)." },
  { id: 'fs-109', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Economical", "Efficiency", "Eighteen", "Eligable"], correctAnswer: 3, explanation: "Eligible ends in -ible." },
  { id: 'fs-110', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Eliminate", "Embarasment", "Emergency", "Eminent"], correctAnswer: 1, explanation: "Embarrassment has two 'r's and two 's's." },
  { id: 'fs-111', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Emphasis", "Encourage", "Endeavor", "Enthousiastic"], correctAnswer: 3, explanation: "Enthusiastic does not have an 'o' (en-thu-si-astic)." },
  { id: 'fs-112', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Enviroment", "Equilibrium", "Equipped", "Erroneous"], correctAnswer: 0, explanation: "Environment needs an 'n' before the 'm'." },
  { id: 'fs-113', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Especially", "Essential", "Etiquette", "Exagerate"], correctAnswer: 3, explanation: "Exaggerate needs two 'g's." },
  { id: 'fs-114', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Excellence", "Exceptional", "Exaust", "Exhibition"], correctAnswer: 2, explanation: "Exhaust needs an 'h'." },
  { id: 'fs-115', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Exhilaration", "Existence", "Expedition", "Expell"], correctAnswer: 3, explanation: "Expel has only one 'l'." },
  { id: 'fs-116', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Expensive", "Experience", "Experiment", "Explaination"], correctAnswer: 3, explanation: "Explanation drops the 'i' from 'explain'." },
  { id: 'fs-117', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Extention", "Extremely", "Fallacy", "Familiar"], correctAnswer: 0, explanation: "Extension is spelled with an 's'." },
  { id: 'fs-118', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Fascinate", "Feasable", "February", "Fierce"], correctAnswer: 1, explanation: "Feasible ends in -ible." },
  { id: 'fs-119', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Financial", "Forcable", "Forehead", "Foreign"], correctAnswer: 1, explanation: "Forcible is spelled with an 'i'." },
  { id: 'fs-120', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Forfeit", "Fortunately", "Fourty", "Frantically"], correctAnswer: 2, explanation: "Forty is spelled without a 'u'." },
  { id: 'fs-121', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Glamorous", "Governor", "Grarantee", "Grateful"], correctAnswer: 2, explanation: "Guarantee is spelled with a 'u' after the 'g'." },
  { id: 'fs-122', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Harassment", "Harrass", "Heredity", "Hesitant"], correctAnswer: 1, explanation: "Harass has only one 'r' and two 's's." },
  { id: 'fs-123', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Horizontal", "Hygene", "Hypocrisy", "Hypothesis"], correctAnswer: 1, explanation: "Hygiene is spelled with 'ie' after the 'g'." },
  { id: 'fs-124', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Idealize", "Idiosyncrasy", "Ignorance", "Immagination"], correctAnswer: 3, explanation: "Imagination has only one 'm'." },
  { id: 'fs-125', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Imitation", "Immigrate", "Imminent", "Imortality"], correctAnswer: 3, explanation: "Immortality requires two 'm's." },
  { id: 'fs-126', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Inadequate", "Inaugurate", "Incedently", "Inconvenience"], correctAnswer: 2, explanation: "Incidentally is spelled with 'al' before the 'ly'." },
  { id: 'fs-127', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Indefinite", "Independance", "Indispensable", "Inevitable"], correctAnswer: 1, explanation: "Independence ends in -ence." },
  { id: 'fs-128', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Infectious", "Inferior", "Infinitive", "Inflamable"], correctAnswer: 3, explanation: "Inflammable is spelled with two 'm's." },
  { id: 'fs-129', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Influential", "Inheritance", "Innocence", "Inocculate"], correctAnswer: 3, explanation: "Inoculate is spelled with only one 'c'." },
  { id: 'fs-130', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Instinct", "Integrity", "Intellecual", "Intelligence"], correctAnswer: 2, explanation: "Intellectual needs two 'l's." },
  { id: 'fs-131', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Interfere", "Intermitent", "Internal", "Interpret"], correctAnswer: 1, explanation: "Intermittent requires two 't's." },
  { id: 'fs-132', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Interruption", "Invaluable", "Inventory", "Irrevelant"], correctAnswer: 3, explanation: "Relevant (and irrelevant) is spelled with 'el' and then 'ev'." },
  { id: 'fs-133', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Irresistable", "Irritable", "Island", "Itinerary"], correctAnswer: 0, explanation: "Irresistible ends in -ible." },
  { id: 'fs-134', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Jealousy", "Judgemental", "Justifiable", "Kangaroo"], correctAnswer: 1, explanation: "Judgmental (or Judgemental) is often debated, but standard American spelling drops the 'e'." },
  { id: 'fs-135', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Knack", "Knapsack", "Knowledge", "Labatory"], correctAnswer: 3, explanation: "Laboratory is spelled with an 'o' (labor-a-tory)." },
  { id: 'fs-136', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Labyrinth", "Lacquered", "Lamentable", "Languge"], correctAnswer: 3, explanation: "Language is spelled with a 'ua'." },
  { id: 'fs-137', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Lantern", "Larynx", "Latitude", "Legitamate"], correctAnswer: 3, explanation: "Legitimate is spelled with an 'i' in the middle syllable." },
  { id: 'fs-138', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Leisure", "Liability", "Liasion", "Liberal"], correctAnswer: 2, explanation: "Liaison has an 'i' after the 'a'." },
  { id: 'fs-139', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Likeliness", "Liklyhood", "Limitation", "Lineage"], correctAnswer: 1, explanation: "Likelihood is spelled with an 'e' after the 'k'." },
  { id: 'fs-140', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Liquefy", "Literature", "Liveliness", "Lonliness"], correctAnswer: 3, explanation: "Loneliness is spelled with an 'e' after the 'ne'." },
  { id: 'fs-141', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Loathsome", "Longevity", "Lousiana", "Lucrative"], correctAnswer: 2, explanation: "Louisiana requires an 'ou'." },
  { id: 'fs-142', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Luminous", "Luscious", "Magnificence", "Malingerur"], correctAnswer: 3, explanation: "Malingerer ends in -er." },
  { id: 'fs-143', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Management", "Maneuver", "Manefest", "Manipulate"], correctAnswer: 2, explanation: "Manifest is spelled with an 'i'." },
  { id: 'fs-144', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Manufacturer", "Manuscript", "Marathon", "Marraige"], correctAnswer: 3, explanation: "Marriage is spelled with 'ia' (mar-ri-age)." },
  { id: 'fs-145', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Marshmallow", "Masquerade", "Massacree", "Material"], correctAnswer: 2, explanation: "Massacre is spelled with -re at the end." },
  { id: 'fs-146', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Mathematics", "Matinee", "Maximum", "Meantime"], correctAnswer: 1, explanation: "Matinee is spelled with an accent or simply as matinee, but requires 'ee' at the end." },
  { id: 'fs-147', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Mechanical", "Medievil", "Mediocre", "Melancholy"], correctAnswer: 1, explanation: "Medieval is spelled with 'eval' (middle age)." },
  { id: 'fs-148', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Melody", "Membrane", "Memorandum", "Mercinary"], correctAnswer: 3, explanation: "Mercenary ends in -ary." },
  { id: 'fs-149', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Metaphor", "Metropolis", "Microscope", "Milage"], correctAnswer: 3, explanation: "Mileage is spelled with an 'e' after the 'l'." },
  { id: 'fs-150', category: Category.SPELLING, questionText: "Which of the following words is spelled incorrectly?", options: ["Militia", "Millionaire", "Mimick", "Mineral"], correctAnswer: 2, explanation: "Mimic is spelled without a 'k' (unless it becomes mimicking)." }
];

const LOCAL_GRAMMAR_POOL: Question[] = [
  { id: 'lg-1', category: Category.GRAMMAR, questionText: "Select the sentence with the correct modifier placement:", options: ["Running to the bus, the rain soaked my clothes.", "The rain soaked my clothes running to the bus.", "Running to the bus, I was soaked by the rain.", "I was soaked by the rain running to the bus."], correctAnswer: 2, explanation: "The modifier 'Running to the bus' must describe the subject 'I', not 'the rain'." },
  { id: 'lg-2', category: Category.GRAMMAR, questionText: "Identify the error in this sentence: 'Each of the students are responsible for their own locker.'", options: ["No error", "Pronoun agreement (their)", "Spelling error", "Subject-verb agreement (are)"], correctAnswer: 3, explanation: "'Each' is singular, so the verb should be 'is' (and technically pronoun 'his/her', though 'their' is becoming accepted, the verb is the primary academic error)." },
  { id: 'lg-3', category: Category.GRAMMAR, questionText: "Which sentence uses the semicolon correctly?", options: ["I have a big test tomorrow, I can't go out.", "I have a big test tomorrow; and I can't go out.", "I have a big test tomorrow; I can't go out.", "I have a big test tomorrow because; I can't go out."], correctAnswer: 2, explanation: "Semicolons join two independent clauses without a conjunction." },
  { id: 'lg-4', category: Category.GRAMMAR, questionText: "Choose the correct pronoun: 'The award was given to ___ and me.'", options: ["him", "he", "himself", "his"], correctAnswer: 0, explanation: "Object of the preposition 'to' requires the objective case 'him'." },
  { id: 'lg-5', category: Category.GRAMMAR, questionText: "Identify the sentence with parallel structure:", options: ["She likes reading, writing, and to swim.", "She likes reading, to write, and to swim.", "She likes to read, writing, and swimming.", "She likes reading, writing, and swimming."], correctAnswer: 3, explanation: "All items in the list use the gerund (-ing) form." },
  { id: 'lg-6', category: Category.GRAMMAR, questionText: "Which sentence is in the passive voice?", options: ["The chef prepared the meal.", "The chef is preparing the meal.", "The meal was prepared by the chef.", "The chef had prepared the meal."], correctAnswer: 2, explanation: "The subject (meal) receives the action." },
  { id: 'lg-7', category: Category.GRAMMAR, questionText: "Choose the correct word: 'The weather had a negative ___ on the event.'", options: ["effect", "affect", "affected", "effected"], correctAnswer: 0, explanation: "'Effect' is the noun (result); 'Affect' is usually the verb." },
  { id: 'lg-8', category: Category.GRAMMAR, questionText: "Identify the sentence with a dangling modifier:", options: ["While sleeping, the cat snored.", "The cat snored while sleeping.", "While sleeping, the phone rang.", "The phone rang while the cat slept."], correctAnswer: 2, explanation: "'While sleeping' implies the phone was sleeping, which is impossible." },
  { id: 'lg-9', category: Category.GRAMMAR, questionText: "Select the correct comparative form: 'Of the two brothers, John is the ___.'", options: ["smartest", "most smart", "smarter", "more smarter"], correctAnswer: 2, explanation: "When comparing exactly two items, use the comparative (-er), not superlative (-est)." },
  { id: 'lg-10', category: Category.GRAMMAR, questionText: "Which sentence uses 'whom' correctly?", options: ["Who did you invite?", "Whom is coming to dinner?", "To who should I address this?", "Whom did you invite?"], correctAnswer: 3, explanation: "'Whom' is the object of the verb 'invite' (You did invite whom?)." },
  { id: 'lg-11', category: Category.GRAMMAR, questionText: "Correct the run-on: 'The sun is hot put on sunscreen.'", options: ["The sun is hot, put on sunscreen.", "The sun is hot but put on sunscreen.", "The sun is hot; put on sunscreen.", "The sun is hot put on sunscreen."], correctAnswer: 2, explanation: "Use a semicolon to separate two independent clauses." },
  { id: 'lg-12', category: Category.GRAMMAR, questionText: "Identify the subject: 'In the middle of the forest stands a large oak tree.'", options: ["forest", "stands", "tree", "middle"], correctAnswer: 2, explanation: "Inverted sentence structure. The tree stands." },
  { id: 'lg-13', category: Category.GRAMMAR, questionText: "Choose the correct word: 'I have ___ items than you.'", options: ["less", "fewer", "lesser", "fewest"], correctAnswer: 1, explanation: "Use 'fewer' for countable items, 'less' for uncountable concepts." },
  { id: 'lg-14', category: Category.GRAMMAR, questionText: "Select the correct verb form: 'If I ___ you, I would study harder.'", options: ["were", "was", "am", "be"], correctAnswer: 0, explanation: "Subjunctive mood expresses a hypothetical condition; use 'were'." },
  { id: 'lg-15', category: Category.GRAMMAR, questionText: "Identify the error: 'Driving down the street, the house looked beautiful.'", options: ["Comma splice", "Dangling modifier", "Run-on sentence", "Passive voice"], correctAnswer: 1, explanation: "The house was not driving down the street." },
  { id: 'lg-16', category: Category.GRAMMAR, questionText: "Choose the correct possessive: 'The ___ toys were everywhere.'", options: ["childrens'", "children's", "childrens", "childrens's"], correctAnswer: 1, explanation: "'Children' is already plural; add 's to make it possessive." },
  { id: 'lg-17', category: Category.GRAMMAR, questionText: "Select the correct sentence:", options: ["My sister who lives in NY is a doctor.", "My sister, that lives in NY, is a doctor.", "My sister, who lives in NY, is a doctor.", "My sister whom lives in NY, is a doctor."], correctAnswer: 2, explanation: "If you have only one sister, the clause is non-essential and needs commas." },
  { id: 'lg-18', category: Category.GRAMMAR, questionText: "Choose the correct word: 'Please ___ the book on the table.'", options: ["lie", "laid", "lain", "lay"], correctAnswer: 3, explanation: "'Lay' means to place something (needs an object); 'Lie' means to recline." },
  { id: 'lg-19', category: Category.GRAMMAR, questionText: "Correct the sentence: 'Me and him went to the park.'", options: ["He and I went to the park.", "Him and I went to the park.", "Me and he went to the park.", "I and he went to the park."], correctAnswer: 0, explanation: "Subjective case pronouns (He, I) are needed for the subject." },
  { id: 'lg-20', category: Category.GRAMMAR, questionText: "Identify the sentence fragment:", options: ["It was raining.", "Since it was raining, we stayed inside.", "Because it was raining.", "The rain fell."], correctAnswer: 2, explanation: "A dependent clause standing alone is a fragment." },
  { id: 'lg-21', category: Category.GRAMMAR, questionText: "Which sentence demonstrates the correct use of the subjunctive mood?", options: ["If I was you, I would accept the offer immediately.", "If I am you, I will accept the offer immediately.", "If I were you, I would accept the offer immediately.", "If I be you, I would accept the offer immediately."], correctAnswer: 2, explanation: "The subjunctive mood, used for contrary-to-fact statements, requires 'were' instead of 'was' with 'I'." },
  { id: 'lg-22', category: Category.GRAMMAR, questionText: "Identify the sentence with the correct use of correlative conjunctions:", options: ["Not only did she finish the project early, and she also reviewed it for errors.", "Not only did she finish the project early, but she also reviewed it for errors.", "She not only finished the project early, but she reviewed it for errors.", "Not only did she finish the project early, but reviewed it for errors."], correctAnswer: 1, explanation: "'Not only... but also' requires parallel structure. The auxiliary 'did' applies to the first part, so the second part needs a subject ('she') to be independent or parallel verb structure." },
  { id: 'lg-23', category: Category.GRAMMAR, questionText: "Choose the sentence containing a misplaced modifier:", options: ["Covered in chocolate, the toddler happily ate the cake.", "The toddler happily ate the cake covered in chocolate.", "The trees looked beautiful as I walked down the street.", "Walking down the street, the trees looked beautiful."], correctAnswer: 3, explanation: "'Walking down the street' modifies 'the trees', suggesting the trees were walking. This is a dangling/misplaced modifier." },
  { id: 'lg-24', category: Category.GRAMMAR, questionText: "Select the sentence with correct subject-verb agreement:", options: ["The number of students in the class are increasing.", "The number of students in the class is increasing.", "A number of students is absent today.", "A numbers of student are absent."], correctAnswer: 1, explanation: "'The number' is singular (refers to the specific count), taking 'is'. 'A number' is plural (meaning 'some'), taking 'are'." },
  { id: 'lg-25', category: Category.GRAMMAR, questionText: "Identify the error in this sentence: 'Whom did you say is coming to the party?'", options: ["is should be are", "coming should be came", "Whom should be Who", "did should be do"], correctAnswer: 2, explanation: "The pronoun is the subject of the verb 'is coming' (Who is coming?), not the object of 'say'. Therefore, 'Who' is correct." },
  { id: 'lg-26', category: Category.GRAMMAR, questionText: "Which sentence correctly uses a semicolon?", options: ["The weather was cold, however; we went hiking.", "The weather was cold however, we went hiking.", "The weather was cold; however we went hiking.", "The weather was cold; however, we went hiking."], correctAnswer: 3, explanation: "Conjunctive adverbs (however, therefore) connecting two independent clauses require a semicolon before and a comma after." },
  { id: 'lg-27', category: Category.GRAMMAR, questionText: "Choose the correct possessive form: 'The ___ hypothesis was confirmed by the data.'", options: ["researcher's-in-charge", "researchers-in-charge", "researcher-in-charge's", "researcher-in-charges"], correctAnswer: 2, explanation: "For compound nouns, the possessive 's is added to the end of the word." },
  { id: 'lg-28', category: Category.GRAMMAR, questionText: "Select the sentence with clear pronoun reference:", options: ["When the teacher spoke to the student, he looked concerned.", "The teacher looked concerned when he spoke to the student.", "The bowl was on the table, and it was empty.", "Mary told Jane that she had won the lottery."], correctAnswer: 2, explanation: "In A, B, and D, the pronouns 'he' or 'she' could refer to either noun. C is unambiguous." },
  { id: 'lg-29', category: Category.GRAMMAR, questionText: "Which sentence uses the correct comparative degree?", options: ["Of the two solutions, this one is the most efficient.", "This solution is more efficient then the other.", "Of the two solutions, this one is the more efficient.", "This is the efficientest of the two."], correctAnswer: 2, explanation: "When comparing exactly two items, use the comparative (-er/more), not the superlative (-est/most)." },
  { id: 'lg-30', category: Category.GRAMMAR, questionText: "Identify the sentence with the correct use of 'lie' or 'lay':", options: ["I am going to lay down for a nap.", "She laid on the beach all day.", "Please lie the paper on the desk.", "The book has lain on the table for weeks."], correctAnswer: 3, explanation: "'Lie' (recline) past participle is 'lain'. 'Lay' (put) requires an object. A is wrong (should be lie). B is wrong (should be lay - past of lie). C is wrong (should be lay)." },
  { id: 'lg-31', category: Category.GRAMMAR, questionText: "Correct the ambiguity: 'Visiting relatives can be boring.'", options: ["To visit relatives can be boring.", "Relatives who are visiting can be boring.", "It is boring to visit relatives.", "All of the above clarify the meaning."], correctAnswer: 3, explanation: "The original sentence is ambiguous: are the relatives boring, or is the act of visiting them boring? All options clarify this." },
  { id: 'lg-32', category: Category.GRAMMAR, questionText: "Select the sentence avoiding a split infinitive:", options: ["She decided to quickly run to the store.", "She decided to, quickly, run to the store.", "She decided to run quickly to the store.", "To quickly run was her decision."], correctAnswer: 2, explanation: "While split infinitives ('to quickly run') are acceptable in modern English, formal academic style often prefers keeping 'to' and the verb together ('to run quickly')." },
  { id: 'lg-33', category: Category.GRAMMAR, questionText: "Which sentence correctly punctuates a restrictive clause?", options: ["The car, which hit the fence, was red.", "The car, that hit the fence, was red.", "The car that hit the fence was red.", "The car which hit the fence was red."], correctAnswer: 2, explanation: "Restrictive clauses (essential to meaning) use 'that' without commas. 'Which' usually indicates a non-restrictive clause with commas." },
  { id: 'lg-34', category: Category.GRAMMAR, questionText: "Identify the error: 'Each of the players must bring their own equipment.'", options: ["must", "Each", "own", "their"], correctAnswer: 3, explanation: "Strictly speaking, 'Each' is singular, so the pronoun should be 'his or her'. 'Their' is widely accepted but academically tested as an error." },
  { id: 'lg-35', category: Category.GRAMMAR, questionText: "Choose the correct sentence:", options: ["Between you and I, the decision is final.", "Between we, the decision is final.", "Between you and me, the decision is final.", "Between I and you, the decision is final."], correctAnswer: 2, explanation: "'Between' is a preposition, so pronouns must be in the objective case ('me', not 'I')." },
  { id: 'lg-36', category: Category.GRAMMAR, questionText: "Select the correct verb: 'The team ___ winning the game.'", options: ["are", "were", "is", "have been"], correctAnswer: 2, explanation: "In American English, collective nouns like 'team' are treated as singular unless the members are acting individually." },
  { id: 'lg-37', category: Category.GRAMMAR, questionText: "Which sentence uses 'fewer' correctly?", options: ["I have less dollars than you.", "I have fewer dollars than you.", "There is fewer water in the glass.", "There are less students in the class."], correctAnswer: 1, explanation: "'Fewer' is for countable nouns (dollars, students); 'Less' is for uncountable nouns (water, money)." },
  { id: 'lg-38', category: Category.GRAMMAR, questionText: "Identify the run-on sentence:", options: ["The sun set; the moon rose.", "The sun set, the moon rose.", "The sun set, and the moon rose.", "Because the sun set, the moon rose."], correctAnswer: 1, explanation: "Option B is a comma splice (joining two independent clauses with only a comma). It requires a conjunction or semicolon." },
  { id: 'lg-39', category: Category.GRAMMAR, questionText: "Choose the sentence with correct parallel structure:", options: ["She enjoys hiking, swimming, and to run.", "She enjoys to hike, swimming, and running.", "She enjoys to hike, to swim, and running.", "She enjoys hiking, swimming, and running."], correctAnswer: 3, explanation: "All items in the list must be in the same form (gerunds: -ing)." },
  { id: 'lg-40', category: Category.GRAMMAR, questionText: "Correct the sentence: 'Being a doctor, the patient's health was his priority.'", options: ["As a doctor, the patient's health was his priority.", "The patient's health was his priority, being a doctor.", "Being a doctor, he prioritized the patient's health.", "The patient's health, being a doctor, was his priority."], correctAnswer: 2, explanation: "The modifier 'Being a doctor' must describe the subject. In the original, it modifies 'health'. Option C correctly modifies 'he'." },
  { id: 'lg-41', category: Category.GRAMMAR, questionText: "Which sentence is correctly punctuated?", options: ["Before we eat, the dog must be fed.", "Before we eat the dog must be fed.", "Before, we eat the dog must be fed.", "Before we eat the dog, must be fed."], correctAnswer: 0, explanation: "An introductory dependent clause needs a comma after it." },
  { id: 'lg-42', category: Category.GRAMMAR, questionText: "Identify the grammar error: 'If I was taller, I would play basketball.'", options: ["Taller", "I would", "If I was", "Basketball"], correctAnswer: 2, explanation: "Contrary-to-fact 'if' clauses require the subjunctive mood: 'If I were'." },
  { id: 'lg-43', category: Category.GRAMMAR, questionText: "Which sentence uses an Oxford comma correctly?", options: ["I bought bread, milk and eggs.", "I bought bread, milk, and eggs.", "I bought bread, milk, and, eggs.", "I bought bread, milk and, eggs."], correctAnswer: 1, explanation: "The Oxford comma appears before the final conjunction in a list." },
  { id: 'lg-44', category: Category.GRAMMAR, questionText: "Select the sentence with the comma error:", options: ["He went to the store, and bought some apples.", "He went to the store and bought some apples.", "He went to the store, and he bought some apples.", "He went to the store; he bought some apples."], correctAnswer: 0, explanation: "Do not use a comma before 'and' when it only joins two verbs (compound predicate)." },
  { id: 'lg-45', category: Category.GRAMMAR, questionText: "Identify the comma splice:", options: ["The movie was great; I loved it.", "The movie was great, and I loved it.", "The movie was great, I loved it.", "The movie was great because I loved it."], correctAnswer: 2, explanation: "A comma splice occurs when two independent clauses are joined only by a comma." },
  { id: 'lg-46', category: Category.GRAMMAR, questionText: "Choose the correct punctuation: 'Yes ___ I will be there.'", options: ["Yes,", "Yes;", "Yes.", "Yes!"], correctAnswer: 0, explanation: "Use a comma to set off introductory words like 'Yes' or 'No'." },
  { id: 'lg-47', category: Category.GRAMMAR, questionText: "Identify the error: 'The book, that I borrowed, was excellent.'", options: ["The book,", "that I borrowed,", "excellent", "No error"], correctAnswer: 1, explanation: "Restrictive clauses starting with 'that' should not be set off by commas." },
  { id: 'lg-48', category: Category.GRAMMAR, questionText: "Which sentence correctly sets off an appositive?", options: ["My brother, a talented artist, is visiting.", "My brother a talented artist is visiting.", "My brother a talented artist, is visiting.", "My, brother a talented artist is visiting."], correctAnswer: 0, explanation: "Appositives (renaming the noun) must be enclosed in commas if they are non-essential." },
  { id: 'lg-49', category: Category.GRAMMAR, questionText: "Identify the error: 'He is the most strongest man I know.'", options: ["He is", "most strongest", "man", "No error"], correctAnswer: 1, explanation: "Double superlatives (most + -est) are incorrect. Use 'strongest'." },
  { id: 'lg-50', category: Category.GRAMMAR, questionText: "Which sentence correctly addresses someone?", options: ["Happy birthday, Sarah!", "Happy birthday Sarah!", "Happy, birthday Sarah!", "Happy birthday Sarah,"], correctAnswer: 0, explanation: "Use a comma to set off a noun of direct address." },
  { id: 'lg-51', category: Category.GRAMMAR, questionText: "Where is the comma missing: 'We went to Paris France last summer.'", options: ["After Paris", "After France", "After summer", "No comma needed"], correctAnswer: 0, explanation: "Place a comma between a city and its country or state." },
  { id: 'lg-52', category: Category.GRAMMAR, questionText: "Which is a correctly punctuated compound sentence?", options: ["I like tea but he likes coffee.", "I like tea, but he likes coffee.", "I like tea; but he likes coffee.", "I like tea, but, he likes coffee."], correctAnswer: 1, explanation: "A comma is required before a coordinating conjunction that joins two independent clauses." },
  { id: 'lg-53', category: Category.GRAMMAR, questionText: "Identify the error: 'Neither of the boys have seen the movie.'", options: ["Neither", "of the boys", "have seen", "No error"], correctAnswer: 2, explanation: "'Neither' is a singular pronoun and requires the singular verb 'has'." },
  { id: 'lg-54', category: Category.GRAMMAR, questionText: "Which sentence uses commas correctly with adjectives?", options: ["He wore a heavy, wool coat.", "He wore a heavy wool, coat.", "He wore a, heavy wool coat.", "He wore a heavy wool coat."], correctAnswer: 3, explanation: "Cumulative adjectives (heavy and wool) do not need a comma because you wouldn't say 'wool heavy coat'." },
  { id: 'lg-55', category: Category.GRAMMAR, questionText: "Which sentence uses commas correctly with coordinate adjectives?", options: ["It was a long, difficult road.", "It was a long difficult road.", "It was a long difficult, road.", "It was a, long difficult road."], correctAnswer: 0, explanation: "Coordinate adjectives (you can say 'long AND difficult') require a comma." },
  { id: 'lg-56', category: Category.GRAMMAR, questionText: "Identify the error: 'The cake tasted deliciously.'", options: ["The", "cake", "tasted", "deliciously"], correctAnswer: 3, explanation: "Linking verbs like 'tasted' or 'looked' should be followed by an adjective ('delicious'), not an adverb." },
  { id: 'lg-57', category: Category.GRAMMAR, questionText: "Identify the misplaced comma: 'I want, to go home now.'", options: ["After I", "After want", "After go", "After home"], correctAnswer: 1, explanation: "Do not place a comma between a verb and its infinitive object." },
  { id: 'lg-58', category: Category.GRAMMAR, questionText: "Which sentence handles a date correctly?", options: ["On July 4 1776, the document was signed.", "On July 4, 1776 the document was signed.", "On July 4, 1776, the document was signed.", "On July, 4 1776 the document was signed."], correctAnswer: 2, explanation: "Commas go after the day and the year in a full date." },
  { id: 'lg-59', category: Category.GRAMMAR, questionText: "Select the sentence with correct parallel structure:", options: ["The coach told us to work hard, play fair, and that we should win.", "The coach told us to work hard, playing fair, and winning.", "The coach told us to work hard, play fair, and win.", "The coach told us to work hard, play fair, and for us to win."], correctAnswer: 2, explanation: "Items in a list should share the same grammatical form (to work, [to] play, [to] win)." },
  { id: 'lg-60', category: Category.GRAMMAR, questionText: "Identify the error: 'Between you and I, this is a secret.'", options: ["Between", "you", "and I", "secret"], correctAnswer: 2, explanation: "'Between' is a preposition; the pronoun must be objective case ('me')." },
  { id: 'lg-61', category: Category.GRAMMAR, questionText: "Where should the comma go: 'After all he is only human.'", options: ["After all", "After he", "After only", "After human"], correctAnswer: 0, explanation: "Use a comma after an introductory phrase like 'After all'." },
  { id: 'lg-62', category: Category.GRAMMAR, questionText: "Which is a correct way to fix a run-on sentence?", options: ["Period", "Semicolon", "Comma + Coordinating Conjunction", "All of the above"], correctAnswer: 3, explanation: "Run-ons can be fixed by separating the clauses or joining them properly." },
  { id: 'lg-63', category: Category.GRAMMAR, questionText: "Identify the error: 'One of my friends are moving today.'", options: ["One", "my friends", "are moving", "today"], correctAnswer: 2, explanation: "The subject is 'One', which is singular. The verb should be 'is moving'." },
  { id: 'lg-64', category: Category.GRAMMAR, questionText: "Which sentence correctly uses commas in a series?", options: ["Red white and blue.", "Red, white and blue.", "Red, white, and blue.", "Both B and C"], correctAnswer: 3, explanation: "While the Oxford comma (C) is standard in academic writing, the style without it (B) is common in journalism." },
  { id: 'lg-65', category: Category.GRAMMAR, questionText: "Identify the comma error in this sentence: 'Wait, for me, please.'", options: ["After Wait", "After me", "No error", "After please"], correctAnswer: 1, explanation: "The comma after 'me' is unnecessary and interrupts the flow of the imperative sentence." },
  { id: 'lg-66', category: Category.GRAMMAR, questionText: "Which sentence is correctly punctuated?", options: ["He said, 'Hello.'", "He said 'Hello'.", "He said 'Hello.'", "He said, 'Hello'."], correctAnswer: 0, explanation: "Commas set off direct quotes, and periods usually go inside the quotation marks." },
  { id: 'lg-67', category: Category.GRAMMAR, questionText: "Identify the error: 'The team lost because they played bad.'", options: ["lost", "because", "they", "bad"], correctAnswer: 3, explanation: "The verb 'played' should be modified by the adverb 'badly'." },
  { id: 'lg-68', category: Category.GRAMMAR, questionText: "Which sentence correctly sets off a year?", options: ["In 1999 the world didn't end.", "In 1999, the world didn't end.", "In, 1999 the world didn't end.", "In 1999 the world, didn't end."], correctAnswer: 1, explanation: "A comma is used after an introductory year or time phrase." },
  { id: 'lg-69', category: Category.GRAMMAR, questionText: "Identify the error: 'I feel more better today.'", options: ["I feel", "more better", "today", "No error"], correctAnswer: 1, explanation: "Better is already a comparative; 'more' is redundant (double comparative)." },
  { id: 'lg-70', category: Category.GRAMMAR, questionText: "Select the sentence with correct punctuation:", options: ["You are coming, aren't you?", "You are coming aren't you?", "You are coming, aren't you.", "You are coming; aren't you?"], correctAnswer: 0, explanation: "Tag questions are set off by commas and end with a question mark." },
  { id: 'lg-71', category: Category.GRAMMAR, questionText: "Identify the error: 'Everyone should do their best.'", options: ["Everyone", "should", "do", "their"], correctAnswer: 3, explanation: "Academically, 'everyone' is singular and requires 'his or her'. (Though 'their' is used in casual speech)." },
  { id: 'lg-72', category: Category.GRAMMAR, questionText: "Where is the comma missing: 'I need to go home for I am tired.'", options: ["After go", "After home", "After for", "No comma needed"], correctAnswer: 1, explanation: "Use a comma before 'for' when it acts as a coordinating conjunction (meaning 'because')." },
  { id: 'lg-73', category: Category.GRAMMAR, questionText: "Which sentence correctly punctuates 'however' as an interrupter?", options: ["The truth, however, is quite different.", "The truth however is quite different.", "The truth; however is quite different.", "The truth however, is quite different."], correctAnswer: 0, explanation: "Interrupters in the middle of a sentence should be enclosed in commas." },
  { id: 'lg-74', category: Category.GRAMMAR, questionText: "Identify the error: 'Whose going to the store?'", options: ["Whose", "going", "store", "No error"], correctAnswer: 0, explanation: "'Whose' is possessive. Use 'Who's' (contraction of 'Who is')." },
  { id: 'lg-75', category: Category.GRAMMAR, questionText: "Select the correct sentence:", options: ["Walking through the door, the cat escaped.", "Walking through the door, I let the cat escape.", "The cat escaped, walking through the door.", "Walking through the door the cat escaped."], correctAnswer: 1, explanation: "The person walking through the door is 'I', not 'the cat'." },
  { id: 'lg-76', category: Category.GRAMMAR, questionText: "Identify the error: 'They invited my wife and I.'", options: ["They", "invited", "my wife", "and I"], correctAnswer: 3, explanation: "The pronoun is the object of the verb 'invited'; use 'me'." },
  { id: 'lg-77', category: Category.GRAMMAR, questionText: "Which is correctly punctuated?", options: ["Nevertheless, we must move on.", "Nevertheless we must move on.", "Nevertheless we must, move on.", "Nevertheless; we must move on."], correctAnswer: 0, explanation: "Introductory adverbs like 'Nevertheless' or 'Consequently' require a comma." },
  { id: 'lg-78', category: Category.GRAMMAR, questionText: "Identify the error: 'The scissors is on the table.'", options: ["The", "scissors", "is", "No error"], correctAnswer: 2, explanation: "'Scissors' is a plural noun and requires the verb 'are'." },
  { id: 'lg-79', category: Category.GRAMMAR, questionText: "Where should the comma go: 'No you cannot go out tonight.'", options: ["After No", "After you", "After out", "After tonight"], correctAnswer: 0, explanation: "Introductory 'No' is followed by a comma." },
  { id: 'lg-80', category: Category.GRAMMAR, questionText: "Identify the subject-verb agreement error:", options: ["The cats sleep.", "The cat sleep.", "The cat sleeps.", "The cats are sleeping."], correctAnswer: 1, explanation: "Singular 'cat' needs the singular verb 'sleeps'." },
  { id: 'lg-81', category: Category.GRAMMAR, questionText: "Which is correct for a non-essential clause?", options: ["My bike, that is blue, is fast.", "My bike that is blue is fast.", "My bike which is blue is fast.", "My bike, which is blue, is fast."], correctAnswer: 3, explanation: "Non-essential clauses use 'which' and require commas." },
  { id: 'lg-82', category: Category.GRAMMAR, questionText: "Identify the error: 'The problem is between he and she.'", options: ["problem", "between", "he", "and she"], correctAnswer: 2, explanation: "Objects of prepositions must be in the objective case: 'him and her'." },
  { id: 'lg-83', category: Category.GRAMMAR, questionText: "Which sentence correctly punctuates a long introductory phrase?", options: ["To find the hidden treasure, you must follow the map.", "To find the hidden treasure you must follow the map.", "To find, the hidden treasure you must follow the map.", "To find the hidden treasure you must follow, the map."], correctAnswer: 0, explanation: "A comma should follow an introductory infinitive phrase." },
  { id: 'lg-84', category: Category.GRAMMAR, questionText: "Identify the error: 'I could of gone if I had known.'", options: ["could of", "gone", "if", "known"], correctAnswer: 0, explanation: "The correct construction is 'could have'." },
  { id: 'lg-85', category: Category.GRAMMAR, questionText: "Select the sentence with the correct comma use:", options: ["We visited London, and Rome.", "We visited London and Rome.", "We, visited London and Rome.", "We visited London, and, Rome."], correctAnswer: 1, explanation: "No comma is needed to join two nouns (London and Rome)." },
  { id: 'lg-86', category: Category.GRAMMAR, questionText: "Identify the error: 'She is the tallest of the two.'", options: ["She", "is", "tallest", "of the two"], correctAnswer: 2, explanation: "Use 'taller' when comparing two people." },
  { id: 'lg-87', category: Category.GRAMMAR, questionText: "Where is the comma missing: 'Although it was late we finished.'", options: ["After although", "After late", "After finished", "No comma needed"], correctAnswer: 1, explanation: "Introductory dependent clauses (starting with 'Although') require a comma." },
  { id: 'lg-88', category: Category.GRAMMAR, questionText: "Identify the error: 'The student's all failed.'", options: ["student's", "all", "failed", "No error"], correctAnswer: 0, explanation: "'Student's' is possessive; the sentence needs the plural 'students'." },
  { id: 'lg-89', category: Category.GRAMMAR, questionText: "Which sentence correctly sets off a name in direct address?", options: ["Listen closely, class.", "Listen closely class.", "Listen, closely class.", "Listen closely class!"], correctAnswer: 0, explanation: "Commas set off the group being addressed." },
  { id: 'lg-90', category: Category.GRAMMAR, questionText: "Identify the error: 'There is many ways to solve this.'", options: ["There", "is", "many", "ways"], correctAnswer: 1, explanation: "The subject 'ways' is plural, so the verb should be 'are'." },
  { id: 'lg-91', category: Category.GRAMMAR, questionText: "Which sentence uses 'literally' correctly?", options: ["I literally died laughing.", "He literally flew to the store.", "The water was literally boiling.", "She literally has a heart of gold."], correctAnswer: 2, explanation: "Literally should be used for things that actually happen exactly as stated." },
  { id: 'lg-92', category: Category.GRAMMAR, questionText: "Identify the error: 'They are more smarter than us.'", options: ["They are", "more smarter", "than", "us"], correctAnswer: 1, explanation: "Double comparative: 'smarter' is sufficient." },
  { id: 'lg-93', category: Category.GRAMMAR, questionText: "Which is a correctly punctuated address?", options: ["I live at 123 Main St Austin, Texas.", "I live at 123 Main St, Austin Texas.", "I live at 123 Main St, Austin, Texas.", "I live at 123 Main St Austin Texas."], correctAnswer: 2, explanation: "Place commas between street, city, and state." },
  { id: 'lg-94', category: Category.GRAMMAR, questionText: "Identify the error: 'Neither the dogs nor the cat are hungry.'", options: ["Neither", "nor", "cat", "are"], correctAnswer: 3, explanation: "With 'neither/nor', the verb agrees with the closer subject ('cat'), which is singular: 'is'." },
  { id: 'lg-95', category: Category.GRAMMAR, questionText: "Which is correctly punctuated?", options: ["Yes, I think so.", "Yes I think so.", "Yes; I think so.", "Yes. I think so."], correctAnswer: 0, explanation: "Introductory words like 'Yes' are followed by a comma." },
  { id: 'lg-96', category: Category.GRAMMAR, questionText: "Identify the error: 'This is the most unique vase.'", options: ["This is", "most unique", "vase", "No error"], correctAnswer: 1, explanation: "'Unique' means one-of-a-kind and cannot be compared; it is an absolute adjective." },
  { id: 'lg-97', category: Category.GRAMMAR, questionText: "Where should the comma go: 'Please bring me a pen Mary.'", options: ["After pen", "After please", "After me", "No comma needed"], correctAnswer: 0, explanation: "Direct address 'Mary' requires a comma before it." },
  { id: 'lg-98', category: Category.GRAMMAR, questionText: "Identify the error: 'It's tail is wagging.'", options: ["It's", "tail", "is", "wagging"], correctAnswer: 0, explanation: "'It's' is 'it is'. Use 'Its' for possession." },
  { id: 'lg-99', category: Category.GRAMMAR, questionText: "Select the correctly punctuated list:", options: ["Apples oranges and pears.", "Apples, oranges, pears.", "Apples, oranges, and pears.", "Apples, oranges and, pears."], correctAnswer: 2, explanation: "Standard list punctuation requires commas between items." },
  { id: 'lg-100', category: Category.GRAMMAR, questionText: "Identify the error: 'I am doing good in math.'", options: ["I am", "doing", "good", "math"], correctAnswer: 2, explanation: "'Good' is an adjective; 'well' is the adverb needed to modify the verb 'doing'." }
];

const LOCAL_MATH_POOL: Question[] = [
  { id: 'lm-1', category: Category.MATH, questionText: "Solve for x: 3(x - 4) = 2x + 5", options: ["17", "12", "9", "-7"], correctAnswer: 0, explanation: "3x - 12 = 2x + 5 -> x = 17." },
  { id: 'lm-2', category: Category.MATH, questionText: "What is the slope of the line passing through (2, 5) and (4, 11)?", options: ["2", "4", "3", "6"], correctAnswer: 2, explanation: "Slope = (y2 - y1) / (x2 - x1) = (11 - 5) / (4 - 2) = 6 / 2 = 3." },
  { id: 'lm-3', category: Category.MATH, questionText: "If a circle has a radius of 4, what is its area?", options: ["4π", "8π", "32π", "16π"], correctAnswer: 3, explanation: "Area = πr² = π(4)² = 16π." },
  { id: 'lm-4', category: Category.MATH, questionText: "Simplify: (2x³)(4x²)", options: ["6x⁵", "8x⁶", "8x⁵", "6x⁶"], correctAnswer: 2, explanation: "Multiply coefficients (2*4=8) and add exponents (3+2=5)." },
  { id: 'lm-5', category: Category.MATH, questionText: "A shirt is originally $40 and is on sale for 20% off. What is the sale price?", options: ["$30", "$35", "$28", "$32"], correctAnswer: 3, explanation: "20% of 40 is 8. 40 - 8 = 32." },
  { id: 'lm-6', category: Category.MATH, questionText: "Solve the system: y = 2x and y = x + 4", options: ["(2, 4)", "(3, 6)", "(4, 8)", "(4, 4)"], correctAnswer: 2, explanation: "Set 2x = x + 4, so x = 4. Then y = 2(4) = 8." },
  { id: 'lm-7', category: Category.MATH, questionText: "What is the probability of rolling a sum of 7 with two six-sided dice?", options: ["1/12", "1/6", "1/36", "5/36"], correctAnswer: 1, explanation: "Pairs: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). 6 pairs out of 36 total outcomes = 6/36 = 1/6." },
  { id: 'lm-8', category: Category.MATH, questionText: "What is the value of 5! (5 factorial)?", options: ["15", "120", "50", "100"], correctAnswer: 1, explanation: "5 * 4 * 3 * 2 * 1 = 120." },
  { id: 'lm-9', category: Category.MATH, questionText: "If f(x) = 2x² - 3x + 1, find f(-2).", options: ["3", "-1", "15", "-13"], correctAnswer: 2, explanation: "2(-2)² - 3(-2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15." },
  { id: 'lm-10', category: Category.MATH, questionText: "The sum of three consecutive integers is 45. What is the largest integer?", options: ["14", "15", "17", "16"], correctAnswer: 3, explanation: "x + (x+1) + (x+2) = 45 -> 3x + 3 = 45 -> 3x = 42 -> x = 14. Integers are 14, 15, 16." },
  { id: 'lm-11', category: Category.MATH, questionText: "What is the hypotenuse of a right triangle with legs 5 and 12?", options: ["15", "13", "17", "14"], correctAnswer: 1, explanation: "a² + b² = c². 25 + 144 = 169. √169 = 13." },
  { id: 'lm-12', category: Category.MATH, questionText: "Simplify: √75", options: ["3√5", "25√3", "15", "5√3"], correctAnswer: 3, explanation: "√75 = √(25 * 3) = 5√3." },
  { id: 'lm-13', category: Category.MATH, questionText: "Factor the expression: x² - 9", options: ["(x-3)(x-3)", "(x+3)(x+3)", "(x-3)(x+3)", "(x-9)(x+1)"], correctAnswer: 2, explanation: "Difference of squares: a² - b² = (a-b)(a+b)." },
  { id: 'lm-14', category: Category.MATH, questionText: "Find the median of the set: 2, 5, 9, 3, 5, 4", options: ["4", "5", "3", "4.5"], correctAnswer: 3, explanation: "Order: 2, 3, 4, 5, 5, 9. Middle two are 4 and 5. Average is 4.5." },
  { id: 'lm-15', category: Category.MATH, questionText: "A car travels 150 miles in 3 hours. What is its average speed?", options: ["45 mph", "60 mph", "50 mph", "55 mph"], correctAnswer: 2, explanation: "Speed = Distance / Time = 150 / 3 = 50." },
  { id: 'lm-16', category: Category.MATH, questionText: "What is the value of 2⁻³?", options: ["-6", "-8", "1/6", "1/8"], correctAnswer: 3, explanation: "Negative exponent means reciprocal: 1/(2³) = 1/8." },
  { id: 'lm-17', category: Category.MATH, questionText: "Solve for y: 4y + 2 > 10", options: ["y > 2", "y > 3", "y < 2", "y = 2"], correctAnswer: 0, explanation: "4y > 8 -> y > 2." },
  { id: 'lm-18', category: Category.MATH, questionText: "What is the perimeter of a rectangle with length 8 and width 5?", options: ["40", "13", "26", "20"], correctAnswer: 2, explanation: "P = 2(l + w) = 2(8 + 5) = 2(13) = 26." },
  { id: 'lm-19', category: Category.MATH, questionText: "Simplify: (x + 2)(x + 5)", options: ["x² + 7x + 10", "x² + 10x + 7", "x² + 7x + 7", "x² + 3x + 10"], correctAnswer: 0, explanation: "FOIL: x² + 5x + 2x + 10 = x² + 7x + 10." },
  { id: 'lm-20', category: Category.MATH, questionText: "If 3x = 2x + 7, what is x?", options: ["5", "-7", "0", "7"], correctAnswer: 3, explanation: "Subtract 2x from both sides: x = 7." },
  { id: 'lm-21', category: Category.MATH, questionText: "A train leaves City A traveling at 60 mph. Two hours later, a second train leaves City A on a parallel track traveling at 80 mph. How long will it take the second train to catch the first?", options: ["4 hours", "8 hours", "5 hours", "6 hours"], correctAnswer: 3, explanation: "Train 1 is 120 miles ahead (60mph * 2h). Relative speed is 20mph (80-60). Time = Distance/Relative Speed = 120/20 = 6 hours." },
  { id: 'lm-22', category: Category.MATH, questionText: "The sum of three consecutive odd integers is 159. What is the product of the first and the third integer?", options: ["2703", "2915", "2695", "2805"], correctAnswer: 3, explanation: "Integers are x, x+2, x+4. 3x+6=159 -> 3x=153 -> x=51. Integers are 51, 53, 55. Product 51*55 = 2805." },
  { id: 'lm-23', category: Category.MATH, questionText: "A store increases the price of a jacket by 20%. After a week, they decrease the new price by 20%. How does the final price compare to the original price?", options: ["It is the same.", "It is 4% higher.", "It is 2% lower.", "It is 4% lower."], correctAnswer: 3, explanation: "Let original = 100. Increase 20% -> 120. Decrease 20% of 120 (24) -> 96. 96 is 4% lower than 100." },
  { id: 'lm-24', category: Category.MATH, questionText: "If 3x + 2y = 12 and x - y = 4, what is the value of x + y?", options: ["0", "8", "6", "4"], correctAnswer: 3, explanation: "From x-y=4, x=y+4. Sub into eq1: 3(y+4)+2y=12 -> 3y+12+2y=12 -> 5y=0 -> y=0. If y=0, x=4. x+y = 4+0 = 4." },
  { id: 'lm-25', category: Category.MATH, questionText: "A rectangular garden has a perimeter of 40 feet. If the length is 4 feet more than the width, what is the area?", options: ["80 sq ft", "100 sq ft", "96 sq ft", "64 sq ft"], correctAnswer: 2, explanation: "2L + 2W = 40 -> L+W=20. L=W+4. (W+4)+W=20 -> 2W=16 -> W=8. L=12. Area = 12*8 = 96." },
  { id: 'lm-26', category: Category.MATH, questionText: "Two dice are rolled. What is the probability that the sum of the numbers is at least 10?", options: ["1/12", "1/6", "1/9", "5/36"], correctAnswer: 1, explanation: "Outcomes >= 10: (4,6), (5,5), (5,6), (6,4), (6,5), (6,6). That's 6 outcomes. Total is 36. 6/36 = 1/6." },
  { id: 'lm-27', category: Category.MATH, questionText: "Find the value of k if the line passing through (1, k) and (3, 5) has a slope of 2.", options: ["2", "3", "-1", "1"], correctAnswer: 3, explanation: "Slope = (y2-y1)/(x2-x1) -> 2 = (5-k)/(3-1) -> 2 = (5-k)/2 -> 4 = 5-k -> k=1." },
  { id: 'lm-28', category: Category.MATH, questionText: "A tank is 40% full. If 12 gallons are added, it becomes 70% full. What is the total capacity of the tank?", options: ["30 gallons", "50 gallons", "60 gallons", "40 gallons"], correctAnswer: 3, explanation: "Difference is 30% (70-40). 30% of Capacity = 12. 0.3C = 12 -> C = 12/0.3 = 40." },
  { id: 'lm-29', category: Category.MATH, questionText: "Simplify the expression: (2x²y)³ / (4xy²)", options: ["2x⁵y", "2x⁵y", "2x⁵y⁻¹", "2x²y"], correctAnswer: 0, explanation: "Numerator: 8x⁶y³. Denominator: 4xy². 8/4=2. x⁶/x=x⁵. y³/y²=y. Result: 2x⁵y." },
  { id: 'lm-30', category: Category.MATH, questionText: "The average of 5 numbers is 20. If one number is removed, the average of the remaining 4 numbers is 22. What number was removed?", options: ["10", "15", "8", "12"], correctAnswer: 3, explanation: "Sum of 5 = 5*20 = 100. Sum of 4 = 4*22 = 88. Removed = 100 - 88 = 12." },
  { id: 'lm-31', category: Category.MATH, questionText: "Solve for x: 2^(x+1) = 64", options: ["4", "5", "6", "3"], correctAnswer: 1, explanation: "64 = 2⁶. So x+1 = 6 -> x = 5." },
  { id: 'lm-32', category: Category.MATH, questionText: "A worker can complete a job in 6 hours. Another worker can do it in 3 hours. How long does it take if they work together?", options: ["4.5 hours", "1.5 hours", "2.5 hours", "2 hours"], correctAnswer: 3, explanation: "Rate 1 = 1/6. Rate 2 = 1/3. Combined = 1/6 + 2/6 = 3/6 = 1/2. So 2 hours." },
  { id: 'lm-33', category: Category.MATH, questionText: "What is the 10th term of the arithmetic sequence: 5, 8, 11, ...?", options: ["32", "35", "30", "33"], correctAnswer: 0, explanation: "a1=5, d=3. an = a1 + (n-1)d. a10 = 5 + (9)*3 = 5 + 27 = 32." },
  { id: 'lm-34', category: Category.MATH, questionText: "The ratio of boys to girls in a club is 3:4. If there are 28 girls, how many boys are there?", options: ["24", "18", "21", "32"], correctAnswer: 2, explanation: "3/4 = B/28. 4B = 3*28 = 84. B = 21." },
  { id: 'lm-35', category: Category.MATH, questionText: "If f(x) = x² - 1, find f(f(2)).", options: ["3", "15", "0", "8"], correctAnswer: 3, explanation: "f(2) = 2² - 1 = 3. f(3) = 3² - 1 = 8." },
  { id: 'lm-36', category: Category.MATH, questionText: "A cylinder has a radius of 3 and a height of 5. What is its volume?", options: ["15π", "75π", "30π", "45π"], correctAnswer: 3, explanation: "V = πr²h = π(3²)(5) = π(9)(5) = 45π." },
  { id: 'lm-37', category: Category.MATH, questionText: "What is the sum of the interior angles of a pentagon?", options: ["360°", "720°", "540°", "180°"], correctAnswer: 2, explanation: "Sum = (n-2)*180. (5-2)*180 = 3*180 = 540." },
  { id: 'lm-38', category: Category.MATH, questionText: "Multiply: (x - 3)(x² + 3x + 9)", options: ["x³ + 27", "x³ - 9", "x³ - 27", "x³ - 6x - 27"], correctAnswer: 2, explanation: "Difference of cubes formula: (a-b)(a²+ab+b²) = a³-b³. Here, x³ - 3³ = x³ - 27." },
  { id: 'lm-39', category: Category.MATH, questionText: "If the radius of a circle is decreased by 50%, by what percentage does the area decrease?", options: ["50%", "75%", "25%", "100%"], correctAnswer: 1, explanation: "A = πr². If r becomes 0.5r, A_new = π(0.5r)² = 0.25πr². The new area is 25% of original, so it decreased by 75%." },
  { id: 'lm-40', category: Category.MATH, questionText: "Solve for x: |2x - 5| = 7", options: ["1 and -6", "6 and -1", "6 and 1", "2 and -5"], correctAnswer: 1, explanation: "2x-5=7 -> 2x=12 -> x=6. OR 2x-5=-7 -> 2x=-2 -> x=-1." },
  { id: 'lm-41', category: Category.MATH, questionText: "A rectangular swimming pool is 10 meters long and 5 meters wide. A walkway of uniform width 1 meter is built around the outside of the pool. What is the area of the walkway alone?", options: ["30 sq m", "34 sq m", "14 sq m", "44 sq m"], correctAnswer: 1, explanation: "Total area including walkway is (10+2)*(5+2) = 12*7 = 84. Pool area is 10*5 = 50. Walkway = 84 - 50 = 34. A common mistake is adding only 1m to each dimension instead of 2." },
  
  { id: 'lm-42', category: Category.MATH, questionText: "If 4 workers can build 4 chairs in 4 hours, how many hours does it take 8 workers to build 8 chairs?", options: ["8", "2", "4", "1"], correctAnswer: 2, explanation: "The rate of one worker is 1 chair per 4 hours. 8 workers will build 8 chairs in the same 4 hours. It's a classic rate problem trick." },

  { id: 'lm-43', category: Category.MATH, questionText: "A clock strikes once at 1:00, twice at 2:00, and so on. How many times does it strike in total from 8:00 AM on Monday to 8:00 AM on Tuesday?", options: ["156", "78", "300", "168"], correctAnswer: 0, explanation: "Strikes in 12 hours: 1+2...+12 = 78. In 24 hours, it goes through two 12-hour cycles: 78 * 2 = 156." },

  { id: 'lm-44', category: Category.MATH, questionText: "Solve for x: log₂(x) + log₂(x-2) = 3", options: ["4", "4 and -2", "2", "8"], correctAnswer: 0, explanation: "log₂(x(x-2)) = 3 -> x²-2x = 2³ -> x²-2x-8 = 0 -> (x-4)(x+2)=0. x=4 or x=-2. However, log of a negative is undefined, so only 4 is valid." },

  { id: 'lm-45', category: Category.MATH, questionText: "A shop offers a 'Buy 2 Get 1 Free' deal. What is the actual percentage discount being offered on the total purchase?", options: ["50%", "33.3%", "25%", "20%"], correctAnswer: 1, explanation: "You get 3 items for the price of 2. Discount = 1 free / 3 total = 1/3 = 33.3%." },

  { id: 'lm-46', category: Category.MATH, questionText: "In a group of 30 people, 18 like tea, 15 like coffee, and 8 like both. How many like neither?", options: ["7", "5", "10", "12"], correctAnswer: 1, explanation: "Using Inclusion-Exclusion: Tea or Coffee = 18 + 15 - 8 = 25. Neither = 30 - 25 = 5." },

  { id: 'lm-47', category: Category.MATH, questionText: "What is the units digit of 3²⁰²⁶?", options: ["3", "9", "7", "1"], correctAnswer: 1, explanation: "Power of 3 cycle: 3, 9, 7, 1. Cycle length is 4. 2026 mod 4 = 2. The 2nd number in the cycle is 9." },

  { id: 'lm-48', category: Category.MATH, questionText: "A ladder 10 feet long leans against a wall. The base of the ladder is 6 feet from the wall. If the top of the ladder slides down 2 feet, how many feet does the bottom slide out?", options: ["2 ft", "4 ft", "1.5 ft", "approx 1.75 ft"], correctAnswer: 3, explanation: "Initially: 6²+h²=10² -> h=8. After sliding: Top is at 6ft (8-2). New base b: b²+6²=10² -> b=8. Slide distance = 8 - 6 = 2." },

  { id: 'lm-49', category: Category.MATH, questionText: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?", options: ["$0.10", "$0.05", "$0.15", "$1.05"], correctAnswer: 1, explanation: "x + (x + 1.00) = 1.10 -> 2x = 0.10 -> x = 0.05. Many reflexively answer $0.10." },

  { id: 'lm-50', category: Category.MATH, questionText: "If the length of a rectangle is increased by 20% and the width is decreased by 20%, what is the net change in area?", options: ["No change", "4% increase", "4% decrease", "2% decrease"], correctAnswer: 2, explanation: "1.2 * 0.8 = 0.96. 1 - 0.96 = 0.04 or 4% decrease." },

  { id: 'lm-51', category: Category.MATH, questionText: "How many integers between 1 and 100 inclusive are divisible by 3 or 5?", options: ["47", "53", "50", "41"], correctAnswer: 0, explanation: "Div by 3: 33. Div by 5: 20. Div by both (15): 6. Total = 33 + 20 - 6 = 47." },

  { id: 'lm-52', category: Category.MATH, questionText: "A car travels uphill at 30 mph and travels back down the same path at 60 mph. What is the average speed for the round trip?", options: ["45 mph", "40 mph", "50 mph", "35 mph"], correctAnswer: 1, explanation: "Harmonic mean: 2ab/(a+b) = 2(30)(60)/(30+60) = 3600/90 = 40 mph." },

  { id: 'lm-53', category: Category.MATH, questionText: "Simplify: i⁴⁷, where i is the imaginary unit.", options: ["i", "-i", "1", "-1"], correctAnswer: 1, explanation: "Cycle: i, -1, -i, 1. 47 mod 4 = 3. The 3rd value is -i." },

  { id: 'lm-54', category: Category.MATH, questionText: "A fence is 100 meters long. If posts are placed every 10 meters, including both ends, how many posts are needed?", options: ["10", "11", "9", "12"], correctAnswer: 1, explanation: "Fencepost error: 100/10 = 10 intervals, which requires 11 posts." },

  { id: 'lm-55', category: Category.MATH, questionText: "If a=3 and b=-2, what is the value of a - b²?", options: ["7", "1", "-1", "5"], correctAnswer: 2, explanation: "3 - (-2)² = 3 - 4 = -1. Mistake: thinking -(-2)² becomes +4." },

  { id: 'lm-56', category: Category.MATH, questionText: "A bag contains 3 red marbles and 2 blue marbles. If two marbles are drawn without replacement, what is the probability they are both red?", options: ["9/25", "3/10", "1/2", "6/20"], correctAnswer: 1, explanation: "(3/5) * (2/4) = 6/20 = 3/10." },

  { id: 'lm-57', category: Category.MATH, questionText: "What is the area of a triangle with sides 13, 14, and 15?", options: ["84", "91", "105", "70"], correctAnswer: 0, explanation: "Heron's Formula: s=21. Area = √(21*8*7*6) = √7056 = 84." },

  { id: 'lm-58', category: Category.MATH, questionText: "Find the value of x: 2x/3 + 1/2 = x/4 - 1", options: ["x = -18/5", "x = -3.6", "x = -12/7", "x = -14/3"], correctAnswer: 1, explanation: "Multiply by 12: 8x + 6 = 3x - 12 -> 5x = -18 -> x = -3.6." },

  { id: 'lm-59', category: Category.MATH, questionText: "If f(x) = 3x - 5, what is the inverse function f⁻¹(x)?", options: ["(x-5)/3", "1/(3x-5)", "(x+5)/3", "5x - 3"], correctAnswer: 2, explanation: "x = 3y - 5 -> x + 5 = 3y -> y = (x+5)/3." },

  { id: 'lm-60', category: Category.MATH, questionText: "A bottle and a cork together weigh 110g. The bottle weighs 100g more than the cork. What is the weight of the bottle?", options: ["100g", "105g", "10g", "95g"], correctAnswer: 1, explanation: "B+C=110, B=C+100. (C+100)+C=110 -> 2C=10 -> C=5. So B=105g." },
  { id: 'lm-61', category: Category.MATH, questionText: "What is the area of an equilateral triangle with a side length of 6?", options: ["18", "9√3", "12√3", "36"], correctAnswer: 1, explanation: "Area = (s²√3)/4 = (36√3)/4 = 9√3." },
  { id: 'lm-62', category: Category.MATH, questionText: "If x + 1/x = 4, what is the value of x² + 1/x²?", options: ["16", "18", "14", "12"], correctAnswer: 2, explanation: "Square both sides: (x + 1/x)² = 16 -> x² + 2(x)(1/x) + 1/x² = 16 -> x² + 2 + 1/x² = 16 -> x² + 1/x² = 14." },
  { id: 'lm-63', category: Category.MATH, questionText: "A number is selected at random from 1 to 50. What is the probability that it is a prime number?", options: ["13/50", "3/10", "7/25", "1/4"], correctAnswer: 1, explanation: "Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. There are 15 primes. 15/50 = 3/10." },
  { id: 'lm-64', category: Category.MATH, questionText: "Find the distance between points (1, 2) and (4, 6).", options: ["5", "7", "√7", "25"], correctAnswer: 0, explanation: "d = √[(4-1)² + (6-2)²] = √[3² + 4²] = √[9 + 16] = √25 = 5." },
  { id: 'lm-65', category: Category.MATH, questionText: "If the discriminant of a quadratic equation is zero, how many real solutions does it have?", options: ["Zero", "One", "Two", "Infinitely many"], correctAnswer: 1, explanation: "A discriminant ($$D = b^2 - 4ac$$) equal to zero indicates exactly one repeated real root." },
  { id: 'lm-66', category: Category.MATH, questionText: "A sequence is defined by $a_n = 2a_{n-1} + 1$ with $a_1 = 3$. Find $a_4$.", options: ["15", "31", "7", "63"], correctAnswer: 1, explanation: "a2 = 2(3)+1=7. a3 = 2(7)+1=15. a4 = 2(15)+1=31." },
  { id: 'lm-67', category: Category.MATH, questionText: "What is the period of the function f(x) = sin(4x)?", options: ["2π", "π", "π/2", "π/4"], correctAnswer: 2, explanation: "Period of sin(bx) is 2π/b. Here, 2π/4 = π/2." },
  { id: 'lm-68', category: Category.MATH, questionText: "A 10-foot ladder leans against a wall. If the base is 6 feet from the wall, how high up the wall does the ladder reach?", options: ["4 ft", "8 ft", "√136 ft", "7 ft"], correctAnswer: 1, explanation: "Pythagorean theorem: 6² + h² = 10² -> 36 + h² = 100 -> h² = 64 -> h = 8." },
  { id: 'lm-69', category: Category.MATH, questionText: "How many ways can the letters in the word 'APPLES' be arranged?", options: ["720", "360", "120", "240"], correctAnswer: 1, explanation: "6 letters total, with 'P' repeating twice. 6! / 2! = 720 / 2 = 360." },
  { id: 'lm-70', category: Category.MATH, questionText: "Solve for x: 3^(2x-1) = 27", options: ["1", "2", "1.5", "3"], correctAnswer: 1, explanation: "27 = 3³. So 2x - 1 = 3 -> 2x = 4 -> x = 2." },
  { id: 'lm-71', category: Category.MATH, questionText: "In a circle with center O, a central angle of 60° intercepts an arc of length 4π. What is the radius of the circle?", options: ["6", "24", "12", "18"], correctAnswer: 2, explanation: "Arc Length = (θ/360) * 2πr. 4π = (60/360) * 2πr -> 4π = (1/6) * 2πr -> 4π = πr/3. r = 12." },
  { id: 'lm-72', category: Category.MATH, questionText: "What is the sum of the solutions to the equation |x - 4| = 10?", options: ["8", "14", "20", "-6"], correctAnswer: 0, explanation: "x-4=10 (x=14) and x-4=-10 (x=-6). Sum: 14 + (-6) = 8." },
  { id: 'lm-73', category: Category.MATH, questionText: "If 2x + 3y = 7 and 3x - 2y = 4, what is the value of x?", options: ["2", "1", "3", "0"], correctAnswer: 0, explanation: "Multiply eq1 by 2 and eq2 by 3: 4x+6y=14 and 9x-6y=12. Adding gives 13x=26, so x=2." },
  { id: 'lm-74', category: Category.MATH, questionText: "A rectangular box has dimensions 3, 4, and 12. What is the length of the internal diagonal?", options: ["19", "15", "17", "13"], correctAnswer: 3, explanation: "Diagonal = √(w² + l² + h²) = √(3² + 4² + 12²) = √(9 + 16 + 144) = √169 = 13." },
  { id: 'lm-75', category: Category.MATH, questionText: "If log(x) = 2 and log(y) = 3, what is the value of log(x²y)?", options: ["12", "7", "6", "5"], correctAnswer: 1, explanation: "log(x²y) = 2log(x) + log(y) = 2(2) + 3 = 7." },
  { id: 'lm-76', category: Category.MATH, questionText: "A person invests $1,000 at an annual interest rate of 5% compounded annually. What is the value after 2 years?", options: ["$1,102.50", "$1,100.00", "$1,050.00", "$1,125.00"], correctAnswer: 0, explanation: "A = P(1+r)ⁿ = 1000(1.05)² = 1000(1.1025) = 1102.50." },
  { id: 'lm-77', category: Category.MATH, questionText: "Find the value of 'c' that makes x² + 10x + c a perfect square trinomial.", options: ["100", "20", "25", "50"], correctAnswer: 2, explanation: "c = (b/2)² = (10/2)² = 25." },
  { id: 'lm-78', category: Category.MATH, questionText: "What is the slope of a line perpendicular to 2x - 5y = 10?", options: ["2/5", "5/2", "-5/2", "-2/5"], correctAnswer: 2, explanation: "Original slope = 2/5. The perpendicular slope is the negative reciprocal: -5/2." },
  { id: 'lm-79', category: Category.MATH, questionText: "If the area of a circle is 9π, what is its circumference?", options: ["3π", "6π", "9π", "18π"], correctAnswer: 1, explanation: "Area = πr² = 9π -> r=3. Circumference = 2πr = 6π." },
  { id: 'lm-80', category: Category.MATH, questionText: "A committee of 3 people is to be chosen from a group of 6. How many different committees are possible?", options: ["20", "120", "18", "40"], correctAnswer: 0, explanation: "Combination 6C3 = (6*5*4)/(3*2*1) = 20." },
  { id: 'lm-81', category: Category.MATH, questionText: "What is the limit of (x² - 1) / (x - 1) as x approaches 1?", options: ["0", "1", "2", "Undefined"], correctAnswer: 2, explanation: "Factor: (x-1)(x+1)/(x-1) = x+1. As x->1, 1+1=2." },
  { id: 'lm-82', category: Category.MATH, questionText: "In a triangle with sides 7, 24, and 25, what is the value of the smallest angle's sine?", options: ["7/24", "24/25", "7/25", "24/7"], correctAnswer: 2, explanation: "This is a right triangle (7²+24²=25²). The smallest angle is opposite the shortest side (7). Sine = 7/25." },
  { id: 'lm-83', category: Category.MATH, questionText: "Solve for x: 5^(x-2) = 1/25", options: ["2", "4", "1", "0"], correctAnswer: 3, explanation: "1/25 = 5⁻². So x-2 = -2 -> x = 0." },
  { id: 'lm-84', category: Category.MATH, questionText: "The mean of 10 numbers is 50. If two numbers, 35 and 45, are removed, what is the new mean?", options: ["52.5", "50", "48", "51.25"], correctAnswer: 0, explanation: "Total sum = 500. New sum = 500 - 80 = 420. New mean = 420 / 8 = 52.5." },
  { id: 'lm-85', category: Category.MATH, questionText: "What is the domain of the function f(x) = √(x - 5)?", options: ["x > 5", "x ≥ 5", "x ≤ 5", "All real numbers"], correctAnswer: 1, explanation: "The value under a square root must be non-negative: x-5 ≥ 0 -> x ≥ 5." },
  { id: 'lm-86', category: Category.MATH, questionText: "If a line has an x-intercept of 4 and a y-intercept of -2, what is its equation?", options: ["y = 2x - 2", "y = 0.5x - 2", "y = -0.5x + 4", "y = 4x - 2"], correctAnswer: 1, explanation: "Points are (4,0) and (0,-2). Slope = (0 - -2)/(4 - 0) = 2/4 = 0.5. y-intercept is -2." },
  { id: 'lm-87', category: Category.MATH, questionText: "Factor completely: 2x² - 8", options: ["2(x-2)(x-2)", "2(x-4)(x+4)", "2(x-2)(x+2)", "(2x-4)(x+2)"], correctAnswer: 2, explanation: "Factor out 2: 2(x²-4). Difference of squares: 2(x-2)(x+2)." },
  { id: 'lm-88', category: Category.MATH, questionText: "How many degrees are in 3π/4 radians?", options: ["120°", "150°", "225°", "135°"], correctAnswer: 3, explanation: "Multiply by 180/π: (3/4) * 180 = 135°." },
  { id: 'lm-89', category: Category.MATH, questionText: "The volume of a cone is 12π. If its height is 4, what is its radius?", options: ["3", "9", "6", "√3"], correctAnswer: 0, explanation: "V = (1/3)πr²h -> 12π = (1/3)πr²(4) -> 12 = 4r²/3 -> 36 = 4r² -> r² = 9 -> r = 3." },
  { id: 'lm-90', category: Category.MATH, questionText: "If f(x) = 3x - 5, what is f⁻¹(x)?", options: ["(x-5)/3", "(x+5)/3", "3x+5", "1/(3x-5)"], correctAnswer: 1, explanation: "Swap x and y: x = 3y - 5 -> x + 5 = 3y -> y = (x+5)/3." },
  { id: 'lm-91', category: Category.MATH, questionText: "What is the sum of the infinite geometric series: 1 + 1/2 + 1/4 + 1/8 + ...?", options: ["1.5", "2", "3", "Infinity"], correctAnswer: 1, explanation: "Sum = a / (1 - r) = 1 / (1 - 0.5) = 1 / 0.5 = 2." },
  { id: 'lm-92', category: Category.MATH, questionText: "A gardener increases the length of a plot by 10% and decreases the width by 10%. The area...", options: ["Remains the same", "Increases by 1%", "Decreases by 1%", "Increases by 10%"], correctAnswer: 2, explanation: "New area = (1.1L)(0.9W) = 0.99LW. This is 99% of original, so a 1% decrease." },
  { id: 'lm-93', category: Category.MATH, questionText: "Find the value of x: 2^(3x-1) = 32", options: ["1", "3", "4", "2"], correctAnswer: 3, explanation: "32 = 2⁵. 3x - 1 = 5 -> 3x = 6 -> x = 2." },
  { id: 'lm-94', category: Category.MATH, questionText: "What is the value of sin²(30°) + cos²(30°)?", options: ["0.5", "√3/2", "1", "0.75"], correctAnswer: 2, explanation: "By the Pythagorean identity, sin²θ + cos²θ = 1 for any angle θ." },
  { id: 'lm-95', category: Category.MATH, questionText: "If the ratio of the areas of two similar triangles is 16:25, what is the ratio of their corresponding sides?", options: ["4:5", "16:25", "256:625", "2:3"], correctAnswer: 0, explanation: "Side ratio is the square root of the area ratio: √16 : √25 = 4 : 5." },
  { id: 'lm-96', category: Category.MATH, questionText: "Solve for x: x/2 + x/3 = 10", options: ["15", "10", "6", "12"], correctAnswer: 3, explanation: "Multiply by 6: 3x + 2x = 60 -> 5x = 60 -> x = 12." },
  { id: 'lm-97', category: Category.MATH, questionText: "What is the product of the roots of the equation 2x² - 8x + 6 = 0?", options: ["4", "3", "-4", "-3"], correctAnswer: 1, explanation: "Product of roots = c/a = 6/2 = 3." },
  { id: 'lm-98', category: Category.MATH, questionText: "A map has a scale where 1 inch = 50 miles. How many square miles are represented by a 2-inch by 3-inch rectangle?", options: ["300", "15,000", "6,000", "5,000"], correctAnswer: 1, explanation: "Dimensions in miles: (2*50) by (3*50) = 100 by 150. Area = 100 * 150 = 15,000 sq miles." },
  { id: 'lm-99', category: Category.MATH, questionText: "Find the length of an arc of a circle with radius 10 that subtends a central angle of 90°.", options: ["10π", "2.5π", "5π", "20π"], correctAnswer: 2, explanation: "90° is 1/4 of a circle. (1/4) * 2π(10) = 20π/4 = 5π." },
  { id: 'lm-100', category: Category.MATH, questionText: "If i² = -1, what is the value of (2 + 3i)(2 - 3i)?", options: ["-5", "13", "4", "4 - 9i"], correctAnswer: 1, explanation: "Difference of squares: 2² - (3i)² = 4 - 9i² = 4 - 9(-1) = 4 + 9 = 13." }
];

const shuffleArray = <T>(array: T[]): T[] => {
  if (!array || array.length === 0) return [];
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// --- Service Functions ---

export const generateGrammarLesson = async (topic: string): Promise<GrammarLesson> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return FALLBACK_GRAMMAR_DATA[topic] || FALLBACK_GRAMMAR_DATA["Comma Mastery: Essential vs Non-Essential"];
};

export const generateVocabulary = async (): Promise<VocabularyWord[]> => {
  return FULL_PREP_VOCAB;
};

// READING LAB: Returns Questions for EXACTLY ONE Passage
export const generateReadingTest = async (): Promise<Question[]> => {
    // 1. Shuffle passages
    const shuffledPassages = shuffleArray(fullReadingData);
    
    // 2. Select strictly the first ONE passage
    const selectedPassage = shuffledPassages[0];
    
    // 3. Map questions for that single passage
    return selectedPassage.questions.map(q => ({
        ...q,
        id: `reading-${selectedPassage.id}-${q.id}-${Date.now()}`,
        category: Category.READING,
        // CRITICAL FIX: The property in readingData.ts is 'passage', not 'text'
        passage: selectedPassage.passage 
    }));
};

export const generateVocabTest = async (count: number): Promise<Question[]> => {
  if (!FULL_PREP_VOCAB || FULL_PREP_VOCAB.length === 0) return [];
  const shuffledWords = shuffleArray(FULL_PREP_VOCAB).slice(0, count);
  return shuffledWords.map((word, index) => {
    const isDefinitionQuestion = Math.random() > 0.5;
    const distractors = shuffleArray(FULL_PREP_VOCAB.filter(w => w.word !== word.word))
      .slice(0, 3)
      .map(w => isDefinitionQuestion ? w.definition : w.word);

    let options: string[];
    let correctAnswer: number;
    let questionText: string;

    if (isDefinitionQuestion) {
      questionText = `What is the definition of "${word.word}"?`;
      options = shuffleArray([word.definition, ...distractors]);
      correctAnswer = options.indexOf(word.definition);
    } else {
      questionText = `Which word means: "${word.definition}"?`;
      options = shuffleArray([word.word, ...distractors]);
      correctAnswer = options.indexOf(word.word);
    }

    return {
      id: `vocab-q-${Date.now()}-${index}`,
      category: Category.VOCABULARY,
      questionText,
      options,
      correctAnswer,
      explanation: `"${word.word}" (${word.partOfSpeech}) means ${word.definition}. Example: ${word.exampleSentence}`
    };
  });
};

export const generateGrammarTest = async (count: number): Promise<Question[]> => {
  return shuffleArray(LOCAL_GRAMMAR_POOL).slice(0, count);
};

export const generateSpellingTest = async (count: number): Promise<Question[]> => {
  return shuffleArray(LOCAL_SPELLING_POOL).slice(0, count);
};

export const generateMathTest = async (count: number): Promise<Question[]> => {
    return shuffleArray(LOCAL_MATH_POOL).slice(0, count);
};

// MOCK PART 1: ELA (Includes 3 Passages)
export const generateMockPart1_ELA = async (): Promise<Question[]> => {
    const mockQuestions: Question[] = [];

    // 1. Add 5 Spelling Questions
    const spellingPool = shuffleArray(LOCAL_SPELLING_POOL).slice(0, 5);
    mockQuestions.push(...spellingPool.map(q => ({ ...q, category: Category.MOCK })));

    // 2. Add 10 Vocabulary Questions
    const vocabPool = await generateVocabTest(10);
    mockQuestions.push(...vocabPool.map(q => ({ ...q, category: Category.MOCK })));

    // 3. Add 15 Grammar Questions
    const grammarPool = await generateGrammarTest(15);
    mockQuestions.push(...grammarPool.map(q => ({ ...q, category: Category.MOCK })));

    // 4. Add 3 Passages with all their questions
    const shuffledPassages = shuffleArray(fullReadingData).slice(0, 3);
    
    shuffledPassages.forEach((passage) => {
        const passageQs = passage.questions.map(q => ({
            ...q,
            id: `mock-ela-${passage.id}-${q.id}-${Date.now()}`,
            category: Category.MOCK, // MOCK category keeps it independent from Reading Lab logic
            // CRITICAL FIX: Ensures the full text is available for the pop-out modal
            passage: passage.passage 
        }));
        mockQuestions.push(...passageQs);
    });

    return mockQuestions;
};

/**
 * MAIN GENERATOR SWITCH
 */
export const generateQuestions = async (category: Category, count: number): Promise<Question[]> => {
    switch (category) {
        case Category.READING:
            return generateReadingTest(); // Returns 1 passage
        case Category.MOCK:
            return generateMockPart1_ELA(); // Returns 3 passages + Mixed ELA
        case Category.VOCABULARY:
            return generateVocabTest(count);
        case Category.GRAMMAR:
            return generateGrammarTest(count);
        case Category.SPELLING:
            return generateSpellingTest(count);
        case Category.MATH:
            return generateMathTest(count);
        default:
            return [];
    }
};

// MOCK PART 2: MATH
export const generateMockPart2_Math = async (): Promise<Question[]> => {
    const mathQuestions = shuffleArray(LOCAL_MATH_POOL).slice(0, 40).map(q => ({
        ...q,
        id: `mock-math-${q.id}-${Date.now()}`
    }));
    return mathQuestions;
};

export const generateMockTest = async () => generateMockPart1_ELA(); 

export const generateShortDefinitions = async (words: VocabularyWord[]): Promise<{ word: string, shortDef: string }[]> => {
  return words.map(w => ({
    word: w.word,
    shortDef: w.definition.split(' ').slice(0, 6).join(' ') + (w.definition.split(' ').length > 6 ? '...' : '')
  }));
};
