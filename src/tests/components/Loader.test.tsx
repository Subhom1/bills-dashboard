import { render, screen } from '@testing-library/react';
import { Loader } from '@/components/common/Loader';

describe('Loader Component', () => {
  // Basic rendering test
  // We want to make sure our loader appears when called
  test('renders the loading spinner', () => {
    render(<Loader />);
    
    // CircularProgress should be present and visible
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  // Accessibility test
  // Loading states must be clear to screen readers
  test('has proper accessibility attributes', () => {
    render(<Loader />);
    
    // Find the loading indicator
    const spinner = screen.getByRole('progressbar');
    
    // Check for proper ARIA attributes
    // These help screen readers announce the loading state
    expect(spinner).toHaveAttribute('aria-busy', 'true');
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
  });

  // Styling test
  // Ensure loader is centered and visible
  test('applies correct styling classes', () => {
    render(<Loader />);
    
    // The container should be centered using Tailwind classes
    const container = screen.getByTestId('loader-container');
    expect(container).toHaveClass(
      'flex',
      'justify-center',
      'items-center'
    );
  });
});