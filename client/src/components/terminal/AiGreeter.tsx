import { useState, useRef, useEffect } from "react";
import { AIMessage } from "@/lib/types";
import { defaultAIMessages, getAIResponse } from "@/lib/data";

interface AiGreeterProps {
  onNavigationRequest?: (section: string) => void;
}

const AiGreeter = ({ onNavigationRequest }: AiGreeterProps) => {
  const [messages, setMessages] = useState<AIMessage[]>(defaultAIMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSubmit = () => {
    if (!inputValue.trim() || isTyping) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: inputValue }]);
    
    // Start AI typing
    setIsTyping(true);
    
    // Process and generate AI response
    const userQuery = inputValue;
    setInputValue("");
    
    // Simple timeout to simulate thinking/processing
    setTimeout(() => {
      const aiResponse = getAIResponse(userQuery);
      
      // Add the response character by character for typing effect
      let responseText = "";
      let index = 0;
      
      const typingInterval = setInterval(() => {
        if (index < aiResponse.length) {
          responseText += aiResponse.charAt(index);
          setMessages(prev => [
            ...prev.slice(0, -1),
            { role: "user", content: userQuery },
            { role: "ai", content: responseText }
          ]);
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Check if navigation was requested
          if (userQuery.toLowerCase().includes("project")) {
            onNavigationRequest?.("projects");
          } else if (userQuery.toLowerCase().includes("skill")) {
            onNavigationRequest?.("skills"); 
          } else if (userQuery.toLowerCase().includes("contact")) {
            onNavigationRequest?.("contact");
          } else if (userQuery.toLowerCase().includes("resume")) {
            onNavigationRequest?.("resume");
          }
        }
      }, 20);
    }, 500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  
  return (
    <div className="hologram relative rounded-lg overflow-hidden border border-cyber-teal/30 p-1">
      <div className="bg-black/80 rounded-lg p-6 relative z-10">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-cyber-teal glow">
            {/* Placeholder for actual profile image */}
            <div className="w-full h-full bg-gradient-to-br from-cyber-dark to-cyber-teal/30 flex items-center justify-center text-cyber-teal text-3xl">
              <i className="fas fa-user"></i>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-teal/30 to-transparent"></div>
          </div>
          <div>
            <h3 className="font-space text-xl text-cyber-teal glow">AI GREETER</h3>
            <p className="text-sm text-gray-300">Neural Assistant v4.2</p>
          </div>
        </div>
        
        <div className="text-sm mb-4 h-32 overflow-y-auto scrollbar-hide">
          {messages.map((message, index) => (
            <p key={index} className="mb-2">
              <span className={message.role === "system" ? "text-cyber-teal" : message.role === "ai" ? "text-cyber-magenta" : "text-white"}>
                {message.role.toUpperCase()}:
              </span>{" "}
              {message.content}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1 bg-black/60 border border-cyber-teal/50 rounded-l-md px-3 py-2 text-white text-sm focus:outline-none focus:border-cyber-teal"
            placeholder="Ask me about Lazarus..."
          />
          <button
            onClick={handleSubmit}
            disabled={isTyping || !inputValue.trim()}
            className={`bg-cyber-teal/20 hover:bg-cyber-teal/40 border border-cyber-teal/50 text-cyber-teal rounded-r-md px-4 py-2 text-sm transition-colors ${
              isTyping || !inputValue.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiGreeter;
