import { NFTCard } from "../NFTCard";
import useNFTViewer from "./useNFTViewer";
import { OwnedNft } from "alchemy-sdk";

type TNFTViewerProps = {
  selectedNFT: OwnedNft;
};

export const NFTViewer = ({ selectedNFT }: TNFTViewerProps) => {
  const { sendChatToModel, message, setMessage, messages, loading, error } = useNFTViewer(selectedNFT);

  return (
    <div className="flex flex-col md:flex-row gap-x-5 gap-y-5">
      <div className="overflow-auto min-h-[62vh] max-h-[72vh]">
        <div className="w-full flex justify-center">
          <NFTCard nft={selectedNFT} readOnly />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-y-5">
        <div className="flex flex-col-reverse h-[62vh] overflow-auto py-2 px-4  bg-base-100 rounded-xl">
          {(loading || error) && (
            <div className="my-2 flex justify-start">
              <div className="rounded-xl p-4 bg-secondary text-secondary-content">
                {error ? "Sorry. An error occured" : "Typing..."}
              </div>
            </div>
          )}
          {messages
            .slice(1)
            .reverse()
            .map((m, idx) => (
              <div key={idx} className={`my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-xl p-4 ${
                    m.role === "user" ? "bg-primary text-primary-content" : "bg-secondary text-secondary-content"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
        </div>
        <div className="flex">
          <textarea
            placeholder="Say something to NFT"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="textarea textarea-bordered rounded-md px-2 py-1 w-full text-base"
          />
          <button
            disabled={loading}
            onClick={sendChatToModel}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
