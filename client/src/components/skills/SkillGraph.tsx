import { useState, useEffect } from "react";
import { skills, skillConnections } from "@/lib/data";
import { Skill, SkillConnection } from "@/lib/types";

const SkillGraph = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  
  // Calculate positions for SVG visualization based on the 3D positions
  // This maps 3D positions to 2D for our visualization
  const calculateNodePositions = () => {
    const nodes = skills.map((skill) => {
      // Map 3D coordinates to 2D space
      const x = (skill.position[0] * 50) + 400; // Center point at 400px
      const y = (skill.position[1] * -50) + 250; // Center point at 250px, invert y axis
      const size = skill.size * 20;
      
      return {
        ...skill,
        x,
        y,
        size
      };
    });
    
    return nodes;
  };
  
  const nodes = calculateNodePositions();
  
  // Create connection paths for SVG
  const getConnectionPaths = () => {
    return skillConnections.map((connection, index) => {
      const fromNode = nodes.find(node => node.name === connection.from);
      const toNode = nodes.find(node => node.name === connection.to);
      
      if (!fromNode || !toNode) return null;
      
      return (
        <path 
          key={`connection-${index}`}
          d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
          stroke={activeSkill && (activeSkill === connection.from || activeSkill === connection.to) ? 
            "#FF00FF" : "#00F7FF"}
          strokeWidth={activeSkill && (activeSkill === connection.from || activeSkill === connection.to) ? 3 : 1}
          strokeOpacity={0.7}
          className="animate-pulse"
        />
      );
    });
  };
  
  // Pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const randomSkillIndex = Math.floor(Math.random() * skills.length);
      setActiveSkill(skills[randomSkillIndex].name);
      
      // Reset after a delay
      setTimeout(() => {
        setActiveSkill(null);
      }, 2000);
      
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      <div 
        className="w-full h-[500px] bg-cyber-dark/50 rounded-lg border border-cyber-teal/20 overflow-hidden"
        aria-label="Interactive skill graph showing connections between technologies"
      >
        <svg 
          viewBox="0 0 800 500" 
          className="w-full h-full"
          style={{ background: "rgba(10,10,10,0.5)" }}
        >
          {/* Neural network connections */}
          <g className="connections">
            {getConnectionPaths()}
          </g>
          
          {/* Skill nodes */}
          <g className="nodes">
            {nodes.map((node, index) => (
              <g 
                key={`node-${index}`}
                onMouseEnter={() => setActiveSkill(node.name)}
                onMouseLeave={() => setActiveSkill(null)}
                className="cursor-pointer transform transition-transform duration-300 hover:scale-110"
              >
                {/* Node circle */}
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={node.size} 
                  fill={node.color} 
                  fillOpacity={activeSkill === node.name ? 0.9 : 0.6}
                  stroke={activeSkill === node.name ? "#FFFFFF" : node.color}
                  strokeWidth={activeSkill === node.name ? 2 : 0}
                  className={activeSkill === node.name ? "animate-pulse" : ""}
                />
                
                {/* Node label */}
                <text 
                  x={node.x} 
                  y={node.y + node.size + 15}
                  fontSize="14px"
                  fontFamily="'Space Mono', monospace"
                  textAnchor="middle"
                  fill={node.color}
                  className="font-bold"
                >
                  {node.name}
                </text>
              </g>
            ))}
          </g>
          
          {/* Add some decorative elements */}
          <g className="decorative-elements opacity-20">
            <circle cx="100" cy="450" r="80" fill="none" stroke="#00F7FF" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx="700" cy="50" r="60" fill="none" stroke="#FF00FF" strokeWidth="1" strokeDasharray="5,5" />
            <path d="M 50 250 L 750 250" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 400 50 L 400 450" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
          </g>
        </svg>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-black/80 p-3 rounded-md border border-cyber-teal/30 text-sm">
        <p className="text-gray-300">
          <i className="fas fa-info-circle text-cyber-teal mr-1"></i> Hover over skills to see connections
        </p>
      </div>
    </div>
  );
};

export default SkillGraph;
