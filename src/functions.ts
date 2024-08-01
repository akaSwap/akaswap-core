import { WalletProps } from "./types/akaswap";

export const showWallet = ({
  wallet = "",
  alias = "",
  full = false,
  digits = 5,
}: WalletProps) => {
  try {
    if (alias !== "") {
      return alias;
    } else if (!full && wallet.length > digits * 2) {
      return `${wallet.slice(0, digits)}...${wallet.slice(-1 * digits)}`;
    } else return wallet;
  } catch (e) {
    return "";
  }
};

export const getIpfsSrc = (gateway: string, url: string) => {
  let hash = url.startsWith("ipfs://") ? url.split("ipfs://")[1] : url;
  return `${gateway}${hash}`;
};
