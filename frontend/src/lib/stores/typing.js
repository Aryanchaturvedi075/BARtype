// frontend/src/lib/stores/typing.js              --> Reactive Typing Store for Managing Typing test State
import { writable, derived } from 'svelte/store';

function createTypingStore() {
    const initialState = {
        sessionId: null,
        text: '',
        input: '',
        status: 'idle',
        metrics: null,
        error: null
    };

    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        initialize: (sessionData) => update(state => ({
            ...state,
            sessionId: sessionData.id,
            text: sessionData.text,
            status: 'ready'
        })),
        updateInput: (input) => update(state => ({
            ...state,
            input,
            status: input.length === state.text.length ? 'complete' : 'active'
        })),
        setMetrics: (metrics) => update(state => ({
            ...state,
            metrics
        })),
        setError: (error) => update(state => ({
            ...state,
            error
        })),
        reset: () => set(initialState)
    };
}

export const typingStore = createTypingStore();

// Derived stores for computed values
export const typingProgress = derived(typingStore, $store => ({
    isComplete: $store.status === 'complete',
    isActive: $store.status === 'active',
    progress: $store.text ? ($store.input.length / $store.text.length) * 100 : 0
}));

export const typingAccuracy = derived(typingStore, $store => {
    if (!$store.text || !$store.input) {
        return 100;
    }
    const correctChars = [...$store.input].filter((char, index) => 
        char === $store.text[index]
    ).length;
    
    return (correctChars / $store.input.length) * 100;
});