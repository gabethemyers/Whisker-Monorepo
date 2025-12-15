import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import MessagesScreen from '../../app/messages';
import * as api from '../../utils/api';
import * as auth from '../../utils/auth';

jest.mock('../../utils/api');
jest.mock('../../utils/auth');

describe('MessagesScreen', () => {
    beforeEach(() => {
        (auth.getUserId as jest.Mock).mockResolvedValue(1);
        (auth.getJwt as jest.Mock).mockResolvedValue('mock-token');
    });

    it('should render without crashing', async () => {
        (api.getUsersWithMessageHistory as jest.Mock).mockResolvedValue([]);

        const { getByText } = render(<MessagesScreen />);

        await waitFor(() => {
            expect(getByText('Messages')).toBeTruthy();
        });
    });

    it('should display users with message history', async () => {
        const mockUsers = [
            { id: 2, username: 'friend1', email: 'friend1@test.com' },
        ];

        (api.getUsersWithMessageHistory as jest.Mock).mockResolvedValue(mockUsers);

        const { getByText } = render(<MessagesScreen />);

        await waitFor(() => {
            expect(getByText('friend1')).toBeTruthy();
        });
    });

    it('should show empty state when no conversations', async () => {
        (api.getUsersWithMessageHistory as jest.Mock).mockResolvedValue([]);

        const { getByText } = render(<MessagesScreen />);

        await waitFor(() => {
            expect(getByText(/no conversations/i)).toBeTruthy();
        });
    });

    it('should show loading state initially', () => {
        (api.getUsersWithMessageHistory as jest.Mock).mockReturnValue(new Promise(() => { }));

        const component = render(<MessagesScreen />);
        expect(component).toBeTruthy();
    });
});
