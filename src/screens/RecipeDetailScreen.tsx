import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Share,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRecipeContext } from '../context/RecipeContext';
import { Recipe } from '../types/Recipe';

interface RecipeDetailScreenProps {
  route: {
    params: {
      recipeId: string;
    };
  };
  navigation: any;
}

export default function RecipeDetailScreen({ route, navigation }: RecipeDetailScreenProps) {
  const { recipeId } = route.params;
  const { recipes, isFavorite, toggleFavorite } = useRecipeContext();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 980;
  const contentMaxWidth = 1320;

  useEffect(() => {
    const foundRecipe = recipes.find(r => r.id === recipeId);
    setRecipe(foundRecipe || null);
  }, [recipeId, recipes]);

  useEffect(() => {
    setImageFailed(false);
  }, [recipe?.image]);

  const handleShare = async () => {
    if (!recipe) return;
    
    try {
      await Share.share({
        message: `Kolla in detta recept: ${recipe.title}\n${recipe.description}`,
        title: recipe.title,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Receptet hittades inte</Text>
      </SafeAreaView>
    );
  }

  const renderIngredient = (ingredient: any, index: number) => {
    if (ingredient.isSection) {
      return (
        <View key={index} style={styles.ingredientSectionRow}>
          <Text style={styles.ingredientSectionTitle}>{ingredient.name}</Text>
        </View>
      );
    }

    const amountText = [ingredient.amount, ingredient.unit].filter(Boolean).join(' ').trim();
    return (
      <View key={index} style={styles.ingredientItem}>
        <Text style={styles.ingredientAmount}>{amountText || ' '}</Text>
        <Text style={styles.ingredientName}>
          {ingredient.name}
        </Text>
      </View>
    );
  };

  const renderInstruction = (instruction: string, index: number) => (
    <View key={index} style={styles.instructionItem}>
      <View style={styles.instructionNumber}>
        <Text style={styles.instructionNumberText}>{index + 1}</Text>
      </View>
      <Text style={styles.instructionText}>{instruction}</Text>
    </View>
  );

  const hasImageUrl = recipe.image.startsWith('http://') || recipe.image.startsWith('https://');
  const sourceUrl = (recipe as Recipe & { sourceUrl?: string }).sourceUrl;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.pageInner, isWideLayout && { maxWidth: contentMaxWidth }]}>
        <View style={[styles.heroSection, isWideLayout && styles.heroSectionWide]}>
          {/* Recipe Info */}
          <View style={[styles.recipeInfo, isWideLayout && styles.recipeInfoWide]}>
            <View style={styles.titleRow}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(recipe.id)}
              >
                <Ionicons
                  name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite(recipe.id) ? '#ff4444' : '#666'}
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
            
            {/* Recipe Stats */}
            <View style={styles.recipeStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color="#2E7D32" />
                <Text style={styles.statText}>{recipe.prepTime + recipe.cookTime} min</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={20} color="#2E7D32" />
                <Text style={styles.statText}>{recipe.servings} portioner</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="star-outline" size={20} color="#2E7D32" />
                <Text style={styles.statText}>{recipe.difficulty}</Text>
              </View>
            </View>
          </View>

          {/* Header Image */}
          <View style={[styles.headerImage, isWideLayout && styles.headerImageWide]}>
            {hasImageUrl && !imageFailed ? (
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
                resizeMode={isWideLayout ? 'contain' : 'cover'}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <Text style={styles.recipeEmoji}>{recipe.image}</Text>
            )}
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredienser</Text>
          <Text style={styles.sectionSubtitle}>{recipe.servings} portioner</Text>
          
          <View style={styles.ingredientsList}>
            {recipe.ingredients.length > 0 ? (
              recipe.ingredients.map(renderIngredient)
            ) : (
              <View>
                <Text style={styles.placeholderText}>
                  Ingredienser saknas i denna datakalla for receptet.
                </Text>
                {sourceUrl ? (
                  <TouchableOpacity onPress={() => Linking.openURL(sourceUrl)}>
                    <Text style={styles.linkText}>Oppna originalrecept hos ICA</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gör så här</Text>
          
          <View style={styles.instructionsList}>
            {recipe.instructions.length > 0 ? (
              recipe.instructions.map(renderInstruction)
            ) : (
              <View>
                <Text style={styles.placeholderText}>
                  Tillagningssteg saknas i denna datakalla for receptet.
                </Text>
                {sourceUrl ? (
                  <TouchableOpacity onPress={() => Linking.openURL(sourceUrl)}>
                    <Text style={styles.linkText}>Oppna tillagningssteg hos ICA</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={20} color="#FFA726" />
            <Text style={styles.tipText}>
              Servera med en sallad eller grönsaker för en komplett måltid.
            </Text>
          </View>
        </View>

        {/* Nutritional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Näringsvärde per portion</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>661</Text>
              <Text style={styles.nutritionLabel}>kCal</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>36g</Text>
              <Text style={styles.nutritionLabel}>Fett</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>64g</Text>
              <Text style={styles.nutritionLabel}>Kolhydrater</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>18g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
          </View>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  pageInner: {
    width: '100%',
    alignSelf: 'center',
  },
  heroSection: {
    marginBottom: 10,
  },
  heroSectionWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  headerImage: {
    height: 200,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerImageWide: {
    flex: 1.2,
    height: 520,
    backgroundColor: '#F5F7F8',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  recipeEmoji: {
    fontSize: 80,
  },
  recipeInfo: {
    backgroundColor: 'white',
    padding: 20,
  },
  recipeInfoWide: {
    flex: 0.9,
    paddingVertical: 32,
    paddingHorizontal: 28,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 24,
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#4A7C59',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ingredientSectionRow: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  ingredientSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  ingredientAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A7C59',
    width: 80,
  },
  ingredientName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  instructionsList: {
    gap: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4A7C59',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  instructionNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    flex: 1,
  },
  placeholderText: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  linkText: {
    marginTop: 8,
    color: '#2E7D32',
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: 14,
    color: '#E65100',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A7C59',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
