// app/(tabs)/home.tsx
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import Header from '@/components/Header';
import { ThemedText } from '@/components/themed-text';
import { brandColor, globalStyles } from '@/styles/globalStyle';
import { Post as ApiPost, getAllPosts, getAllUsers } from '@/utils/api';

type PostWithDetails = ApiPost & {
  username?: string;
};

// 3 is the max before the chips start clipping
const CAT_CHIPS_MAX = 3;

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

        // Attach usernames (cats already arrive on each post)
        const postsWithDetails = postsData.map((post) => ({
          ...post,
          username: userMap[post.authorId] || "Unknown User",
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
                  {post.cats.length === 0 ? (
                    <View key="no-cat" style={styles.catChip}>
                      <View style={styles.catChipAvatarPlaceholder}>
                        <ThemedText style={styles.avatarPlaceholderText}>
                          {(post.username || '?').charAt(0).toUpperCase()}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.catChipName} numberOfLines={1}>
                        {post.username || 'Unknown'}
                      </ThemedText>
                    </View>
                  ) : (
                    post.cats.slice(0, CAT_CHIPS_MAX).map((cat) => (
                      <View key={cat.id} style={styles.catChip}>
                        {cat.avatarUrl ? (
                          <Image source={{ uri: cat.avatarUrl }} style={styles.catChipAvatar} />
                        ) : (
                          <View style={styles.catChipAvatarPlaceholder}>
                            <ThemedText style={styles.avatarPlaceholderText}>
                              {cat.name.charAt(0).toUpperCase()}
                            </ThemedText>
                          </View>
                        )}
                        <ThemedText style={styles.catChipName} numberOfLines={1}>
                          {cat.name}
                        </ThemedText>
                      </View>
                    ))
                  )}
                  {post.cats.length > CAT_CHIPS_MAX && (
                    <View style={styles.overflowBadge}>
                      <ThemedText style={styles.overflowBadgeText}>
                        +{post.cats.length - CAT_CHIPS_MAX}
                      </ThemedText>
                    </View>
                  )}
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
    fontSize: 20,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginRight: 14,
    borderRadius: 16,
    backgroundColor: '#f2f2f2',
  },
  catChipAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  catChipAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#d8d8d8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catChipName: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    color: '#1f1f1f',
    textAlign: 'left',
    maxWidth: 54,
  },
  overflowBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  overflowBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
  },
  subText: {
    fontSize: 12,
    color: '#666',
  },
});
