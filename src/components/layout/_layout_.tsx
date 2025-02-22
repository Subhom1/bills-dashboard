import { mockBills } from "@/tests/mocks/mockBills";
import { BillsTable } from "@/components/bills/BillsTable";


export const Layout = () => {
  return (
    <>
      <header>Bills Dashboard</header>
      <BillsTable bills={mockBills[0].results.map((item) => item.bill)} />
    </>
  );
};
