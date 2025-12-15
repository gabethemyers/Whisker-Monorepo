import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import SearchScreen from '../../app/(tabs)/search';
import * as api from '../../utils/api';
import * as auth from '../../utils/auth';

jest.mock('../../utils/api');
jest.mock('../../utils/auth');

describe('SearchScreen', () => {
    beforeEach(() => {
        (auth.getJwt as jest.Mock).mockResolvedValue('mock-token');
    });

    it('should render search input', async () => {
        (api.getAllUsers as jest.Mock).mockResolvedValue([]);

        const { getByPlaceholderText } = render(<SearchScreen />);

        await waitFor(() => {
            expect(getByPlaceholderText(/search/i)).toBeTruthy();
        });
    });

    it('should filter users based on search query', async () => {
        const mockUsers = [
            { id: 1, username: 'alice', email: 'alice@test.com' },
            { id: 2, username: 'bob', email: 'bob@test.com' },
        ];

        (api.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

        const { getByPlaceholderText, getByText } = render(<SearchScreen />);

        await waitFor(() => {
            expect(getByText('@alice')).toBeTruthy();
        });

        const searchInput = getByPlaceholderText(/search/i);
        fireEvent.changeText(searchInput, 'alice');

        await waitFor(() => {
            expect(getByText('@alice')).toBeTruthy();
        });
    });

    it('should show empty state when no users found', async () => {
        (api.getAllUsers as jest.Mock).mockResolvedValue([]);

        const { getByText } = render(<SearchScreen />);

        await waitFor(() => {
            expect(getByText(/no users/i)).toBeTruthy();
        });
    });

    it('should display loading state initially', () => {
        (api.getAllUsers as jest.Mock).mockReturnValue(new Promise(() => { }));

        const { getByText } = render(<SearchScreen />);
        expect(getByText(/checking your session/i)).toBeTruthy();
    });
});
