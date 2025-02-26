import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { networkState } from "@/state/atoms/networkState";

/**
 * A custom hook that tracks the user's network connection status
 *
 * Why this exists:
 * - Helps app respond to network changes
 * - Enables offline-first functionality
 * - Improves user experience with network feedback
 *
 * How it works:
 * 1. Uses Recoil to maintain global network state
 * 2. Listens to browser's online/offline events
 * 3. Updates state automatically when connection changes
 * 4. Cleans up listeners when component unmounts
 *
 * @returns boolean - true if online, false if offline
 *
 * Usage example:
 * ```
 * const isOnline = useNetworkStatus();
 * if (!isOnline) {
 *   showOfflineWarning();
 * }
 * ```
 */
export const useNetworkStatus = () => {
  // Get current online status from Recoil state
  const [isOnline, setIsOnline] = useRecoilState(networkState);

  useEffect(() => {
    // Handler functions for network status changes
    const handleOnline = () => setIsOnline(true); // Browser is online
    const handleOffline = () => setIsOnline(false); // Browser lost connection

    // Start listening for network status changes
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup function to remove listeners when component unmounts
    // This prevents memory leaks and duplicate listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline]); // Only re-run if setIsOnline function changes

  return isOnline; // Return current network status
};
