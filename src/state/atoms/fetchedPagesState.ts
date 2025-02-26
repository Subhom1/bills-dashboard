import { atom } from 'recoil';
/**
 * Recoil atom for storing fetched pages
 */
export const fetchedPagesState = atom<Set<number>>({
  key: 'fetchedPagesState',
  default: new Set([0]),
});