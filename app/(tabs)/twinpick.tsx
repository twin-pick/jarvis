import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TwinPickScreen() {
  const [usernames, setUsernames] = useState(['']);
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const addUsernameField = () => {
    setUsernames([...usernames, '']);
  };

  const updateUsername = (index: number, value: string) => {
    const newUsernames = [...usernames];
    newUsernames[index] = value;
    setUsernames(newUsernames);
  };

  const removeUsername = (index: number) => {
    if (usernames.length > 1) {
      const newUsernames = usernames.filter((_, i) => i !== index);
      setUsernames(newUsernames);
    }
  };

  const searchMovie = () => {
    const validUsernames = usernames.filter(u => u.trim() !== '');
    
    if (validUsernames.length === 0) {
      Alert.alert('Erreur', 'Veuillez entrer au moins un nom d\'utilisateur Letterboxd');
      return;
    }

    // TODO: Appeler l'API tars avec les critères
    router.push({
      pathname: '/twinpick-result',
      params: {
        title: 'Inception', //juste test
        posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          🍿 Twin Pick
        </ThemedText>
        
        <ThemedText type="subtitle" style={styles.subtitle}>
          Trouvez le film parfait selon vos watchlists Letterboxd
        </ThemedText>

        {/* Section Usernames */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Noms d'utilisateur Letterboxd
          </ThemedText>
          
          {usernames.map((username, index) => (
            <ThemedView key={index} style={styles.usernameContainer}>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.tabIconDefault,
                  backgroundColor: colors.background,
                  color: colors.text 
                }]}
                placeholder={`Utilisateur ${index + 1}`}
                placeholderTextColor={colors.tabIconDefault}
                value={username}
                onChangeText={(value) => updateUsername(index, value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {usernames.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeUsername(index)}
                >
                  <ThemedText style={styles.removeButtonText}>✕</ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          ))}
          
          <TouchableOpacity 
            style={[styles.addButton, { borderColor: colors.tint }]} 
            onPress={addUsernameField}
          >
            <ThemedText style={[styles.addButtonText, { color: colors.tint }]}>
              + Ajouter un utilisateur
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Section Critères */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Critères de recherche
          </ThemedText>
          
          <TextInput
            style={[styles.input, { 
              borderColor: colors.tabIconDefault,
              backgroundColor: colors.background,
              color: colors.text 
            }]}
            placeholder="Genre (ex: horror, comedy, action...)"
            placeholderTextColor={colors.tabIconDefault}
            value={genre}
            onChangeText={setGenre}
            autoCapitalize="none"
          />
          
          <TextInput
            style={[styles.input, { 
              borderColor: colors.tabIconDefault,
              backgroundColor: colors.background,
              color: colors.text 
            }]}
            placeholder="Durée max en minutes (ex: 120)"
            placeholderTextColor={colors.tabIconDefault}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </ThemedView>

        {/* Bouton de recherche */}
        <TouchableOpacity style={styles.searchButton} onPress={searchMovie}>
          <ThemedText style={styles.searchButtonText}>🎬 Chercher un film</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 16,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: '#ff6b47',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});