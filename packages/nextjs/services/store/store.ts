import { OwnedNftsResponse, OwnedNftsValidAt } from "alchemy-sdk";
import create from "zustand";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

// format of cachedNFTData =
// {
//  [address: string]: OwnedNftsResponse, ....
//  }

type TGlobalState = {
  nativeCurrencyPrice: number;
  cachedNFTData: Record<string, OwnedNftsResponse>;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  setCachedNFTData: (newCachedNFTData: Record<string, OwnedNftsResponse>) => void;
};

export const useGlobalState = create<TGlobalState>(set => ({
  nativeCurrencyPrice: 0,
  cachedNFTData: {},
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
  setCachedNFTData: (newValue: Record<string, OwnedNftsResponse>): void => set(() => ({ cachedNFTData: newValue })),
}));
