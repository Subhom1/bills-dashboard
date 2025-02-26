import { selector } from "recoil";
import { billsState } from "@/state/atoms/billsState";
import { filterState } from "@/state/atoms/filterState";

export const filteredBillsSelector = selector({
  key: "filteredBillsSelector",
  get: ({ get }) => {
    const bills = get(billsState);
    const filter = get(filterState);
    if (!filter) return bills; // No filter applied
    // Optimized: Filtering only what is needed
    return bills.filter((bill) => bill.status.includes(filter));
  },
});
