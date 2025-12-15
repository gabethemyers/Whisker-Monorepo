// app/(tabs)/home.tsx
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import Header from '@/components/Header';
import { ThemedText } from '@/components/themed-text';
import { brandColor, globalStyles } from '@/styles/globalStyle';
import { Post as ApiPost, Cat, getAllCats, getAllPosts, getAllUsers } from '@/utils/api';

type PostWithDetails = ApiPost & {
  username?: string;
  cat?: Cat;
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch posts using API
        const postsData = await getAllPosts();

        if (postsData.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        // Fetch all users to map usernames
        const allUsers = await getAllUsers();
        const userMap: Record<number, string> = {};
        allUsers.forEach(user => {
          userMap[user.id] = user.username;
        });

        // Fetch all cats to map cat details
        const allCats = await getAllCats();
        const catMap: Record<number, Cat> = {};
        allCats.forEach(cat => {
          catMap[cat.id] = cat;
        });

        // Attach usernames and cats to posts
        const postsWithDetails = postsData.map((post) => ({
          ...post,
          username: userMap[post.authorId] || "Unknown User",
          cat: post.catId ? catMap[post.catId] : undefined,
        }));

        setPosts(postsWithDetails);
      } catch (err: any) {
        console.error('Failed to load posts:', err);
        setError(err.message ?? 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndUsers();
  }, []);

  return (
    <>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.feedContainer}>

          {/* Loading */}
          {loading && (
            <View style={globalStyles.centered}>
              <ActivityIndicator />
              <ThemedText style={{ marginTop: 8 }}>Loading cats…</ThemedText>
            </View>
          )}

          {/* Error */}
          {error && !loading && (
            <View style={globalStyles.centered}>
              <ThemedText type="subtitle">Error</ThemedText>
              <ThemedText>{error}</ThemedText>
            </View>
          )}

          {/* No posts */}
          {!loading && !error && posts.length === 0 && (
            <View style={globalStyles.centered}>
              <ThemedText>No posts yet. Be the first to share a cat!</ThemedText>
            </View>
          )}

          {/* Posts */}
          {!loading && !error &&
            posts.map((post) => (
              <View key={post.id} style={styles.postCard}>

                {/* Header: Cat info */}
                <View style={styles.postHeader}>
                  {post.cat?.avatarUrl ? (
                    <Image source={{ uri: post.cat.avatarUrl }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <ThemedText style={styles.avatarPlaceholderText}>
                        {(post.cat?.name || post.username || '?').charAt(0).toUpperCase()}
                      </ThemedText>
                    </View>
                  )}
                  <View>
                    <ThemedText style={globalStyles.usernameText}>
                      {post.cat?.name || post.username || 'Unknown'}
                    </ThemedText>
                  </View>
                </View>

                {/* Main Media: Full width image */}
                {post.imageUrl && (
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.postImage}
                    contentFit="cover"
                  />
                )}

                {/* Footer: Actions (placeholder), Caption, Date */}
                <View style={styles.postFooter}>

                  {/* Action Icons (Heart, Comment, Share) - Placeholders for visual fidelity */}
                  <View style={globalStyles.actionIconsFn}>
                    {/* Using simple text or placeholders since we might not have icons imported yet, 
                        but relying on globalStyles.actionIconsFn to layout them out if we did. 
                        For now, just keeping clean spacing. */}
                  </View>

                  {/* Caption Row */}
                  <ThemedText style={globalStyles.caption}>
                    <ThemedText style={{ fontWeight: '700', color: '#000' }}>
                      {post.username}
                    </ThemedText>{' '}
                    {post.caption}
                  </ThemedText>

                  {/* Date */}
                  {post.createdAt && (
                    <ThemedText style={globalStyles.metaText}>
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </ThemedText>
                  )}
                </View>

              </View>
            ))}

        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: brandColor,
  },
  feedContainer: {
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  postCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },
  postFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarPlaceholderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  subText: {
    fontSize: 12,
    color: '#666',
  },
});
