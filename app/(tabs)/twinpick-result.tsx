// app/(tabs)/twinpick-result.tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView } from 'react-native';

export default function TwinPickResultScreen() {
  const { title, posterUrl } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>{title}</Text>
      {posterUrl && (
        <Image
          source={{ uri: posterUrl as string }}
          style={{ width: 200, height: 300, borderRadius: 12 }}
          resizeMode="cover"
        />
      )}
    </ScrollView>
  );
}