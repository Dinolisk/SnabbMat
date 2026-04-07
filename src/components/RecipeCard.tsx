import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../types/Recipe';
import { useRecipeContext } from '../context/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useRecipeContext();
  const [scaleAnim] = React.useState(new Animated.Value(1));
  const [imageFailed, setImageFailed] = React.useState(false);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress(recipe);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  const hasImageUrl = recipe.image.startsWith('http://') || recipe.image.startsWith('https://');
  React.useEffect(() => {
    setImageFailed(false);
  }, [recipe.image]);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <View style={styles.imageContainer}>
          {hasImageUrl && !imageFailed ? (
            <Image
              source={{ uri: recipe.image }}
              style={styles.recipeImage}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <Text style={styles.emoji}>{recipe.image}</Text>
          )}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
          >
            <Ionicons 
              name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'} 
              size={20} 
              color={isFavorite(recipe.id) ? '#FF6B6B' : '#999'} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {recipe.description}
          </Text>
          
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#4A7C59" />
              <Text style={styles.metaText}>
                {recipe.prepTime + recipe.cookTime} min
              </Text>
            </View>
            
            <View style={[styles.difficultyBadge, getDifficultyStyle(recipe.difficulty)]}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.category}>{recipe.category}</Text>
            <View style={styles.servings}>
              <Ionicons name="people-outline" size={14} color="#999" />
              <Text style={styles.servingsText}>{recipe.servings} pers</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function getDifficultyStyle(difficulty: string) {
  switch (difficulty) {
    case 'Lätt':
      return { backgroundColor: '#E8F5E8' };
    case 'Medel':
      return { backgroundColor: '#FFF4E6' };
    case 'Svår':
      return { backgroundColor: '#FFEBEE' };
    default:
      return { backgroundColor: '#F5F5F5' };
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 100,
    height: 120,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 40,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#4A7C59',
    marginLeft: 4,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  servings: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servingsText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});
