import { getAllPosts, getAllUsers, getCurrentUser, getPostsByUser } from '../../utils/api';
import * as auth from '../../utils/auth';

// Mock the auth module
jest.mock('../../utils/auth');

// Mock fetch
global.fetch = jest.fn();

describe('API Utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (auth.getJwt as jest.Mock).mockResolvedValue('mock-token');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getAllUsers', () => {
        it('should fetch and return all users', async () => {
            const mockUsers = [
                { userId: 1, username: 'user1', email: 'user1@test.com', provider: 'google' },
                { userId: 2, username: 'user2', email: 'user2@test.com', provider: 'github' },
            ];

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockUsers,
            });

            const users = await getAllUsers();

            expect(users).toHaveLength(2);
            expect(users[0].username).toBe('user1');
            expect(users[1].username).toBe('user2');
        });

        it('should return empty array on error', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const users = await getAllUsers();

            expect(users).toEqual([]);
        });
    });

    describe('getAllPosts', () => {
        it('should fetch and return all posts', async () => {
            const mockPosts = [
                { id: 1, caption: 'Cat 1', imageUrl: 'url1', authorId: 1, likesCount: 5, commentCount: 2, createdAt: '2025-01-01' },
                { id: 2, caption: 'Cat 2', imageUrl: 'url2', authorId: 2, likesCount: 10, commentCount: 3, createdAt: '2025-01-02' },
            ];

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockPosts,
            });

            const posts = await getAllPosts();

            expect(posts).toHaveLength(2);
            expect(posts[0].caption).toBe('Cat 1');
            expect(posts[1].likesCount).toBe(10);
        });

        it('should return empty array on error', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const posts = await getAllPosts();

            expect(posts).toEqual([]);
        });
    });

    describe('getCurrentUser', () => {
        it('should fetch and return current user', async () => {
            const mockUser = {
                userId: 1,
                username: 'currentUser',
                email: 'current@test.com',
                provider: 'google',
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockUser,
            });

            const user = await getCurrentUser();

            expect(user).not.toBeNull();
            expect(user?.username).toBe('currentUser');
            expect(user?.id).toBe(1);
        });

        it('should return null on error', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Auth error'));

            const user = await getCurrentUser();

            expect(user).toBeNull();
        });
    });

    describe('getPostsByUser', () => {
        it('should fetch posts for a specific user', async () => {
            const mockPosts = [
                { id: 1, caption: 'User Post', imageUrl: 'url', authorId: 5, likesCount: 3, commentCount: 1, createdAt: '2025-01-01' },
            ];

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockPosts,
            });

            const posts = await getPostsByUser(5);

            expect(posts).toHaveLength(1);
            expect(posts[0].authorId).toBe(5);
        });
    });
});
