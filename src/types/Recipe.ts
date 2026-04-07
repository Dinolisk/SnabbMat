export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Lätt' | 'Medel' | 'Svår';
  category: string;
  image: string; // emoji or image URL
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  isFavorite?: boolean;
  // ICA API specific fields
  icaImageId?: number;
  icaAverageRating?: string;
  icaOfferCount?: number;
  icaIngredientCount?: number;
  icaCookingTime?: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  isSection?: boolean;
}

export interface RecipeCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}
