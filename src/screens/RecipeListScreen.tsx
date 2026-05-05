import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { categories } from '../data/recipes';
import { Recipe } from '../types/Recipe';
import { useRecipeContext } from '../context/RecipeContext';
import { RecipeCard } from '../components/RecipeCard';
import { PageContainer } from '../components/PageContainer';

export default function RecipeListScreen({ navigation }: any) {
  const [visibleRecipes, setVisibleRecipes] = useState(12);

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

  useEffect(() => {
    loadRecipesFromICA();
  }, []);

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

  const displayedRecipes = filteredRecipes.slice(0, visibleRecipes);
  const hasMoreRecipes = visibleRecipes < filteredRecipes.length;

  const loadMoreRecipes = () => {
    setVisibleRecipes(prev => Math.min(prev + 12, filteredRecipes.length));
  };

  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} onPress={handleRecipePress} />
  );

  const categoryMeta = useMemo(() => {
    const map = new Map<string, { icon: string; color: string }>();
    categories.forEach((cat) => map.set(cat.name, { icon: cat.icon, color: cat.color }));
    return map;
  }, []);

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

  const availableCategoryNames = useMemo(() => {
    const counts = new Map<string, number>();
    recipes.forEach((recipe) => {
      counts.set(recipe.category, (counts.get(recipe.category) || 0) + 1);
    });
    return [...counts.entries()]
      .filter(([, count]) => count > 0)
      .map(([name]) => name)
      .sort((a, b) => a.localeCompare(b, 'sv'));
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Fast full-width header - scrollar inte bort */}
      <LinearGradient
        colors={['#2E7D32', '#43A047', '#66BB6A']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.headerContent}
          onPress={() => {
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

      <PageContainer>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <FlatList<Recipe>
          data={displayedRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item: Recipe) => item.id}
          contentContainerStyle={styles.recipesList}
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          removeClippedSubviews={Platform.OS !== 'web'}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🍽️</Text>
                <Text style={styles.emptyText}>Inga recept hittades</Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery
                    ? `Inga resultat för "${searchQuery}"`
                    : 'Inga recept tillgängliga just nu'}
                </Text>
              </View>
            ) : null
          }
          // Sökfält och kategorier scrollar bort när man bläddrar ner
          ListHeaderComponent={
            <>
              {/* Sökfält */}
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

              {/* Kategorier - swipe vänster/höger med fingret */}
              <View style={styles.categoriesWrapper}>
                <Text style={styles.categoriesLabel}>Kategorier</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersScrollContent}
                >
                  {mergedCategories.map(renderCategoryFilter)}
                </ScrollView>
              </View>

              {/* Recepträknare */}
              <View style={styles.recipesDivider}>
                <Text style={styles.recipesDividerText}>
                  {filteredRecipes.length} recept
                  {selectedCategory !== 'Alla' ? ` · ${selectedCategory}` : ''}
                </Text>
              </View>
            </>
          }
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
        </KeyboardAvoidingView>
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
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
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
  // marginHorizontal borttagen - contentContainerStyle ger 20px från kanten
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
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
  flatList: {
    flex: 1,
    marginTop: 3,
    marginBottom: 3,
  },
  categoriesWrapper: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginTop: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  categoriesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 2,
  },
  filtersScrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  recipesDivider: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  recipesDividerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  categoryCardFilter: {
    width: 72,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
    marginRight: 8,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
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
  recipesList: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  loadMoreContainer: {
    padding: 1,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
