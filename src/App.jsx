import React, { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import { BeatLoader } from "react-spinners";

const App = () => {
  const [formData, setFormData] = useState({ language: "Hindi", message: "", model: "gpt-4" });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const apiKey = import.meta.env.VITE_OPENAI_KEY;
  if (!apiKey) {
    console.error("API key is missing. Please set the VITE_OPENAI_KEY environment variable.");
  }

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const translate = async () => {
    setIsLoading(true);
    const { language, message, model } = formData;

    try {
      const response = await openai.createChatCompletion({
        model: model, // use the model from formData
        messages: [
          {
            role: "system",
            content: `You are a translator that translates text into ${language}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const translatedText = response.data.choices[0].message.content.trim();
      setTranslation(translatedText);
      setHistory([...history, { language, message, translation: translatedText }]);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error.message);
      } else {
        setError("An error occurred while translating. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }
    translate();
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(translation)
      .then(() => displayNotification())
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="container">
      <h1>TRANSLATION</h1>

      <form onSubmit={handleOnSubmit}>
        <div className="choices">
          <input
            type="radio"
            id="hindi"
            name="language"
            value="Hindi"
            checked={formData.language === "Hindi"}
            onChange={handleInputChange}
          />
          <label htmlFor="hindi">Hindi</label>

          <input
            type="radio"
            id="french"
            name="language"
            value="French"
            checked={formData.language === "French"}
            onChange={handleInputChange}
          />
          <label htmlFor="french">French</label>

          <input
            type="radio"
            id="spanish"
            name="language"
            value="Spanish"
            checked={formData.language === "Spanish"}
            onChange={handleInputChange}
          />
          <label htmlFor="spanish">Spanish</label>

          <input
            type="radio"
            id="japanese"
            name="language"
            value="Japanese"
            checked={formData.language === "Japanese"}
            onChange={handleInputChange}
          />
          <label htmlFor="japanese">Japanese</label>

          <input
            type="radio"
            id="punjabi"
            name="language"
            value="Punjabi"
            checked={formData.language === "Punjabi"}
            onChange={handleInputChange}
          />
          <label htmlFor="punjabi">Punjabi</label>

      

          <input
            type="radio"
            id="gpt-3.5-turbo"
            name="model"
            value="gpt-3.5-turbo"
            checked={formData.model === "gpt-3.5-turbo"}
            onChange={handleInputChange}
          />
          <label htmlFor="gpt-3.5-turbo">GPT-3.5 Turbo</label>

          <input
            type="radio"
            id="gpt4"
            name="model"
            value="gpt-4"
            checked={formData.model === "gpt-4"}
            onChange={handleInputChange}
          />
          <label htmlFor="gpt4">GPT4</label>

          <input
            type="radio"
            id="gpt4-turbo"
            name="model"
            value="gpt-4-turbo"
            checked={formData.model === "gpt-4-turbo"}
            onChange={handleInputChange}
          />
          <label htmlFor="gpt4-turbo">GPT4 Turbo</label>
        </div>

        <textarea
          name="message"
          placeholder="Type your message here..."
          value={formData.message}
          onChange={handleInputChange}
        ></textarea>

        {error && <div className="error">{error}</div>}

        <button type="submit">Translate</button>
      </form>

      <div className="translation">
        <div className="copy-btn" onClick={handleCopy}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
            />
          </svg>
        </div>
        {isLoading ? <BeatLoader size={12} color={"red"} /> : translation}
      </div>

      <div className="history">
        <h2>Translation History</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <span>Language: {item.language}</span>
              <span>Message: {item.message}</span>
              <span>Translation: {item.translation}</span>
            </li>
          ))}
        </ul>
        <button onClick={handleClearHistory}>Clear History</button>
      </div>

      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard!
      </div>
    </div>
  );
};

export default App;

