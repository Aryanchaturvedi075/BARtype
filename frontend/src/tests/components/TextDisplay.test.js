// frontend/src/tests/components/TextDisplay.test.js
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TextDisplay from '../../lib/components/typing/TextDisplay.svelte';

describe('TextDisplay', () => {
    it('renders text correctly', () => {
        const text = 'Hello World';
        render(TextDisplay, { props: { text } });
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('highlights correct characters', () => {
        const text = 'Test';
        const input = 'Te';
        render(TextDisplay, { props: { text, input } });
        
        const characters = screen.getAllByRole('presentation');
        expect(characters[0]).toHaveClass('correct');
        expect(characters[1]).toHaveClass('correct');
        expect(characters[2]).toHaveClass('pending');
    });
});