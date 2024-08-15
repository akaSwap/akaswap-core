import { WalletStatus } from "./types/user";

class AkaSwapUser {
  private walletStatus: WalletStatus = "disconnected";
  private walletAddress: string | null = null;
  private identifier: string = "google";

  public getWalletStatus(): WalletStatus {
    return this.walletStatus;
  }
  public getWalletAddress(): string | null {
    return this.walletAddress;
  }
  public getIdentifier(): string | null {
    return this.identifier;
  }

  public async connectWallet(): Promise<void> {
    this.walletStatus = "connecting";
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.walletAddress = "tz123123123";
    this.walletStatus = "connected";
  }

  public async disconnectWallet(): Promise<void> {
    this.walletStatus = "disconnecting";
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.walletAddress = null;
    this.walletStatus = "disconnected";
  }
}

export const akaSwapUser = new AkaSwapUser();
