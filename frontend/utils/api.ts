import { getJwt } from './auth';

const BASE_URL = 'https://whisker-backend.onrender.com';
export const API_BASE_URL = BASE_URL;

// ---------- Types ----------

// Raw response for /api/users/me
interface BackendMeResponse {
    userId: number;
    username: string;
    email: string;
    provider: string;
}

// Normalized user type for the frontend
export interface User {
    id: number;
    username: string;
    email: string;
    provider?: string;
    providerId?: string;
}

// Post type based on your docs
export interface Post {
    id: number;
    caption?: string;
    imageUrl: string;
    authorId: number;
    catId?: number;
    likesCount: number;
    commentCount: number;
    createdAt: string;
}

// Chat message type from your original file
export interface ChatMessage {
    id: number;
    senderId: number;
    recipientId: number;
    content: string;
    createdAt: string;
}

export interface Comment {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: string;
}

export interface Like {
    id: number;
    postId: number;
    userId: number;
    createdAt: string;
}

export interface Cat {
    id: number;
    name: string;
    bio?: string;
    avatarUrl?: string;
    birthdate?: string;
    userId: number;
    createdAt: string;
}

// ---------- Core helper ----------

/**
 * Generic helper to call your backend with the current JWT.
 *
 * Usage:
 *   const me = await apiFetch('/api/users/me');
 *   const posts = await apiFetch(`/api/posts/cat/${catId}`);
 */
export async function apiFetch<T = any>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = await getJwt();

    if (!token) {
        console.warn('No token found in apiFetch');
        throw new Error('Not authenticated');
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        let message: string;

        try {
            const maybeJson = await res.json();
            message =
                (maybeJson && (maybeJson.error || maybeJson.message)) ||
                res.statusText ||
                'Request failed';
        } catch {
            message = res.statusText || 'Request failed';
        }

        console.error('apiFetch error:', res.status, message);
        throw new Error(message);
    }

    if (res.status === 204) {
        // No content
        return undefined as T;
    }

    return (await res.json()) as T;
}

// ---------- User endpoints ----------

/**
 * GET /api/users/me
 * Returns the currently logged-in user.
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const data = await apiFetch<BackendMeResponse>('/api/users/me');

        const user: User = {
            id: data.userId,
            username: data.username,
            email: data.email,
            provider: data.provider,
        };

        return user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

/**
 * GET /api/users/all
 * Returns all users.
 */
export async function getAllUsers(): Promise<User[]> {
    try {
        // Backend might return { userId, username, ... } for each user, so we normalize.
        const rawUsers = await apiFetch<Array<any>>('/api/users/all');

        const users: User[] = rawUsers.map((u) => ({
            id: u.userId ?? u.id, // handle either `userId` or `id`
            username: u.username,
            email: u.email,
            provider: u.provider,
        }));

        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

/**
 * PUT /api/users/{userId}/username
 */
export async function updateUsername(userId: number, username: string): Promise<void> {
    try {
        await apiFetch(`/api/users/${userId}/username`, {
            method: 'PUT',
            body: JSON.stringify({ username }),
        });
    } catch (error) {
        console.error('Error updating username:', error);
        throw error;
    }
}

// ---------- Post endpoints ----------

/**
 * GET /api/posts
 */
export async function getAllPosts(): Promise<Post[]> {
    try {
        const posts = await apiFetch<Post[]>('/api/posts');
        return posts;
    } catch (error) {
        console.error('Error fetching all posts:', error);
        return [];
    }
}

/**
 * GET /api/posts/user/{userId}
 */
export async function getPostsByUser(userId: number): Promise<Post[]> {
    try {
        const posts = await apiFetch<Post[]>(`/api/posts/user/${userId}`);
        return posts;
    } catch (error) {
        console.error('Error fetching posts by user:', error);
        return [];
    }
}

/**
 * GET /api/posts/cat/{catId}
 */
export async function getPostsByCat(catId: number): Promise<Post[]> {
    try {
        const posts = await apiFetch<Post[]>(`/api/posts/cat/${catId}`);
        return posts;
    } catch (error) {
        console.error('Error fetching posts by cat:', error);
        return [];
    }
}

/**
 * GET /api/posts/{id}
 */
export async function getPost(id: number): Promise<Post | null> {
    try {
        const post = await apiFetch<Post>(`/api/posts/${id}`);
        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

/**
 * POST /api/posts
 */
export async function createPost(input: {
    caption: string;
    imageUrl: string;
    authorId: number;
    catId: number;
}): Promise<Post | null> {
    try {
        const created = await apiFetch<Post>('/api/posts', {
            method: 'POST',
            body: JSON.stringify(input),
        });
        return created;
    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
}

/**
 * PUT /api/posts/{id}
 */
export async function updatePost(
    id: number,
    input: { caption?: string; imageUrl?: string },
): Promise<Post | null> {
    try {
        const updated = await apiFetch<Post>(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
        });
        return updated;
    } catch (error) {
        console.error('Error updating post:', error);
        return null;
    }
}

/**
 * DELETE /api/posts/{id}
 */
export async function deletePost(id: number): Promise<boolean> {
    try {
        await apiFetch(`/api/posts/${id}`, {
            method: 'DELETE',
        });
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        return false;
    }
}

// ---------- Chat endpoints (your original logic) ----------

/**
 * GET /api/messages/{otherUserId}
 * (This endpoint is from your earlier code, not listed in the docs, but we keep it.)
 */
export async function getChatHistory(otherUserId: number): Promise<ChatMessage[]> {
    try {
        const messages = await apiFetch<ChatMessage[]>(`/api/messages/${otherUserId}`);
        return messages;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return [];
    }
}

/**
 * Get all users that the current user has message history with
 * by checking chat history for each user
 */
export async function getUsersWithMessageHistory(currentUserId: number): Promise<User[]> {
    try {
        // Get all users first
        const allUsers = await getAllUsers();

        // Filter out the current user
        const otherUsers = allUsers.filter(u => u.id !== currentUserId);

        // Check each user for message history in parallel
        const usersWithHistory = await Promise.all(
            otherUsers.map(async (user) => {
                try {
                    const messages = await getChatHistory(user.id);
                    return messages.length > 0 ? user : null;
                } catch {
                    return null;
                }
            })
        );

        // Filter out null values (users with no message history)
        return usersWithHistory.filter((user): user is User => user !== null);
    } catch (error) {
        console.error('Error fetching users with message history:', error);
        return [];
    }
}

// ---------- Cat endpoints ----------

/**
 * GET /api/cats
 * Returns all cats
 */
export async function getAllCats(): Promise<Cat[]> {
    try {
        const cats = await apiFetch<Cat[]>('/api/cats');
        return cats;
    } catch (error) {
        console.error('Error fetching all cats:', error);
        return [];
    }
}

/**
 * GET /api/cats/user/{userId}
 * Returns all cats for a specific user
 */
export async function getCatsByUser(userId: number): Promise<Cat[]> {
    try {
        const cats = await apiFetch<Cat[]>(`/api/cats/user/${userId}`);
        return cats;
    } catch (error) {
        console.error('Error fetching cats by user:', error);
        return [];
    }
}

/**
 * Compress an image blob to reduce file size
 */
async function compressImage(blob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;

            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (compressedBlob) => {
                    if (compressedBlob) {
                        resolve(compressedBlob);
                    } else {
                        reject(new Error('Compression failed'));
                    }
                },
                'image/jpeg',
                0.8 // 80% quality
            );
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}

/**
 * POST /api/cats
 * Create a new cat with image upload (with compression)
 */
export async function createCat(input: {
    name: string;
    bio?: string;
    userId: number;
    imageFile?: any;
}): Promise<Cat | null> {
    try {
        const token = await getJwt();
        if (!token) throw new Error('Not authenticated');

        const formData = new FormData();
        formData.append('name', input.name);
        formData.append('userId', String(input.userId));
        if (input.bio) formData.append('bio', input.bio);

        if (input.imageFile) {
            console.log('Original image:', input.imageFile.fileSize, 'bytes');
            const res = await fetch(input.imageFile.uri);
            const blob = await res.blob();

            // Compress image if it's too large (over 1MB)
            if (blob.size > 1024 * 1024) {
                console.log('Compressing image...');
                const compressed = await compressImage(blob);
                console.log('Compressed:', blob.size, '→', compressed.size, 'bytes');
                formData.append('file', compressed, 'cat-avatar.jpg');
            } else {
                formData.append('file', blob, 'cat-avatar.jpg');
            }
        }

        const response = await fetch(`${BASE_URL}/api/cats`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error ${response.status}: ${text}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating cat:', error);
        throw error;
    }
}