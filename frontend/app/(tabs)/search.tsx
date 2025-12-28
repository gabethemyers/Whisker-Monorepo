import { getAllUsers, User } from "@/utils/api";
import { getJwt } from "@/utils/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load JWT token
  useEffect(() => {
    const loadToken = async () => {
      try {
        setLoading(true);
        setError(null);
        const t = await getJwt();
        if (!t) {
          setError("You must sign in first.");
        } else {
          setToken(t);
        }
      } catch (err) {
        console.error("Failed to load auth token:", err);
        setError("Failed to load auth token.");
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  // Load all users
  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (err: any) {
      console.error("Failed to load users:", err);
      setUsersError(err.message || "Failed to load users.");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    loadUsers();
  }, [token, loadUsers]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  }, [token, loadUsers]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!query.trim()) {
      return users;
    }
    const lowerQuery = query.toLowerCase();
    return users.filter((user) =>
      user.username.toLowerCase().includes(lowerQuery) ||
      user.email?.toLowerCase().includes(lowerQuery)
    );
  }, [users, query]);

  // Render user item
  const renderUserItem: ListRenderItem<User> = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: '/userprofile',
          params: {
            userId: item.id,
            username: item.username,
            email: item.email || '',
            provider: item.provider || '',
          },
        });
      }}
    >
      <View style={styles.userAvatar}>
        <Text style={styles.avatarText}>
          {item.username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>@{item.username}</Text>
        {item.email && (
          <Text style={styles.userEmail}>{item.email}</Text>
        )}
        {item.provider && (
          <Text style={styles.userProvider}>
            via {item.provider}
          </Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  ), []);

  const keyExtractor = useCallback((user: User) => String(user.id), []);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#417aa9ff" />
        <Text style={styles.loadingText}>Checking your session…</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !token) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "You must sign in first."}</Text>
      </SafeAreaView>
    );
  }

  // Main content
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Users</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username or email..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} style={styles.clearButton}>
            <MaterialIcons name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {usersLoading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#417aa9ff" />
          <Text style={styles.loadingText}>Loading users…</Text>
        </View>
      ) : usersError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{usersError}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={keyExtractor}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="person-search" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {query.trim() ? "No users found" : "No users available"}
              </Text>
              {query.trim() && (
                <Text style={styles.emptySubtext}>
                  Try searching with a different keyword
                </Text>
              )}
            </View>
          }
          ListHeaderComponent={
            filteredUsers.length > 0 ? (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 80,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#417aa9ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  userProvider: {
    fontSize: 12,
    color: "#999",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 4,
  },
});

