export interface CourseItem {
  id: string;
  slug: string;
  aliases: string[];
  board: "CBSE" | "ICSE";
  className: "Class IX" | "Class X";
  title: string;
  tagline: string;
  description: string;
  overview: string;
  targetStudent: string;
  subjects: {
    physics: { title: string; topics: string[]; description: string };
    chemistry: { title: string; topics: string[]; description: string };
    biology: { title: string; topics: string[]; description: string };
  };
  syllabusHighlights: string[];
  numericalPractice: string;
  testingStructure: string[];
  doubtSolving: string;
  boardTimeline: { phase: string; milestone: string }[];
  faqs: { q: string; a: string }[];
  relatedArticles: string[];
}

export const site = {
  name: "Joshi’s Academy",
  tagline: "Gyan Ki Varsha",
  location: "Kharadi, Pune, Maharashtra",
  addressDisplay: "Kharadi, Pune, Maharashtra, India",
  phone: "07030554317",
  whatsapp: "07030554317",
  geo: {
    latitude: 18.5515,
    longitude: 73.9468,
  },
  nearbyLocations: [
    "Kharadi",
    "Chandan Nagar",
    "Wagholi",
    "Viman Nagar",
    "Mundhwa",
    "Keshav Nagar",
    "Hadapsar",
    "Vadgaon Sheri",
    "Kalyani Nagar",
  ],
  mapsUrl: "https://maps.google.com/maps?ftid=0xda91b9aaa8e08e7:0xa2245a5b43016f88",
  mapsEmbed: "https://maps.google.com/maps?q=joshi%27s+academy+kharadi+pune&output=embed",
  description:
    "Specialist CBSE and ICSE Science coaching for Classes IX and X in Kharadi, Pune, serving Chandan Nagar, Wagholi, Viman Nagar, Mundhwa & nearby areas with small batches and 90%+ board results.",
};

export const announcement = {
  enabled: true,
  badge: "2025–26 AY",
  text: "Science available at just ₹1500/- for 2025–26 AY!",
  expiry: "2026-12-31",
};

export const courses: CourseItem[] = [
  {
    id: "cbse-9",
    slug: "cbse-class-9-science",
    aliases: ["cbse-class-ix-science"],
    board: "CBSE",
    className: "Class IX",
    title: "CBSE Class 9 Science",
    tagline: "Foundational mastery in Physics, Chemistry & Biology for Class IX",
    description:
      "Build the deep conceptual base in Physics, Chemistry, and Biology that makes Class 10 Board Science intuitive and achievable.",
    overview:
      "Class IX Science introduces fundamental concepts—from Newton's laws of motion to atomic structure and cell physiology—that form the bedrock of all future science education. We teach students to understand principles before memorising equations.",
    targetStudent:
      "Students entering or enrolled in CBSE Class IX who want to develop sharp analytical thinking, prevent conceptual backlogs, and gain early confidence before their board examination year.",
    subjects: {
      physics: {
        title: "Physics",
        topics: [
          "Motion & Equations of Kinematics",
          "Force & Newton's Laws",
          "Gravitation & Archimedes Principle",
          "Work, Energy & Power",
          "Sound & Waves",
        ],
        description:
          "Focus on vector understanding, graphical analysis of motion, and systematic mathematical steps in numerical solving.",
      },
      chemistry: {
        title: "Chemistry",
        topics: [
          "Matter in Our Surroundings",
          "Is Matter Around Us Pure?",
          "Atoms & Molecules",
          "Structure of the Atom",
        ],
        description:
          "Emphasis on microscopic models, mole concept calculations, chemical valencies, and writing correct balanced formulas.",
      },
      biology: {
        title: "Biology",
        topics: [
          "The Fundamental Unit of Life (Cell)",
          "Tissues (Plant & Animal)",
          "Improvement in Food Resources",
        ],
        description:
          "Clear understanding of cellular organelles, histological functions, and technical scientific nomenclature with structured diagram practice.",
      },
    },
    syllabusHighlights: [
      "Thorough NCERT coverage paired with exemplar application questions",
      "Graph-based problem solving in Kinematics",
      "Step-by-step mole concept derivation and formula building",
      "Scientific diagram drawing with precise labeling standards",
    ],
    numericalPractice:
      "Weekly dedicated numerical workshops where students decompose word problems into given quantities, formula selection, SI unit checks, and error prevention.",
    testingStructure: [
      "Weekly 25-minute concept check tests",
      "End-of-chapter subjective papers strictly evaluated on CBSE marking schemes",
      "Term-end full syllabus diagnostic examinations",
      "Post-test error analysis reports given to each student",
    ],
    doubtSolving:
      "15 minutes reserved after every lecture plus dedicated weekend doubt-clearing sessions where students resolve homework ambiguities individually.",
    boardTimeline: [
      {
        phase: "April – August",
        milestone: "Foundational Mechanics, States of Matter, and Cellular Biology",
      },
      {
        phase: "September – November",
        milestone: "Gravitation, Work & Energy, Atomic Structure, and Plant Tissues",
      },
      {
        phase: "December – January",
        milestone:
          "Full syllabus review, multi-chapter numerical integration, and CBSE question sets",
      },
      {
        phase: "February",
        milestone: "Final simulated examinations and individual weakness eradication",
      },
    ],
    faqs: [
      {
        q: "Why is Class 9 Science considered difficult by CBSE students?",
        a: "Class 9 introduces mathematical abstraction in Physics and microscopic reasoning in Chemistry. Without conceptual intuition, memorisation fails. We bridge this gap early.",
      },
      {
        q: "How are practicals and lab activities addressed?",
        a: "Every practical demonstration in the NCERT curriculum is explained with underlying chemical principles and ray/apparatus setups so students excel in school assessments.",
      },
    ],
    relatedArticles: [
      "class-9-science-study-plan",
      "physics-numericals-common-mistakes",
      "cbse-vs-icse-science",
    ],
  },
  {
    id: "cbse-10",
    slug: "cbse-class-10-science",
    aliases: ["cbse-class-x-science"],
    board: "CBSE",
    className: "Class X",
    title: "CBSE Class 10 Science",
    tagline: "Rigorous board examination preparation with concept mastery",
    description:
      "A disciplined, concept-driven programme designed to achieve 90%+ in the CBSE Class 10 Board Examination through rigorous practice, exemplar revision, and individual feedback.",
    overview:
      "CBSE Class 10 Board Science requires both immaculate clarity on foundational principles and the ability to articulate answers according to the CBSE marking rubric. Our small-batch environment ensures no doubt goes unaddressed.",
    targetStudent:
      "CBSE Class 10 students aiming for distinction and top percentile performance in their board examinations through disciplined weekly preparation rather than last-minute cramming.",
    subjects: {
      physics: {
        title: "Physics",
        topics: [
          "Light: Reflection & Refraction",
          "The Human Eye & Colourful World",
          "Electricity & Circuits",
          "Magnetic Effects of Electric Current",
        ],
        description:
          "Mastery over sign conventions in ray diagrams, equivalent resistance calculations, and electromagnetic rule applications.",
      },
      chemistry: {
        title: "Chemistry",
        topics: [
          "Chemical Reactions & Equations",
          "Acids, Bases & Salts",
          "Metals & Non-Metals",
          "Carbon & Its Compounds",
        ],
        description:
          "Systematic balanced equation writing, colour-change observation charts, ionic vs covalent properties, and IUPAC nomenclature.",
      },
      biology: {
        title: "Biology",
        topics: [
          "Life Processes (Nutrition, Respiration, Transport, Excretion)",
          "Control & Coordination",
          "How do Organisms Reproduce?",
          "Heredity & Evolution",
          "Our Environment",
        ],
        description:
          "Comprehensive step-by-step physiological pathways, Punnett square genetics, and high-scoring diagram drafting.",
      },
    },
    syllabusHighlights: [
      "Complete 100% syllabus mastery completed well before pre-board exams",
      "Analysis of past 10 years of CBSE Board question papers (PYQs)",
      "Strict training on CBSE 3-mark and 5-mark answer presentation",
      "Competency-focused and case-based question mastery",
    ],
    numericalPractice:
      "Daily numerical drills covering mirror/lens equations, Snell's law, Ohm's law, Joule's law of heating, and electric power calculations with strict SI unit tracking.",
    testingStructure: [
      "Bi-weekly board-pattern unit tests (objective + subjective)",
      "Three full-syllabus pre-board mock examinations under timed conditions",
      "Micro-tests on assertion-reason and case-study questions",
      "Detailed answer-sheet evaluation with step-wise mark breakdown",
    ],
    doubtSolving:
      "Immediate doubt clearance during class, personal one-on-one doubt slots, and custom question resolution for school assignment topics.",
    boardTimeline: [
      {
        phase: "April – July",
        milestone: "Chemical Reactions, Acids/Bases, Electricity, Light, and Core Life Processes",
      },
      {
        phase: "August – October",
        milestone: "Carbon Compounds, Magnetism, Reproduction, Heredity, and Environment",
      },
      {
        phase: "November – December",
        milestone: "First full syllabus completion, Chapter-wise PYQ marathons, and Pre-Board 1",
      },
      {
        phase: "January – February",
        milestone: "Intensive 3-hour board simulations, answer polish, and final revision sprints",
      },
    ],
    faqs: [
      {
        q: "How does Joshi's Academy help students score 90%+ in CBSE Class 10 Science?",
        a: "By combining rigorous concept clarity with step-wise CBSE marking scheme practice. 50% of our 2024–25 batch scored 90%+, demonstrating the consistency of our approach.",
      },
      {
        q: "Do you provide concise revision notes?",
        a: "Yes. Every student receives structured, handwritten-standard notes with summarized reaction charts, ray diagram cheat-sheets, and formula reference sheets.",
      },
    ],
    relatedArticles: [
      "score-90-cbse-class-10-science",
      "class-10-science-preparation-strategy",
      "biology-board-exam-preparation",
    ],
  },
  {
    id: "icse-9",
    slug: "icse-class-9-science",
    aliases: ["icse-class-ix-science"],
    board: "ICSE",
    className: "Class IX",
    title: "ICSE Class 9 Science",
    tagline: "In-depth Physics, Chemistry & Biology coaching tailored for ICSE depth",
    description:
      "Detailed, disciplined science learning specifically engineered for the breadth, technical rigor, and descriptive depth of the ICSE Class 9 curriculum.",
    overview:
      "The ICSE science syllabus is known for its rigorous detail, demanding exact technical vocabulary, experimental derivations, and in-depth chemical reactions. We treat Physics, Chemistry, and Biology with the specialized attention each demands.",
    targetStudent:
      "ICSE Class 9 students seeking a structured academic support system that navigates the rigorous Selina/Concise curriculum without feeling overwhelmed.",
    subjects: {
      physics: {
        title: "Physics",
        topics: [
          "Measurements & Experimentation",
          "Motion in One Dimension",
          "Laws of Motion",
          "Fluids: Pressure & Upthrust",
          "Heat & Energy",
          "Light & Sound",
          "Electricity & Magnetism",
        ],
        description:
          "Vernier calipers/screw gauge precision, graphical kinematics, pressure laws, and calorimeter principles.",
      },
      chemistry: {
        title: "Chemistry",
        topics: [
          "The Language of Chemistry",
          "Chemical Changes & Reactions",
          "Water",
          "Atomic Structure & Chemical Bonding",
          "The Periodic Table",
          "Study of the First Element: Hydrogen",
          "Gas Laws",
        ],
        description:
          "Valency charts, radical combination rules, Boyle's & Charles' Law derivations, and detailed reaction equations.",
      },
      biology: {
        title: "Biology",
        topics: [
          "Basic Biology: Cell & Tissues",
          "Flowering Plants (Vegetative & Reproductive)",
          "Plant Physiology (Transpiration & Photosynthesis)",
          "Human Anatomy & Physiology",
        ],
        description:
          "Anatomical precision, detailed botanical dissections, and accurate technical terminology demanded by ICSE examiners.",
      },
    },
    syllabusHighlights: [
      "Rigorous alignment with ICSE Council syllabus and textbook standards",
      "Special emphasis on numerical problems in Heat, Sound, and Gas Laws",
      "Complete chemical equation writing with catalysts, states, and conditions",
      "High-precision biological diagram drafting",
    ],
    numericalPractice:
      "Rigorous focus on multi-step calculations in Gas Laws, density/relative density, and mechanical advantage problems.",
    testingStructure: [
      "Fortnightly ICSE-pattern tests with Section I (compulsory short questions) and Section II (long structured questions)",
      "Continuous assessment of terminology and balanced equations",
      "Term diagnostic examinations mirroring terminal school evaluations",
    ],
    doubtSolving:
      "Dedicated 1-on-1 sessions addressing complex derivation steps and experimental reasoning questions.",
    boardTimeline: [
      {
        phase: "April – August",
        milestone: "Mechanics, Atomic Structure, Language of Chemistry, and Plant Biology",
      },
      {
        phase: "September – November",
        milestone: "Heat, Light, Gas Laws, Hydrogen, and Human Systems",
      },
      {
        phase: "December – January",
        milestone: "Comprehensive revision of all 3 disciplines and cross-topic drills",
      },
      { phase: "February", milestone: "Final annual exam readiness" },
    ],
    faqs: [
      {
        q: "How is ICSE Science different from CBSE at Joshi’s Academy?",
        a: "ICSE splits Science into three separate examinations with vastly greater factual and experimental depth. Our curriculum is tailored to ICSE's distinct depth and vocabulary requirements.",
      },
    ],
    relatedArticles: [
      "cbse-vs-icse-science",
      "physics-numericals-common-mistakes",
      "class-9-science-study-plan",
    ],
  },
  {
    id: "icse-10",
    slug: "icse-class-10-science",
    aliases: ["icse-class-x-science"],
    board: "ICSE",
    className: "Class X",
    title: "ICSE Class 10 Science",
    tagline: "Mastery across Physics, Chemistry & Biology for ICSE Board Examinations",
    description:
      "A comprehensive, high-standard coaching programme preparing students for outstanding results in ICSE Physics, Chemistry, and Biology Board Examinations.",
    overview:
      "In Class 10 ICSE, students take three separate board papers for Science. Our structured approach provides dedicated subject focus for each discipline, instilling deep reasoning, flawless diagramming, and numerical speed.",
    targetStudent:
      "ICSE Class 10 students dedicated to securing 90%+ across Physics, Chemistry, and Biology in their ICSE Board Examinations through methodical study.",
    subjects: {
      physics: {
        title: "Physics",
        topics: [
          "Force, Work, Power & Energy",
          "Machines",
          "Refraction of Light (Prisms, Lenses, Spectrum)",
          "Sound",
          "Current Electricity & Household Circuits",
          "Electromagnetism",
          "Calorimetry",
          "Radioactivity",
        ],
        description:
          "Rigorous pulleys and levers calculations, critical angle & total internal reflection, principle of mixtures in calorimetry, and nuclear reactions.",
      },
      chemistry: {
        title: "Chemistry",
        topics: [
          "Periodic Properties & Variations",
          "Chemical Bonding",
          "Study of Acids, Bases & Salts",
          "Analytical Chemistry",
          "Mole Concept & Stoichiometry",
          "Electrolysis",
          "Metallurgy",
          "Study of Compounds (HCl, NH₃, HNO₃, H₂SO₄)",
          "Organic Chemistry",
        ],
        description:
          "Precise observation-based questions (colour changes, gas evolution tests), mole concept calculations, and IUPAC organic reactions.",
      },
      biology: {
        title: "Biology",
        topics: [
          "Cell Division & Genetics",
          "Plant Physiology (Absorption, Transpiration, Photosynthesis)",
          "Human Physiology (Circulatory, Excretory, Nervous, Endocrine, Reproductive)",
          "Human Population & Health",
        ],
        description:
          "Step-wise physiological cycle analysis, pedigree charts, endocrine hormone functions, and strict council diagram marking standards.",
      },
    },
    syllabusHighlights: [
      "Exhaustive coverage of 10-year ICSE council past question papers",
      "Specialized test series for Physics numericals and Chemistry practical observations",
      "Precise botanical and anatomical diagram practice sessions",
      "Thorough training on Section A compulsory questions to guarantee maximum marks",
    ],
    numericalPractice:
      "Dedicated workshops on Calorimetry, Electric Circuits, Pulleys, and Stoichiometry calculations with exact significant figure conventions.",
    testingStructure: [
      "Weekly 80-mark simulated ICSE board papers per discipline",
      "Strict council-aligned evaluation highlighting lost half-marks",
      "Full preliminary board simulations across consecutive days",
    ],
    doubtSolving:
      "Individual doubt resolution hours for each student, focusing on individual school preliminary exam questions and council model answers.",
    boardTimeline: [
      {
        phase: "March – July",
        milestone: "Mechanics, Light, Periodic Table, Mole Concept, and Plant Physiology",
      },
      {
        phase: "August – October",
        milestone:
          "Electricity, Calorimetry, Study of Compounds, Organic Chemistry, and Human Systems",
      },
      {
        phase: "November – December",
        milestone:
          "First complete syllabus review, Prelim 1 preparation, and 10-year paper marathons",
      },
      {
        phase: "January – February",
        milestone:
          "Council model question papers, answer precision polish, and final board mock cycles",
      },
    ],
    faqs: [
      {
        q: "Are Physics, Chemistry, and Biology taught as separate subjects?",
        a: "Yes. ICSE requires distinct subject papers, and our curriculum structures each discipline with dedicated teaching modules, tests, and homework tracking.",
      },
      {
        q: "How do you help students with Chemistry practical observations?",
        a: "We maintain structured observation matrices for flame tests, precipitate colors with NaOH/NH₄OH, and gas identification tests that appear frequently in board papers.",
      },
    ],
    relatedArticles: [
      "cbse-vs-icse-science",
      "score-90-cbse-class-10-science",
      "class-10-science-preparation-strategy",
    ],
  },
];

export const approach = [
  {
    num: "01",
    title: "Concept-Based Learning",
    desc: "We connect every mathematical formula, reaction, and biological mechanism to the physical principle behind it, training students to reason rather than memorize blindly.",
    image: "approach",
  },
  {
    num: "02",
    title: "Personalised Attention",
    desc: "Every student's thinking process is observed closely. Individual learning gaps are diagnosed early and addressed with tailored explanations and practice problems.",
    image: "classroom",
  },
  {
    num: "03",
    title: "Small Batches",
    desc: "Intentionally limited batch sizes ensure that every student actively participates, asks clarifying questions without hesitation, and receives direct teacher engagement.",
    image: "hero",
  },
  {
    num: "04",
    title: "Structured Notes",
    desc: "Carefully organized, concise notes turn revision into a deliberate and structured process rather than a stressful scramble before school examinations.",
    image: "approach",
  },
  {
    num: "05",
    title: "Regular Testing",
    desc: "Chapter-end assessments, board-style question papers, and continuous MCQ practice make academic progress transparent and measurable throughout the entire session.",
    image: "classroom",
  },
  {
    num: "06",
    title: "Dedicated Doubt Solving",
    desc: "Doubts are treated as essential learning milestones. Time is specifically reserved after every lecture to resolve individual questions thoroughly.",
    image: "hero",
  },
];

export const scienceDisciplines = [
  {
    id: "physics",
    name: "PHYSICS",
    subtitle: "Principles • Numericals • Application",
    annotation: "F = ma",
    secondaryAnnotation: "v = u + at • P = VI",
    description:
      "Physics is taught as the language of nature. From Newton's laws to electric circuits and optics, we build intuition first, followed by rigorous mathematical application and error-free numerical solving.",
    topics: [
      "Kinematics & Force",
      "Work, Energy & Power",
      "Light & Geometrical Optics",
      "Electricity & Magnetism",
    ],
  },
  {
    id: "chemistry",
    name: "CHEMISTRY",
    subtitle: "Concepts • Reactions • Problem Solving",
    annotation: "2H₂ + O₂ → 2H₂O",
    secondaryAnnotation: "PV = nRT • pH = -log[H⁺]",
    description:
      "Chemistry is demystified by connecting atomic structure to observable reactions. Students master valencies, balanced equations, stoichiometry, and organic nomenclature with systematic clarity.",
    topics: [
      "Chemical Equations & Stoichiometry",
      "Acids, Bases & Salts",
      "Structure of the Atom",
      "Carbon & Organic Compounds",
    ],
  },
  {
    id: "biology",
    name: "BIOLOGY",
    subtitle: "Concepts • Diagrams • Understanding",
    annotation: "DNA / Cellular Respiration",
    secondaryAnnotation: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O",
    description:
      "Biology is approached as an interconnected living system rather than dry memorisation. We train students in precise scientific terminology, physiological mechanisms, and clean board-standard diagrams.",
    topics: [
      "Cellular Biology & Genetics",
      "Human Physiological Systems",
      "Plant Nutrition & Respiration",
      "Ecology & Heredity",
    ],
  },
];

export const methodology = [
  {
    step: "01",
    name: "UNDERSTAND",
    headline: "Concept Clarity",
    description:
      "Deep exploration of underlying principles using intuitive real-world examples and interactive discussions before touching formulas.",
  },
  {
    step: "02",
    name: "PRACTICE",
    headline: "Disciplined Application",
    description:
      "Guided solving of numerical problems and descriptive reasoning questions with step-by-step mathematical rigor.",
  },
  {
    step: "03",
    name: "TEST",
    headline: "Rigorous Assessment",
    description:
      "Strictly timed unit evaluations and board-pattern examinations evaluating conceptual grasp and presentation accuracy.",
  },
  {
    step: "04",
    name: "ANALYSE",
    headline: "Identify Gaps",
    description:
      "Post-examination diagnostic review pinpointing calculation slips, missed terms, or conceptual hesitation.",
  },
  {
    step: "05",
    name: "IMPROVE",
    headline: "Focused Support",
    description:
      "One-on-one remediation sessions and targeted practice sheets addressing precisely identified weaknesses.",
  },
  {
    step: "06",
    name: "PERFORM",
    headline: "Board Confidence",
    description:
      "Simulated exam marathons and presentation coaching that turn mastery into calm, top-percentile board execution.",
  },
];

export const results = {
  headline: "Results that reflect real understanding.",
  subheadline: "Academic excellence built through consistency, not last-minute memorisation.",
  stats: [
    { value: "25+", label: "Students Scored 90%+", detail: "In CBSE Class X Board Examination" },
    { value: "50%", label: "Scored Above 90%", detail: "Of the entire 2024–25 academic batch" },
    { value: "85%+", label: "Remaining Students", detail: "Maintained distinction level averages" },
  ],
  note: "All published results represent verified academic records from Joshi’s Academy students. We publish verified statistical milestones to maintain institutional integrity.",
};

export const testimonials = [
  {
    quote:
      "Joshi’s Academy transformed my understanding of science. The personalised attention made all the difference in my board exam preparation.",
    author: "Ravi Sharma",
    context: "CBSE Class X Science • 94% Scored",
  },
  {
    quote:
      "The structured notes and small batch sizes at Joshi’s Academy helped me excel in my studies. I highly recommend it for anyone serious about their education.",
    author: "Anita Desai",
    context: "CBSE Class X Science • 92% Scored",
  },
];

export const facultyStandards = {
  headline: "The people behind the teaching.",
  intro:
    "At Joshi’s Academy, teaching is personal, disciplined, and transparent. We believe great science teaching requires deep subject qualification, pedagogical patience, and an unwavering commitment to individual student progress.",
  pillars: [
    {
      title: "Subject Specialisation",
      desc: "Every subject is taught by educators with strong academic backgrounds in their respective scientific disciplines.",
    },
    {
      title: "Pedagogical Patience",
      desc: "Complex concepts are explained from multiple angles until every student in the batch develops authentic clarity.",
    },
    {
      title: "Academic Rigor",
      desc: "Teachers continuously review CBSE and ICSE marking guidelines to ensure student answers match council standards.",
    },
    {
      title: "Continuous Mentorship",
      desc: "Beyond scheduled classes, faculty members remain accessible for doubt solving and academic guidance.",
    },
  ],
};

export const faqs = [
  {
    q: "Which classes does Joshi’s Academy teach?",
    a: "Joshi’s Academy specialises exclusively in Science coaching for students in Classes IX and X, ensuring complete focus on these critical secondary school years.",
  },
  {
    q: "Does Joshi’s Academy teach CBSE and ICSE?",
    a: "Yes. The academy provides specialized, curriculum-aligned Science programmes for both CBSE and ICSE boards, with separate batches and board-specific study materials.",
  },
  {
    q: "Does the academy specialise in Science?",
    a: "Yes. Joshi’s Academy is dedicated entirely to Science—covering Physics, Chemistry, and Biology in complete conceptual depth.",
  },
  {
    q: "Are batches small?",
    a: "Yes. Small batch sizes are a core tenet of Joshi’s Academy. This guarantees personalized attention, active participation, and immediate doubt resolution for every student.",
  },
  {
    q: "Are regular tests conducted?",
    a: "Yes. We conduct regular chapter-wise tests, periodic cumulative examinations, and full-length board mock papers with step-by-step correction.",
  },
  {
    q: "Where is Joshi’s Academy located?",
    a: "Joshi’s Academy is conveniently located in Kharadi, Pune, Maharashtra, serving students across Kharadi and surrounding neighbourhoods.",
  },
];

export const galleryItems = [
  {
    id: "1",
    title: "Focused Small-Batch Teaching",
    category: "Classroom",
    aspect: "aspect-[4/5]",
    caption: "Small-batch interactive discussions that encourage students to ask questions freely.",
  },
  {
    id: "2",
    title: "Concept Demonstration in Session",
    category: "Pedagogy",
    aspect: "aspect-[16/9]",
    caption:
      "Physical demonstration of scientific principles connecting formulas to observable phenomena.",
  },
  {
    id: "3",
    title: "Dedicated Individual Doubt Solving",
    category: "Mentorship",
    aspect: "aspect-[1/1]",
    caption: "One-on-one student mentoring ensuring no conceptual ambiguity remains unresolved.",
  },
  {
    id: "4",
    title: "Board Examination Practice",
    category: "Assessment",
    aspect: "aspect-[3/4]",
    caption: "Disciplined written practice under timed conditions to develop exam composure.",
  },
  {
    id: "5",
    title: "Structured Notes & Formula Building",
    category: "Study Material",
    aspect: "aspect-[4/3]",
    caption: "Clear, structured handwritten-standard notes designed for effective spaced revision.",
  },
  {
    id: "6",
    title: "Academic Discussion & Problem Solving",
    category: "Collaborative",
    aspect: "aspect-[16/9]",
    caption: "Students collaborating on complex multi-step physics and chemistry numericals.",
  },
];

export const articles = [
  {
    slug: "best-coaching-classes-in-kharadi-pune",
    category: "Local Education Guide",
    classLevel: "Class IX & X",
    title: "How to Choose the Best Coaching Classes in Kharadi & Nearby Areas",
    excerpt:
      "A complete parent's guide for evaluating science coaching, batch size, and conceptual foundation in Kharadi, Chandan Nagar, Wagholi, and Viman Nagar.",
    readingTime: "7 min read",
    date: "September 2026",
    sections: [
      {
        heading: "Why Location and Batch Size Matter in Kharadi",
        content:
          "Kharadi and nearby hubs like Chandan Nagar, Wagholi, Viman Nagar, and Mundhwa have experienced rapid growth. For secondary school students preparing for Class 9 and 10 CBSE & ICSE board examinations, daily travel time directly affects study efficiency. Choosing a specialized academy in Kharadi with strictly controlled batch sizes ensures your child receives individual attention without wasting hours in transit.",
      },
      {
        heading: "Evaluating Science Specialisation vs Mass Coaching",
        content:
          "Mass coaching institutes often combine hundreds of students in a single lecture hall. For core subjects like Physics, Chemistry, and Biology, personal doubt clearance and step-by-step problem-solving are essential. Specialized science academies focus exclusively on deep conceptual clarity, NCERT exemplar practice, and board-pattern answer presentation.",
      },
      {
        heading: "Key Criteria for Parents in Kharadi, Chandan Nagar & Wagholi",
        content:
          "When selecting coaching classes, evaluate four main factors: 1) Experienced subject specialist faculty, 2) Small batch size guaranteeing active participation, 3) Regular chapter-wise testing with detailed mark breakdowns, and 4) Accessible location near key residential landmarks like EON IT Park, WTC Kharadi, Nagar Road, and Mundhwa bridge.",
      },
    ],
  },
  {
    slug: "cbse-icse-science-tuition-kharadi-wagholi-vimannagar",
    category: "Board Preparation",
    classLevel: "Class IX & X",
    title: "CBSE & ICSE Science Tuition in Kharadi, Wagholi & Viman Nagar: A Parent's Guide",
    excerpt:
      "Key strategies to ensure your child excels in 9th & 10th grade Physics, Chemistry, and Biology across top schools in Kharadi and Eastern Pune.",
    readingTime: "6 min read",
    date: "September 2026",
    sections: [
      {
        heading: "Understanding Board Expectations in Eastern Pune Schools",
        content:
          "Students attending top schools in Kharadi, Viman Nagar, Wagholi, and Hadapsar follow rigorous CBSE and ICSE curricula. While CBSE emphasizes conceptual application and NCERT Exemplar numericals, ICSE demands deep factual knowledge, detailed biological diagrams, and observation-based chemistry questions.",
      },
      {
        heading: "Structured Preparation Timeline for Classes 9 & 10",
        content:
          "At Joshi's Academy in Kharadi, we follow a disciplined three-phase preparation model: 1) Conceptual syllabus completion by October, 2) Intensive chapter-wise PYQ marathons through December, and 3) Timed 3-hour pre-board simulations in January and February.",
      },
      {
        heading: "Seamless Access for Students in Nearby Neighborhoods",
        content:
          "Located centrally in Kharadi, Joshi's Academy is easily accessible to students from Chandan Nagar (2 mins), Wagholi (7-10 mins via Nagar Road), Viman Nagar (8 mins), and Keshav Nagar/Mundhwa (5 mins across the river bridge).",
      },
    ],
  },
  {
    slug: "score-90-cbse-class-10-science",
    category: "CBSE Science",
    classLevel: "Class X",
    title: "How to Score 90+ in CBSE Class 10 Science",
    excerpt:
      "A practical, chapter-by-chapter framework for turning the CBSE Science syllabus into a predictable, high-scoring preparation plan.",
    readingTime: "6 min read",
    date: "September 2026",
    sections: [
      {
        heading: "Deconstruct the Three Disciplines",
        content:
          "Scoring 90+ requires recognizing that Physics, Chemistry, and Biology demand distinct preparation styles. Physics rewards numerical practice and ray diagram mastery. Chemistry demands balanced chemical equations and observation tables. Biology requires exact NCERT terminology and neat diagrams.",
      },
      {
        heading: "Master the NCERT Exemplar",
        content:
          "Most board rankers complete the standard NCERT textbook, but distinction students solve the NCERT Exemplar. Competency-based and case-study questions in recent board examinations directly test the higher-order thinking nurtured by Exemplar problems.",
      },
      {
        heading: "Develop an Answer-Writing Template",
        content:
          "CBSE evaluators follow strict marking schemes. Write answers with clear point-wise headings, state formulas before numerical substitution, underline key scientific terms, and draw boxes around final numerical answers with appropriate SI units.",
      },
    ],
  },
  {
    slug: "class-10-science-preparation-strategy",
    category: "Board Strategy",
    classLevel: "Class X",
    title: "Class 10 Science Preparation Strategy",
    excerpt:
      "How to balance conceptual study, written practice, revision cycles, and timed full-length board mock papers.",
    readingTime: "7 min read",
    date: "August 2026",
    sections: [
      {
        heading: "The Three-Phase Academic Year",
        content:
          "Divide your academic session into three deliberate phases: Syllabus Completion (April to September), Chapter-wise Revision & PYQ Marathons (October to December), and Timed Board Simulations (January to February).",
      },
      {
        heading: "Daily Numerical Habits in Physics",
        content:
          "Solve at least 4 numericals daily from Electricity and Light. Trace ray diagrams using a sharp pencil and metric ruler, always including directional arrows to avoid automatic mark deductions.",
      },
    ],
  },
  {
    slug: "physics-numericals-common-mistakes",
    category: "Physics",
    classLevel: "Class IX & X",
    title: "Physics Numericals: Common Mistakes and How to Avoid Them",
    excerpt:
      "The small reasoning and sign-convention errors that cost students valuable board marks—and the systematic habits that prevent them.",
    readingTime: "5 min read",
    date: "August 2026",
    sections: [
      {
        heading: "Cartesian Sign Conventions in Optics",
        content:
          "The single most common error in Class 10 Physics is misapplying signs for focal length and object distance. Remember: object distance (u) is always negative. A concave mirror has a negative focal length, while a convex mirror has a positive focal length.",
      },
      {
        heading: "SI Unit Conversions in Electricity",
        content:
          "Students frequently forget to convert time into seconds when calculating charge (Q = I × t) or fail to convert resistance values from kilo-ohms to ohms. Always write a dedicated 'Given' section with converted SI units first.",
      },
    ],
  },
  {
    slug: "biology-board-exam-preparation",
    category: "Biology",
    classLevel: "Class X",
    title: "Biology Board Exam Preparation: Diagrams, Terms & Answers",
    excerpt:
      "A thoughtful approach to understanding physiological mechanisms, mastering scientific terminology, and scoring full marks on diagrams.",
    readingTime: "6 min read",
    date: "July 2026",
    sections: [
      {
        heading: "Diagram Marking Criteria",
        content:
          "In CBSE and ICSE Biology, diagrams do not require artistic flair—they require anatomical accuracy and clear horizontal labeling lines on the right side. Practice the human nephron, heart structure, and reflex arc weekly.",
      },
      {
        heading: "Precision in Physiological Pathways",
        content:
          "Explain biological processes step-by-step using flowchart summaries. For cellular respiration, map anaerobic vs aerobic pathways with explicit energy output statements (2 ATP vs 38 ATP).",
      },
    ],
  },
  {
    slug: "cbse-vs-icse-science",
    category: "Curriculum Guide",
    classLevel: "Class IX & X",
    title: "CBSE vs ICSE Science: Understanding Curriculum Differences",
    excerpt:
      "An objective comparison of CBSE and ICSE Science curricula in Classes 9 and 10 to help parents and students align their preparation.",
    readingTime: "8 min read",
    date: "July 2026",
    sections: [
      {
        heading: "Integrated Science vs Separate Disciplines",
        content:
          "CBSE evaluates Science as a single integrated 80-mark paper, while ICSE splits Physics, Chemistry, and Biology into three independent 80-mark examinations. ICSE requires significantly deeper factual and experimental coverage.",
      },
      {
        heading: "How Joshi’s Academy Bridges Both Systems",
        content:
          "Because both curricula share core scientific truths, our approach roots students in fundamental laws first, then provides board-specific test papers, terminology drills, and answer format training.",
      },
    ],
  },
  {
    slug: "class-9-science-study-plan",
    category: "Class IX",
    classLevel: "Class IX",
    title: "Class 9 Science Study Plan: Building the Secondary School Base",
    excerpt:
      "Why Class 9 is the pivotal foundation year for secondary science, and how students can transition smoothly from middle school.",
    readingTime: "5 min read",
    date: "June 2026",
    sections: [
      {
        heading: "The Jump from Middle School to Class 9",
        content:
          "In Class 8, Science is largely descriptive. Class 9 introduces formal mathematical physics and quantitative chemistry. Students who develop disciplined daily study routines in Class 9 transition to Class 10 with natural confidence.",
      },
    ],
  },
];
