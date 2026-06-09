import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';

export default function MealDetailScreen({ route, navigation }) {
  const { mealId } = route.params;
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger le détail du plat par son ID
  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(res => res.json())
      .then(data => {
        setMeal(data.meals[0]);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur de chargement');
        setLoading(false);
      });
  }, [mealId]);

  // Extraire les ingrédients depuis les champs strIngredient1..20
  const getIngredients = (meal) => {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        list.push({ ingredient, measure });
      }
    }
    return list;
  };

  // Découper les instructions en étapes
  const getInstructions = (text) => {
    return text.split('\r\n').filter(s => s.trim().length > 0);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e53935" />
      </View>
    );
  }

  if (error || !meal) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Introuvable'}</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.retry}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const ingredients = getIngredients(meal);
  const instructions = getInstructions(meal.strInstructions);
  const videoId = meal.strYoutube?.split('v=')[1];
  const youtubeThumb = videoId
    ? `https://img.youtube.com/vi/${videoId}/0.jpg`
    : null;

  return (
    <ScrollView style={styles.container}>

      {/* Bouton retour */}
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>‹ Go back</Text>
      </Pressable>

      {/* Miniature YouTube — ouvre la vidéo au clic */}
      {youtubeThumb && (
        <Pressable onPress={() => Linking.openURL(meal.strYoutube)}>
          <View style={styles.youtubeContainer}>
            <Image source={{ uri: youtubeThumb }} style={styles.youtubeThumb} />
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </View>
        </Pressable>
      )}

      <Text style={styles.mealTitle}>{meal.strMeal}</Text>

      {/* Liste des ingrédients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {ingredients.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.ingredientName}>{item.ingredient}</Text>
          <Text style={styles.ingredientMeasure}>{item.measure}</Text>
        </View>
      ))}

      {/* Instructions numérotées */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      {instructions.map((step, index) => (
        <View key={index} style={styles.instructionRow}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: { paddingHorizontal: 16, paddingTop: 50, paddingBottom: 10 },
  backText: { fontSize: 16, color: '#333', fontWeight: '500' },
  youtubeContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  youtubeThumb: { width: '100%', height: 200 },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: { color: '#fff', fontSize: 20, marginLeft: 4 },
  mealTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bullet: { fontSize: 16, color: '#e53935', marginRight: 8 },
  ingredientName: { flex: 1, fontSize: 14, color: '#333' },
  ingredientMeasure: { fontSize: 13, color: '#888' },
  instructionRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  stepNumberText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  stepText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 22 },
  errorText: { color: '#e53935', fontSize: 15 },
  retry: { color: '#1565c0', marginTop: 10, fontSize: 14 },
});