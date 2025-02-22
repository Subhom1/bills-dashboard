import { atom } from "recoil";
import { BillsResponseHead } from "@/types/index";
/**
 * Recoil atom for storing bills API response metadata
 * Includes total counts, date range, and language settings
 */
export const billHeadState = atom<BillsResponseHead>({
  key: "billHeadState",
  default: {
    counts: {
      billCount: 0,
      resultCount: 0
    },
    dateRange: {
      start: "",
      end: ""
    },
    lang: "en"
  }
});
