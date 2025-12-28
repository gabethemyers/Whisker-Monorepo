// components/Footer.tsx
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Footer() {
  const router = useRouter();

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: '#666', fontSize: 14 }}>
          You’re signed out.
        </Text>

        <Pressable
          // ✅ this is the fixed line:
          onPress={() => router.push('/signin')}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            backgroundColor: '#ff6f61',
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 14,
          })}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}
