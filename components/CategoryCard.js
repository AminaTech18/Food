import React from 'react';
import { Text, Image, Pressable, StyleSheet, View } from 'react-native';

export default function CategoryCard({ category, isSelected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isSelected && styles.selected]}
    >
      <View style={[styles.imageContainer, isSelected && styles.imageContainerSelected]}>
        <Image
          source={{ uri: category.strCategoryThumb }}
          style={styles.image}
        />
      </View>
      <Text
        style={[styles.label, isSelected && styles.labelSelected]}
        numberOfLines={2}
      >
        {category.strCategory}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    width: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: '#fff0f0',
    borderColor: '#e53935',
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  imageContainerSelected: {
    backgroundColor: '#ffcdd2',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 15,
  },
  labelSelected: {
    color: '#e53935',
    fontWeight: 'bold',
  },
});