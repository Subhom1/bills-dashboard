import { Bill } from '@/types';
import PropTypes from 'prop-types';

/**
 * Custom hook for filtering bills by type
 * @param {Bill[]} bills - Array of bills to filter
 * @param {string} filterType - Type to filter by
 * @returns {Bill[]} Filtered array of bills
 */
export const useBillFilter = (bills: Bill[], filterType: string): Bill[] => {
  if (!filterType || filterType === 'All') {
    return bills;
  }
  return bills.filter(bill => bill.billType === filterType);
};