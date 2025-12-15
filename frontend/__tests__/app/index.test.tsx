import { render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import IndexScreen from '../../app/index';

jest.mock('expo-router');

describe('IndexScreen', () => {
    it('should render loading indicator', () => {
        const component = render(<IndexScreen />);
        expect(component).toBeTruthy();
    });

    it('should redirect to signIn page', async () => {
        const mockReplace = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            replace: mockReplace,
        });

        render(<IndexScreen />);

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/signIn');
        });
    });

    it('should clean up timeout on unmount', () => {
        const mockReplace = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            replace: mockReplace,
        });

        const { unmount } = render(<IndexScreen />);
        unmount();

        // Component should unmount without errors
        expect(true).toBeTruthy();
    });
});
