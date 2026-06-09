import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryCard from '../components/CategoryCard';
import MealCard from '../components/MealCard';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Beef');
  const [meals, setMeals] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories);
        setLoadingCats(false);
      })
      .catch(() => {
        setError('Erreur de chargement des catégories');
        setLoadingCats(false);
      });
  }, []);

  useEffect(() => {
    setLoadingMeals(true);
    setMeals([]); 
    setError('');
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        setMeals(data.meals || []);
        setLoadingMeals(false);
      })
      .catch(() => {
        setError('Erreur de chargement des plats');
        setLoadingMeals(false);
      });
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Categories</Text>

      {/* Liste horizontale des catégories */}
      {loadingCats ? (
        <ActivityIndicator
          size="small"
          color="#e53935"
          style={{ marginVertical: 16 }}
        />
      ) : (
        <View style={styles.categoryWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map(cat => (
              <CategoryCard
                key={cat.idCategory}
                category={cat}
                isSelected={cat.strCategory === selectedCategory}
                onPress={() => setSelectedCategory(cat.strCategory)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Plats de la catégorie: {selectedCategory}
      </Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text
            style={styles.retry}
            onPress={() => {
              setSelectedCategory(prev => prev);
            }}
          >
            Réessayer
          </Text>
        </View>
      ) : loadingMeals ? (
        <ActivityIndicator
          size="large"
          color="#e53935"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={meals}
          numColumns={2}
          keyExtractor={item => item.idMeal}
          renderItem={({ item }) => (
            <MealCard
              meal={item}
              onPress={() =>
                navigation.navigate('MealDetail', { mealId: item.idMeal })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun plat trouvé</Text>
          }
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  categoryWrapper: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  errorContainer: { alignItems: 'center', marginTop: 40 },
  errorText: { color: '#e53935', fontSize: 15 },
  retry: {
    color: '#1565c0',
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
});