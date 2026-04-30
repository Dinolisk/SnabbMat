import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useRecipeContext } from '../context/RecipeContext';
import { Recipe } from '../types/Recipe';
import { PageContainer } from '../components/PageContainer';

export default function FavoritesScreen({ navigation }: any) {
  const { recipes, favorites, toggleFavorite } = useRecipeContext();

  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  const confirmRemoveFavorite = (recipe: Recipe) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Ta bort "${recipe.title}" från dina favoriter?`)) {
        toggleFavorite(recipe.id);
      }
    } else {
      Alert.alert(
        'Ta bort favorit',
        `Vill du ta bort "${recipe.title}" från dina favoriter?`,
        [
          { text: 'Avbryt', style: 'cancel' },
          { text: 'Ta bort', style: 'destructive', onPress: () => toggleFavorite(recipe.id) },
        ],
      );
    }
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => {
    const hasImageUrl = item.image?.startsWith('http');
    const totalTime = (item.prepTime ?? 0) + (item.cookTime ?? 0);

    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
      >
        <View style={styles.recipeImageContainer}>
          {hasImageUrl ? (
            <Image source={{ uri: item.image }} style={styles.recipeImage} resizeMode="cover" />
          ) : (
            <Text style={styles.recipeEmoji}>{item.image}</Text>
          )}
        </View>
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.recipeDescription} numberOfLines={1}>{item.description}</Text>
          <View style={styles.recipeMeta}>
            {totalTime > 0 && (
              <Text style={styles.recipeTime}>⏱️ {totalTime} min</Text>
            )}
            <Text style={styles.recipeDifficulty}>{item.difficulty}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => confirmRemoveFavorite(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>💔</Text>
      <Text style={styles.emptyStateTitle}>Inga favoriter än</Text>
      <Text style={styles.emptyStateText}>
        Tryck på hjärtat på dina favoritrecept för att lägga till dem här!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <PageContainer>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Mina Favoriter</Text>
          <Text style={styles.subtitleText}>
            {favoriteRecipes.length} recept sparade
          </Text>
        </View>

        {favoriteRecipes.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={favoriteRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.recipesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </PageContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  titleContainer: {
    backgroundColor: '#FF9F4A',
    padding: 20,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
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
    overflow: 'hidden',
  },
  recipeImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  recipeEmoji: {
    fontSize: 32,
  },
  recipeInfo: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 40,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: 12,
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
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
