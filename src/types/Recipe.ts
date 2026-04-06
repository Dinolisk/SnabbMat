export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Lätt' | 'Medel' | 'Svår';
  category: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  isFavorite?: boolean;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface RecipeCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}
