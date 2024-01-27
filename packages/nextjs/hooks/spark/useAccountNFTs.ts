import { useCallback, useEffect, useState } from "react";
import { Alchemy, Network, OwnedNftsResponse } from "alchemy-sdk";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";

const settings = {
  apiKey: scaffoldConfig.alchemyApiKey,
  network: Network.ETH_MAINNET,
};

export function useAccountNFTs(address: string) {
  const [nfts, setNfts] = useState<OwnedNftsResponse>();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageKey, setPageKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const alchemy = new Alchemy(settings);
  const cachedNFTData = useGlobalState(state => state.cachedNFTData);
  const setCachedNFTData = useGlobalState(state => state.setCachedNFTData);

  const fetchNFTs = useCallback(async () => {
    try {
      // if we have cached data, use that instead of fetching
      if (cachedNFTData[address]) {
        const lastUpdated = cachedNFTData[address].validAt.blockTimestamp;

        console.log(`Using cached data for ${address} from ${lastUpdated}`);
      }

      const fetchedNFTs = await alchemy.nft.getNftsForOwner(address);
      let updatedData: any = {};
      updatedData[address] = fetchedNFTs;

      const pageKey = fetchedNFTs.pageKey ? parseInt(fetchedNFTs.pageKey) : 0;
      setPageKey(pageKey);

      console.log(fetchedNFTs);
      cachedNFTData[address] = fetchedNFTs;

      setNfts(fetchedNFTs);
      setCachedNFTData(updatedData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred."));
    }
  }, [currentPage]);

  useEffect(() => {
    setError(null);
    setLoading(true);
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    setCurrentPage,
    loading,
    error,
    pageKey,
  };
}
