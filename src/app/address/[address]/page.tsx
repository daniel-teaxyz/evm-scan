"use client";

import { useEffect, useState } from "react";
import { fetchBalanceAndTransactions } from "@/utils/scan";
import { useNetwork } from "@/contexts/NetworkContext";
import Typography from "@/components/typography/Typography";
import TransactionsTable from "@/containers/accountDetailsPage/TransactionsTable";
import SkeletonLoader from "@/components/loaders/SkeletonLoader";
import { toast } from "react-toastify";
import { formatWeiToEth } from "@/utils/conversions";

const AddressDetails = ({ params }: { params: { address: string } }) => {
  const { address } = params;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addressData, setAddressData] = useState<{
    balance: string | null;
    txHistory: any[] | null;
  }>({ balance: null, txHistory: null });
  const { network } = useNetwork();

  useEffect(() => {
    if (address) {
      const fetchData = async () => {
        try {
          const data = await fetchBalanceAndTransactions(address, network);
          setAddressData(data);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
          toast.error("Address details not found, please try again later.");
        }
      };

      fetchData();
    }
  }, [address]);

  return (
    <div>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="mb-10">
            <Typography size="xl" weight="bold">
              Address details
            </Typography>
            <div className="border border-2 rounded-md mb-2 p-4 border-gray-300 max-w-fit flex flex-col items-start justify-between gap-2">
              <Typography
                size="base"
                className="text-ellipsis overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold">Address:</span> {address}
              </Typography>
              <Typography
                size="base"
                className="text-ellipsis overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold">Balance:</span>{" "}
                {formatWeiToEth(addressData.balance ?? "")}
              </Typography>
            </div>
            <hr className="border border-gray-300 mt-4" />
          </div>
          {addressData?.txHistory ? (
            <TransactionsTable
              transactions={addressData?.txHistory?.map((tx) => ({
                hash: tx.hash,
                value: tx.value,
                timestamp: tx.timeStamp,
              }))}
            />
          ) : (
            <Typography size="xl" weight="bold">
              Transaction History unavailable
            </Typography>
          )}
        </>
      )}
    </div>
  );
};

export default AddressDetails;
