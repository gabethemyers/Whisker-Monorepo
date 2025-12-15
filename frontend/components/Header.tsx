import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function Header() {
  const router = useRouter();
  const brandColor = '#417aa9ff'; // 🧡 Whiskr brand color (change this!)

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}
    >
      {/* Left: Whiskr brand name */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: brandColor,
          letterSpacing: 0.5,
        }}
      >
        Whiskr
      </Text>

      {/* Right: action icons */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        

        {/* Messages */}
        <Pressable
          onPress={() => router.push('/messages')}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            padding: 6,
          })}
        >
          <IconSymbol name="paperplane.fill" color={brandColor} size={28} />
        </Pressable>
      </View>
    </View>
  );
}
