import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export function PageContainer({ children, maxWidth = 1320 }: PageContainerProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 980;

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, isWide && { maxWidth }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  inner: {
    width: '100%',
    flex: 1,
  },
});
