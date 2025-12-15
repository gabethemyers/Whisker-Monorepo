// components/ActivityHeader.tsx
import { View, Text, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { brandColor } from '@/styles/globalStyle';

export default function ActivityHeader() {
  const router = useRouter();

  return (
    <View
      style={{
        paddingTop: Platform.select({ ios: 12, android: 0 }),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}
    >
      <View
        style={{
          height: 56, // ensures a nice, tall header
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 8,
        }}
      >
        {/* Back button with large tap area */}
        <Pressable
          onPress={() => router.push('/')}
          hitSlop={12}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 22,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <IconSymbol name="arrow.backward" color={brandColor} size={26} />
        </Pressable>

        {/* Center title that won't intercept touches */}
        <Text
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 28,
            fontWeight: 'bold',
            color: '#417aa9ff',
          }}
        >
          Whiskr
        </Text>

        {/* Spacer to balance layout */}
        <View style={{ width: 44, height: 44 }} />
      </View>
    </View>
  );
}
