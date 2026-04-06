import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9F4A', '#FFB366']}
        style={styles.spinnerContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
