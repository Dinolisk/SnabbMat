import { Recipe } from '../types/Recipe';

// ICA Recipe Categories (from API)
export const ICACategories = [
  { id: 1, name: 'Billiga Veckan', icon: '💰', color: '#FFB3BA' },
  { id: 36, name: 'Grillrecept', icon: '🍖', color: '#BAFFC9' },
  { id: 37, name: 'Sallader', icon: '🥗', color: '#BAE1FF' },
  { id: 24, name: 'Grönare middagar', icon: '🥬', color: '#C7CEEA' },
  { id: 19, name: 'Vegetariska recept', icon: '🥬', color: '#90EE90' },
  { id: 39, name: 'Jordgubbar', icon: '🌰', color: '#8B4513' },
  { id: 11, name: 'Soppor', icon: '🍲', color: '#C7CEEA' },
  { id: 10, name: 'Kyckling', icon: '🍗', color: '#FFD700' },
  { id: 12, name: 'Paj', icon: '🥧', color: '#DEB887' },
  { id: 13, name: 'Lasagne', icon: '🍝', color: '#E27B25' },
  { id: 35, name: 'Bakverk', icon: '🥐', color: '#F4A460' },
  { id: 31, name: 'Frukost', icon: '🧀', color: '#FFEAA7' },
  { id: 25, name: 'Smoothies', icon: '🥤', color: '#DDA0DD' },
  { id: 3, name: 'Tidningen Buffé', icon: '🍽', color: '#FF6B35' },
  { id: 14, name: 'Grytor', icon: '🍲', color: '#8B4513' },
  { id: 21, name: 'Fisk', icon: '🐟', color: '#4FC3F7' }
];

// Sample recipes from ICA (first batch - more can be added)
export const ICASampleRecipes: Recipe[] = [
  {
    id: 'ica_001',
    title: 'Ugnsbakad lax med limecrème fraiche',
    description: 'En krämig och färska laxrätt med en fräsch limecrème fraiche. Perfekt för en snabb och lyxig middag.',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Medel',
    category: 'Fisk',
    image: 'https://handla.api.ica.se/api/images/79179',
    ingredients: [
      { name: 'Färsk lax', amount: '600', unit: 'g' },
      { name: 'Lime', amount: '2', unit: 'st' },
      { name: 'Dill', amount: '1', unit: 'tsk' },
      { name: 'Krasse', amount: '100', unit: 'g' },
      { name: 'Grädd lök', amount: '2', unit: 'st' },
      { name: 'Crème fraîche', amount: '2', unit: 'dl' },
      { name: 'Svartpeppar', amount: '1', unit: 'krm' },
      { name: 'Salt', amount: '1', unit: 'tsk' },
      { name: 'Potatis', amount: '400', unit: 'g' },
      { name: 'Smör', amount: '50', unit: 'g' }
    ],
    instructions: [
      'Skär laxen i tunna skivor.',
      'Blanda limecrème fraîche och dill.',
      'Stek dill och lök i smör tills de blir mjuka.',
      'Koka potatis i saltat vatten ca 15 min.',
      'Häll av potatis och blanda med dill, lök och crème fraîche.',
      'Blanda ner laxen och smör.',
      'Krydda med svartpeppar.',
      'Servera med potatis och dill.',
      'Dekorera med persilja.'
    ],
    tags: ['fisk', 'lax', 'middag', 'svensk']
  },
  {
    id: 'ica_002',
    title: 'Kycklingwok med grönsaker',
    description: 'Snabb och näringsrik wok med färska grönsaker. Perfekt för en stressig vardagskväll.',
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    difficulty: 'Lätt',
    category: 'Kyckling',
    image: '🍗', // Use emoji instead of invalid URL
    ingredients: [
      { name: 'Kycklingfilé', amount: '400', unit: 'g' },
      { name: 'Bok choy', amount: '150', unit: 'g' },
      { name: 'Sötpaprika', amount: '1', unit: 'st' },
      { name: 'Morötter', amount: '2', unit: 'st' },
      { name: 'Vitlök', amount: '2', unit: 'klyftor' },
      { name: 'Broccoli', amount: '200', unit: 'g' },
      { name: 'Soja', amount: '3', unit: 'msk' },
      { name: 'Ingefärsolja', amount: '2', unit: 'msk' },
      { name: 'Vitlök', amount: '2', unit: 'klyftor' }
    ],
    instructions: [
      'Skär kycklingen i tunna skivor.',
      'Stek kycklingen tills den är genomstekt.',
      'Tillsätt hackad vitlök och stek 1 minut.',
      'Tillsätt broccoli och paprika i woken 3-4 minuter.',
      'Tillsätt morötter och vitlök.',
      'Blanda i woken med kyckling och soja.',
      'Woka allt tillsammans i 2 minuter.',
      'Servera direkt med ris.'
    ],
    tags: ['wok', 'kyckling', 'grönsaker', 'snabb', 'asiatisk']
  },
  {
    id: 'ica_003',
    title: 'Enkel caprese sallad',
    description: 'Fräsch och enkel caprese sallad med mozzarella, basilika och olivolja. Perfekt som lunch eller lättare middag.',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: 'Lätt',
    category: 'Sallader',
    image: '🥗', // Use emoji instead of invalid URL
    ingredients: [
      { name: 'Tomater', amount: '4', unit: 'st' },
      { name: 'Mozzarella', amount: '200', unit: 'g' },
      { name: 'Basilika', amount: '1', unit: 'knippe' },
      { name: 'Olivolja', amount: '3', unit: 'msk' },
      { name: 'Balsamvinäger', amount: '1', unit: 'msk' },
      { name: 'Salt & peppar', amount: '1', unit: 'krm' }
    ],
    instructions: [
      'Skiva tomater och mozzarella.',
      'Lägg dem växelvis på ett fat.',
      'Strö över basilikablad.',
      'Blanda olivolja och balsamvinäger.',
      'Häll över dressingen.',
      'Krydda med salt och peppar.'
    ],
    tags: ['sallad', 'vegetarisk', 'färsk', 'lätt', 'italiensk']
  }
];

// Function to get all ICA recipes (for initial import)
export const getAllICARecipes = (): Recipe[] => {
  return ICASampleRecipes;
};

// Function to get ICA categories
export const getICACategories = () => {
  return ICACategories;
};
