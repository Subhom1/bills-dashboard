import { selector } from 'recoil';
import { billsState } from '../atoms/billsState';

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