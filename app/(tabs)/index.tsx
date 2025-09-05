import { Image } from 'expo-image';
import { RelativePathString, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import '../../global';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Movie } from '@/libs/types';
import { useMovieStore } from '@/store/useMovieStore';

const PLATFORMS = [
  'Netflix',
  'Prime Video',
  'Disney+',
  'Canal+',
  'Apple TV+',
  'HBO Max',
];

const GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Romance',
  'Sci-Fi',
  'Horror',
];

const DURATION_PRESETS = [
  { key: 'short', label: '< 90 min', min: 0, max: 89 },
  { key: 'medium', label: '90 – 120 min', min: 90, max: 120 },
  { key: 'long', label: '> 120 min', min: 121, max: 600 },
] as const;

type Mode = 'match' | 'party';
type DurationKey = typeof DURATION_PRESETS[number]['key'];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [mode, setMode] = useState<Mode>('match');
  const [users, setUsers] = useState<string[]>(['']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [durationKey, setDurationKey] = useState<DurationKey>('medium');
  const setMovie = useMovieStore((state: { setMovie: any }) =>  state.setMovie);

  function createFetchUrl(endpoint : string) : string {
    let url = `http://localhost:8085/api/${endpoint}`
    url += "usernames=" + users.join(',')
       
    if (selectedGenres.length < 0){
      url = "&genres=" + selectedGenres.join(",")
    }
    // if (selectedPlatforms.length < 0){
    //   url = "&platforms=" + selectedPlatforms.join(",")
    // }
    return url
  }

  const onSubmit =  async () => {
    let endpoint : string 

    let path : RelativePathString
    if (mode === 'match') {
      endpoint = 'v1/match?';
      path = `/(tabs)/twinpick-result` as RelativePathString;
    } else {
      endpoint = 'v2/party?';
      path = '/(tabs)/party' as RelativePathString;
    }
    /*path = `/(tabs)/party-result` as RelativePathString;
    router.push(path)*/
    const duration = DURATION_PRESETS.find((d) => d.key === durationKey)!;
    const url : string = createFetchUrl(endpoint)
    const response : Response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    },)
    try {
      if (response.ok) {
        const data = await response.json()
        if (mode === 'match'){
          const newMovie: Movie = {
            id: data.id,
            title: data.title as string,
            date: data.date as string,
            director: data.director as string,
            duration: data.duration as string,
            poster: data.poster as string,
            wantToWatch: true,
          };
          setMovie(newMovie);
          console.log("new movie = " + newMovie)
          router.push(path);
        }
        else{
          router.push({
            pathname: path,
            params: {
              roomId: data.roomId
            }
          })
        }
      }
    }
    catch (error){
      console.log(error)
    }
  };

  const canSubmit = users.some(u => u.trim() !== '');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'flex-start' }}
    >
      <ThemedView style={styles.header}>
        <Image
          source={require('@/assets/images/logo-icon.png')}
          contentFit="contain"
          style={styles.logo}
        />
        <ThemedText type="title" style={styles.title}>Twin Pick</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Find a movie that suits everyone
        </ThemedText>
      </ThemedView>

      <ThemedView style={[styles.card, { borderColor: colors.border }]}>
        <ThemedText style={styles.label}>Users</ThemedText>
        {users.map((user, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`User ${index + 1}`}
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={user}
            onChangeText={(text) => {
              const next = [...users];
              next[index] = text;
              setUsers(next);
            }}
          />
        ))}
        <TouchableOpacity
          onPress={() => setUsers([...users, ''])}
          activeOpacity={0.7}
          style={{ marginTop: 8, alignSelf: 'flex-start' }}
        >
          <Text style={{ color: colors.tint, fontWeight: '600' }}>Add user</Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={[styles.card, { borderColor: colors.border }]}>
        <ThemedText style={styles.label}>Genres</ThemedText>
        <View style={styles.chipsWrap}>
          {GENRES.map((g) => {
            const active = selectedGenres.includes(g);
            return (
              <TouchableOpacity
                key={g}
                style={[styles.chip, active && { backgroundColor: colors.tint, borderColor: colors.tint }]}
                onPress={() =>
                  setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
                }
                activeOpacity={0.85}
              >
                <ThemedText style={[styles.chipText, active && { color: colors.background }]}>{g}</ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </ThemedView>

      <ThemedView style={[styles.card, { borderColor: colors.border }]}>
        <View style={styles.rowBetween}>
          <ThemedText style={styles.label}>Mode</ThemedText>
          <View style={styles.modeRow}>
            <ThemedText style={[styles.modeLabel, mode === 'match' && styles.modeActive]}>Match</ThemedText>
            <Switch value={mode === 'party'} onValueChange={() => setMode(m => m === 'match' ? 'party' : 'match')} />
            <ThemedText style={[styles.modeLabel, mode === 'party' && styles.modeActive]}>Party</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={[styles.card, { borderColor: colors.border }]}>
        <ThemedText style={styles.label}>Platforms</ThemedText>
        <View style={styles.chipsWrap}>
          {PLATFORMS.map((p) => {
            const active = selectedPlatforms.includes(p);
            return (
              <TouchableOpacity
                key={p}
                style={[styles.chip, active && { backgroundColor: colors.tint, borderColor: colors.tint }]}
                onPress={() => {
                  setSelectedPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
                }}
                activeOpacity={0.85}
              >
                <ThemedText style={[styles.chipText, active && { color: colors.background }]}>{p}</ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
        <ThemedText style={styles.helpText}>Select at least one platform.</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.card, { borderColor: colors.border }]}>
        <ThemedText style={styles.label}>Duration</ThemedText>
        <View style={styles.segmentWrap}>
          {DURATION_PRESETS.map((d) => {
            const active = durationKey === d.key;
            return (
              <TouchableOpacity
                key={d.key}
                style={[styles.segment, active && { borderColor: colors.tint, backgroundColor: colors.tint }]}
                onPress={() => setDurationKey(d.key)}
                activeOpacity={0.85}
              >
                <ThemedText style={[styles.segmentText, active && { color: colors.background }]}>
                  {d.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </ThemedView>

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: colors.tint }, !canSubmit && { opacity: 0.5 }]}
        onPress={onSubmit}
        disabled={!canSubmit}
        activeOpacity={0.9}
      >
        <ThemedText style={styles.submitText}>SUBMIT</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    gap: 6,
  },
  logo: { width: 96, height: 96, borderRadius: 20 },
  title: { marginTop: 2 },
  subtitle: { opacity: 0.8 },

  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginTop: 12,
    alignSelf: 'stretch'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontWeight: '700', marginBottom: 10 },
  helpText: { opacity: 0.8, marginTop: 8, fontSize: 13 },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modeLabel: { opacity: 0.8, fontWeight: '600' },
  modeActive: { opacity: 1 },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(127,127,127,0.12)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipText: { fontWeight: '600' },

  segmentWrap: { flexDirection: 'row', gap: 8 },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(127,127,127,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  segmentText: { fontWeight: '700' },

  submitBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  submitText: { color: '#d32d2dff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
    marginBottom: 12,
  },
});
