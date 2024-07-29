import axios from "axios";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { hexToDecimal } from "./conversions";

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? "";
const POLYGONSCAN_API_KEY = process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY ?? "";

const txHashRegex = /^0x([A-Fa-f0-9]{64})$/;

export enum ValidationResult {
  ADDRESS = "address",
  TRANSACTION_HASH = "transaction hash",
  INVALID = "invalid",
}

export enum Network {
  Ethereum = "ethereum",
  Polygon = "polygon",
}

const getBaseUrl = (network: Network) => {
  return network === Network.Polygon
    ? "https://api.polygonscan.com"
    : "https://api.etherscan.io";
};

const fetchBalance = async (
  address: string,
  baseUrl: string,
  apiKey: string
) => {
  try {
    const response = await axios.get(`${baseUrl}/api`, {
      params: {
        module: "account",
        action: "balance",
        address,
        apiKey,
      },
    });
    return response.data.result;
  } catch (error) {
    return null;
  }
};

const fetchTransactions = async (
  address: string,
  baseUrl: string,
  apiKey: string
) => {
  try {
    const response = await axios.get(`${baseUrl}/api`, {
      params: {
        module: "account",
        action: "txlist",
        address,
        page: 1,
        offset: 99,
        sort: "desc",
        apiKey,
      },
    });
    return response.data.result;
  } catch (error) {
    return null;
  }
};

export const validateAddress = (input: string): ValidationResult => {
  // Check if the input is a valid Ethereum address
  if (ethers.isAddress(input)) {
    return ValidationResult.ADDRESS;
  }

  // Check if the input is a valid Ethereum transaction hash
  if (txHashRegex.test(input)) {
    return ValidationResult.TRANSACTION_HASH;
  }

  // If neither, return 'invalid'
  return ValidationResult.INVALID;
};

export const fetchBalanceAndTransactions = async (
  address: string,
  network: Network
) => {
  const apiKey =
    network === Network.Polygon ? POLYGONSCAN_API_KEY : ETHERSCAN_API_KEY;
  const accBalance = await fetchBalance(address, getBaseUrl(network), apiKey);
  const accTransactions = accBalance
    ? await fetchTransactions(address, getBaseUrl(network), apiKey)
    : null;

  return {
    balance: accBalance,
    txHistory: accTransactions,
  };
};

export const fetchTransactionDetails = async (
  hash: string,
  network: Network
) => {
  const apiKey =
    network === Network.Polygon ? POLYGONSCAN_API_KEY : ETHERSCAN_API_KEY;

  try {
    const txResponse = await axios.get(`${getBaseUrl(network)}/api`, {
      params: {
        module: "proxy",
        action: "eth_getTransactionByHash",
        txhash: hash,
        apiKey,
      },
    });
    const txData = txResponse.data.result;
    if (!txData || !txData.blockNumber) {
      toast.error("Transaction not found or missing block number");
      throw new Error("Transaction not found or missing block number");
    }

    const blockResponse = await axios.get(`${getBaseUrl(network)}/api`, {
      params: {
        module: "proxy",
        action: "eth_getBlockByNumber",
        tag: txData.blockNumber,
        boolean: "false",
        apiKey,
      },
    });
    const blockData = blockResponse.data.result;

    if (!blockData || !blockData.timestamp) {
      toast.error("Block not found or missing timestamp");
      throw new Error("Block not found or missing timestamp");
    }

    return {
      transaction: txData,
      blockTimestamp: hexToDecimal(blockData.timestamp) * 1000, // Convert hex timestamp to milliseconds
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
