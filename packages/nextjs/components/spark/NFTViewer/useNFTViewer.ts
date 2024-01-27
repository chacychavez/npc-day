import { useEffect, useMemo, useState } from "react";
import https from "https";
import scaffoldConfig from "~~/scaffold.config";

const settings = {
  openAIApiKey: scaffoldConfig.openAIApiKey,
};

type TMessage = {
  role: "system" | "assistant" | "user";
  content: string;
};

const useNFTViewer = (selectedNFT: any) => {
  const initialPrompt = useMemo(
    () =>
      "Roleplay as an actual character. I will start with sending you a JSON object containing some information about you. Never talk about NFTs or the blockchain. JSON follows: \n" +
      JSON.stringify(selectedNFT, null, 2),
    [selectedNFT],
  );

  const initialMessages: TMessage[] = useMemo(
    () => [
      {
        role: "system",
        content: initialPrompt,
      },
    ],
    [initialPrompt],
  );

  const [messages, setMessages] = useState<TMessage[]>(initialMessages);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, selectedNFT]);

  const sendChatToModel = async () => {
    const newMessages = [...messages, { role: "user", content: message } as TMessage];
    setMessages(newMessages);
    setMessage("");

    const requestData = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: newMessages,
    });

    const options = {
      hostname: "api.openai.com",
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.openAIApiKey}`,
      },
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let data = "";

        res.on("data", chunk => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      });

      req.on("error", error => {
        reject(error);
      });

      req.write(requestData);
      req.end();
    });

    const responseMessage = (response as any).choices[0].message.content;
    setMessages(m => [...m, { role: "assistant", content: responseMessage } as TMessage]);
  };

  return {
    sendChatToModel,
    message,
    setMessage,
    messages,
  };
};

export default useNFTViewer;
