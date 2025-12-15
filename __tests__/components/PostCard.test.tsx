import { render } from '@testing-library/react-native';
import React from 'react';
import PostCard from '../../components/post-card';

describe('PostCard Component', () => {
    const defaultProps = {
        id: '1',
        imageUrl: 'https://example.com/cat.jpg',
        creator: { name: 'testuser' },
    };

    it('should render without crashing', () => {
        const component = render(<PostCard {...defaultProps} />);
        expect(component).toBeTruthy();
    });

    it('should handle missing image gracefully', () => {
        const props = { ...defaultProps, imageUrl: '' };
        const result = render(<PostCard {...props} />);
        expect(result).toBeTruthy();
    });

    it('should render with valid props', () => {
        const result = render(<PostCard {...defaultProps} />);
        expect(result).toBeTruthy();
    });
});
