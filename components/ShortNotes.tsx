
import React, { useState } from 'react';

interface VocabItem {
  word: string;
  pos: string;
  def: string;
  sentence: string;
  synonyms: string[];
  antonyms: string[];
  tone: string;
}

interface Note {
  title: string;
  content: string;
  details?: string;
  vocabList?: VocabItem[];
}

const ACADEMIC_LOGIC_LIST: VocabItem[] = [
  { word: "Abstract", pos: "Adj", def: "Existing in thought, but not physical.", sentence: "The concept of 'justice' is often an abstract idea until it is applied to a specific case.", synonyms: ["Conceptual", "Theoretical"], antonyms: ["Concrete", "Tangible"], tone: "Neutral" },
  { word: "Analogous", pos: "Adj", def: "Comparable in a way that clarifies a relationship.", sentence: "The human brain is often described as being analogous to a computer's central processor.", synonyms: ["Comparable", "Parallel"], antonyms: ["Dissimilar", "Unrelated"], tone: "Neutral" },
  { word: "Assertion", pos: "Noun", def: "A confident and forceful statement.", sentence: "The author’s assertion that technology causes isolation was backed by several studies.", synonyms: ["Claim", "Declaration"], antonyms: ["Denial", "Rejection"], tone: "Neutral" },
  { word: "Conjecture", pos: "Noun", def: "A conclusion based on incomplete info.", sentence: "Without more data, his theory remains mere conjecture rather than proven fact.", synonyms: ["Guess", "Speculation"], antonyms: ["Fact", "Certainty"], tone: "Neutral" },
  { word: "Delineate", pos: "Verb", def: "To describe or portray precisely.", sentence: "The contract clearly delineates the responsibilities of both the employer and the employee.", synonyms: ["Outline", "Depict"], antonyms: ["Confuse", "Distort"], tone: "Neutral" },
  { word: "Elicit", pos: "Verb", def: "To draw out a response or reaction.", sentence: "The comedian's jokes failed to elicit even a single laugh from the bored audience.", synonyms: ["Evoke", "Extract"], antonyms: ["Suppress", "Repel"], tone: "Neutral" },
  { word: "Fallacious", pos: "Adj", def: "Based on a mistaken belief; unsound.", sentence: "The argument that because it's expensive it must be better is often fallacious.", synonyms: ["Invalid", "Erroneous"], antonyms: ["Valid", "Logical"], tone: "Negative (-)" },
  { word: "Inherent", pos: "Adj", def: "Existing as a permanent, essential attribute.", sentence: "There is an inherent risk in any new business venture, no matter how well planned.", synonyms: ["Innate", "Intrinsic"], antonyms: ["Acquired", "Extrinsic"], tone: "Neutral" },
  { word: "Intrinsic", pos: "Adj", def: "Belonging naturally; essential.", sentence: "The historical value of the artifact is intrinsic, regardless of how much it's worth in money.", synonyms: ["Inherent", "Native"], antonyms: ["Accidental", "Foreign"], tone: "Neutral" },
  { word: "Synthesis", pos: "Noun", def: "Combining ideas to form a whole.", sentence: "The final report was a synthesis of all the individual research findings.", synonyms: ["Integration", "Union"], antonyms: ["Separation", "Analysis"], tone: "Positive (+)" }
];

const TONE_CHARACTER_LIST: VocabItem[] = [
  { word: "Ambivalent", pos: "Adj", def: "Having mixed or contradictory feelings.", sentence: "She felt ambivalent about the promotion because it meant more money but less free time.", synonyms: ["Uncertain", "Equivocal"], antonyms: ["Certain", "Resolute"], tone: "Neutral" },
  { word: "Apathetic", pos: "Adj", def: "Showing no interest or concern.", sentence: "Voter turnout was low because the citizens had grown apathetic toward local politics.", synonyms: ["Indifferent", "Unmoved"], antonyms: ["Enthusiastic", "Eager"], tone: "Negative (-)" },
  { word: "Benevolent", pos: "Adj", def: "Well-meaning and kindly.", sentence: "The benevolent donor provided enough funding to build a new library for the school.", synonyms: ["Kind", "Charitable"], antonyms: ["Malevolent", "Cruel"], tone: "Positive (+)" },
  { word: "Cynical", pos: "Adj", def: "Distrustful of human sincerity.", sentence: "After years of seeing broken promises, he became cynical about political reform.", synonyms: ["Skeptical", "Pessimistic"], antonyms: ["Optimistic", "Gullible"], tone: "Negative (-)" },
  { word: "Didactic", pos: "Adj", def: "Intended to teach, often with a moral.", sentence: "The children's book was highly didactic, focusing heavily on the importance of sharing.", synonyms: ["Instructional", "Moralizing"], antonyms: ["Uninformative"], tone: "Neutral/Preachy" },
  { word: "Indignant", pos: "Adj", def: "Showing anger at unfair treatment.", sentence: "The employees were indignant when they discovered they were being paid less than promised.", synonyms: ["Resentful", "Irritated"], antonyms: ["Content", "Pleased"], tone: "Negative (-)" },
  { word: "Objective", pos: "Adj", def: "Not influenced by personal feelings.", sentence: "A judge must remain objective and base their decision solely on the evidence presented.", synonyms: ["Unbiased", "Impartial"], antonyms: ["Subjective", "Biased"], tone: "Neutral/Positive" },
  { word: "Pragmatic", pos: "Adj", def: "Dealing with things sensibly and realistically.", sentence: "The committee took a pragmatic approach to the budget, cutting only non-essential costs.", synonyms: ["Practical", "Efficient"], antonyms: ["Idealistic", "Visionary"], tone: "Positive (+)" },
  { word: "Resilient", pos: "Adj", def: "Able to recover quickly from difficulty.", sentence: "The local economy proved to be resilient, bouncing back shortly after the factory closed.", synonyms: ["Strong", "Tough"], antonyms: ["Fragile", "Vulnerable"], tone: "Positive (+)" },
  { word: "Wary", pos: "Adj", def: "Showing caution about possible danger.", sentence: "Investors are wary of putting money into the stock market during times of global instability.", synonyms: ["Cautious", "Vigilant"], antonyms: ["Careless", "Trusting"], tone: "Neutral" }
];

const TRANSITION_RELATION_LIST: VocabItem[] = [
  { word: "Adversary", pos: "Noun", def: "One's opponent or enemy.", sentence: "The two lawyers were respected adversaries who fought fiercely in the courtroom.", synonyms: ["Rival", "Foe"], antonyms: ["Ally", "Friend"], tone: "Negative (-)" },
  { word: "Concede", pos: "Verb", def: "To admit something is true after resisting.", sentence: "The politician was forced to concede the election after all the votes were counted.", synonyms: ["Admit", "Acknowledge"], antonyms: ["Deny", "Dispute"], tone: "Neutral" },
  { word: "Divergent", pos: "Adj", def: "Tending to be different or go apart.", sentence: "They started with the same goal, but their paths became divergent over the years.", synonyms: ["Differing", "Varying"], antonyms: ["Convergent", "Similar"], tone: "Neutral" },
  { word: "Exacerbate", pos: "Verb", def: "To make a bad situation worse.", sentence: "Scratching the bug bite will only exacerbate the itching and lead to an infection.", synonyms: ["Aggravate", "Worsen"], antonyms: ["Alleviate", "Improve"], tone: "Negative (-)" },
  { word: "Impetus", pos: "Noun", def: "A driving force or motivation.", sentence: "The new tax credit provided the impetus for many families to install solar panels.", synonyms: ["Catalyst", "Stimulus"], antonyms: ["Hindrance", "Block"], tone: "Positive (+)" },
  { word: "Mitigate", pos: "Verb", def: "To make less severe or serious.", sentence: "The city planted more trees to help mitigate the effects of the summer heatwaves.", synonyms: ["Ease", "Relieve"], antonyms: ["Intensify", "Worsen"], tone: "Positive (+)" },
  { word: "Paradox", pos: "Noun", def: "A self-contradictory but true statement.", sentence: "It is a paradox that the more choices people have, the harder it is for them to decide.", synonyms: ["Contradiction", "Enigma"], antonyms: ["Consistency"], tone: "Neutral" },
  { word: "Pervasive", pos: "Adj", def: "Spreading widely throughout an area.", sentence: "The pervasive influence of social media has changed how young people communicate.", synonyms: ["Widespread", "Omnipresent"], antonyms: ["Rare", "Limited"], tone: "Neutral" },
  { word: "Substantiate", pos: "Verb", def: "To provide evidence to prove the truth.", sentence: "You cannot make such a serious accusation if you cannot substantiate it with facts.", synonyms: ["Verify", "Corroborate"], antonyms: ["Disprove", "Refute"], tone: "Positive (+)" },
  { word: "Transient", pos: "Adj", def: "Lasting only for a short time.", sentence: "The joy of winning the game was transient, as the team had to prepare for the next round.", synonyms: ["Brief", "Fleeting"], antonyms: ["Permanent", "Lasting"], tone: "Neutral" }
];

const NOTES_DATA: Record<string, Note[]> = {
  grammar: [
    { 
      title: "The Comma Master-Plan", 
      content: "Complete rules for comma placement in complex academic writing.",
      details: "RULES FOR MCVSD SUCCESS:\n\n1. FANBOYS: Use a comma BEFORE for, and, nor, but, or, yet, so when joining two complete sentences.\n2. INTRODUCTORY ELEMENTS: Use after 'Because...', 'Since...', 'While...' at the sentence start.\n3. THE APPOSITIVE WRAP: Surround non-essential nouns (e.g., The teacher, Mr. Jones, is here.)\n4. THE OXFORD COMMA: Essential for lists of 3+ items. Always use it on this test."
    },
    { 
      title: "Subject-Verb Agreement", 
      content: "Solving the most common traps in grammar sections.",
      details: "TRAPS TO AVOID:\n\n- Collective Nouns: 'The class' is singular, 'The classes' are plural.\n- Intervening Phrases: Ignore phrases like 'as well as' or 'along with'. (e.g., The captain, along with his crew, IS ready.)\n- Indefinite Pronouns: 'Everyone', 'Each', 'Neither' are ALWAYS singular.\n- Closer Subject Rule: With 'neither/nor', the verb matches the noun CLOSEST to it."
    },
    { 
      title: "Modifiers: Misplaced & Dangling", 
      content: "Correcting sentences that don't make logical sense.",
      details: "DANGLING MODIFIERS: When the person doing the action is missing.\n- Error: Barking loudly, the mailman ran away. (Mailman wasn't barking).\n- Fix: Barking loudly, the DOG made the mailman run away.\n\nMISPLACED MODIFIERS: Words too far from the noun they describe.\n- Error: I saw a bird with a telescope. (Did the bird have a telescope?)\n- Fix: Using a telescope, I saw a bird."
    },
    { 
      title: "Parallelism and Tense", 
      content: "Maintaining structural balance and consistent timeframes.",
      details: "PARALLELISM: Keep all items in a series in the same form.\n- Bad: He likes to fish, hiking, and swim.\n- Good: He likes fishing, hiking, and swimming.\n\nTENSE CONSISTENCY: Don't jump from past to present without logic.\n- Bad: He walked into the room and starts yelling.\n- Good: He walked into the room and started yelling."
    },
    {
      title: "Punctuation Precision",
      content: "Mastering Colons, Semicolons, and Dashes.",
      details: "1. SEMICOLONS (;): Join two independent sentences that are closely related without a conjunction.\n2. COLONS (:): Must follow a full sentence. Use before a list or an explanation.\n3. DASHES (—): Use to emphasize an abrupt break or a sudden change in thought."
    }
  ],
  vocabulary: [
    {
      title: "Academic Logic & Analysis",
      content: "Words used to describe arguments, evidence, and intellectual processes.",
      vocabList: ACADEMIC_LOGIC_LIST
    },
    {
      title: "Tone & Character Qualities",
      content: "Words that describe how a writer feels or how a person behaves.",
      vocabList: TONE_CHARACTER_LIST
    },
    {
      title: "Transition & Relation Words",
      content: "Words used to connect ideas or describe how situations interact.",
      vocabList: TRANSITION_RELATION_LIST
    },
    { 
      title: "Master Lexicon: A-Z Roots", 
      content: "Directory of Latin and Greek segments from the academy directory.",
      details: "• a/n: not/without\n• ab/s: from/away\n• a/c/d: toward/near\n• acro: top/height\n• act: do\n• aer/o: air\n• agr/i: farming\n• alg/o: pain\n• ambi: both\n• ambul: walk\n• ami/o: love\n• ana: up/back/again\n• andr/o: man\n• anim: spirit/life\n• ann/enn: year\n• ante: before\n• anth/o: flower\n• anthrop: human\n• anti: against\n• apo/apho: separate\n• aqu/a: water\n• arbor: tree\n• arch/i: chief/rule\n• astro: star\n• aud/i: hear\n• auto: self\n• avi: bird\n• bar/o: pressure\n• bell/i: war\n• bene: good\n• bi/n: two\n• bio: life\n• blast: cell\n• burs: pouch\n• calc: stone\n• cand: glowing\n• capt/cept: take\n• cardi: heart\n• carn: flesh\n• cata: down/against\n• caust: burn\n• cede/ceed: go/yield\n• celer: fast\n• cent: hundred\n• centr: center\n• cephal: head\n• cerebr: brain\n• cert: sure\n• chrom: color\n• chron: time\n• cide: kill\n• circum: around\n• claim/clam: shout\n• clar: clear\n• clud/clus: close\n• cline: lean\n• co/con: together\n• cogn: know\n• contra: against\n• corp: body\n• cosm: universe\n• counter: opposite\n• cred: believe\n• cruc: cross\n• crypto: hidden\n• cumul: heap\n• curr: run\n• cycl: circle\n• de: reduce/away\n• dec/deka: ten\n• dem/o: people\n• demi: half\n• dent: tooth\n• derm: skin\n• di/s: apart/not\n• dia: through\n• dict: speak\n• domin: master\n• duc/t: lead\n• dur: hard/last\n• dyn: power\n• dys: bad/abnormal\n• ego: self\n• endo: within\n• epi: on/over\n• equ: equal\n• eu: good\n• ex: out\n• extra: beyond\n• fac: make/do\n• fer: carry\n• fid: faith\n• flect: bend\n• flor: flower\n• form: shape\n• fract: break\n• fug: flee\n• fus: pour\n• gen: birth/kind\n• geo: earth\n• graph/y: writing\n• hyper: over\n• inter: between\n• mal: bad/wrong\n• micro: small\n• omni: all\n• path: emotion\n• phil/o: love\n• phon/o: sound\n• port: carry\n• scrib/script: write\n• tele/o: far/distant\n• viv/i/vit: live"
    },
    { 
      title: "Contextual Clue Decoders", 
      content: "Strategies for defining 500+ words using textual hints.",
      details: "1. RESTATEMENT: Look for 'that is', 'or', or 'in other words'.\n2. EXAMPLE HINTS: Words like 'including', 'such as', and 'for instance' provide definitions by list.\n3. CONTRAST: Look for 'but', 'however', 'conversely' to find the antonym and flip it.\n4. LOGIC: Use the overall tone of the sentence to determine if a word is positive or negative."
    }
  ],
  reading: [
    { 
      title: "Reading: Purpose & Tone", 
      content: "The P.I.E framework for author's intention.",
      details: "P - PERSUADE: Uses opinions or calls to action.\nI - INFORM: Neutral tone, facts, no bias.\nE - ENTERTAIN: Narratives, vivid imagery.\n\nTONE DETECTION: Look at word choice (Diction). Are words 'gloomy' or 'radiant'? Is the tone 'Objective' (fact-based) or 'Subjective' (opinionated)?"
    },
    { 
      title: "Finding the Main Idea", 
      content: "Strategies to pinpoint the central claim quickly.",
      details: "1. THESIS CHECK: Read the LAST sentence of the FIRST paragraph.\n2. TOPIC SKIM: Check the first sentence of every paragraph.\n3. TRAP: If an answer choice only fits one paragraph, it's a DETAIL, not the Main Idea."
    },
    { 
      title: "Context Clue Mastery", 
      content: "The I.D.E.A.S method for defining unknown words.",
      details: "I - Inference: General logic of the scene.\nD - Definition: Text gives an explicit meaning.\nE - Example: A list follows the word.\nA - Antonym: A contrast word (unlike, but).\nS - Synonym: A similar word (also, like)."
    },
    {
      title: "Paired Passage Analysis",
      content: "Synthesizing information across two different texts.",
      details: "1. READ P1 FIRST: Answer only the questions for P1.\n2. READ P2 SECOND: Answer only the questions for P2.\n3. COMPARISON: Focus on where the authors AGREE and where they DISAGREE. Don't let your personal opinion influence the author's voice."
    }
  ],
  spelling: [
    {
      title: "The 'I' before 'E' Rule",
      content: "The classic rhyme helps, but know the exceptions.",
      details: "RULE: 'I' before 'E', except after 'C', or when sounding like 'A' as in 'neighbor' and 'weigh'.\n\nEXCEPTIONS TO MEMORIZE:\n- Weird\n- Seize\n- Leisure\n- Foreign\n- Caffeine\n\nAPPLICATIONS:\n- Belief (i before e)\n- Receive (except after c)\n- Vein (sounding like A)"
    },
    {
      title: "Double Consonants",
      content: "When to double the final letter before a suffix.",
      details: "THE RULE: Double the final consonant if:\n1. The word ends in a single consonant preceded by a single vowel.\n2. The accent is on the final syllable.\n\nEXAMPLES:\n- Begin -> Beginning (stress on 'gin')\n- Occur -> Occurrence (stress on 'cur')\n- Refer -> Referred\n\nCONTRAST:\n- Open -> Opening (stress on 'O', so no double)"
    },
    {
      title: "Tricky Endings: -ABLE vs -IBLE",
      content: "Distinguishing between these common adjective suffixes.",
      details: "-ABLE: Usually attached to full English roots. If you remove -able, you often have a whole word.\n  - Depend -> Dependable\n  - Tax -> Taxable\n\n-IBLE: Usually attached to Latin roots that don't stand alone well.\n  - Vis -> Visible\n  - Aud -> Audible\n  - Terr -> Terrible\n\nEXCEPTION: Access -> Accessible"
    },
    {
      title: "Commonly Misspelled Words",
      content: "A hit-list of words frequently seen on exams.",
      details: "1. ACCOMMODATE: Two C's, Two M's.\n2. SEPARATE: There is 'A RAT' in separate.\n3. DEFINITELY: Finite in the middle. No 'A'.\n4. EMBARRASS: Two R's, Two S's.\n5. NECESSARY: One Collar (C), Two Sleeves (S).\n6. MINUSCULE: Think 'Minus', not 'Mini'."
    },
    {
      title: "Homophones & Confusables",
      content: "Words that sound alike but mean different things.",
      details: "PRINCIPAL vs PRINCIPLE:\n- Principal: Your pal (person) or main thing.\n- Principle: A rule (both end in -le).\n\nSTATIONARY vs STATIONERY:\n- StationAry: PArked (not moving).\n- StationEry: LEtter (paper).\n\nAFFECT vs EFFECT:\n- Affect: Action (Verb).\n- Effect: End result (Noun)."
    }
  ]
};

const ShortNotes: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'grammar' | 'vocabulary' | 'reading' | 'spelling'>('grammar');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalTab, setModalTab] = useState<'list' | 'flashcards'>('list');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCloseModal = () => {
    setSelectedNote(null);
    setModalTab('list');
    setCardIndex(0);
    setIsFlipped(false);
  };

  const handleFlashcardNav = (direction: 'next' | 'prev') => {
    if (!selectedNote?.vocabList) return;
    const len = selectedNote.vocabList.length;
    if (direction === 'next') setCardIndex((cardIndex + 1) % len);
    else setCardIndex((cardIndex - 1 + len) % len);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cheat Sheets & Quick Guides</h2>
        <p className="text-slate-500 font-medium italic">High-impact summaries for your MCVSD preparation. Click any card to expand.</p>
      </header>

      <div className="flex flex-wrap gap-2 bg-slate-200 p-1.5 rounded-2xl w-fit mb-10 shadow-inner">
        {['grammar', 'vocabulary', 'reading', 'spelling'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeCategory === cat ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NOTES_DATA[activeCategory].map((note, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedNote(note)}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col hover:border-indigo-200 transition-all hover:shadow-md cursor-pointer group relative overflow-hidden"
          >
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 font-black text-xs shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {idx + 1}
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-700 transition-colors">{note.title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-2">{note.content}</p>
            <div className="mt-auto pt-6 text-indigo-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              {note.vocabList ? 'Launch Mastery Window' : 'Expand Note'}
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom-10 duration-500 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-4 bg-indigo-600 w-full shrink-0"></div>
            
            <button 
              onClick={handleCloseModal}
              className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="p-10 md:p-12 pb-0 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-3 block">Registry Mastery Probe</span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight">{selectedNote.title}</h3>
                
                {selectedNote.vocabList && (
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mt-8 border border-slate-200">
                    <button onClick={() => setModalTab('list')} className={`px-6 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${modalTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Full List</button>
                    <button onClick={() => setModalTab('flashcards')} className={`px-6 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${modalTab === 'flashcards' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Flashcards</button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-10 md:p-12 no-scrollbar">
                {selectedNote.vocabList ? (
                  modalTab === 'list' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500 pb-10">
                      {selectedNote.vocabList.map((item, i) => (
                        <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                            <h5 className="text-2xl font-black text-indigo-900 uppercase tracking-tight">{item.word}</h5>
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{item.pos}</span>
                          </div>
                          
                          <div className="space-y-4 flex-1">
                            <div>
                              <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-1">Definition</p>
                              <p className="text-slate-800 font-bold leading-relaxed">{item.def}</p>
                            </div>
                            
                            <div>
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Sentence Usage</p>
                              <p className="text-slate-600 font-medium italic text-sm">"{item.sentence}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[9px] font-black uppercase text-emerald-500 tracking-widest mb-1">Synonyms</p>
                                <p className="text-slate-600 text-xs font-bold">{item.synonyms.join(", ")}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase text-rose-500 tracking-widest mb-1">Antonyms</p>
                                <p className="text-slate-600 text-xs font-bold">{item.antonyms.join(", ")}</p>
                              </div>
                            </div>

                            <div className="pt-2">
                              <p className="text-[9px] font-black uppercase text-amber-500 tracking-widest mb-1">Tone Profile</p>
                              <p className="text-slate-700 font-black text-[10px] uppercase tracking-tighter">{item.tone}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[450px] animate-in slide-in-from-bottom-4 duration-500">
                      <div className="w-full max-w-2xl h-96 relative perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                          {/* Front */}
                          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-8 text-center">
                            <span className="text-[10px] font-black text-indigo-300 uppercase mb-4 tracking-[0.4em]">Term Inquiry</span>
                            <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase">{selectedNote.vocabList[cardIndex]?.word}</h2>
                            <span className="mt-4 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase">{selectedNote.vocabList[cardIndex]?.pos}</span>
                          </div>
                          
                          {/* Back */}
                          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-indigo-50 rounded-[3rem] shadow-xl flex flex-col justify-center p-12 text-white overflow-y-auto no-scrollbar">
                            <div className="space-y-6">
                              <div>
                                <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-2">Meaning</p>
                                <p className="text-2xl font-bold leading-tight">{selectedNote.vocabList[cardIndex]?.def}</p>
                              </div>
                              
                              <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                                <p className="text-[9px] font-black uppercase text-indigo-300 tracking-widest mb-2">Contextual Application</p>
                                <p className="text-sm font-medium italic leading-relaxed text-indigo-50">"{selectedNote.vocabList[cardIndex]?.sentence}"</p>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest mb-1">Synonyms</p>
                                  <p className="text-xs font-bold opacity-80">{selectedNote.vocabList[cardIndex]?.synonyms.join(", ")}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black uppercase text-rose-400 tracking-widest mb-1">Antonyms</p>
                                  <p className="text-xs font-bold opacity-80">{selectedNote.vocabList[cardIndex]?.antonyms.join(", ")}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                <span className="text-[9px] font-black uppercase text-amber-400 tracking-widest">Tone Profile:</span>
                                <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full">{selectedNote.vocabList[cardIndex]?.tone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-12 mt-16">
                        <button onClick={() => handleFlashcardNav('prev')} className="p-5 bg-white border-2 rounded-[2rem] shadow-sm hover:border-indigo-400 transition-all">
                          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black text-slate-900 tracking-widest">{cardIndex + 1}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Sequence {selectedNote.vocabList.length}</span>
                        </div>
                        <button onClick={() => handleFlashcardNav('next')} className="p-5 bg-white border-2 rounded-[2rem] shadow-sm hover:border-indigo-400 transition-all">
                          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="prose prose-indigo max-w-none animate-in fade-in duration-500">
                    <div className="whitespace-pre-wrap text-slate-800 font-medium leading-[1.8] text-xl md:text-2xl">
                      {selectedNote.details || selectedNote.content}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0 flex justify-end">
              <button 
                onClick={handleCloseModal}
                className="px-12 py-5 bg-indigo-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Exit Mastery Window
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default ShortNotes;
