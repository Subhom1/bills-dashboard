import { atom } from "recoil";
import { Bill } from "@/types/index";
/**
 * Recoil atom for storing bills response data
 */
export const billsState = atom<Array<Bill>>({
  key: "billsState",
  default: [],
});
