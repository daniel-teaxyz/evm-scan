import Typography from "@/components/typography/Typography";
import { formatWeiToEth } from "@/utils/conversions";
import { format, fromUnixTime } from "date-fns";
import React, { useState } from "react";

type Transaction = {
  hash: string;
  value: string;
  timestamp: number; // Unix timestamp
};

type Props = {
  transactions: Transaction[];
};

const TransactionsTable: React.FC<Props> = ({ transactions }) => {
  const [sortField, setSortField] = useState<"value" | "timestamp">(
    "timestamp"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedTransactions = [...transactions].sort((a, b) => {
    const aValue = parseInt(a.value, 16);
    const bValue = parseInt(b.value, 16);

    if (sortField === "value") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return sortOrder === "asc"
        ? a.timestamp - b.timestamp
        : b.timestamp - a.timestamp;
    }
  });

  const handleSort = (field: "value" | "timestamp") => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="overflow-x-auto">
      <Typography size="xl" weight="bold">
        Transaction history
      </Typography>
      <table className="min-w-[70vw] max-w-[80rem] divide-y divide-gray-200 mt-2 ">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hash
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("value")}
            >
              Value {sortField === "value" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("timestamp")}
            >
              Timestamp{" "}
              {sortField === "timestamp" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTransactions.map((tx) => (
            <tr key={tx.hash}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[10rem] truncate">
                <a
                  href={`/transaction/${tx.hash}`}
                  className="text-blue-600 hover:underline"
                  title={tx.hash}
                >
                  {tx.hash}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatWeiToEth(tx.value)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(fromUnixTime(tx.timestamp), "PPpp")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
