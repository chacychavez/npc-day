import { useRef, useState } from "react";
import { useAccountNFTs } from "~~/hooks/spark";

// import { getTargetNetwork } from "~~/utils/scaffold-eth";

const useNFTPicker = (address: string) => {
  // const configuredNetwork = getTargetNetwork();
  const {
    nfts,
    // pageKey,
    // setCurrentPage,
    loading,
    error,
  } = useAccountNFTs(address);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<any>();
  const modalRef = useRef<HTMLDialogElement>(null);

  const openNFTViewer = (nft: any) => {
    setSelectedNFT(nft);
    modalRef.current?.showModal();
  };

  const filteredNFTs = nfts?.ownedNfts.filter(nft => nft.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return {
    nfts,
    filteredNFTs,
    loading,
    error,
    setSearchTerm,
    selectedNFT,
    setSelectedNFT,
    modalRef,
    openNFTViewer,
  };
};

export default useNFTPicker;
