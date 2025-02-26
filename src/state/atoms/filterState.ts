import { atom } from "recoil";
/**
 * Recoil atom for storing filter selection 
 */
export const filterState = atom<string>({
  key: "filterState",
  default: "", // Default: No filter applied
});
