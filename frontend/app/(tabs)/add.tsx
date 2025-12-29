// app/(tabs)/add.tsx
// npm install expo-image-picker
// use above if errors
import { API_BASE_URL, Cat, getAllCats, getCatsByUser, getCurrentUser } from '@/utils/api';
import { getJwt, getUserId } from '@/utils/auth';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const BASE_URL = API_BASE_URL;

const uriToBlob = async (uri: string) => {
  const res = await fetch(uri);
  return await res.blob();
};

export default function AddScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [caption, setCaption] = useState('');
  const [catId, setCatId] = useState<number | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [imageFile, setImageFile] = useState<any>(null);

  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const t = await getJwt();
      setToken(t);

      if (t) {
        try {
          const user = await getCurrentUser();
          if (user) setCurrentUser(user.id);

          const allCats = await getAllCats();
          // Sort: owned cats first, then shared cats
          const sortedCats = allCats.sort((a, b) => {
            const aIsOwned = a.userId === user?.id;
            const bIsOwned = b.userId === user?.id;
            if (aIsOwned && !bIsOwned) return -1;
            if (!aIsOwned && bIsOwned) return 1;
            return 0;
          });
          setCats(sortedCats);
        } catch (err) {
          console.error("Failed to load cats", err);
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFile(result.assets[0]);
    }
  };

  const handleCreatePost = async () => {
    try {
      setPosting(true);
      setMessage(null);

      const userId = await getUserId();
      if (!userId) throw new Error("User ID missing");
      if (!imageFile) {
        setMessage("Please select an image first.");
        return;
      }
      if (!catId) {
        setMessage("Please select a cat.");
        return;
      }

      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("authorId", String(userId));
      formData.append("catId", String(catId));

      const fileBlob = await uriToBlob(imageFile.uri);
      formData.append("file", fileBlob, "upload.jpg");

      const res = await fetch(`${BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }

      setMessage("Post created successfully!");
      setCaption("");
      setCatId(null);
      setImageFile(null);

      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 2000);

    } catch (err) {
      console.error("Failed to post:", err);
      setMessage("Error creating post.");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Checking your session…</Text>
      </SafeAreaView>
    );
  }

  if (!token) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>You must sign in first.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Create New Post</Text>

          {!imageFile ? (
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Select Image</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: imageFile.uri }}
                style={styles.previewImage}
              />
            </TouchableOpacity>
          )}

          <TextInput
            placeholder="Caption"
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
          />

          <Text style={styles.label}>Select a Cat:</Text>
          <Text style={styles.helperText}>Want to create a new cat? Go to the Account tab.</Text>
          <View style={styles.catListContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 4 }}
            >
              {cats.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.catOption,
                    catId === item.id && styles.catOptionSelected
                  ]}
                  onPress={() => setCatId(item.id)}
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
                  <Text style={[styles.catName, catId === item.id && styles.catNameSelected]} numberOfLines={2}>
                    {item.name}
                    {item.userId !== currentUser && ' (Shared)'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.postButton}
            onPress={handleCreatePost}
            disabled={posting}
          >
            <Text style={styles.postButtonText}>
              {posting ? "Posting..." : "Create Post"}
            </Text>
          </TouchableOpacity>

          {message && <Text style={styles.messageText}>{message}</Text>}
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 12,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  imageButton: {
    backgroundColor: "#666",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: "white",
    fontWeight: "600",
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  postButton: {
    marginTop: 24,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  catListContainer: {
    height: 130,
    width: '100%',
  },
  catOption: {
    alignItems: 'center',
    marginRight: 12,
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#f9f9f9',
    width: 100,
  },
  catOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#eef6ff',
  },
  catAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  catAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  catAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  catName: {
    fontSize: 11,
    textAlign: 'center',
    color: '#333',
    lineHeight: 14,
  },
  catNameSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  messageText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#333',
  }
});
