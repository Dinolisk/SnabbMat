import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import RecipeListScreen from './src/screens/RecipeListScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import AuthScreen from './src/screens/AuthScreen';

// Import context
import { RecipeProvider } from './src/context/RecipeContext';
import { AuthProvider } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();
const RecipeStackNavigator = createStackNavigator<{
  RecipeList: undefined;
  RecipeDetail: { recipeId: string };
}>();
const FavoritesStackNavigator = createStackNavigator<{
  FavoritesMain: undefined;
  RecipeDetail: { recipeId: string };
}>();
const ProfileStackNavigator = createStackNavigator<{
  ProfileMain: undefined;
  Auth: { mode?: 'login' | 'register' };
}>();

// Stack Navigator for Recipe List
function RecipeStack() {
  return (
    <RecipeStackNavigator.Navigator>
      <RecipeStackNavigator.Screen 
        name="RecipeList" 
        component={RecipeListScreen} 
        options={{ headerShown: false }}
      />
      <RecipeStackNavigator.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={{
          title: 'Recept',
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </RecipeStackNavigator.Navigator>
  );
}


// Stack Navigator for Profile (includes Auth screen)
function ProfileStack() {
  return (
    <ProfileStackNavigator.Navigator>
      <ProfileStackNavigator.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          title: '',
          headerStyle: { backgroundColor: '#2E7D32' },
          headerTintColor: '#fff',
          presentation: 'modal',
        }}
      />
    </ProfileStackNavigator.Navigator>
  );
}

// Stack Navigator for Favorites
function FavoritesStack() {
  return (
    <FavoritesStackNavigator.Navigator>
      <FavoritesStackNavigator.Screen 
        name="FavoritesMain" 
        component={FavoritesScreen} 
        options={{ headerShown: false }}
      />
      <FavoritesStackNavigator.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={{
          title: 'Recept',
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </FavoritesStackNavigator.Navigator>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 980;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF4E6' }}>
      <AuthProvider>
      <RecipeProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <View style={{ 
            flex: 1, 
            maxWidth: isWideLayout ? 1320 : undefined, 
            alignSelf: 'center', 
            width: '100%' 
          }}>
            <Tab.Navigator
              screenOptions={({ route }: any) => ({
                tabBarIcon: ({ focused, color, size }: any) => {
                  let iconName: keyof typeof Ionicons.glyphMap;

                  if (route.name === 'Recept') {
                    iconName = focused ? 'restaurant' : 'restaurant-outline';
                  } else if (route.name === 'Favoriter') {
                    iconName = focused ? 'heart' : 'heart-outline';
                  } else if (route.name === 'Profil') {
                    iconName = focused ? 'person' : 'person-outline';
                  } else {
                    iconName = 'help-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#C8E6C9',
                tabBarStyle: {
                  backgroundColor: '#2E7D32',
                  borderTopColor: '#4CAF50',
                  borderTopWidth: 1,
                  marginHorizontal: 20,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                },
                headerStyle: {
                  backgroundColor: '#2E7D32',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              })}
            >
              <Tab.Screen 
                name="Recept" 
                component={RecipeStack} 
                options={{ headerShown: false }}
              />
              <Tab.Screen 
                name="Favoriter" 
                component={FavoritesStack} 
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name="Profil"
                component={ProfileStack}
                options={{ headerShown: false }}
              />
            </Tab.Navigator>
          </View>
        </NavigationContainer>
      </RecipeProvider>
      </AuthProvider>
    </View>
  );
}
