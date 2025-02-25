import React from 'react';
import { CircularProgress } from '@mui/material';

/**
 * Props for the Loader component
 * @property {number} size - The size of the loading spinner in pixels (default: 20)
 * @property {string} message - Custom loading message to display (default: "Loading...")
 * @property {string} data-testid - Test ID for testing purposes (default: "loader-container")
 */
interface LoaderProps {
  size?: number;
  message?: string;
  'data-testid'?: string;
}

/**
 * A reusable loading spinner component that shows a circular progress indicator
 * with an optional message. Uses Material-UI's CircularProgress under the hood.
 */
export const Loader: React.FC<LoaderProps> = ({
  size = 20,
  message = 'Loading...',
  'data-testid': testId = 'loader-container'
}) => {
  return (
    <div 
      className="flex justify-center items-center"
      data-testid={testId}
    >
      {/* Material UI spinner with accessibility attributes */}
      <CircularProgress 
        size={size}
        aria-busy="true"
        aria-label={message}
        role="progressbar"
      />
      {/* Loading message with consistent styling */}
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  );
};

export default Loader;