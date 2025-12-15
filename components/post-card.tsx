import React, { useMemo, useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";

type Comment = {
    id: string;
    author: { name: string; avatarUrl?: string};
    text: string;
    createdAt?: string;
};

type Creator = { name: string; avatarUrl?: string; handle?: string};

export default function PostCard({
    id,
    imageUrl,
    creator,
    initialLiked = false,
    initialLikeCount = 0,
    initialComments = [],
    onLikeToggle,
    onSubmitComment,
    style,
}: PostCardProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const heart = liked ? <Entypo name="heart" size={32} color="#c2678a" /> : <Entypo name="heart-outlined" size={32} color="black" />;

    const handleLike = () => {
        const next = !liked;
        setLiked(next);
        setLikeCount((c) => c + (next ? 1 : -1)); 
        onLikeToggle?.({ id, liked: next});
    };

    const handleAddComment = async () => {
        const text = commentText.trim();
        if (!text || submitting) return;

        setSubmitting(true);

        const tempComment: Comment = {
            id: `temp-${Date.now()}`,
            author: {name: "You"},
            text,
            createdAt: new Date().toISOString(),
        };
        setComments((c) => [tempComment, ...c]);
        setCommentText("");

        try {
            await onSubmitComment?.({id, text});

        } catch (e){
            setComments((c) => c.filter((cm) => cm.id !== tempComment.id));
            setCommentText(text);
        } finally {
            setSubmitting(false);
        }
    };

    const commentCount = comments.length;
    const subtitle = useMemo(() => {
        const handle = creator.handle ? `• @${creator.handle}` : "";
        return `${creator.name}${handle}`;
    }, [creator]);

    const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentRow}>
      <View style={styles.commentAvatar}>
        {item.author.avatarUrl ? (
          <Image source={{ uri: item.author.avatarUrl }} style={styles.avatarImg} />
        ) : (
          <Text style={styles.avatarFallback}>{item.author.name?.[0] ?? "?"}</Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.commentText}>
          <Text style={styles.commentAuthor}>{item.author.name} </Text>
          {item.text}
        </Text>
        {item.createdAt ? (
          <Text style={styles.commentMeta}>{timeAgo(item.createdAt)}</Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.card, style]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.creatorAvatar}>
          {creator.avatarUrl ? (
            <Image source={{ uri: creator.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarFallback}>{creator.name?.[0] ?? "?"}</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.creatorName} numberOfLines={1} accessibilityRole="header">
            {creator.name}
          </Text>
          {creator.handle ? <Text style={styles.creatorHandle}>@{creator.handle}</Text> : null}
        </View>
      </View>

      {/* Photo */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.photo}
        accessibilityIgnoresInvertColors
        accessible
        accessibilityLabel="Post image"
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionLeft}>
          <Text style={styles.actionText}>
            {heart} {likeCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowComments((v) => !v)}>
          <Text style={styles.actionText}>
            <Ionicons name="chatbox-ellipses-outline" size={32} color="black" /> 
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comments */}
      {showComments && (
        <FlatList
          data={comments}
          keyExtractor={(c) => c.id}
          renderItem={renderComment}
          contentContainerStyle={styles.commentList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Be the first to comment!</Text>
          }
          scrollEnabled={false}
        />
      )}

      {/* Add comment */}
      <View style={styles.inputRow}>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Add a comment…"
          placeholderTextColor="#8E8E93"
          style={styles.input}
          editable={!submitting}
          onSubmitEditing={handleAddComment}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={handleAddComment}
          disabled={submitting || commentText.trim().length === 0}
          style={[styles.sendBtn, (submitting || commentText.trim().length === 0) && styles.sendBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Post comment"
        >
          <MaterialCommunityIcons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const s = Math.max(1, Math.floor((Date.now() - d) / 1000));
  const units: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.345, "w"],
    [12, "mo"],
    [Number.POSITIVE_INFINITY, "y"],
  ];
  let val = s;
  let label = "s";
  let i = 0;
  while (i < units.length && val >= units[i][0]) {
    val = Math.floor(val / units[i][0]);
    label = units[i][1];
    i++;
  }
  return `${val}${label} ago`;
}


//Styling
const styles = StyleSheet.create({
    card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    overflow: "hidden",
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  avatarFallback: { fontWeight: "700", color: "#666" },
  creatorName: { fontWeight: "700", fontSize: 16 },
  creatorHandle: { color: "#888", fontSize: 12 },
  likeBtn: { padding: 8 },
  likeIcon: { fontSize: 18 },
  photo: { width: "100%", aspectRatio: 1, backgroundColor: "#f2f2f2" },
  actions: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionLeft: { flexDirection: "row", alignItems: "center" },
  actionText: { fontSize: 14, fontWeight: "600" },
  commentList: { paddingHorizontal: 12, paddingBottom: 8, gap: 10 },
  commentRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  commentText: { fontSize: 14, lineHeight: 18, color: "#222" },
  commentAuthor: { fontWeight: "700" },
  commentMeta: { fontSize: 12, color: "#999", marginTop: 2 },
  emptyText: { color: "#888", fontStyle: "italic", fontSize: 13 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 14,
  },
  sendBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendText: { color: "#fff", fontWeight: "700" },
});