import { NFTCard } from "../NFTCard";
import useNFTViewer from "./useNFTViewer";

type TNFTViewerProps = {
  selectedNFT: any;
};

export const NFTViewer = ({ selectedNFT }: TNFTViewerProps) => {
  const { sendChatToModel, message, setMessage, messages } = useNFTViewer(selectedNFT);

  return (
    <div className="flex gap-x-5">
      <div className="overflow-auto h-[70vh]">
        <NFTCard nft={selectedNFT} readOnly />
      </div>
      <div className="flex-1 flex flex-col gap-y-5">
        <div className="h-[60vh] overflow-auto py-2 px-4  bg-base-100 rounded-xl">
          {messages.slice(1).map((m, idx) => (
            <div key={idx} className={`my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-xl p-4 ${m.role === "user" ? "bg-primary " : "bg-secondary"}`}>{m.content}</div>
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
          <button onClick={sendChatToModel} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
