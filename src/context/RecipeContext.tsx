import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types/Recipe';
import { sampleRecipes } from '../data/recipes';
import { ICASampleRecipes } from '../data/icaRecipes';
import { getRecipesFromICA } from '../services/icaApi';

interface RecipeContextType {
  recipes: Recipe[];
  favorites: string[];
  searchQuery: string;
  selectedCategory: string;
  isLoading: boolean;
  useICAApi: boolean;
  dataSource: 'localdb' | 'fallback';
  apiError: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setUseICAApi: (enabled: boolean) => void;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;
  loadRecipesFromICA: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alla');
  const [isLoading, setIsLoading] = useState(false);
  const [useICAApi, setUseICAApi] = useState(false);
  const [dataSource, setDataSource] = useState<'localdb' | 'fallback'>('fallback');
  const [apiError, setApiError] = useState<string | null>(null);

  // Load favorites from storage
  useEffect(() => {
    loadFavorites();
  }, []);

  // Initialize with ICA data
  useEffect(() => {
    // Combine local recipes with ICA recipes
    const allRecipes = [...sampleRecipes, ...ICASampleRecipes];
    setRecipes(allRecipes);
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteRecipes');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (favoriteIds: string[]) => {
    try {
      await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (recipeId: string) => {
    const newFavorites = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId];
    
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (recipeId: string) => {
    return favorites.includes(recipeId);
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, recipe]);
  };

  const removeRecipe = (recipeId: string) => {
    setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    // Also remove from favorites
    const newFavorites = favorites.filter(id => id !== recipeId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const loadRecipesFromICA = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const liveRecipes = await getRecipesFromICA();
      if (liveRecipes.length > 0) {
        setRecipes([...sampleRecipes, ...liveRecipes]);
        setUseICAApi(false);
        setDataSource('localdb');
      } else {
        // Keep app usable even if local database is empty.
        setRecipes([...sampleRecipes, ...ICASampleRecipes]);
        setUseICAApi(false);
        setDataSource('fallback');
        setApiError('Lokal ICA-databas ar tom. Visar fallback.');
      }
    } catch (error) {
      console.error('Error loading ICA recipes:', error);
      setRecipes([...sampleRecipes, ...ICASampleRecipes]);
      setUseICAApi(false);
      setDataSource('fallback');
      setApiError(error instanceof Error ? error.message : 'Kunde inte lasa lokal ICA-databas.');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    recipes,
    favorites,
    searchQuery,
    selectedCategory,
    isLoading,
    useICAApi,
    dataSource,
    apiError,
    setSearchQuery,
    setSelectedCategory,
    setUseICAApi,
    toggleFavorite,
    isFavorite,
    addRecipe,
    removeRecipe,
    loadRecipesFromICA,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
}
