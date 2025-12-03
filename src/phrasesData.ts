export interface PhraseItem {
  word: string;
  translation: string;
  image: string;
  ipa?: string;
  example?: string;
  exampleTranslation?: string;
  level?: 'Basic' | 'Intermediate' | 'Advanced';
}

export const phrasesData: PhraseItem[] = [
  {
    word: "¿Cómo estás?",
    translation: "How are you?",
    image: "https://images.unsplash.com/photo-1516575334481-f85287c2c81d?auto=format&fit=crop&w=800&q=80",
    ipa: "/ˈko.mo esˈtas/",
    level: "Basic"
  },
  {
    word: "Buenos días",
    translation: "Good morning",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=80",
    ipa: "/ˈbwe.nos ˈdi.as/",
    level: "Basic"
  },
  {
    word: "Buenas noches",
    translation: "Good night",
    image: "https://images.unsplash.com/photo-1472552944129-b035e9ea6fb4?auto=format&fit=crop&w=800&q=80",
    ipa: "/ˈbwe.nas ˈno.tʃes/",
    level: "Basic"
  },
  {
    word: "Por favor",
    translation: "Please",
    image: "https://images.unsplash.com/photo-1453396450673-3fe83d2db2c4?auto=format&fit=crop&w=800&q=80",
    ipa: "/poɾ faˈboɾ/",
    level: "Basic"
  },
  {
    word: "¿Dónde está el baño?",
    translation: "Where is the bathroom?",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    ipa: "/ˈdon.de esˈta el ˈba.ɲo/",
    level: "Basic"
  },
  {
    word: "Me gustaría...",
    translation: "I would like...",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
    ipa: "/me ɡus.taˈɾi.a/",
    level: "Basic"
  },
  {
    word: "¿Cuánto cuesta?",
    translation: "How much does it cost?",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    ipa: "/ˈkwan.to ˈkwes.ta/",
    level: "Basic"
  },
  {
    word: "No entiendo",
    translation: "I don't understand",
    image: "https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?auto=format&fit=crop&w=800&q=80",
    ipa: "/no enˈtjen.do/",
    level: "Basic"
  }
];
