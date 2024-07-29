"use client";

import { useEffect, useState } from "react";
import { fetchTransactionDetails } from "@/utils/scan";
import { Network, useNetwork } from "@/contexts/NetworkContext";
import Typography from "@/components/typography/Typography";
import { toast } from "react-toastify";
import SkeletonLoader from "@/components/loaders/SkeletonLoader";
import { useRouter } from "next/navigation";
import {
  formatGasPriceInETH,
  formatWeiToEth,
  hexToDecimal,
} from "@/utils/conversions";
import { format } from "date-fns";

const TransactionDetails = ({ params }: { params: { txHash: string } }) => {
  const { txHash } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // That should never be an any type, API/util functions should have data types ready for that
  const [transactionData, setTransactionData] = useState<any>(null);
  const [blockTimestamp, setBlockTimestamp] = useState<number>(0);
  const { network } = useNetwork();

  useEffect(() => {
    if (txHash) {
      const fetchData = async () => {
        try {
          const data = await fetchTransactionDetails(txHash, network);
          if (data?.transaction) {
            setTransactionData(data?.transaction);
            setBlockTimestamp(data?.blockTimestamp ?? 0);
            setIsLoading(false);
          } else {
            toast.error("Transaction not found, please try again later");
            router.push("/");
          }
        } catch (error) {
          console.error(error);
          toast.error("Transaction not found, please try again later");
        }
      };

      fetchData();
    }
  }, [txHash]);

  return (
    <div>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="mb-10">
            <Typography size="xl" weight="bold">
              Transaction details
            </Typography>
            <div className="border border-2 rounded-md mb-2 p-4 border-gray-300 max-w-full md:max-w-fit flex flex-col items-start justify-between gap-2">
              {/* That should be replaced with a field component */}
              <Typography
                size="base"
                className="w-full text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer text-blue-600 hover:underline"
                onClick={() =>
                  window.open(
                    `https://${
                      network === Network.Ethereum
                        ? "etherscan.io"
                        : "polygonscan.com"
                    }/tx/${txHash}`
                  )
                }
              >
                <span className="font-bold">Hash:</span> {txHash}
              </Typography>
              <Typography
                size="base"
                className="w-full text-ellipsis overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold">Created at:</span>{" "}
                {format(new Date(blockTimestamp), "PPpp")}
              </Typography>
              <Typography
                size="base"
                className="w-full text-ellipsis overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold">From:</span> {transactionData.from}
              </Typography>
              <Typography
                size="base"
                className="w-full text-ellipsis overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold">To:</span> {transactionData.to}
              </Typography>
              <Typography
                size="base"
                className="w-full text-ellipsis overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold">Value:</span>{" "}
                {formatWeiToEth(hexToDecimal(transactionData.value).toString())}
              </Typography>
              <Typography
                size="base"
                className="w-full text-ellipsis overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold">Gas:</span>{" "}
                {formatGasPriceInETH(
                  transactionData.gasPrice,
                  transactionData.gas
                )}
              </Typography>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionDetails;
