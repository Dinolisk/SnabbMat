import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { categories } from '../data/recipes';
import { Recipe } from '../types/Recipe';
import { useRecipeContext } from '../context/RecipeContext';
import { useFilteredRecipes } from '../hooks/useFilteredRecipes';
import { RecipeCard } from '../components/RecipeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function RecipeListScreen({ navigation }: any) {
  const [visibleRecipes, setVisibleRecipes] = useState(5);
  const { searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } = useRecipeContext();
  const filteredRecipes = useFilteredRecipes();

  const displayedRecipes = filteredRecipes.slice(0, visibleRecipes);
  const hasMoreRecipes = visibleRecipes < filteredRecipes.length;

  const loadMoreRecipes = () => {
    setVisibleRecipes(prev => Math.min(prev + 5, filteredRecipes.length));
  };

  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} onPress={handleRecipePress} />
  );

  const renderCategoryFilter = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryFilter,
        selectedCategory === category && styles.selectedCategoryFilter
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryFilterText,
        selectedCategory === category && styles.selectedCategoryFilterText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const allCategories = ['Alla', ...categories.map(cat => cat.name)];

  return (
    <SafeAreaView style={styles.container}>
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
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategorier</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={allCategories}
          renderItem={({ item }) => renderCategoryFilter(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Recipe Count */}
      <View style={styles.recipeCountContainer}>
        <Text style={styles.recipeCountText}>
          Recept Visar {displayedRecipes.length} av {filteredRecipes.length} stycken
        </Text>
      </View>

      {/* Recipe List */}
      <FlatList
        data={displayedRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.recipesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Load More Button */}
      {hasMoreRecipes && (
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreRecipes}>
            <Text style={styles.loadMoreText}>Visa fler recept</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
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
    padding: 15,
    backgroundColor: 'white',
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
  section: {
    margin: 20,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersList: {
    paddingHorizontal: 15,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  selectedCategoryFilter: {
    backgroundColor: '#2E7D32',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryFilterText: {
    color: 'white',
  },
  recipesList: {
    padding: 15,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  recipeEmoji: {
    fontSize: 32,
  },
  recipeInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTime: {
    fontSize: 12,
    color: '#4A7C59',
    fontWeight: '500',
  },
  recipeDifficulty: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  recipeCategory: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  recipeCountContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recipeCountText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
});
