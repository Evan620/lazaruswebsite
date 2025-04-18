import { useState, useEffect, useRef, useCallback } from "react";
import { skills, skillConnections, skillCategories } from "@/lib/data";
import { Skill, SkillConnection } from "@/lib/types";

// Interface for node with 2D coordinates added
interface Node extends Skill {
  x: number;
  y: number;
  z: number;
  size: number;
  dx?: number;
  dy?: number;
  dz?: number;
}

// Define tooltip interface
interface SkillTooltip {
  visible: boolean;
  skill: Node | null;
  x: number;
  y: number;
}

const SkillGraph = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  // State hooks for interactivity
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [tooltip, setTooltip] = useState<SkillTooltip>({ visible: false, skill: null, x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewOffset, setViewOffset] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [connectionAnimation, setConnectionAnimation] = useState<{from: string, to: string} | null>(null);
  
  // Calculate 3D positions with rotation simulation
  const calculate3DPositions = useCallback(() => {
    const angleRad = (rotationAngle * Math.PI) / 180;
    const cosAngle = Math.cos(angleRad);
    const sinAngle = Math.sin(angleRad);
    
    return skills.map((skill) => {
      // Apply rotation to x and z coordinates
      const rotatedX = skill.position[0] * cosAngle - skill.position[2] * sinAngle;
      const rotatedZ = skill.position[0] * sinAngle + skill.position[2] * cosAngle;
      
      // Map 3D coordinates to 2D space with perspective projection
      const z = rotatedZ + 5; // Push everything forward to avoid negative z
      const scale = 300 / (z + 10); // Simple perspective division
      
      const x = rotatedX * scale * 50 + 400; // Center at 400px
      const y = skill.position[1] * -scale * 50 + 250; // Center at 250px, invert y
      const nodeSize = skill.size * 20 * (scale * 0.8 + 0.2); // Size with perspective
      
      return {
        ...skill,
        x,
        y,
        z: rotatedZ,
        size: nodeSize,
        // Add velocity for animations
        dx: Math.random() * 0.2 - 0.1,
        dy: Math.random() * 0.2 - 0.1,
        dz: Math.random() * 0.2 - 0.1
      };
    });
  }, [rotationAngle]);
  
  // Initial position calculation
  useEffect(() => {
    const calculatedNodes = calculate3DPositions();
    setNodes(calculatedNodes);
    
    // Start rotation animation
    const rotationInterval = setInterval(() => {
      setRotationAngle(prevAngle => (prevAngle + 0.2) % 360);
    }, 50);
    
    return () => clearInterval(rotationInterval);
  }, [calculate3DPositions]);
  
  // Update nodes on rotation change
  useEffect(() => {
    setNodes(calculate3DPositions());
  }, [rotationAngle, calculate3DPositions]);
  
  // Random skill highlight effect
  useEffect(() => {
    const highlightInterval = setInterval(() => {
      // Get random skill and highlight it
      const randomSkillIndex = Math.floor(Math.random() * skills.length);
      const randomSkill = skills[randomSkillIndex].name;
      setActiveSkill(randomSkill);
      
      // Find connections for this skill
      const relevantConnections = skillConnections.filter(
        conn => conn.from === randomSkill || conn.to === randomSkill
      );
      
      // Animate connections sequentially
      if (relevantConnections.length > 0) {
        const animateConnections = async () => {
          for (const conn of relevantConnections) {
            setConnectionAnimation(conn);
            // Wait a bit between connection animations
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          setConnectionAnimation(null);
        };
        
        animateConnections();
      }
      
      // Reset after a delay
      setTimeout(() => {
        setActiveSkill(null);
      }, 2000);
      
    }, 8000);
    
    return () => clearInterval(highlightInterval);
  }, []);
  
  // Handle SVG pan interaction
  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handlePanMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;
    
    const dx = (e.clientX - dragStart.x) / zoomLevel;
    const dy = (e.clientY - dragStart.y) / zoomLevel;
    
    setViewOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handlePanEnd = () => {
    setIsDragging(false);
    setDragStart(null);
  };
  
  // Handle mouse wheel for zoom
  const handleZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom in or out
    const newZoom = Math.max(0.5, Math.min(3, zoomLevel * zoomFactor)); // Clamp between 0.5 and 3
    setZoomLevel(newZoom);
  };
  
  // Create connection paths for SVG
  const getConnectionPaths = () => {
    return skillConnections.map((connection, index) => {
      const fromNode = nodes.find(node => node.name === connection.from);
      const toNode = nodes.find(node => node.name === connection.to);
      
      if (!fromNode || !toNode) return null;
      
      // Determine if this connection is active based on active skill or animation
      const isActiveConnection = 
        activeSkill && (activeSkill === connection.from || activeSkill === connection.to) ||
        (connectionAnimation && connectionAnimation.from === connection.from && connectionAnimation.to === connection.to);
      
      // Determine if this connection should be visible based on category filtering
      const shouldShowConnection = !activeCategory || 
        fromNode.color.includes(activeCategory === 'AI & Automation' ? 'FF00FF' : '00F7FF') ||
        toNode.color.includes(activeCategory === 'AI & Automation' ? 'FF00FF' : '00F7FF');
      
      // Apply perspective to connections - make farther connections thinner
      const distanceFactor = Math.min(
        1, 
        Math.max(0.3, 1 - (Math.abs(fromNode.z) + Math.abs(toNode.z)) / 20)
      );
      
      // Create animated dashed lines for active connections
      const dashArray = isActiveConnection ? "4,2" : "none";
      const animationClass = isActiveConnection ? "animate-pulse-fast" : "";
      
      return (
        <path 
          key={`connection-${index}`}
          d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
          stroke={isActiveConnection ? "#FF00FF" : "#00F7FF"}
          strokeWidth={isActiveConnection ? 3 * distanceFactor : 1 * distanceFactor}
          strokeOpacity={shouldShowConnection ? (isActiveConnection ? 0.9 : 0.4) : 0.1}
          strokeDasharray={dashArray}
          className={animationClass}
          style={{
            transition: 'stroke-opacity 0.3s, stroke-width 0.3s',
            animation: isActiveConnection ? 'pulse 1.5s infinite' : 'none'
          }}
        />
      );
    });
  };
  
  // Generate skill node elements
  const getSkillNodes = () => {
    // Sort nodes by z-index for proper overlap (back to front)
    const sortedNodes = [...nodes].sort((a, b) => b.z - a.z);
    
    return sortedNodes.map((node, index) => {
      // Determine if this node should be highlighted based on category
      const isInActiveCategory = !activeCategory || 
        (activeCategory === 'AI & Automation' && node.color.includes('FF00FF')) ||
        (activeCategory !== 'AI & Automation' && node.color.includes('00F7FF'));
      
      // Apply glow effects for active skills
      const glowFilter = activeSkill === node.name ? 
        `drop-shadow(0 0 6px ${node.color}) drop-shadow(0 0 8px white)` : '';
        
      // Node opacity based on active category and active skill
      const nodeOpacity = !isInActiveCategory ? 0.3 : 
        activeSkill === node.name ? 1 : 0.7;
        
      return (
        <g 
          key={`node-${index}`}
          onMouseEnter={() => {
            setActiveSkill(node.name);
            setTooltip({
              visible: true,
              skill: node,
              x: node.x + 20,
              y: node.y - 10
            });
          }}
          onMouseLeave={() => {
            if (activeSkill === node.name) {
              setActiveSkill(null);
            }
            setTooltip({ ...tooltip, visible: false });
          }}
          className="cursor-pointer"
          style={{ 
            transform: `scale(${activeSkill === node.name ? 1.15 : 1})`,
            transition: 'transform 0.3s, opacity 0.3s',
            filter: glowFilter
          }}
        >
          {/* Node glow effect */}
          {activeSkill === node.name && (
            <circle 
              cx={node.x} 
              cy={node.y} 
              r={node.size * 1.4} 
              fill={node.color} 
              opacity={0.2}
              className="animate-pulse-slow"
            />
          )}
          
          {/* Node circle */}
          <circle 
            cx={node.x} 
            cy={node.y} 
            r={node.size} 
            fill={node.color} 
            fillOpacity={nodeOpacity}
            stroke={activeSkill === node.name ? "#FFFFFF" : node.color}
            strokeWidth={activeSkill === node.name ? 2 : 1}
            style={{
              transition: 'r 0.3s, fill-opacity 0.3s, stroke-width 0.3s'
            }}
          />
          
          {/* Inner circle for decoration */}
          <circle 
            cx={node.x} 
            cy={node.y} 
            r={node.size * 0.5} 
            fill={node.color} 
            fillOpacity={nodeOpacity + 0.1}
            style={{
              transition: 'r 0.3s, fill-opacity 0.3s'
            }}
          />
          
          {/* Node label */}
          <text 
            x={node.x} 
            y={node.y + node.size + 15}
            fontSize="14px"
            fontFamily="'Space Mono', monospace"
            textAnchor="middle"
            fill={node.color}
            fillOpacity={nodeOpacity + 0.2}
            className="font-bold"
            style={{
              transition: 'fill-opacity 0.3s',
              textShadow: activeSkill === node.name ? '0 0 5px rgba(0,0,0,0.8)' : 'none'
            }}
          >
            {node.name}
          </text>
        </g>
      );
    });
  };
  
  // Generate tooltip for skill details
  const getSkillTooltip = () => {
    if (!tooltip.visible || !tooltip.skill) return null;
    
    // Find connections for this skill
    const relatedConnections = skillConnections.filter(
      conn => conn.from === tooltip.skill!.name || conn.to === tooltip.skill!.name
    );
    
    return (
      <foreignObject 
        x={tooltip.x} 
        y={tooltip.y} 
        width="200" 
        height="auto"
        style={{ overflow: 'visible' }}
      >
        <div className="bg-black/90 backdrop-blur-sm border border-cyber-teal/50 p-3 rounded text-sm text-white shadow-lg"
          style={{ maxWidth: '200px' }}
        >
          <div className="font-space text-cyber-teal font-bold mb-1">{tooltip.skill.name}</div>
          
          {relatedConnections.length > 0 && (
            <div className="mt-2">
              <div className="text-cyber-magenta text-xs mb-1">Connections:</div>
              <ul className="text-xs text-gray-300">
                {relatedConnections.map((conn, idx) => (
                  <li key={idx} className="mb-1">
                    <span className="text-cyber-teal">
                      {conn.from === tooltip.skill!.name ? '→ ' : '← '}
                      {conn.from === tooltip.skill!.name ? conn.to : conn.from}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-400">
            Click to explore this skill in depth
          </div>
        </div>
      </foreignObject>
    );
  };
  
  // Handle category filter buttons
  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };
  
  // Viewport transformation for pan and zoom
  const getViewBoxTransform = () => {
    const centerX = 400;
    const centerY = 250;
    const width = 800 / zoomLevel;
    const height = 500 / zoomLevel;
    
    const x = centerX - width / 2 - viewOffset.x;
    const y = centerY - height / 2 - viewOffset.y;
    
    return `${x} ${y} ${width} ${height}`;
  };
  
  return (
    <div className="relative">
      {/* Category filter buttons */}
      <div className="w-full flex flex-wrap justify-center mb-4 gap-2 px-4">
        {skillCategories.map((category, index) => (
          <button
            key={`cat-${index}`}
            className={`px-3 py-1 rounded text-sm transition-all border 
              ${activeCategory === category.title 
                ? category.color === 'teal'
                  ? 'bg-cyber-teal/20 text-cyber-teal border-cyber-teal'
                  : 'bg-cyber-magenta/20 text-cyber-magenta border-cyber-magenta'
                : 'bg-black/60 hover:bg-black/80 text-gray-300 border-gray-700'}`
            }
            onClick={() => handleCategoryFilter(category.title)}
          >
            <i className={`fas ${category.icon} mr-1`}></i> {category.title}
          </button>
        ))}
        {activeCategory && (
          <button
            className="px-3 py-1 rounded text-sm transition-all bg-black/60 hover:bg-black/80 text-gray-300 border border-gray-700"
            onClick={() => handleCategoryFilter(null)}
          >
            <i className="fas fa-times mr-1"></i> Clear Filter
          </button>
        )}
      </div>
    
      <div 
        className="w-full h-[550px] bg-cyber-dark/50 rounded-lg border border-cyber-teal/20 overflow-hidden relative"
        aria-label="Interactive skill graph showing connections between technologies"
      >
        <svg 
          ref={svgRef}
          viewBox={getViewBoxTransform()}
          className="w-full h-full cursor-move"
          style={{ background: "rgba(10,10,10,0.8)" }}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onWheel={handleZoom}
        >
          {/* Grid pattern for dimension sense */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#222" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="skill-glow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Background grid */}
          <rect width="2000" height="2000" fill="url(#grid)" transform="translate(-600, -600)" opacity="0.1" />
          
          {/* Neural network connections */}
          <g className="connections">
            {getConnectionPaths()}
          </g>
          
          {/* Skill nodes */}
          <g className="nodes">
            {getSkillNodes()}
          </g>
          
          {/* Skill tooltip */}
          {getSkillTooltip()}
          
          {/* Decorative elements */}
          <g className="decorative-elements opacity-20">
            <circle cx="100" cy="450" r="80" fill="none" stroke="#00F7FF" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx="700" cy="50" r="60" fill="none" stroke="#FF00FF" strokeWidth="1" strokeDasharray="5,5" />
            <path d="M 50 250 L 750 250" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 400 50 L 400 450" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
            
            {/* Coordinate axis for reference */}
            <line x1="400" y1="250" x2="500" y2="250" stroke="#444" strokeWidth="0.5" strokeDasharray="5,5" />
            <line x1="400" y1="250" x2="400" y2="150" stroke="#444" strokeWidth="0.5" strokeDasharray="5,5" />
            <text x="505" y="250" fill="#444" fontSize="10">X</text>
            <text x="400" y="145" fill="#444" fontSize="10">Y</text>
          </g>
        </svg>
      </div>
      
      {/* Control panel */}
      <div className="absolute bottom-4 right-4 bg-black/80 p-3 rounded-md border border-cyber-teal/30 text-sm">
        <p className="text-gray-300 flex items-center">
          <i className="fas fa-info-circle text-cyber-teal mr-1"></i> 
          <span>Interactive Controls:</span>
        </p>
        <ul className="text-xs text-gray-400 mt-1">
          <li className="flex items-center">
            <i className="fas fa-mouse mr-1"></i> Drag to pan view
          </li>
          <li className="flex items-center">
            <i className="fas fa-search-plus mr-1"></i> Scroll to zoom
          </li>
          <li className="flex items-center">
            <i className="fas fa-hand-pointer mr-1"></i> Hover skills for details
          </li>
        </ul>
        <div className="mt-2 text-cyan-500 text-xs">
          Zoom: {Math.round(zoomLevel * 100)}%
        </div>
      </div>
    </div>
  );
};

export default SkillGraph;
