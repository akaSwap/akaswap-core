import { walletProps } from "./types";

export const showWallet = ({
  wallet = "",
  alias = "",
  full = false,
  digits = 5,
}: walletProps) => {
  try {
    if (alias !== "") {
      return alias
    } else if (!full && wallet.length > digits*2) {
      return `${wallet.slice(0, digits)}...${wallet.slice(-1 * digits)}`
    } else return wallet
  } catch (e) {
    return ""
  }
}

