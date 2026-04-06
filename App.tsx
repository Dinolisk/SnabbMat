import React from 'react';
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

// Import context
import { RecipeProvider } from './src/context/RecipeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Recipe List
function RecipeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="RecipeList" 
        component={RecipeListScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
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
    </Stack.Navigator>
  );
}


// Stack Navigator for Favorites
function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FavoritesMain" 
        component={FavoritesScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
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
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <RecipeProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
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
            component={ProfileScreen} 
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </RecipeProvider>
  );
}
