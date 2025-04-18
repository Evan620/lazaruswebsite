import { useState, useEffect, useRef } from "react";
import { getTerminalResponse } from "@/lib/data";

interface TerminalProps {
  onCommandExecuted?: (command: string) => void;
}

const Terminal = ({ onCommandExecuted }: TerminalProps) => {
  const [terminalOutput, setTerminalOutput] = useState<
    Array<{ text: string; type: "command" | "response" | "info" }>
  >([
    { text: "Neural Interface v1.0.0 (Lazarus System)", type: "info" },
    { text: "Establishing secure connection...", type: "info" },
    { text: "Connection established. Authenticate to proceed.", type: "response" },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-typing effect for the initial command
  useEffect(() => {
    const text = "access Lazarus_portfolio --verify";
    let index = 0;
    let typingInterval: ReturnType<typeof setInterval>;
    
    if (isTyping) {
      typingInterval = setInterval(() => {
        if (index < text.length) {
          setTypedText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Auto-complete the authentication
          setTimeout(() => {
            setTerminalOutput((prev) => [
              ...prev,
              { text: `$ ${text}`, type: "command" },
              { text: "Access granted. Welcome to the Lazarus Portfolio.", type: "response" },
              { text: "Loading neural interface...", type: "info" },
              { text: "System initialized. You may now explore the portfolio.", type: "response" }
            ]);
          }, 500);
        }
      }, 100);
    }
    
    return () => clearInterval(typingInterval);
  }, [isTyping]);
  
  // Scroll to bottom when terminal output changes
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalOutput]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = inputValue.trim();
      
      if (command) {
        // Add command to terminal
        setTerminalOutput((prev) => [
          ...prev,
          { text: `$ ${command}`, type: "command" }
        ]);
        
        // Process command
        const response = getTerminalResponse(command);
        
        setTerminalOutput((prev) => [
          ...prev,
          { text: response, type: "response" }
        ]);
        
        // Trigger callback if provided
        if (onCommandExecuted) {
          onCommandExecuted(command);
        }
        
        // Clear input
        setInputValue("");
      }
    }
  };
  
  return (
    <div className="bg-black/60 border border-cyber-teal/30 rounded-lg p-6 terminal-text">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-gray-400 text-sm">lazarus-terminal ~ (secure-shell)</div>
      </div>
      
      <div
        ref={terminalOutputRef}
        className="mb-4 h-64 overflow-y-auto scrollbar-hide"
      >
        {terminalOutput.map((line, index) => (
          <p
            key={index}
            className={`${
              line.type === "info"
                ? "text-gray-400"
                : line.type === "response"
                ? "text-cyber-teal"
                : "text-white"
            } ${index > 0 ? "mt-1" : ""}`}
          >
            {line.text}
          </p>
        ))}
        
        {isTyping && (
          <p className="text-white mt-4">
            $ <span className="text-cyber-teal">{typedText}</span>
            <span className="terminal-cursor"></span>
          </p>
        )}
      </div>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          className="w-full bg-transparent border-none outline-none text-cyber-teal"
          placeholder="Type 'access Lazarus_portfolio --verify'"
        />
      </div>
    </div>
  );
};

export default Terminal;
