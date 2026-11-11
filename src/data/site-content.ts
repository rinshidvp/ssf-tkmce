export type ArticleLanguage = "English" | "Malayalam" | "Arabic";

export interface NavItem {
  label: string;
  href: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  malayalamSubtitle: string;
  category: "Study & Dialogue" | "Campus Life" | "Arts & Literature" | "Welfare & Service";
  schedule: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface DarseSession {
  id: string;
  track: "Weekly Darse" | "Kitab Circle" | "Special Majlis";
  title: string;
  arabicTitle: string;
  malayalamTitle: string;
  schedule: string;
  venue: string;
  arabicQuote: string;
  transliteration: string;
  quoteMeaning: string;
  englishOverview: string;
  malayalamNote: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  malayalamCaption: string;
  album: "Campus Gathering" | "Darse & Study" | "Arts & Literary" | "Ramadan & Service";
  season: string;
  description: string;
  motifSymbol: string;
  palette: "brown" | "bronze" | "terracotta";
}

export interface KnowledgeArticle {
  slug: string;
  language: ArticleLanguage;
  category: string;
  readTime: string;
  publishedLabel: string;
  title: string;
  subtitle: string;
  excerpt: string;
  englishContext?: string;
  body: string[];
  featuredQuote?: string;
}

export interface WingItem {
  number: string;
  name: string;
  malayalamName: string;
  arabicName: string;
  focus: string;
}

export const siteBrand = {
  name: "SSF TKMCE",
  shortName: "SSF",
  campus: "TKM College of Engineering",
  location: "Karicode, Kollam, Kerala",
  taglineEnglish: "Faith · Knowledge · Community",
  taglineMalayalam: "വിശ്വാസം · അറിവ് · കൂട്ടായ്മ",
  taglineArabic: "الإيمان · العلم · الأخوة",
  arabicGreeting: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
  arabicHeroMotto: "طَلَبُ الْعِلْمِ فَرِيضَةٌ",
  arabicHeroTranslation: "Seeking beneficial knowledge is a sacred pursuit.",
  arabicFooterVerse: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
  arabicFooterTranslation: "“My Lord, increase me in knowledge.”",
} as const;

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Activities", href: "/activities" },
  { label: "Darse", href: "/darse" },
  { label: "Memories", href: "/memories" },
  { label: "Knowledge", href: "/knowledge" },
];

export const trilingualHeritage = [
  {
    script: "English",
    nativeLabel: "Campus & Academic Voice",
    description:
      "Clear dialogue, engineering ethics, campus initiatives, and student reflections bridging faith with modern inquiry.",
  },
  {
    script: "Malayalam",
    nativeLabel: "Kerala Roots & Literature",
    description:
      "Kerala’s rich Mappila literary heritage, campus conversations, poetry, and community writings—featured inside Knowledge Corner & Darse.",
  },
  {
    script: "Arabic",
    nativeLabel: "Classical Wisdom & Texts",
    description:
      "Classical Arabic texts, Prophetic wisdom, Quranic reflection, and spiritual terminology grounding our weekly Darse.",
  },
] as const;

export const corePillars = [
  {
    number: "01",
    eyebrow: "FAITH & CHARACTER",
    title: "Rooted in sincerity and moral clarity.",
    body: "Nurturing spiritual steadiness alongside the demands of engineering life—creating space for prayer, reflection, and principled conduct on campus.",
  },
  {
    number: "02",
    eyebrow: "KNOWLEDGE & INQUIRY",
    title: "Where revelation meets critical thought.",
    body: "From classical Darse texts in Arabic to contemporary discussions in English and Malayalam, we treat learning as a lifelong journey.",
  },
  {
    number: "03",
    eyebrow: "COMMUNITY & SERVICE",
    title: "Brotherhood built through presence and care.",
    body: "Welcoming newcomers, supporting peers through campus transitions, and organizing cultural, literary, and welfare initiatives at TKMCE.",
  },
] as const;

export const activities: ActivityItem[] = [
  {
    id: "weekly-darse",
    title: "Weekly Campus Darse",
    malayalamSubtitle: "പ്രതിവാര ക്യാമ്പസ് ദർസ്",
    category: "Study & Dialogue",
    schedule: "Every Thursday · After Maghrib",
    location: "Near Campus Prayer Space, TKMCE",
    summary:
      "Our anchor weekly gathering uniting classical Islamic learning, Quranic reflections, and practical conversations for engineering students.",
    highlights: [
      "Arabic text reading with English & Malayalam explanation",
      "Open student Q&A and peer reflection",
      "Curated short notes shared in Knowledge Corner",
    ],
  },
  {
    id: "sahityotsav",
    title: "Sahityotsav & Literary Arts",
    malayalamSubtitle: "സാഹിത്യോത്സവം · കലയും എഴുത്തും",
    category: "Arts & Literature",
    schedule: "Annual Campus Season",
    location: "TKMCE Campus Grounds",
    summary:
      "Celebrating creative expression across English, Malayalam, and Arabic—essay writing, calligraphy, speech, poetry, and cultural performances.",
    highlights: [
      "Trilingual writing & recitation stages",
      "Arabic calligraphy & visual design showcases",
      "Encouraging first-year students to discover their voice",
    ],
  },
  {
    id: "freshers-welcome",
    title: "Freshers’ Welcome & Mentorship",
    malayalamSubtitle: "നവാഗതർക്ക് സ്നേഹസ്വാഗതം",
    category: "Campus Life",
    schedule: "Start of Academic Year",
    location: "Karicode · TKMCE",
    summary:
      "Helping new engineering students settle into hostel and campus life with academic guidance, friendly mentorship, and an immediate circle of support.",
    highlights: [
      "Peer academic support across departments",
      "Orientation to campus facilities & prayer spaces",
      "Senior-junior brotherhood circles",
    ],
  },
  {
    id: "ramadan-majlis",
    title: "Ramadan Majlis & Community Iftar",
    malayalamSubtitle: "റമദാൻ മജ്‌ലിസും ഇഫ്താർ സംഗമവും",
    category: "Welfare & Service",
    schedule: "Month of Ramadan",
    location: "Campus & Neighbourhood",
    summary:
      "Evenings of spiritual renewal featuring Quranic reflections, collective Iftar gatherings, and student-led charity drives.",
    highlights: [
      "Student-organized campus Iftar nights",
      "Daily short Arabic & Malayalam reminders",
      "Essential care kits for local community initiatives",
    ],
  },
  {
    id: "book-talk",
    title: "The Reading Circle & Book Talks",
    malayalamSubtitle: "വായനക്കൂട്ടായ്മയും സംവാദങ്ങളും",
    category: "Study & Dialogue",
    schedule: "Monthly Saturday Sessions",
    location: "Campus Seminar Courtyard",
    summary:
      "Focused discussions on history, ethics, science, and Mappila intellectual heritage—encouraging thoughtful reading beyond coursework.",
    highlights: [
      "English, Malayalam, and translated classics",
      "Student book reviews published online",
      "Calm space for respectful dialogue",
    ],
  },
  {
    id: "campus-care",
    title: "Student Care & Relief Desk",
    malayalamSubtitle: "വിദ്യാർത്ഥി സഹായവും സേവനവും",
    category: "Welfare & Service",
    schedule: "Year-Round Initiative",
    location: "TKMCE Student Network",
    summary:
      "Quiet, dignified support for peers—study material sharing, emergency assistance, blood donation drives, and exam-season encouragement.",
    highlights: [
      "Note-sharing & peer tutoring support",
      "Coordinated campus blood donation support",
      "Confidential student assistance network",
    ],
  },
];

export const darseSessions: DarseSession[] = [
  {
    id: "ethics-of-seeker",
    track: "Weekly Darse",
    title: "Adab of the Seeker in an Age of Distraction",
    arabicTitle: "آدَابُ طَالِبِ الْعِلْمِ",
    malayalamTitle: "വിദ്യാർത്ഥിയുടെ വിനയവും ലക്ഷ്യബോധവും",
    schedule: "Thursdays · 6:45 PM",
    venue: "TKMCE Prayer Hall Courtyard",
    arabicQuote: "الْعِلْمُ نُورٌ وَلَا يُهْدَى لِعَاصٍ",
    transliteration: "Al-‘ilmu nūrun...",
    quoteMeaning:
      "True knowledge is an inner light—cultivated through humility, consistency, and purity of intention.",
    englishOverview:
      "Drawing from classical treatises on student etiquette, this session explores how engineering students can guard attention, honour teachers, and align technical excellence with spiritual mindfulness.",
    malayalamNote:
      "സാങ്കേതിക പഠനത്തിനിടയിലും ഹൃദയശുദ്ധിയും സമയനിഷ്ഠയും എങ്ങനെ കാത്തുസൂക്ഷിക്കാമെന്നതിനെക്കുറിച്ചുള്ള പ്രതിവാര ചിന്തകൾ.",
  },
  {
    id: "prophetic-mercy",
    track: "Kitab Circle",
    title: "Reading Al-Shama’il: Prophetic Grace in Everyday Life",
    arabicTitle: "الشَّمَائِلُ الْمُحَمَّدِيَّةُ",
    malayalamTitle: "തിരുനബി (സ)യുടെ സൗമ്യതയും ജീവിതരീതിയും",
    schedule: "Tuesdays · 5:30 PM",
    venue: "Hostel Study Circle",
    arabicQuote: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
    transliteration: "Wa mā arsalnāka illā raḥmatan lil-‘ālamīn",
    quoteMeaning:
      "And We have not sent you, [O Muhammad], except as a mercy to the worlds.",
    englishOverview:
      "A chapter-by-chapter study of Prophetic character—gentleness in speech, attentiveness to companions, and composure under pressure.",
    malayalamNote:
      "പ്രവാചക ചര്യയിലെ കാരുണ്യവും സൗമ്യമായ പെരുമാറ്റവും വിദ്യാർത്ഥി ജീവിതത്തിൽ എങ്ങനെ പ്രാവർത്തികമാക്കാം എന്ന പഠനം.",
  },
  {
    id: "quran-reflection",
    track: "Special Majlis",
    title: "Tadabbur Nights: Reflecting on Surah Luqman",
    arabicTitle: "تَدَبُّرُ سُورَةِ لُقْمَانَ",
    malayalamTitle: "സൂറത്തു ലുഖ്മാൻ: യുവതയ്ക്കുള്ള ഉപദേശങ്ങൾ",
    schedule: "First Friday of Month · Evening",
    venue: "Karicode Community Hall",
    arabicQuote: "يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ",
    transliteration: "Yā bunayya aqimiṣ-ṣalāta wa’mur bil-ma‘rūf",
    quoteMeaning:
      "O my dear child, establish prayer, enjoin what is good, forbid what is wrong, and be patient over what befalls you.",
    englishOverview:
      "An intimate evening majlis unpacking Luqman’s counsel to youth: gratitude, humility in walking and speaking, and steady patience.",
    malayalamNote:
      "ലുഖ്മാൻ ഹക്കീം മകന് നൽകിയ ഉപദേശങ്ങളിലൂടെ യുവതലമുറയ്ക്കുള്ള പ്രായോഗിക പാഠങ്ങൾ.",
  },
];

export const memories: MemoryItem[] = [
  {
    id: "evening-darse-archive",
    title: "Thursday Evening Darse Circle",
    malayalamCaption: "വ്യാഴാഴ്ച സന്ധ്യയിലെ വിജ്ഞാന സദസ്സ്",
    album: "Darse & Study",
    season: "Campus Academic Term",
    description:
      "Students gathering beneath warm evening lights after classes—books open, notes shared in English and Malayalam, grounded in quiet reflection.",
    motifSymbol: "۞",
    palette: "brown",
  },
  {
    id: "ramadan-iftar-campus",
    title: "Campus Iftar & Maghrib Gathering",
    malayalamCaption: "ക്യാമ്പസ് ഇഫ്താർ സംഗമവും പ്രാർത്ഥനാ നിമിഷങ്ങളും",
    album: "Ramadan & Service",
    season: "Ramadan Season",
    description:
      "Sharing dates, water, and warm meals together at sunset—turning ordinary hostel evenings into lasting memories of brotherhood.",
    motifSymbol: "☽",
    palette: "terracotta",
  },
  {
    id: "sahityotsav-stage",
    title: "Sahityotsav Literary & Calligraphy Showcase",
    malayalamCaption: "സാഹിത്യോത്സവം — വാക്കുകളുടെയും വരകളുടെയും ഉത്സവം",
    album: "Arts & Literary",
    season: "Annual Cultural Season",
    description:
      "A vibrant celebration of student talent across Malayalam poetry, English essays, and Arabic calligraphic art.",
    motifSymbol: "✦",
    palette: "bronze",
  },
  {
    id: "freshers-circle",
    title: "Welcoming the New Engineering Batch",
    malayalamCaption: "പുതിയ ബാച്ചിന് സ്നേഹനിർഭരമായ വരവേൽപ്പ്",
    album: "Campus Gathering",
    season: "Orientation Week",
    description:
      "First-year students meeting mentors from senior batches over tea, campus stories, and thoughtful introductions.",
    motifSymbol: "◈",
    palette: "brown",
  },
  {
    id: "morning-book-circle",
    title: "Saturday Morning Book & Chai Dialogue",
    malayalamCaption: "ശനിയാഴ്ച രാവിലത്തെ പുസ്തക ചർച്ച",
    album: "Darse & Study",
    season: "Monthly Reading Series",
    description:
      "Unrushed conversations on history, ethics, and student life outside lecture schedules.",
    motifSymbol: "❖",
    palette: "bronze",
  },
  {
    id: "heritage-arch-night",
    title: "Milad & Cultural Evening",
    malayalamCaption: "മധുരമുള്ള സ്മരണകളുടെ സാംസ്കാരിക സന്ധ്യ",
    album: "Campus Gathering",
    season: "Rabi al-Awwal",
    description:
      "Classical Arabic burdah recitations, Malayalam madh songs, and heartfelt reflections on Prophetic character.",
    motifSymbol: "۞",
    palette: "terracotta",
  },
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: "engineering-with-ihsan",
    language: "English",
    category: "Faith & Academia",
    readTime: "4 min read",
    publishedLabel: "Featured Essay",
    title: "Engineering with Ihsan: Excellence as an Act of Worship",
    subtitle: "How campus study, lab discipline, and sincerity converge in the life of a believer.",
    excerpt:
      "Technical competence is not separate from spiritual life. In the Islamic tradition, excellence (ihsan) transforms ordinary problem-solving into purposeful service.",
    featuredQuote: "Verily, Allah loves that when any one of you does a deed, they do it with ihsan (excellence).",
    body: [
      "Walking through the drafting halls and laboratories of TKMCE, it is easy to split life into two compartments: technical coursework during the day and spiritual practice at night. Yet our tradition rejects this division.",
      "The Quran repeatedly invites reflection upon balance, structure, and proportion—from celestial orbits to the precision of water and stone. For an engineering student, mastering fundamentals with honesty is part of fulfilling trust (amanah).",
      "Ihsan asks us not only to complete assignments, but to ask who our work serves. Whether designing resilient infrastructure, cleaner code, or safer systems, intention elevates skill into stewardship.",
    ],
  },
  {
    slug: "arivinte-yathra-campus",
    language: "Malayalam",
    category: "ക്യാമ്പസ് ചിന്തകൾ",
    readTime: "3 min read",
    publishedLabel: "മലയാളം ലേഖനം",
    title: "അറിവിന്റെ യാത്രയും ക്യാമ്പസ് സൗഹൃദങ്ങളും",
    subtitle: "എഞ്ചിനീയറിംഗ് ക്യാമ്പസിലെ തിരക്കുകൾക്കിടയിൽ ആത്മീയതയും വായനയും എങ്ങനെ ചേർത്തുപിടിക്കാം.",
    excerpt:
      "പഠനഭാരങ്ങൾക്കിടയിലും മനസ്സിന് സമാധാനവും ദിശാബോധവും നൽകുന്നത് നല്ല സൗഹൃദങ്ങളും ആഴ്ചയിലൊരിക്കൽ ചേരുന്ന അറിവിന്റെ സദസ്സുകളുമാണ്.",
    englishContext:
      "A Malayalam reflection on balancing rigorous engineering studies with spiritual grounding, reading circles, and supportive friendships on campus.",
    featuredQuote: "“നല്ല കൂട്ടുകെട്ടുകൾ മനുഷ്യനെ ഉന്നതിയിലേക്കും വിനയത്തിലേക്കും കൈപിടിച്ചുയർത്തുന്നു.”",
    body: [
      "കോളേജ് ജീവിതം കേവലം മാർക്കുകളുടെയും പരീക്ഷകളുടെയും പട്ടിക മാത്രമല്ല; നമ്മുടെ വ്യക്തിത്വവും മൂല്യബോധവും രൂപപ്പെടുന്ന നിർണ്ണായക കാലഘട്ടം കൂടിയാണ്.",
      "ക്ലാസ് മുറികളിലെ പാഠങ്ങൾക്കപ്പുറം, ആഴ്ചയിലൊരിക്കൽ ഒത്തുചേരുന്ന ദർസുകളും പുസ്തക ചർച്ചകളും നമ്മുടെ ചിന്തകൾക്ക് ആഴവും തെളിച്ചവും നൽകുന്നു.",
      "വിശ്വാസവും അറിവും സേവനമനോഭാവവും ഒരുമിച്ചു ചേരുമ്പോഴാണ് ഒരു ക്യാമ്പസ് കൂട്ടായ്മ സമൂഹത്തിന് വെളിച്ചമായി മാറുന്നത്.",
    ],
  },
  {
    slug: "talab-al-ilm-fi-al-jamia",
    language: "Arabic",
    category: "تأملات علمية",
    readTime: "3 min read",
    publishedLabel: "مقال عربي",
    title: "طَلَبُ الْعِلْمِ وَأَدَبُ الطَّالِبِ فِي الْحَرَمِ الْجَامِعِيِّ",
    subtitle: "كيف يجمع طالب الهندسة بين التميز الأكاديمي والسكينة الإيمانية.",
    excerpt:
      "العلم النافع نورٌ يهدي العقل ويزكي القلب، وحين يرتبط الإخلاص بالاجتهاد يصبح التعلم عبادةً وعطاءً.",
    englishContext:
      "An Arabic reflection on combining academic diligence in university life with humility, sincerity, and companionship in faith.",
    featuredQuote: "«مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ»",
    body: [
      "إنَّ الحياةَ الجامعيةَ مرحلةٌ تأسيسيةٌ تُصاغُ فيها هممُ الشباب وتُبنى فيها معالمُ المستقبلِ العلميِّ والأخلاقيِّ.",
      "ولقد علّمنا تراثُنا الإسلاميُّ أنَّ شرفَ العلمِ يزدادُ بتواضعِ طالبِهِ، وصدقِ نيتِهِ، وحرصِهِ على نفعِ الناسِ بما يتعلمُهُ.",
      "وفي حلقاتِ الدرسِ الأسبوعيةِ نجدُ واحةً للروحِ، نجددُ فيها العهدَ مع القرآنِ والذكرِ والصحبةِ الصالحةِ.",
    ],
  },
  {
    slug: "mappila-literary-legacy",
    language: "Malayalam",
    category: "സാംസ്കാരിക പൈതൃകം",
    readTime: "4 min read",
    publishedLabel: "പൈതൃക കുറിപ്പ്",
    title: "മാപ്പിള സാഹിത്യവും ബഹുഭാഷാ സംസ്കാരവും",
    subtitle: "അറബി-മലയാളം പാരമ്പര്യം നമ്മുടെ വിദ്യാർത്ഥി തലമുറയ്ക്ക് നൽകുന്ന പ്രചോദനം.",
    excerpt:
      "അറബിയും മലയാളവും ഇംഗ്ലീഷും പരസ്പരം സംവദിച്ച ചരിത്രമുള്ള കേരളീയ മുസ്‌ലിം വൈജ്ഞാനിക പാരമ്പര്യത്തെക്കുറിച്ച് ഒരു ചെറുകുറിപ്പ്.",
    englishContext:
      "Exploring how Kerala’s Arabi-Malayalam literary heritage inspires a campus culture fluent in Arabic wisdom, Malayalam expression, and global English scholarship.",
    featuredQuote: "“ഭാഷകൾ വേർതിരിവുകളല്ല; അറിവിനെ കൈമാറുന്ന പാലങ്ങളാണ്.”",
    body: [
      "നൂറ്റാണ്ടുകളായി കേരളത്തിലെ വൈജ്ഞാനിക സദസ്സുകൾ അറബി ഭാഷയിലെ ഗഹനമായ അറിവുകളെ മലയാളത്തിന്റെ ഹൃദയഭാഷയിലേക്ക് വിവർത്തനം ചെയ്തുകൊണ്ടിരുന്നു.",
      "ഇന്ന് ആധുനിക സാങ്കേതിക വിദ്യാഭ്യാസത്തിന്റെ കാലത്ത് ഇംഗ്ലീഷും നമ്മുടെ പഠനമാധ്യമമായി മാറിയപ്പോൾ, ഈ മൂന്നു ഭാഷകളുടെയും സൗന്ദര്യം ഒരേ വേദിയിൽ സംഗമിക്കുന്നു.",
      "SSF TKMCE പോലുള്ള ക്യാമ്പസ് വേദികൾ ഈ സമ്പന്നമായ പൈതൃകത്തെ പുതിയ തലമുറയ്ക്ക് പരിചയപ്പെടുത്തുന്നു.",
    ],
  },
  {
    slug: "quiet-architecture-of-community",
    language: "English",
    category: "Campus Community",
    readTime: "3 min read",
    publishedLabel: "Community Note",
    title: "The Quiet Architecture of Campus Brotherhood",
    subtitle: "Why consistent small gatherings matter more than loud events.",
    excerpt:
      "Real community is rarely built on spectacle. It grows through remembered names, shared tea after class, and showing up week after week.",
    body: [
      "Most campus clubs are remembered for a single annual banner. Yet what sustains students through tough semesters, homesickness, and late-night project deadlines is something far quieter.",
      "It is a familiar greeting outside the library, a calm Thursday evening Darse when the week feels chaotic, and seniors who check in without being asked.",
      "By keeping our doors open and our gatherings grounded in warmth, SSF TKMCE strives to be a second home on campus.",
    ],
  },
  {
    slug: "al-suhbah-wal-ukhuwwah",
    language: "Arabic",
    category: "الأخوة والقيم",
    readTime: "3 min read",
    publishedLabel: "خاطرة روحية",
    title: "الصُّحْبَةُ الصَّالِحَةُ وَأَثَرُهَا فِي الثَّبَاتِ",
    subtitle: "الأخوة الإيمانية سندٌ للطالب في طريق العلم والعمل.",
    excerpt:
      "لا يسير المسافرُ في طريقِ العلمِ وحيدًا؛ بل يشدُّ أزرَهُ رفاقٌ يذكرونَهُ بالخيرِ كلما فترت همتُهُ.",
    englishContext:
      "On the role of righteous companionship in keeping students steady, hopeful, and purposeful during college years.",
    featuredQuote: "«الْمَرْءُ عَلَى دِينِ خَلِيلِهِ فَلْيَنْظُرْ أَحَدُكُمْ مَنْ يُخَالِلُ»",
    body: [
      "تتقلبُ أيامُ الطالبِ بين جدِّ الامتحاناتِ وهمومِ الغربةِ، وهنا يظهرُ أثرُ الأخوةِ الصادقةِ التي تملأُ القلبَ طمأنينةً.",
      "في مجالسِ الذكرِ واللقاءاتِ الأخويةِ، تتصافى القلوبُ وتتقاربُ النفوسُ على محبةِ اللهِ وخدمةِ المجتمعِ.",
    ],
  },
];

export const campusWings: WingItem[] = [
  {
    number: "01",
    name: "Campus Coordination",
    malayalamName: "ക്യാമ്പസ് ഏകോപനം",
    arabicName: "تنسيق الوحدة",
    focus: "Stewarding unit programmes, academic-year calendar, and inter-batch mentorship at TKMCE.",
  },
  {
    number: "02",
    name: "Darse & Academic Wing",
    malayalamName: "ദർസ് & പഠന വിഭാഗം",
    arabicName: "قسم الدروس والعلم",
    focus: "Curating weekly Thursday Darse, Kitab study circles, and reading lists across classical & modern works.",
  },
  {
    number: "03",
    name: "Literary & Sahityotsav Wing",
    malayalamName: "സാഹിത്യോത്സവ വിഭാഗം",
    arabicName: "القسم الأدبي والثقافي",
    focus: "Nurturing student writing, calligraphy, speech, and trilingual expression across English, Malayalam, and Arabic.",
  },
  {
    number: "04",
    name: "Welfare & Media Desk",
    malayalamName: "സേവന-മാധ്യമ വിഭാഗം",
    arabicName: "الخدمة والإعلام",
    focus: "Student care initiatives, Ramadan Iftar coordination, archive documentation, and publication design.",
  },
];
