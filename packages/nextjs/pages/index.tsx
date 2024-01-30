import React from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { NFTPicker } from "~~/components/spark";
import { useGlobalState } from "~~/services/store/store";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { guestAddress, setGuestAddress } = useGlobalState();

  const connectWithGuestAccount = () => {
    // use a guest account with NFTs
    setGuestAddress("paulgadi.eth");
  };

  return (
    <>
      <MetaHeader />
      <div className="min-h-auto flex items-center flex-col flex-grow justify-center">
        <div className="px-5 py-5">
          {address || guestAddress ? (
            <NFTPicker address={address ?? guestAddress ?? ""} />
          ) : (
            <div className="h-full flex flex-col items-center">
              <div className="w-80 text-center">
                Connect Wallet to select one of your NFTs, or press the button below to use a guest wallet.
              </div>
              <div className="flex items-center flex-col flex-grow">
                <button className="btn btn-primary btn-sm mt-5" onClick={connectWithGuestAccount} type="button">
                  USE GUEST WALLET
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
