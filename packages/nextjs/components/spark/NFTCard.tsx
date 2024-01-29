import { useState } from "react";
import Image from "next/image";
import { OwnedNft } from "alchemy-sdk";

type TNFTCardProps = {
  readOnly?: boolean;
  nft: OwnedNft;
  openNFTViewer?: (nft: OwnedNft) => void;
};
const DESC_MAX_LENGTH = 100;

export const NFTCard = ({ readOnly = false, nft, openNFTViewer }: TNFTCardProps) => {
  const [expandDescription, setExpandDescription] = useState(false);
  const toggleExpand = () => setExpandDescription(!expandDescription);
  const truncated = nft.description ? nft.description?.length > DESC_MAX_LENGTH : false;

  return (
    <div className="card w-80 sm:w-96 bg-base-100 shadow-xl">
      <figure>
        {nft.image.pngUrl ? (
          <Image
            src={String(nft.image.pngUrl ?? "")}
            alt={nft.name ?? ""}
            height={320}
            width={320}
            className="object-cover h-80 w-80 sm:w-96"
          />
        ) : (
          <div className="animate-pulse flex space-x-4 h-80 w-96 bg-slate-700" />
        )}
      </figure>
      <div className="card-body">
        <span className="text-sm text-warning">{nft.collection?.name}</span>
        <h2 className="card-title">{nft.name}</h2>
        <p className="break-words">
          {nft.description && nft.description?.slice(0, expandDescription ? nft.description?.length : DESC_MAX_LENGTH)}
          {truncated && !expandDescription ? "... " : " "}
          {truncated && (
            <span className="cursor-pointer text-success" onClick={toggleExpand}>
              Read {expandDescription ? "less" : "more"}
            </span>
          )}
        </p>
        {!readOnly && (
          <div className="card-actions justify-start">
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                if (openNFTViewer) openNFTViewer(nft);
              }}
            >
              View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
