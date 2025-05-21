import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"

const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = "AIzaSyCLk2jAzBscBTTcJPOnSmPrkdYwZHbyWeE";

async function runChat(prompt, image = null, conversationHistory = []) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
  };

  const safetySettings = [
      {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
  ];

  const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: conversationHistory,
  });

  const message = [
      ...(prompt ? [{ text: prompt }] : []),
      ...(image ? [{
          inlineData: {
              mimeType: "image/jpeg",
              data: image.split(',')[1]
          }
      }] : [])
  ].filter(Boolean);

  const result = await chat.sendMessage(message);
  const response = result.response;
  console.log(response.text());
  return response.text();
}

export default runChat;