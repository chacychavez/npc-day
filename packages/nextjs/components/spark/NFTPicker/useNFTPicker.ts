import { useRef, useState } from "react";
import { OwnedNft } from "alchemy-sdk";

const useNFTPicker = () => {
  // const configuredNetwork = getTargetNetwork();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<OwnedNft>();
  const modalRef = useRef<HTMLDialogElement>(null);

  const openNFTViewer = (nft: OwnedNft) => {
    setSelectedNFT(nft);
    modalRef.current?.showModal();
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedNFT,
    setSelectedNFT,
    modalRef,
    openNFTViewer,
  };
};

export default useNFTPicker;
