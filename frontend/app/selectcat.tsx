// app/selectCat.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Cat, createCat, getCatsByUser, getCurrentUser } from '@/utils/api';
import { getJwt, getSelectedCatId, setSelectedCatId } from '@/utils/auth';
import * as ImagePicker from 'expo-image-picker';

export default function SelectCatScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [imageFile, setImageFile] = useState<any>(null);

  // Load token + cats
  useEffect(() => {
    const init = async () => {
      try {
        const t = await getJwt();
        if (!t) {
          setError('You must sign in first.');
          setLoading(false);
          return;
        }
        setToken(t);

        // Get current user first
        const user = await getCurrentUser();
        if (!user) {
          setError('Could not load user info.');
          setLoading(false);
          return;
        }
        setUserId(user.id);

        // Fetch only this user's cats
        const userCats = await getCatsByUser(user.id);
        setCats(userCats);

        // Keep selection consistent if one was already stored
        await getSelectedCatId();
      } catch (err: any) {
        console.error('Failed to load cats:', err);
        setError(err.message ?? 'Failed to load cats.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSelectCat = async (catId: number) => {
    try {
      await setSelectedCatId(catId);
      router.replace('/(tabs)/account');
    } catch (err) {
      console.error('Failed to set selected cat:', err);
      Alert.alert('Error', 'Could not select this cat. Please try again.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFile(result.assets[0]);
    }
  };

  const handleCreateCat = async () => {
    if (!token || !userId) return;

    const trimmedName = newName.trim();
    const trimmedBio = newBio.trim();

    if (!trimmedName) {
      Alert.alert('Name required', 'Please give your cat a name.');
      return;
    }

    try {
      const created = await createCat({
        name: trimmedName,
        bio: trimmedBio || undefined,
        userId: userId,
        imageFile: imageFile,
      });

      if (!created) {
        Alert.alert('Error', 'Could not create cat.');
        return;
      }

      setCats((prev) => [...prev, created]);

      // Clear form
      setNewName('');
      setNewBio('');
      setImageFile(null);

      // Immediately select the new cat
      await setSelectedCatId(created.id);
      router.replace('/(tabs)/account');
    } catch (err: any) {
      console.error('Failed to create cat:', err);
      Alert.alert('Error', err.message ?? 'Could not create cat.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading your cats…</Text>
      </SafeAreaView>
    );
  }

  if (error || !token) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>{error ?? 'You must sign in first.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.replace('/(tabs)/account')}
        >
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Select a cat</Text>

        {/* Spacer to balance the back button */}
        <View style={{ width: 22 }} />
      </View>

      {/* Scrollable content */}
      <View style={styles.scrollContent}>
        {/* Cat selection card */}
        {cats.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Cats</Text>
            <Text style={styles.cardSubtitle}>Tap a cat to use it on your profile.</Text>
            <FlatList
              data={cats}
              keyExtractor={(cat) => String(cat.id)}
              style={{ marginTop: 8, maxHeight: 260 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.catRow}
                  onPress={() => handleSelectCat(item.id)}
                >
                  {item.avatarUrl ? (
                    <Image source={{ uri: item.avatarUrl }} style={styles.catAvatar} />
                  ) : (
                    <View style={styles.catAvatarPlaceholder}>
                      <Text style={styles.catAvatarText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.catName}>{item.name}</Text>
                    {!!item.bio && <Text style={styles.catBio}>{item.bio}</Text>}
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Create new cat card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {cats.length === 0 ? 'Create Your First Cat' : 'Add a New Cat'}
          </Text>
          {cats.length === 0 && (
            <Text style={styles.cardSubtitle}>Get started by creating a cat profile!</Text>
          )}

          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <MaterialIcons
              name={imageFile ? 'check-circle' : 'add-photo-alternate'}
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.imageButtonText}>
              {imageFile ? 'Image Selected' : 'Select Cat Image'}
            </Text>
          </TouchableOpacity>

          {imageFile && (
            <Image
              source={{ uri: imageFile.uri }}
              style={styles.previewImage}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Cat name (required)"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Short bio (optional)"
            value={newBio}
            onChangeText={setNewBio}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleCreateCat}>
            <Text style={styles.primaryButtonText}>Create Cat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 56,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerBackButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#fafafa',
  },
  catAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  catAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#888',
  },
  catName: {
    fontWeight: '600',
    fontSize: 16,
  },
  catBio: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  imageButton: {
    marginTop: 12,
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  previewImage: {
    width: 120,
    height: 120,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 60,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#eee',
  },
});


