import { render } from '@testing-library/react-native';
import React from 'react';
import Header from '../../components/Header';

describe('Header Component', () => {
    it('should render without crashing', () => {
        const { getByText } = render(<Header />);
        expect(getByText('Whiskr')).toBeTruthy();
    });

    it('should display the app name', () => {
        const { getByText } = render(<Header />);
        const title = getByText('Whiskr');
        expect(title).toBeTruthy();
    });
});
