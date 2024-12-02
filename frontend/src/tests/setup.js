// frontend/src/tests/setup.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

// Mock Browser APIs that aren't available in the test environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));