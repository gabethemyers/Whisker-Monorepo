import * as SecureStore from 'expo-secure-store';
import { getJwt, getUserId } from '../../utils/auth';

jest.mock('expo-secure-store');

describe('Auth Utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getJwt', () => {
        it('should retrieve JWT from SecureStore', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-jwt-token');

            const token = await getJwt();

            expect(token).toBe('test-jwt-token');
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('jwt');
        });

        it('should return null if no JWT exists', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            const token = await getJwt();

            expect(token).toBeNull();
        });
    });

    describe('getUserId', () => {
        it('should retrieve user ID from JWT token', async () => {
            // Create a mock JWT with userId in payload (base64 encoded)
            const mockJwt = 'header.' + btoa(JSON.stringify({ userId: 123 })) + '.signature';
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockJwt);

            const userId = await getUserId();

            expect(userId).toBe(123);
        });

        it('should return null if no user ID exists', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            const userId = await getUserId();

            expect(userId).toBeNull();
        });

        it('should handle invalid JWT format', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('invalid-token');

            const userId = await getUserId();

            expect(userId).toBeNull();
        });
    });
});
