// src/tests/components/ErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Create a component that will deliberately throw an error
// This helps us test error scenarios in a controlled way
const ThrowError = () => {
  throw new Error('Test error message');
  return null;
};

// Create a simple component that renders normally
// This helps us test the happy path scenario
const NormalComponent = () => <div>Normal render</div>;

describe('ErrorBoundary', () => {
  // Before running any tests, we'll prevent error messages from cluttering our test output
  // This is just for clean test results - in real app, these errors would show
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // First, let's make sure our ErrorBoundary works in normal conditions
  // It should simply render its children when everything is fine
  test('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );
    
    // Check if our normal component content is visible
    expect(screen.getByText('Normal render')).toBeInTheDocument();
  });

  // Now, let's test the main purpose of ErrorBoundary
  // It should catch errors and show a nice error message instead of crashing
  test('renders error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    // Verify that the error message is shown to the user
    // We use case-insensitive regex to be flexible with the exact message
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    // Make sure the actual error message is displayed for debugging
    expect(screen.getByText(/test error message/i)).toBeInTheDocument();
  });

  // Finally, let's ensure our error UI is accessible
  // This is crucial for users relying on screen readers
  test('error message has proper accessibility attributes', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    // Find the error message by its ARIA role
    const errorMessage = screen.getByRole('alert');
    // Verify it exists and has proper accessibility attributes
    expect(errorMessage).toBeInTheDocument();
    // 'assertive' means screen readers will announce this immediately
    expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
  });
});