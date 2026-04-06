import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types/Recipe';
import { sampleRecipes } from '../data/recipes';

interface RecipeContextType {
  recipes: Recipe[];
  favorites: string[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alla');

  // Load favorites from storage
  useEffect(() => {
    loadFavorites();
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

  const value = {
    recipes,
    favorites,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    toggleFavorite,
    isFavorite,
    addRecipe,
    removeRecipe,
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
