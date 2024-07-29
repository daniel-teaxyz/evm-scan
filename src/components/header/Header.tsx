"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Network, useNetwork } from "@/contexts/NetworkContext";
import { useRouter } from "next/navigation";
import { validateAddress, ValidationResult } from "@/utils/scan";
import { toast } from "react-toastify";
import Typography from "@/components/typography/Typography";
import { IoEnterOutline } from "react-icons/io5";

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    "0x9C92a78C578b8B54814bA8fD16dDbC086078001C"
  );
  const { network, handleNetworkChange } = useNetwork();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.length < 42) {
      toast.info("Address too short");
    } else {
      const validationResult = validateAddress(searchQuery);
      switch (validationResult) {
        case ValidationResult.ADDRESS:
          router.push(`/address/${searchQuery}`);
          break;
        case ValidationResult.TRANSACTION_HASH:
          router.push(`/transaction/${searchQuery}`);
          break;
        case ValidationResult.INVALID:
          toast.error("Invalid address or transaction hash");
          break;
        default:
          toast.error("Unexpected validation result. Please try again later");
      }
    }
  };

  return (
    <header className="w-full flex items-start flex-col justify-between p-4 bg-white shadow-md">
      <div className="w-full mb-4 flex items-center justify-between">
        <Image
          src="/logo.png"
          alt="Logo"
          width={220}
          height={40}
          onClick={() => router.push("/")}
        />
        <span>
          <Typography
            size="lg"
            weight="bold"
            className="hidden sm:inline-block pr-2"
          >
            Network:
          </Typography>
          <select
            value={network}
            onChange={(e) => handleNetworkChange(e.target.value as Network)}
            className="outline-none w-auto p-2 border border-gray-300 rounded-md focus:ring focus:border-blue-300"
          >
            <option value={Network.Ethereum}>Ethereum</option>
            <option value={Network.Polygon}>Polygon</option>
          </select>
        </span>
      </div>
      <form
        onSubmit={handleSearch}
        className="w-full flex items-center md:justify-center"
      >
        <div className="flex border md:max-w-[40rem] md:min-w-[22rem] min-w-[15rem] border-gray-300 rounded-md focus-within:ring focus-within:border-blue-300 mb-2 md:mb-0 md:mr-2 w-full">
          <input
            type="text"
            className="w-full px-4 py-2 border-none rounded-l-md focus:outline-none"
            placeholder="Search by address or tx hash"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery.length >= 42 && (
            <button
              type="submit"
              className="h-full px-2 py-2 text-black bg-gray-200 hover:bg-gray-300 rounded-r-md focus:outline-none"
            >
              <IoEnterOutline className="w-6 h-6" />
            </button>
          )}
        </div>
      </form>
    </header>
  );
};

export default Header;
