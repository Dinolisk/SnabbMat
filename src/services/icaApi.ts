import { Recipe } from '../types/Recipe';
import localIcaRecipeDatabase from '../data/icaRecipeDatabase.json';

type RawLocalRecipe = Partial<Recipe> & { id?: string; title?: string };

const normalizeDifficulty = (value: string | undefined): 'Lätt' | 'Medel' | 'Svår' => {
  const lower = String(value || '').toLowerCase();
  if (lower.includes('latt') || lower.includes('lätt') || lower.includes('enkel')) return 'Lätt';
  if (lower.includes('medel')) return 'Medel';
  if (lower.includes('svar') || lower.includes('svår')) return 'Svår';
  return 'Lätt';
};

const defaultRecipe = (raw: RawLocalRecipe, index: number): Recipe => ({
  id: raw.id || `ica_local_${index}`,
  title: raw.title || `ICA recept ${index + 1}`,
  description: raw.description || 'Recept fran lokal databas',
  prepTime: raw.prepTime ?? 20,
  cookTime: raw.cookTime ?? 0,
  servings: raw.servings ?? 4,
  difficulty: normalizeDifficulty(raw.difficulty),
  category: raw.category || 'ICA',
  image: raw.image || '🍽️',
  ingredients: raw.ingredients || [],
  instructions: raw.instructions || [],
  tags: raw.tags || ['ICA', 'recept'],
  icaImageId: raw.icaImageId,
  icaAverageRating: raw.icaAverageRating,
  icaOfferCount: raw.icaOfferCount,
  icaIngredientCount: raw.icaIngredientCount,
  icaCookingTime: raw.icaCookingTime,
});

export const loginToICA = async (): Promise<boolean> => {
  return true;
};

export const getRecipesFromICA = async (
  _categoryId?: number,
  _pageNumber: number = 1,
  _recordsPerPage: number = 23
): Promise<Recipe[]> => {
  return (localIcaRecipeDatabase as RawLocalRecipe[]).map(defaultRecipe);
};

export const getRecipeCategories = async (): Promise<{ Id: number; Title: string }[]> => {
  return [];
};

export const getRecipeDetails = async (recipeId: number): Promise<Recipe | null> => {
  try {
    const recipes = await getRecipesFromICA();
    return recipes.find((recipe) => recipe.id === `ica_${recipeId}`) || null;
  } catch {
    return null;
  }
};
