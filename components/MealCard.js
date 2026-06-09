import React from 'react';
import { Text, Image, Pressable, StyleSheet } from 'react-native';

export default function MealCard({ meal, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>
        {meal.strMeal}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
  },
  title: {
    padding: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
});