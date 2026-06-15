import '@testing-library/jest-dom';

// jsdom polyfill for Radix UI components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
