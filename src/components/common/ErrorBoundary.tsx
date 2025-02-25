import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props accepted by ErrorBoundary
 * @property {ReactNode} children - Components to be wrapped by the error boundary
 */
interface Props {
  children: ReactNode;
}

/**
 * State managed by ErrorBoundary
 * @property {boolean} hasError - Flag indicating if an error occurred
 * @property {Error | null} error - The error that was caught, if any
 */
interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A class component that catches JavaScript errors anywhere in its child component tree.
 * Acts as a safety net to prevent the whole app from crashing when an error occurs.
 * 
 * Features:
 * - Catches runtime errors in child components
 * - Shows a user-friendly error message
 * - Logs errors to console for debugging
 * - Accessible to screen readers
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  // Initialize state with no errors
  public state: State = {
    hasError: false,
    error: null
  };

  /**
   * React lifecycle method called when an error occurs
   * Updates state to trigger error UI rendering
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * React lifecycle method for error reporting
   * Logs errors to console in development
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging purposes
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    // Show error UI if something went wrong
    if (this.state.hasError) {
      return (
        // Center error message on screen
        <div className="flex items-center justify-center h-screen">
          {/* Error message container with accessibility support */}
          <div 
            role="alert"
            aria-live="assertive"
            className="text-center p-8 bg-red-50 rounded-lg"
          >
            <h2 className="text-2xl text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    // If no error occurred, render children normally
    return this.props.children;
  }
}