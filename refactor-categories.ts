import fs from "fs";
import { type VocabularyItem, vocabularyData } from "./src/vocabularyData";

// New Categories based on User Request
const NewCategories = {
  // Phase 1: The Essentials
  Greetings: "Greetings & Social Courtesies",
  Pronouns: "Pronouns",
  QuestionWords: "Question Words",
  Connectors: "Connectors",
  Numbers: "Numbers & Quantifiers",
  Time: "Time & Calendar",
  
  // Phase 2: Me and My Life
  Body: "The Body & Health",
  Family: "Family & Relationships",
  Home: "Home & Furniture",
  Clothing: "Clothing & Accessories",
  Routine: "Daily Routine",
  
  // Phase 3: Food & Dining
  Ingredients: "Ingredients",
  Drinks: "Drinks",
  Tastes: "Tastes & Textures",
  Restaurant: "At the Restaurant",
  
  // Phase 4: Out & About
  Transportation: "Transportation",
  City: "City & Places",
  Directions: "Directions & Location",
  Nature: "Nature & Weather",
  Animals: "Animals",
  
  // Phase 5: Society, Work, & Abstract
  Professions: "Professions",
  School: "School & Study",
  Technology: "Technology & Media",
  Emotions: "Emotions & Personality",
  Adjectives: "Descriptive Adjectives",
  
  // Fallback/General
  Verbs: "Verbs", // Keeping 'Verbs' as a category for high frequency verbs not fitting 'Daily Routine'
  Abstract: "Abstract", // Keeping 'Abstract' for general abstract concepts
} as const;

// Mapping logic
const getNewCategory = (item: VocabularyItem): string => {
  const word = item.word.toLowerCase();
  const oldCategory = item.category;

  // 1. Direct Word Mapping (Overrides)
  const wordMapping: Record<string, string> = {
    // Greetings
    "hola": NewCategories.Greetings,
    "adiós": NewCategories.Greetings,
    "gracias": NewCategories.Greetings,
    "por favor": NewCategories.Greetings,
    "perdón": NewCategories.Greetings,
    "lo siento": NewCategories.Greetings,
    
    // Pronouns
    "yo": NewCategories.Pronouns,
    "tú": NewCategories.Pronouns,
    "él": NewCategories.Pronouns,
    "ella": NewCategories.Pronouns,
    "nosotros": NewCategories.Pronouns,
    "ellos": NewCategories.Pronouns,
    "mi": NewCategories.Pronouns, // Possessive
    "tu": NewCategories.Pronouns,
    "su": NewCategories.Pronouns,
    
    // Question Words
    "qué": NewCategories.QuestionWords,
    "quién": NewCategories.QuestionWords,
    "dónde": NewCategories.QuestionWords,
    "cuándo": NewCategories.QuestionWords,
    "cómo": NewCategories.QuestionWords,
    "por qué": NewCategories.QuestionWords,
    "cuánto": NewCategories.QuestionWords,
    
    // Connectors (and Grammar glue)
    "y": NewCategories.Connectors,
    "o": NewCategories.Connectors,
    "pero": NewCategories.Connectors,
    "porque": NewCategories.Connectors,
    "aunque": NewCategories.Connectors,
    "si": NewCategories.Connectors,
    "de": NewCategories.Connectors, // Preposition
    "a": NewCategories.Connectors,
    "en": NewCategories.Connectors,
    "con": NewCategories.Connectors,
    "por": NewCategories.Connectors,
    "para": NewCategories.Connectors,
    "el": NewCategories.Connectors, // Articles
    "la": NewCategories.Connectors,
    "los": NewCategories.Connectors,
    "las": NewCategories.Connectors,
    "un": NewCategories.Connectors,
    "una": NewCategories.Connectors,
    
    // Numbers
    "uno": NewCategories.Numbers,
    "dos": NewCategories.Numbers,
    "tres": NewCategories.Numbers,
    "cuatro": NewCategories.Numbers,
    "cinco": NewCategories.Numbers,
    "diez": NewCategories.Numbers,
    "cien": NewCategories.Numbers,
    "mil": NewCategories.Numbers,
    "primero": NewCategories.Numbers,
    "segundo": NewCategories.Numbers,
    "mucho": NewCategories.Numbers,
    "poco": NewCategories.Numbers,
    "todo": NewCategories.Numbers,
    "nada": NewCategories.Numbers,
    
    // Time
    "hoy": NewCategories.Time,
    "mañana": NewCategories.Time,
    "ayer": NewCategories.Time,
    "día": NewCategories.Time,
    "noche": NewCategories.Time,
    "semana": NewCategories.Time,
    "mes": NewCategories.Time,
    "año": NewCategories.Time,
    "hora": NewCategories.Time,
    "lunes": NewCategories.Time,
    "enero": NewCategories.Time,
    "tiempo": NewCategories.Time,
    "vez": NewCategories.Time,
    "ya": NewCategories.Time,
    
    // Body
    "cabeza": NewCategories.Body,
    "mano": NewCategories.Body,
    "pie": NewCategories.Body,
    "ojo": NewCategories.Body,
    "boca": NewCategories.Body,
    "cuerpo": NewCategories.Body,
    "dolor": NewCategories.Body,
    "médico": NewCategories.Body,
    
    // Family
    "madre": NewCategories.Family,
    "padre": NewCategories.Family,
    "hermano": NewCategories.Family,
    "hermana": NewCategories.Family,
    "hijo": NewCategories.Family,
    "hija": NewCategories.Family,
    "amigo": NewCategories.Family,
    "familia": NewCategories.Family,
    "mujer": NewCategories.Family, // Context dependent, but often family/people
    "hombre": NewCategories.Family,
    "niño": NewCategories.Family,
    "niña": NewCategories.Family,
    "gente": NewCategories.Family,
    "persona": NewCategories.Family,
    
    // Home
    "casa": NewCategories.Home,
    "mesa": NewCategories.Home,
    "silla": NewCategories.Home,
    "cama": NewCategories.Home,
    "puerta": NewCategories.Home,
    "ventana": NewCategories.Home,
    "cocina": NewCategories.Home,
    "baño": NewCategories.Home,
    "luz": NewCategories.Home,
    
    // Clothing
    "ropa": NewCategories.Clothing,
    "camisa": NewCategories.Clothing,
    "zapato": NewCategories.Clothing,
    
    // Food/Ingredients
    "agua": NewCategories.Drinks,
    "café": NewCategories.Drinks,
    "té": NewCategories.Drinks,
    "vino": NewCategories.Drinks,
    "cerveza": NewCategories.Drinks,
    "pan": NewCategories.Ingredients,
    "carne": NewCategories.Ingredients,
    "fruta": NewCategories.Ingredients,
    "manzana": NewCategories.Ingredients,
    "comida": NewCategories.Ingredients,
    
    // Transportation
    "coche": NewCategories.Transportation,
    "autobús": NewCategories.Transportation,
    "tren": NewCategories.Transportation,
    "avión": NewCategories.Transportation,
    "calle": NewCategories.Transportation,
    "camino": NewCategories.Transportation,
    
    // City
    "ciudad": NewCategories.City,
    "escuela": NewCategories.City,
    "hospital": NewCategories.City,
    "tienda": NewCategories.City,
    "banco": NewCategories.City,
    "país": NewCategories.City,
    "mundo": NewCategories.City,
    
    // Nature
    "sol": NewCategories.Nature,
    "luna": NewCategories.Nature,
    "lluvia": NewCategories.Nature,
    "árbol": NewCategories.Nature,
    "flor": NewCategories.Nature,
    "mar": NewCategories.Nature,
    "montaña": NewCategories.Nature,
    
    // Animals
    "animal": NewCategories.Animals,
    "perro": NewCategories.Animals,
    "gato": NewCategories.Animals,
    "pájaro": NewCategories.Animals,
    "caballo": NewCategories.Animals,
    
    // Professions
    "trabajo": NewCategories.Professions,
    "profesor": NewCategories.Professions,
    "estudiante": NewCategories.Professions,
    "doctor": NewCategories.Professions,
    
    // School
    "libro": NewCategories.School,
    "papel": NewCategories.School,
    "palabra": NewCategories.School,
    "estudiar": NewCategories.School,
    "escribir": NewCategories.School,
    "leer": NewCategories.School,
    
    // Technology
    "teléfono": NewCategories.Technology,
    "ordenador": NewCategories.Technology,
    "internet": NewCategories.Technology,
    
    // Emotions
    "feliz": NewCategories.Emotions,
    "triste": NewCategories.Emotions,
    "amor": NewCategories.Emotions,
    "miedo": NewCategories.Emotions,
    
    // Adjectives
    "grande": NewCategories.Adjectives,
    "pequeño": NewCategories.Adjectives,
    "bueno": NewCategories.Adjectives,
    "malo": NewCategories.Adjectives,
    "nuevo": NewCategories.Adjectives,
    "viejo": NewCategories.Adjectives,
    "bonito": NewCategories.Adjectives,
    "feo": NewCategories.Adjectives,
    "fácil": NewCategories.Adjectives,
    "difícil": NewCategories.Adjectives,
    "importante": NewCategories.Adjectives,
    "mismo": NewCategories.Adjectives,
    "otro": NewCategories.Adjectives,
  };

  if (wordMapping[word]) {
    return wordMapping[word];
  }

  // 2. Category Mapping (Fallback)
  switch (oldCategory) {
    case "Greetings": return NewCategories.Greetings;
    case "Food": return NewCategories.Ingredients; // Default to Ingredients
    case "Travel": return NewCategories.Transportation; // Default to Transportation
    case "Family": return NewCategories.Family;
    case "Nature": return NewCategories.Nature;
    case "Grammar": return NewCategories.Connectors; // Default to Connectors
    case "Verbs": return NewCategories.Verbs; // Keep Verbs
    case "Common Nouns": return NewCategories.Home; // Default to Home, risky but better than nothing
    case "Time & Numbers": return NewCategories.Time; // Default to Time
    case "People": return NewCategories.Family; // Default to Family
    case "Society": return NewCategories.City; // Default to City
    case "Abstract": return NewCategories.Abstract;
    case "Adjectives": return NewCategories.Adjectives;
    default: return NewCategories.Abstract; // Ultimate fallback
  }
};

const updatedData = vocabularyData.map((item) => {
  const newCategory = getNewCategory(item);
  return { ...item, category: newCategory };
});

const content = `export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  category: 
    // Phase 1
    'Greetings & Social Courtesies' | 'Pronouns' | 'Question Words' | 'Connectors' | 'Numbers & Quantifiers' | 'Time & Calendar' |
    // Phase 2
    'The Body & Health' | 'Family & Relationships' | 'Home & Furniture' | 'Clothing & Accessories' | 'Daily Routine' |
    // Phase 3
    'Ingredients' | 'Drinks' | 'Tastes & Textures' | 'At the Restaurant' |
    // Phase 4
    'Transportation' | 'City & Places' | 'Directions & Location' | 'Nature & Weather' | 'Animals' |
    // Phase 5
    'Professions' | 'School & Study' | 'Technology & Media' | 'Emotions & Personality' | 'Descriptive Adjectives' |
    // Extras
    'Verbs' | 'Abstract';
  image: string;
  ipa: string;
  example: string;
  exampleTranslation: string;
  gender?: 'Masculine' | 'Feminine';
}

export const vocabularyData: VocabularyItem[] = ${JSON.stringify(updatedData, null, 2)};
`;

fs.writeFileSync("./src/vocabularyData.ts", content);
console.log("Refactor complete.");
