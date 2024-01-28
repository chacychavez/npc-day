import { useEffect } from "react";
import { NFTCard } from "../NFTCard";
import { NFTViewer } from "../NFTViewer";
import useNFTPicker from "./useNFTPicker";
import { useAccountNFTs } from "~~/hooks/spark";

type TNFTPickerProps = {
  address: string;
  className?: string;
};

/**
 * Allow user to pick an NFT in their address, uses Alchemy
 */
export const NFTPicker = ({ address, className = "" }: TNFTPickerProps) => {
  const { searchTerm, setSearchTerm, selectedNFT, openNFTViewer, modalRef } = useNFTPicker();
  const { nfts, loading, error, loadMore, pageKey } = useAccountNFTs(address);

  const filteredNFTs = nfts?.filter(nft => nft.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (address && loading && nfts.length === 0) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning">Error</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="w-full flex flex-col items-center justify-center">
        <label className="form-control w-full max-w-xs">
          <div className="label justify-center">
            <span className="label-text">Search NFTs</span>
          </div>
          <input
            type="text"
            placeholder="Search by name"
            className="input input-bordered w-full max-w-xs"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </label>
        <div className="mt-5">NFTs found: {filteredNFTs?.length}</div>
      </div>

      {selectedNFT && (
        <dialog className="modal" ref={modalRef}>
          <div className="modal-box w-11/12 max-w-5xl bg-base-200">
            <form method="dialog" className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">NFT Viewer</h3>
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-primary btn-sm">close</button>
            </form>
            <NFTViewer selectedNFT={selectedNFT} />
          </div>
        </dialog>
      )}

      <div className="flex flex-wrap justify-center mt-10 gap-x-4 gap-y-6">
        {filteredNFTs?.map(nft => (
          <NFTCard key={nft.name + nft.tokenId} nft={nft} openNFTViewer={openNFTViewer} />
        ))}
      </div>
      {pageKey && (
        <div className="flex justify-center mt-4">
          {!loading ? (
            <button className="btn btn-primary" onClick={loadMore}>
              Load more
            </button>
          ) : (
            <div className="text-lg py-3">Fetching more nfts...</div>
          )}
        </div>
      )}
    </div>
  );
};
