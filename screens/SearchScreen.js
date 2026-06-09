import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MealCard from '../components/MealCard';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const searchMeals = () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.meals || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur réseau, réessayez');
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rechercher un plat</Text>

      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Ex: Chicken, Pasta..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchMeals}
          returnKeyType="search"
        />
        <Pressable style={styles.searchBtn} onPress={searchMeals}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e53935"
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retry} onPress={searchMeals}>
            Réessayer
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={item => item.idMeal}
          renderItem={({ item }) => (
            <MealCard
              meal={item}
              onPress={() =>
                navigation.navigate('HomeTab', {
                  screen: 'MealDetail',
                  params: { mealId: item.idMeal },
                })
              }
            />
          )}
          ListEmptyComponent={
            searched ? (
              <Text style={styles.emptyText}>
                Aucun résultat pour "{query}"
              </Text>
            ) : null
          }
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111', margin: 16 },
  searchBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  searchBtn: {
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e53935',
  },
  searchBtnText: { fontSize: 18 },
  centered: { alignItems: 'center', marginTop: 40 },
  errorText: { color: '#e53935', fontSize: 15 },
  retry: {
    color: '#1565c0',
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
});