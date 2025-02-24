import { atom } from 'recoil';
import { Bill } from '@/types';

export const fetchedPagesState = atom<Set<number>>({
  key: 'fetchedPagesState',
  default: new Set([0]), // Start with page 0 as fetched
});