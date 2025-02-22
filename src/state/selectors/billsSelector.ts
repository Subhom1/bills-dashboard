import { selector } from 'recoil';
import { billsState } from '../atoms/billsState';
import { Bill } from '@/types';

/**
 * Selector to get all favorite bills
 * Filters the bills state to return only bills marked as favorite
 */
export const favoriteBillsSelector = selector<Bill[]>({
  key: 'favoriteBillsSelector',
  get: ({get}) => {
    const bills = get(billsState);
    return bills.filter(bill => bill.isFavorite);
  }
});

/**
 * Selector to get unique bill types
 * Extracts and deduplicates bill types from all bills
 */
export const billTypesSelector = selector<string[]>({
  key: 'billTypesSelector',
  get: ({get}) => {
    const bills = get(billsState);
    const types = bills.map(bill => bill.billType);
    return Array.from(new Set(types)).sort();
  }
});