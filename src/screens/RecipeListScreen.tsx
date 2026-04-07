/**
 * RecipeListScreen - Huvudskärm för att visa och filtrera recept
 * 
 * Funktioner:
 * - Visa lista med recept från ICA och lokala recept
 * - Sökfunktion för att hitta specifika recept
 * - Kategorifiltrering med navigering
 * - Lazy loading med 12 recept per sida
 * - "Visa fler recept" knapp för att ladda mer
 */
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { categories } from '../data/recipes';
import { Recipe } from '../types/Recipe';
import { useRecipeContext } from '../context/RecipeContext';
import { RecipeCard } from '../components/RecipeCard';
import { PageContainer } from '../components/PageContainer';

export default function RecipeListScreen({ navigation }: any) {
  // State för att hantera antal synliga recept och kategorinavigering
  const [visibleRecipes, setVisibleRecipes] = useState(12); 
  const [categoryOffset, setCategoryOffset] = useState(0); 
  const { width } = useWindowDimensions(); // För responsiv design

  // Hämta kontextdata för recept och funktioner
  const { 
    searchQuery, 
    selectedCategory, 
    setSearchQuery, 
    setSelectedCategory,
    recipes,
    isLoading,
    apiError,
    loadRecipesFromICA
  } = useRecipeContext();

  // Ladda recept från ICA när komponenten monteras
  useEffect(() => {
    loadRecipesFromICA();
  }, []);

  // Filtrera recept baserat på sök och vald kategori
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Sök i titel, beskrivning och taggar
      const matchesSearch = searchQuery === '' ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Matcha kategori eller visa alla
      const matchesCategory = selectedCategory === 'Alla' || recipe.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  // Hantera visning av recept - visa 12 initialt, ladda 12 mer per klick
  const displayedRecipes = filteredRecipes.slice(0, visibleRecipes);
  const hasMoreRecipes = visibleRecipes < filteredRecipes.length; // Visa knapp om det finns fler recept

  // Ladda 12 nya recept när användaren klickar på "Visa fler recept"
  const loadMoreRecipes = () => {
    setVisibleRecipes(prev => Math.min(prev + 12, filteredRecipes.length));
  };

  // Navigera till receptdetaljer när användaren klickar på ett recept
  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
  };

  // Rendera ett enskilt receptkort
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} onPress={handleRecipePress} />
  );

  // Skapa metadata för kategorier (ikon och färg)
  const categoryMeta = useMemo(() => {
    const map = new Map<string, { icon: string; color: string }>();
    categories.forEach((cat) => map.set(cat.name, { icon: cat.icon, color: cat.color }));
    return map;
  }, []);

  // Rendera en enskild kategoriknapp för filtrering
  const renderCategoryFilter = (category: { name: string; icon: string; color: string }) => (
    <TouchableOpacity
      key={category.name}
      style={[
        styles.categoryCardFilter,
        selectedCategory === category.name && styles.selectedCategoryCardFilter
      ]}
      onPress={() => setSelectedCategory(category.name)}
    >
      <View style={[styles.categoryFilterIcon, { backgroundColor: category.color }]}>
        <Text style={styles.categoryFilterEmoji}>{category.icon}</Text>
      </View>
      <Text style={[
        styles.categoryFilterText,
        selectedCategory === category.name && styles.selectedCategoryFilterText
      ]} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  // Hämta unika kategorinamn från recepten och sortera alfabetiskt
  const availableCategoryNames = useMemo(() => {
    const counts = new Map<string, number>();
    recipes.forEach((recipe) => {
      counts.set(recipe.category, (counts.get(recipe.category) || 0) + 1);
    });
    return [...counts.entries()]
      .filter(([, count]) => count > 0)
      .map(([name]) => name)
      .sort((a, b) => a.localeCompare(b, 'sv')); // Svensk sortering
  }, [recipes]);

  const mergedCategories = useMemo(() => {
    return ['Alla', ...availableCategoryNames].map((name) => {
      if (name === 'Alla') {
        return { name, icon: '🍽️', color: '#E8F5E8' };
      }
      const meta = categoryMeta.get(name);
      return {
        name,
        icon: meta?.icon || '🍴',
        color: meta?.color || '#EDEDED',
      };
    });
  }, [availableCategoryNames, categoryMeta]);

  // Beräkna hur många kategorier som får plats baserat på skärmbredd
  const visibleCategoryCount = width < 420 ? 3 : width < 620 ? 5 : width < 900 ? 7 : 9;
  const pagedCategories = mergedCategories.slice(categoryOffset, categoryOffset + visibleCategoryCount);
  const canPageLeft = categoryOffset > 0; // Kan gå till föregående sida?
  const canPageRight = categoryOffset + visibleCategoryCount < mergedCategories.length; // Kan gå till nästa sida?

  // Återställ kategorinavigering när antalet kategorier ändras
  useEffect(() => {
    setCategoryOffset(0);
  }, [mergedCategories.length]);

  // Navigera till föregående/uppsätt kategorisida
  const handlePrevCategories = () => {
    setCategoryOffset((prev: number) => Math.max(0, prev - visibleCategoryCount));
  };

  const handleNextCategories = () => {
    setCategoryOffset((prev: number) => Math.min(prev + visibleCategoryCount, Math.max(0, mergedCategories.length - visibleCategoryCount)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageContainer>
      {/* Header */}
      <LinearGradient
        colors={['#2E7D32', '#43A047', '#66BB6A']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.headerContent}
          onPress={() => {
            // Scroll to top or reset filters
            setSearchQuery('');
            setSelectedCategory('Alla');
          }}
        >
          <Text style={styles.headerTitle}>SnabbMat</Text>
          <Text style={styles.headerSubtitle}>
            Snabba och enkla recept för vardagen
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Sök recept..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {isLoading && (
          <Text style={styles.loadingText}>Laddar live-recept från ICA...</Text>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.categoryPagerButton, !canPageLeft && styles.categoryPagerButtonDisabled]}
          onPress={handlePrevCategories}
          disabled={!canPageLeft}
        >
          <Text style={styles.categoryPagerButtonText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.filtersList}>
          {pagedCategories.map(renderCategoryFilter)}
        </View>
        <TouchableOpacity
          style={[styles.categoryPagerButton, !canPageRight && styles.categoryPagerButtonDisabled]}
          onPress={handleNextCategories}
          disabled={!canPageRight}
        >
          <Text style={styles.categoryPagerButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Count */}
      {/* Moved to bottom with Load More button */}

      {/* Recipe List */}
      <FlatList<Recipe>
        data={displayedRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item: Recipe) => item.id}
        contentContainerStyle={styles.recipesList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          hasMoreRecipes ? (
            <View style={styles.loadMoreContainer}>
              <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreRecipes}>
                <Text style={styles.loadMoreText}>Visa fler recept</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  header: {
    padding: 20,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#2E7D32', // Green for ICA theme
    marginHorizontal: 20,
    borderRadius: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 1,
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    backgroundColor: '#F0F4F7',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E8F0F2',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  categoryCardFilter: {
    width: 88,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
    marginRight: 10,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  categoryPagerButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  categoryPagerButtonDisabled: {
    opacity: 0.35,
  },
  categoryPagerButtonText: {
    fontSize: 18,
    lineHeight: 18,
    color: '#1B5E20',
    fontWeight: '700',
  },
  selectedCategoryCardFilter: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  categoryFilterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryFilterEmoji: {
    fontSize: 18,
  },
  categoryFilterText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedCategoryFilterText: {
    color: '#1B5E20',
  },
  recipeCountContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  recipeCountText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#B71C1C',
    marginTop: 8,
    textAlign: 'center',
  },
  recipesList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  loadMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#FF9F4A',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadMoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
