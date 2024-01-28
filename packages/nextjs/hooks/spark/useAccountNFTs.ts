import { useCallback, useEffect, useState } from "react";
import { Alchemy, Network, OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";

const settings = {
  apiKey: scaffoldConfig.alchemyApiKey,
  network: Network.ETH_MAINNET,
};

export function useAccountNFTs(address: string) {
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const [pageKey, setPageKey] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const alchemy = new Alchemy(settings);
  const cachedNFTData = useGlobalState(state => state.cachedNFTData);
  const setCachedNFTData = useGlobalState(state => state.setCachedNFTData);

  const fetchNFTs = useCallback(
    async (pageKey?: string) => {
      setError(null);
      setLoading(true);
      try {
        // if we have cached data, use that instead of fetching
        const cachedData = cachedNFTData[address + (pageKey ?? "")];
        if (cachedData) {
          const { validAt, ownedNfts, pageKey: cachedPageKey } = cachedData;
          const lastUpdated = validAt.blockTimestamp;
          console.log(`Using cached data for ${address} from ${lastUpdated}`);
          setPageKey(cachedPageKey);
          setNfts(ownedNfts);
        } else {
          const fetchedNFTs = await alchemy.nft.getNftsForOwner(address, { pageKey });
          setPageKey(fetchedNFTs.pageKey ? fetchedNFTs.pageKey : undefined);

          setNfts(currNfts => {
            const newNfts = pageKey ? [...currNfts, ...fetchedNFTs.ownedNfts] : fetchedNFTs.ownedNfts;
            // Cache data
            const updatedData: Record<string, OwnedNftsResponse> = {};
            const newCachedNFTData = { ...fetchedNFTs };
            newCachedNFTData.ownedNfts = newNfts;
            updatedData[address + (pageKey ?? "")] = newCachedNFTData;
            setCachedNFTData(updatedData);
            return newNfts;
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred."));
      } finally {
        setLoading(false);
      }
    },
    [address],
  );

  const loadMore = () => {
    fetchNFTs(pageKey);
  };

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    loading,
    error,
    pageKey,
    loadMore,
  };
}
