import { atom } from "recoil";
/**
 * Recoil atom for storing network status
 */
export const networkState = atom<boolean>({
  key: "networkState",
  default: navigator.onLine, // Initial state based on device status
});
