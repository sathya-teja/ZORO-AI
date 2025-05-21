import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [image, setImage] = useState(null);
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [conversationHistory, setConversationHistory] = useState([]);

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setInput("");
        setResultData("");
        setRecentPrompt("");
        // Retain image and conversation history
    };

    const clearConversation = () => {
        setLoading(false);
        setShowResult(false);
        setInput("");
        setImage(null);
        setResultData("");
        setRecentPrompt("");
        setPrevPrompts([]);
        setConversationHistory([]);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;

        const currentPrompt = prompt !== undefined ? prompt : input || "Describe this image";
        if (!currentPrompt && !image) {
            setLoading(false);
            setResultData("Please provide a prompt or an image.");
            return;
        }

        // Update conversation history
        setConversationHistory(prev => [
            ...prev,
            {
                role: "user",
                parts: [
                    ...(currentPrompt ? [{ text: currentPrompt }] : []),
                    ...(image ? [{ inlineData: { mimeType: "image/jpeg", data: image.split(',')[1] } }] : [])
                ].filter(Boolean)
            }
        ]);

        try {
            response = await runChat(currentPrompt, image, conversationHistory);
            setRecentPrompt(currentPrompt);
            setPrevPrompts(prev => [...prev, currentPrompt]);

            let responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            let newResponse2 = newResponse.split("*").join("</br>");
            let newResponseArray = newResponse2.split(" ");
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }

            // Update conversation history with the model's response
            setConversationHistory(prev => [
                ...prev,
                { role: "model", parts: [{ text: response }] }
            ]);
        } catch (error) {
            console.error("Error in onSent:", error);
            setResultData("An error occurred. Please try again.");
        }

        setLoading(false);
        setInput("");
        setImage(null); // Clear image after submission
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        image,
        setImage,
        newChat,
        clearConversation
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;