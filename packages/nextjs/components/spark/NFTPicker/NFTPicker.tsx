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
      <div className="animate-pulse flex flex-wrap justify-center mt-10 gap-x-4 gap-y-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="flex flex-col gap-4 w-80 lg:w-96 bg-slate-">
            <div className="bg-slate-300 h-32 w-full"></div>
            <div className="bg-slate-300 h-4 w-28"></div>
            <div className="bg-slate-300 h-4 w-full"></div>
            <div className="bg-slate-300 h-4 w-full"></div>
          </div>
        ))}
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
            className="input input-bordered w-full max-w-xs text-lg"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </label>
        <div className="mt-5">NFTs found: {filteredNFTs?.length}</div>
      </div>

      <dialog className="modal" ref={modalRef}>
        <div className="modal-box w-full h-full sm:h-auto sm:w-11/12 sm:max-w-5xl bg-base-200">
          <form method="dialog" className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">NFT Viewer</h3>
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-primary btn-sm">close</button>
          </form>
          {selectedNFT && <NFTViewer selectedNFT={selectedNFT} />}
        </div>
      </dialog>

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
            <div className="text-lg py-3">Fetching more NFTs...</div>
          )}
        </div>
      )}
    </div>
  );
};
