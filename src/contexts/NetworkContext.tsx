"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export enum Network {
  Ethereum = "ethereum",
  Polygon = "polygon",
}

interface NetworkContextType {
  network: Network;
  handleNetworkChange: (nextNetwork: Network) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [network, setNetwork] = useState<Network>(Network.Ethereum);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNetwork = localStorage.getItem("network") as Network;
      if (savedNetwork) {
        setNetwork(savedNetwork);
      }
    }
  }, []);

  const handleNetworkChange = (nextNetwork: Network) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("network", nextNetwork);
    }
    setNetwork(nextNetwork);
  };

  return (
    <NetworkContext.Provider value={{ network, handleNetworkChange }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};
