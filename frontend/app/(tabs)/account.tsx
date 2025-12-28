import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import PostCard from '@/components/post-card';
import {
  Cat as ApiCat,
  Post as ApiPost,
  User as ApiUser,
  getCurrentUser,
  getPostsByCat,
  API_BASE_URL,
} from '@/utils/api';
import { getJwt, getSelectedCatId, logout } from '@/utils/auth';

const COLS = 3;
const GAP = 3;
const SCREEN_W = Dimensions.get('window').width;
const IMG_SIZE = Math.floor((SCREEN_W - GAP * (COLS - 1)) / COLS);

export default function ProfileScreen() {
  // Auth/token gating
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Selected cat
  const [selectedCatId, setSelectedCatIdState] = useState<number | null>(null);
  const [catLoading, setCatLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<ApiCat | null>(null);

  // User
  const [user, setUser] = useState<ApiUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // Posts for selected cat
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Refresh + modal
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ApiPost | null>(null);

  // 1) Load JWT
  useEffect(() => {
    const loadToken = async () => {
      try {
        setAuthLoading(true);
        setAuthError(null);

        const t = await getJwt();
        if (!t) {
          setAuthError('You must sign in first.');
        } else {
          setToken(t);
        }
      } catch (err) {
        console.error('Failed to load auth token:', err);
        setAuthError('Failed to load auth token.');
      } finally {
        setAuthLoading(false);
      }
    };

    loadToken();
  }, []);

  // 2) Load selected cat ID once we have a token
  useEffect(() => {
    if (!token) return;

    const loadSelectedCat = async () => {
      try {
        setCatLoading(true);
        const id = await getSelectedCatId();
        setSelectedCatIdState(id);
      } catch (err) {
        console.error('Failed to load selected cat:', err);
      } finally {
        setCatLoading(false);
      }
    };

    loadSelectedCat();
  }, [token]);

  // 2b) Load active cat details (for name) once we know selectedCatId
  useEffect(() => {
    if (!token || selectedCatId == null) return;

    const loadActiveCat = async () => {
      try {
        // fetch all cats, then find the active one
        const res = await fetch(
          `${API_BASE_URL}/api/cats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          console.error('Failed to load cats for active cat name');
          return;
        }

        const allCats: ApiCat[] = await res.json();
        const found = allCats.find((c) => c.id === selectedCatId) ?? null;
        setActiveCat(found);
      } catch (err) {
        console.error('Failed to load cat name:', err);
      }
    };

    loadActiveCat();
  }, [token, selectedCatId]);

  // 3) Load current user from /api/users/me
  useEffect(() => {
    if (!token) return;

    const loadUser = async () => {
      try {
        setUserLoading(true);
        setUserError(null);

        console.log('Loading user with token:', token.substring(0, 20) + '...');
        const u = await getCurrentUser();
        console.log('User loaded:', u);

        if (!u) {
          setUserError('Failed to load user.');
        } else {
          setUser(u);
        }
      } catch (err: any) {
        console.error('Failed to load user:', err);
        setUserError(err.message || 'Failed to load user.');
      } finally {
        console.log('User loading complete');
        setUserLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // 4) Load posts for the active cat from /api/posts/cat/{catId}
  const loadPosts = useCallback(
    async (catId: number) => {
      try {
        setPostsLoading(true);
        setPostsError(null);

        console.log('Loading posts for cat:', catId);
        const catPosts = await getPostsByCat(catId);
        console.log('Posts loaded:', catPosts.length);
        setPosts(catPosts);
      } catch (err: any) {
        console.error('Failed to load posts:', err);
        setPostsError(err.message || 'Failed to load posts.');
        // Still set posts to empty array so we don't get stuck
        setPosts([]);
      } finally {
        console.log('Posts loading complete');
        setPostsLoading(false);
      }
    },
    [],
  );

  // Initial posts load / reload when cat changes
  useEffect(() => {
    if (!token || selectedCatId == null) return;
    loadPosts(selectedCatId);
  }, [token, selectedCatId, loadPosts]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    if (!token || selectedCatId == null) return;
    setRefreshing(true);
    await loadPosts(selectedCatId);
    setRefreshing(false);
  }, [token, selectedCatId, loadPosts]);

  // Header for FlatList
  const renderHeader = useCallback(
    () => (
      <View>
        {/* Active cat bar */}
        <View style={styles.catBar}>
          <View style={styles.catInfoSection}>
            {/* Cat avatar */}
            {activeCat?.avatarUrl ? (
              <Image
                source={{ uri: activeCat.avatarUrl }}
                style={styles.catAvatar}
              />
            ) : (
              <View style={styles.catAvatarPlaceholder}>
                <Text style={styles.catAvatarText}>
                  {activeCat?.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}

            {/* Cat name and bio */}
            <View style={styles.catTextInfo}>
              <Text style={styles.activeCatName}>
                {activeCat ? activeCat.name : selectedCatId != null ? `Cat #${selectedCatId}` : 'No cat selected'}
              </Text>
              {activeCat?.bio && (
                <Text style={styles.activeCatBio} numberOfLines={1}>
                  {activeCat.bio}
                </Text>
              )}
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={styles.changeCatButton}
              onPress={() => router.push('/selectcat')}
            >
              <Text style={styles.changeCatButtonText}>
                {selectedCatId ? 'Change cat' : 'Choose cat'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={async () => {
                await logout();
                router.replace('/signin');
              }}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User info */}
        {!user ? (
          <View style={styles.profileRow}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            {/* Top bar */}
            <View style={styles.topBar}>
              <Text style={styles.username}>@{user.username}</Text>
              <MaterialIcons name="menu" size={22} />
            </View>

            {/* Profile row */}
            <View style={styles.profileRow}>
              {/* Placeholder avatar */}
              <View style={styles.avatarPlaceholder}>
                <Text style={{ fontWeight: '700', fontSize: 26, color: '#555' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.statsRow}>
                <Stat num={posts.length} label="Posts" />
                <Stat num={0} label="Followers" />
                <Stat num={0} label="Following" />
              </View>
            </View>

            {/* Bio block */}
            <View style={styles.bioBlock}>
              <Text style={styles.name}>{user.username}</Text>
              {user.email && (
                <Text style={styles.bioText}>Email: {user.email}</Text>
              )}
              {user.provider && (
                <Text style={styles.bioText}>Signed in with {user.provider}</Text>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonsRow}>
              <Button text="Edit Profile" />
              <Button text="Share Profile" />
            </View>
          </>
        )}
      </View>
    ),
    [user, selectedCatId, posts.length, activeCat],
  );

  // Grid item renderer
  const renderItem: ListRenderItem<ApiPost> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setSelectedPost(item)}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.gridImg} />
      </TouchableOpacity>
    ),
    [],
  );

  const keyExtractor = useCallback((p: ApiPost) => String(p.id), []);
  const columnWrapperStyle = useMemo(() => ({ gap: GAP }), []);

  // ---------- Gating & error handling ----------

  // First check auth
  if (authLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading auth…</Text>
      </SafeAreaView>
    );
  }

  if (authError || !token) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>{authError ?? 'You must sign in first.'}</Text>
      </SafeAreaView>
    );
  }

  // Then check cat selection
  if (catLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading cat selection…</Text>
      </SafeAreaView>
    );
  }

  // Signed in but no cat yet: go to selectCat screen
  if (selectedCatId == null) {
    router.replace('/selectCat');
    return null;
  }

  // Finally check user/posts (only if we have a cat)
  if (userLoading || postsLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading your profile…</Text>
      </SafeAreaView>
    );
  }

  if (userError || postsError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>{userError || postsError}</Text>
      </SafeAreaView>
    );
  }

  // ---------- Main UI ----------

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        numColumns={COLS}
        columnWrapperStyle={columnWrapperStyle}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={18}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: '#777' }}>No posts yet for this cat.</Text>
          </View>
        }
      />

      {/* Post modal */}
      <Modal
        visible={!!selectedPost}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPost(null)}
        statusBarTranslucent
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={() => setSelectedPost(null)}
        />

        <SafeAreaView style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedPost(null)}
            >
              <MaterialIcons name="close" size={22} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            {selectedPost && (
              <PostCard
                id={String(selectedPost.id)}
                image={selectedPost.imageUrl}
                creator={user?.username ?? 'Unknown'}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ---------- Small components & styles ----------

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontWeight: '700', fontSize: 18 }}>{formatNum(num)}</Text>
      <Text style={{ color: '#666' }}>{label}</Text>
    </View>
  );
}

function Button({ text }: { text: string }) {
  return (
    <View style={styles.btn}>
      <Text style={styles.btnText}>{text}</Text>
    </View>
  );
}

function formatNum(n: number) {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + 'k';
  return String(n);
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  catBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  catInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  catAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#eee',
  },
  catAvatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#888',
  },
  catTextInfo: {
    flex: 1,
  },
  activeCatName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  activeCatBio: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  changeCatButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f2f2f2',
  },
  changeCatButtonText: {
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: '700',
    fontSize: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 16,
  },
  avatarPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bioBlock: {
    paddingHorizontal: 12,
  },
  name: {
    fontWeight: '700',
    marginBottom: 2,
  },
  bioText: {
    color: '#222',
    marginBottom: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginBottom: 20,
  },
  btnText: {
    fontWeight: '600',
  },
  gridImg: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    marginBottom: GAP,
    backgroundColor: '#eee',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCard: {
    flex: 1,
    marginTop: '18%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#ff3b30',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});


