export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  category: 'Greetings' | 'Food' | 'Travel' | 'Family' | 'Nature';
  image: string;
  ipa: string;
  example: string;
  gender?: 'Masculine' | 'Feminine';
}

export const vocabularyData: VocabularyItem[] = [
  {
    id: '1',
    word: 'Hola',
    translation: 'Hello',
    level: 'Basic',
    category: 'Greetings',
    image: 'https://images.unsplash.com/photo-1596436082449-3839a285a86d?auto=format&fit=crop&w=800&q=80',
    ipa: '/ˈo.la/',
    example: 'Hola, ¿cómo estás?',
    gender: undefined
  },
  {
    id: '2',
    word: 'Manzana',
    translation: 'Apple',
    level: 'Basic',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    ipa: '/manˈθa.na/',
    example: 'Me gusta comer una manzana al día.',
    gender: 'Feminine'
  },
  {
    id: '3',
    word: 'Gato',
    translation: 'Cat',
    level: 'Basic',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    ipa: '/ˈɡa.to/',
    example: 'El gato duerme en el sofá.',
    gender: 'Masculine'
  },
  {
    id: '4',
    word: 'Playa',
    translation: 'Beach',
    level: 'Basic',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ipa: '/ˈpla.ʝa/',
    example: 'Vamos a la playa este fin de semana.',
    gender: 'Feminine'
  },
  {
    id: '5',
    word: 'Familia',
    translation: 'Family',
    level: 'Basic',
    category: 'Family',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    ipa: '/faˈmi.lja/',
    example: 'Amo a mi familia.',
    gender: 'Feminine'
  },
  {
    id: '6',
    word: 'Desayuno',
    translation: 'Breakfast',
    level: 'Intermediate',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1533089862017-5614ec45e25a?auto=format&fit=crop&w=800&q=80',
    ipa: '/de.saˈʝu.no/',
    example: 'El desayuno es la comida más importante.',
    gender: 'Masculine'
  },
  {
    id: '7',
    word: 'Aeropuerto',
    translation: 'Airport',
    level: 'Intermediate',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    ipa: '/a.e.ɾoˈpweɾ.to/',
    example: 'Llegamos al aeropuerto a tiempo.',
    gender: 'Masculine'
  },
  {
    id: '8',
    word: 'Montaña',
    translation: 'Mountain',
    level: 'Intermediate',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    ipa: '/monˈta.ɲa/',
    example: 'La vista desde la montaña es increíble.',
    gender: 'Feminine'
  },
  {
    id: '9',
    word: 'Hermano',
    translation: 'Brother',
    level: 'Basic',
    category: 'Family',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    ipa: '/eɾˈma.no/',
    example: 'Mi hermano juega al fútbol.',
    gender: 'Masculine'
  },
  {
    id: '10',
    word: 'Gracias',
    translation: 'Thank you',
    level: 'Basic',
    category: 'Greetings',
    image: 'https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&w=800&q=80',
    ipa: '/ˈɡɾa.θjas/',
    example: 'Muchas gracias por tu ayuda.',
    gender: undefined
  }
];
