import { useMemo } from 'react';
import { useRecipeContext } from '../context/RecipeContext';

export function useFilteredRecipes() {
  const { recipes, searchQuery, selectedCategory } = useRecipeContext();

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = searchQuery === '' || 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Alla' || recipe.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  return filteredRecipes;
}
