import { atom } from 'recoil';
import { Bill } from "@/types/index";
/**
 * Recoil atom for storing favourite bills data
 */
export const favoriteBillsState = atom<Array<Bill>>({
    key: 'favoriteBillsState',
    default: [],
});