import { useEffect } from "react";

const ChatBot = () => {
  useEffect(() => {
    // Inject the main Botpress script
    const botpressScript = document.createElement("script");
    botpressScript.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    botpressScript.async = true;

    // Inject the bot's configuration script
    botpressScript.onload = () => {
      const configScript = document.createElement("script");
      configScript.src =
        "https://files.bpcontent.cloud/2024/12/10/19/20241210192505-8BZEJPFL.js";
      configScript.async = true;
      document.body.appendChild(configScript);
    };

    document.body.appendChild(botpressScript);
  }, []);

  return (
    <div>
      <h2>Welcome to Ifeelincolor Chatbot</h2>
      {/* Chatbot will load automatically */}
    </div>
  );
};

export default ChatBot;
