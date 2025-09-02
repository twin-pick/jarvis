import { Pressable, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export type Mode = 'match' | 'party';

export default function ModeToggle({
  value,
  onChange,
}: {
  value: Mode;
  onChange: (m: Mode) => void;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const isMatch = value === 'match';
  const isParty = value === 'party';

  return (
    <View style={[styles.wrap, { borderColor: colors.border }]}>
      <Pressable
        onPress={() => onChange('match')}
        style={[styles.segment, isMatch && { backgroundColor: colors.tint }]}
      >
        <ThemedText style={[styles.label, isMatch && { color: colors.background }]}>
          Match
        </ThemedText>
      </Pressable>

      <Pressable
        onPress={() => onChange('party')}
        style={[styles.segment, isParty && { backgroundColor: colors.tint }]}
      >
        <ThemedText style={[styles.label, isParty && { color: colors.background }]}>
          Party
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontWeight: '700' },
});