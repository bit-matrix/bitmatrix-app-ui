import { IWallet } from "../IWallet";
import { MarinaProvider } from "./IMarina";

declare global {
  interface Window {
    marina?: MarinaProvider;
  }
}

export const marina = window.marina;

export default class Marina implements IWallet {
  private marina: MarinaProvider | undefined;

  constructor() {
    this.marina = window.marina;
  }

  exist = (): boolean => typeof window.marina !== "undefined";

  isEnabled = (): Promise<boolean> => {
    if (this.exist() && marina) return marina.isEnabled();
    // throw "Install Marina first";
    return Promise.resolve(false);
  };

  enable = (): Promise<void> => {
    if (this.exist() && marina) return marina.enable();
    // else throw "Install Marina first";
    return Promise.resolve();
  };

  disable = (): Promise<void> => {
    if (this.exist() && marina) return marina.disable();
    // else throw "Install Marina first";
    return Promise.resolve();
  };
}
