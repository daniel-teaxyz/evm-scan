export const hexToDecimal = (hex: string): number => parseInt(hex, 16);

export const formatWeiToEth = (value: string): string => {
  return (Number(value) / 1e18).toFixed(8); // Format to 18 decimal places
};

export const formatGasPriceInETH = (
  gasPriceHex: string,
  gasUsed: number
): string => {
  const gasPriceWei = hexToDecimal(gasPriceHex);
  const gasPriceETH = (gasPriceWei * gasUsed) / 1e18; // Convert Wei to ETH
  return gasPriceETH.toFixed(16); // Format to 18 decimal places
};
