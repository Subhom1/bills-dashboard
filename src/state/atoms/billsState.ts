import { atom } from "recoil";
import {Bill} from "../../types/index"

export const billsState = atom<Array<Bill>>({
  key: "billsState",
  default: [],
});
