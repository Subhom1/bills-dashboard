import { Bill } from "../../types/index";

interface BillsTableProps {
  bills: Bill[];
}

export const BillsTable = ({ bills }: BillsTableProps) => {
  return (
    <>
      <div>Bills Table</div>
      {bills && (
        <ol>
          {bills.map((item, index) => (
            <li key={index}>
              {item.debates &&
                item.debates.map((debate, idx) => (
                  <ul key={idx}>
                    <li>{debate.showAs}</li>
                  </ul>
                ))}
            </li>
          ))}
        </ol>
      )}
    </>
  );
};
