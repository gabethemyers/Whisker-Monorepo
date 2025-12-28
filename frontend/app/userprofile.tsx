import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
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
    Post as ApiPost,
    getPostsByUser,
} from '@/utils/api';
import { getJwt } from '@/utils/auth';

const COLS = 3;
const GAP = 3;
const SCREEN_W = Dimensions.get('window').width;
const IMG_SIZE = Math.floor((SCREEN_W - GAP * (COLS - 1)) / COLS);

export default function UserProfileScreen() {
    const params = useLocalSearchParams();
    const userId = params.userId ? Number(params.userId) : null;
    const username = params.username as string | undefined;
    const email = params.email as string | undefined;
    const provider = params.provider as string | undefined;

    // Auth/token gating
    const [token, setToken] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    // Posts for this user
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

    // 2) Load posts for this user
    const loadPosts = useCallback(
        async (uid: number) => {
            try {
                setPostsLoading(true);
                setPostsError(null);

                const userPosts = await getPostsByUser(uid);
                setPosts(userPosts);
            } catch (err: any) {
                console.error('Failed to load posts:', err);
                setPostsError(err.message || 'Failed to load posts.');
            } finally {
                setPostsLoading(false);
            }
        },
        [],
    );

    // Initial posts load
    useEffect(() => {
        if (!token || userId == null) return;
        loadPosts(userId);
    }, [token, userId, loadPosts]);

    // Pull-to-refresh
    const onRefresh = useCallback(async () => {
        if (!token || userId == null) return;
        setRefreshing(true);
        await loadPosts(userId);
        setRefreshing(false);
    }, [token, userId, loadPosts]);

    // Header for FlatList
    const renderHeader = useCallback(
        () => (
            <View>
                {/* Top bar with back button */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color="#222" />
                    </TouchableOpacity>
                    <Text style={styles.username}>@{username || 'User'}</Text>
                    <MaterialIcons name="more-vert" size={22} />
                </View>

                {/* Profile row */}
                <View style={styles.profileRow}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={{ fontWeight: '700', fontSize: 26, color: '#555' }}>
                            {username ? username.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>

                    <View style={styles.statsRow}>
                        <Stat num={posts.length} label="Posts" />
                    </View>
                </View>

                {/* Bio block */}
                <View style={styles.bioBlock}>
                    <Text style={styles.name}>{username || 'User'}</Text>
                    {email && (
                        <Text style={styles.bioText}>Email: {email}</Text>
                    )}
                    {provider && (
                        <Text style={styles.bioText}>Signed in with {provider}</Text>
                    )}
                </View>

                {/* Action buttons */}
                <View style={styles.buttonsRow}>
                    <Button
                        text="Message"
                        onPress={() => {
                            if (userId && username) {
                                router.push({
                                    pathname: '/messages',
                                    params: {
                                        selectedUserId: userId,
                                        selectedUsername: username,
                                    },
                                });
                            }
                        }}
                    />
                </View>
            </View>
        ),
        [username, email, provider, posts.length, userId],
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

    if (authLoading || postsLoading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8 }}>Loading profile…</Text>
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

    if (!userId) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text>User not found</Text>
            </SafeAreaView>
        );
    }

    if (postsError) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text>{postsError}</Text>
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
                        <Text style={{ color: '#777' }}>No posts yet from this user.</Text>
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
                                creator={username ?? 'Unknown'}
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

function Button({ text, onPress }: { text: string; onPress?: () => void }) {
    return (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnText}>{text}</Text>
        </TouchableOpacity>
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
});
