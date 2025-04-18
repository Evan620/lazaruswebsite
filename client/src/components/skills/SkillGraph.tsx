import { useState, useEffect, useRef } from "react";
import { skills, skillConnections, skillCategories } from "@/lib/data";
import { Skill } from "@/lib/types";

// Interface for game entities
interface GameEntity {
  id: string;
  type: 'player' | 'skill' | 'obstacle' | 'powerup';
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  discovered?: boolean;
  explored?: boolean;
  description?: string;
  icon?: string;
}

// Define skill details modal interface
interface SkillModal {
  visible: boolean;
  skill: GameEntity | null;
}

const GRID_SIZE = 10;
const GRID_CELL_SIZE = 70;
const MAZE_WIDTH = GRID_SIZE * GRID_CELL_SIZE;
const MAZE_HEIGHT = GRID_SIZE * GRID_CELL_SIZE;

const SkillGraph = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [player, setPlayer] = useState<GameEntity>({
    id: 'player',
    type: 'player',
    x: MAZE_WIDTH / 2,
    y: MAZE_HEIGHT / 2,
    z: 0,
    size: 20,
    color: '#FF00FF'
  });
  const [targetX, setTargetX] = useState<number>(player.x);
  const [targetY, setTargetY] = useState<number>(player.y);
  const [skillEntities, setSkillEntities] = useState<GameEntity[]>([]);
  const [obstacles, setObstacles] = useState<GameEntity[]>([]);
  const [fog, setFog] = useState<boolean[][]>(
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(true))
  );
  const [skillModal, setSkillModal] = useState<SkillModal>({ visible: false, skill: null });
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [discoveredSkills, setDiscoveredSkills] = useState<string[]>([]);
  const [gameMessage, setGameMessage] = useState<string>("Navigate through the Neural Maze to discover my skills");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [nearbySkills, setNearbySkills] = useState<GameEntity[]>([]);
  
  // Initialize game entities
  useEffect(() => {
    if (gameStarted) return; // Only initialize once
    
    // Create skill entities from skill data
    const entities: GameEntity[] = [];
    const obstacleEntities: GameEntity[] = [];
    
    // Generate maze layout - walls and passages
    generateMazeObstacles(obstacleEntities);
    
    // Place skill nodes in the maze at interesting locations 
    skills.forEach((skill, index) => {
      // Find an open space
      let x: number = 0;
      let y: number = 0;
      let attempts = 0;
      let valid = false;
      
      while (!valid && attempts < 50) {
        attempts++;
        // Get grid-aligned position
        x = Math.floor(Math.random() * (GRID_SIZE - 2) + 1) * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
        y = Math.floor(Math.random() * (GRID_SIZE - 2) + 1) * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
        
        // Check if position is away from obstacles and other entities
        valid = !obstacleEntities.some(obs => {
          return Math.sqrt(Math.pow(obs.x - x, 2) + Math.pow(obs.y - y, 2)) < GRID_CELL_SIZE;
        });
        
        // Ensure not too close to other skills
        valid = valid && !entities.some(entity => {
          return Math.sqrt(Math.pow(entity.x - x, 2) + Math.pow(entity.y - y, 2)) < GRID_CELL_SIZE * 2;
        });
      }
      
      if (valid) {
        entities.push({
          id: skill.name,
          type: 'skill',
          x: x,
          y: y,
          z: 0,
          size: 25,
          color: skill.color,
          discovered: false,
          explored: false,
          description: getSkillDescription(skill.name),
          icon: getSkillIcon(skill.name)
        });
      }
    });
    
    // Add some powerups for fun
    for (let i = 0; i < 3; i++) {
      let x: number = 0;
      let y: number = 0;
      let attempts = 0;
      let valid = false;
      
      while (!valid && attempts < 50) {
        attempts++;
        x = Math.floor(Math.random() * (GRID_SIZE - 2) + 1) * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
        y = Math.floor(Math.random() * (GRID_SIZE - 2) + 1) * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
        
        valid = !obstacleEntities.some(obs => {
          return Math.sqrt(Math.pow(obs.x - x, 2) + Math.pow(obs.y - y, 2)) < GRID_CELL_SIZE;
        });
        
        valid = valid && !entities.some(entity => {
          return Math.sqrt(Math.pow(entity.x - x, 2) + Math.pow(entity.y - y, 2)) < GRID_CELL_SIZE * 1.5;
        });
      }
      
      if (valid) {
        entities.push({
          id: `powerup-${i}`,
          type: 'powerup',
          x: x,
          y: y,
          z: 0,
          size: 15,
          color: '#FFFF00',
          description: "Reveals nearby skills"
        });
      }
    }
    
    setSkillEntities(entities);
    setObstacles(obstacleEntities);
    setGameStarted(true);
    
    // Place player in a clear starting position
    const startX = GRID_CELL_SIZE * 1.5;
    const startY = GRID_CELL_SIZE * 1.5;
    
    setPlayer({
      ...player,
      x: startX,
      y: startY
    });
    setTargetX(startX);
    setTargetY(startY);
    
    // Clear fog around starting position
    clearFogAroundPlayer(startX, startY);
    
  }, [gameStarted]);
  
  // Generate maze obstacles - walls and passages
  const generateMazeObstacles = (obstacleEntities: GameEntity[]) => {
    // Create outer walls
    for (let i = 0; i < GRID_SIZE; i++) {
      // Top wall
      obstacleEntities.push({
        id: `wall-top-${i}`,
        type: 'obstacle',
        x: i * GRID_CELL_SIZE + GRID_CELL_SIZE/2,
        y: 0 + GRID_CELL_SIZE/2,
        z: 0,
        size: GRID_CELL_SIZE/2,
        color: '#333'
      });
      
      // Bottom wall
      obstacleEntities.push({
        id: `wall-bottom-${i}`,
        type: 'obstacle',
        x: i * GRID_CELL_SIZE + GRID_CELL_SIZE/2,
        y: MAZE_HEIGHT - GRID_CELL_SIZE/2,
        z: 0,
        size: GRID_CELL_SIZE/2,
        color: '#333'
      });
      
      // Left wall
      obstacleEntities.push({
        id: `wall-left-${i}`,
        type: 'obstacle',
        x: 0 + GRID_CELL_SIZE/2,
        y: i * GRID_CELL_SIZE + GRID_CELL_SIZE/2,
        z: 0,
        size: GRID_CELL_SIZE/2,
        color: '#333'
      });
      
      // Right wall
      obstacleEntities.push({
        id: `wall-right-${i}`,
        type: 'obstacle',
        x: MAZE_WIDTH - GRID_CELL_SIZE/2,
        y: i * GRID_CELL_SIZE + GRID_CELL_SIZE/2,
        z: 0,
        size: GRID_CELL_SIZE/2,
        color: '#333'
      });
    }
    
    // Create internal maze structure - using a simple algorithm to ensure path exists
    // We'll create a maze with random walls but ensuring a path exists
    for (let i = 2; i < GRID_SIZE - 1; i += 2) {
      for (let j = 2; j < GRID_SIZE - 1; j += 2) {
        if (Math.random() < 0.75) { // 75% chance of a wall segment
          // Choose a direction to leave open (0: top, 1: right, 2: bottom, 3: left)
          const openDirection = Math.floor(Math.random() * 4);
          
          // Place wall segments in 3 other directions
          for (let dir = 0; dir < 4; dir++) {
            if (dir !== openDirection) {
              let wallX = i * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
              let wallY = j * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
              
              // Adjust position based on direction
              if (dir === 0) wallY -= GRID_CELL_SIZE; // top
              else if (dir === 1) wallX += GRID_CELL_SIZE; // right
              else if (dir === 2) wallY += GRID_CELL_SIZE; // bottom
              else wallX -= GRID_CELL_SIZE; // left
              
              // Don't place wall if it's outside the grid
              if (
                wallX > GRID_CELL_SIZE && 
                wallX < MAZE_WIDTH - GRID_CELL_SIZE && 
                wallY > GRID_CELL_SIZE && 
                wallY < MAZE_HEIGHT - GRID_CELL_SIZE
              ) {
                // Add with a bit of randomness to make it look interesting
                if (Math.random() < 0.8) {
                  obstacleEntities.push({
                    id: `wall-inner-${i}-${j}-${dir}`,
                    type: 'obstacle',
                    x: wallX,
                    y: wallY,
                    z: 0,
                    size: GRID_CELL_SIZE/2 * (0.8 + Math.random() * 0.4), // Vary size slightly
                    color: `rgb(${40 + Math.random() * 40}, ${40 + Math.random() * 40}, ${60 + Math.random() * 40})`
                  });
                }
              }
            }
          }
        }
      }
    }
  };
  
  // Function to get skill descriptions
  const getSkillDescription = (skillName: string): string => {
    const descriptions: Record<string, string> = {
      'Python': 'Advanced Python development including data processing, automation, and API integrations. Expert in frameworks like Flask, FastAPI and ML libraries.',
      'AWS': 'AWS Certified Solutions Architect with expertise in designing scalable and highly available cloud architectures across multiple AWS services.',
      'Kafka': 'Experience building real-time data pipelines processing millions of events daily using Kafka, Kafka Streams, and Kafka Connect.',
      'AI': 'AI integration specialist connecting LLMs, computer vision and ML models to business applications. Experienced with OpenAI, HuggingFace, and TensorFlow.',
      'React': 'Frontend development using React, Next.js, and modern JavaScript/TypeScript. Focused on creating responsive, accessible user interfaces.',
      'Docker': 'Container specialist utilizing Docker and Kubernetes for microservice orchestration, with expertise in CI/CD pipeline automation.',
      'Terraform': 'Infrastructure as Code expert using Terraform to manage cloud resources with versioning, modularity, and automated deployments.',
      'ML': 'Machine Learning practitioner building predictive models, recommendation systems, and NLP solutions for business applications.'
    };
    
    return descriptions[skillName] || 'A specialized technical skill in my portfolio.';
  };
  
  // Get appropriate icon for each skill
  const getSkillIcon = (skillName: string): string => {
    const icons: Record<string, string> = {
      'Python': 'fa-python',
      'AWS': 'fa-aws',
      'Kafka': 'fa-stream',
      'AI': 'fa-brain',
      'React': 'fa-react',
      'Docker': 'fa-docker',
      'Terraform': 'fa-cubes',
      'ML': 'fa-robot'
    };
    
    return icons[skillName] || 'fa-code';
  };
  
  // Player movement and game loop
  useEffect(() => {
    // Animation frame for smooth movement
    let animationFrameId: number;
    
    const gameLoop = () => {
      setPlayer(prev => {
        // Calculate distance to target
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If we're close enough to target, stop movement
        if (distance < 2) {
          return prev;
        }
        
        // Calculate new position (easing movement)
        const speed = 5;
        const newX = prev.x + (dx / distance) * speed;
        const newY = prev.y + (dy / distance) * speed;
        
        // Check for collisions with obstacles
        const colliding = obstacles.some(obstacle => {
          const obstacleDistance = Math.sqrt(
            Math.pow(obstacle.x - newX, 2) + 
            Math.pow(obstacle.y - newY, 2)
          );
          return obstacleDistance < (obstacle.size + prev.size - 5); // Slight buffer
        });
        
        if (colliding) {
          // Stop movement if colliding
          return prev;
        }
        
        // Check for powerups or skill discoveries
        checkInteractions(newX, newY);
        
        // Clear fog as player moves
        clearFogAroundPlayer(newX, newY);
        
        // Update player position
        return {
          ...prev,
          x: newX,
          y: newY
        };
      });
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetX, targetY, obstacles]);
  
  // Handle click to move player
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (skillModal.visible) return; // Don't allow movement when modal is open
    
    // Get click coordinates relative to SVG
    const svg = svgRef.current;
    if (!svg) return;
    
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    // Set target for player movement
    setTargetX(svgP.x);
    setTargetY(svgP.y);
  };
  
  // Clear fog around player
  const clearFogAroundPlayer = (x: number, y: number) => {
    // Convert player position to grid coordinates
    const gridX = Math.floor(x / GRID_CELL_SIZE);
    const gridY = Math.floor(y / GRID_CELL_SIZE);
    
    // Clear fog in visible range (3x3 grid around player)
    const newFog = [...fog];
    const visibilityRange = 2; // Cells visible in each direction
    
    for (let i = Math.max(0, gridX - visibilityRange); i <= Math.min(GRID_SIZE - 1, gridX + visibilityRange); i++) {
      for (let j = Math.max(0, gridY - visibilityRange); j <= Math.min(GRID_SIZE - 1, gridY + visibilityRange); j++) {
        // Calculate distance from player to cell center (in grid units)
        const cellCenterX = i * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
        const cellCenterY = j * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
        const distance = Math.sqrt(Math.pow(x - cellCenterX, 2) + Math.pow(y - cellCenterY, 2));
        
        // Clear fog if within visibility radius
        if (distance <= visibilityRange * GRID_CELL_SIZE) {
          newFog[j][i] = false;
        }
      }
    }
    
    setFog(newFog);
    
    // Check nearby skills to update the hint system
    const nearby = skillEntities.filter(entity => {
      if (entity.type !== 'skill') return false;
      const distance = Math.sqrt(Math.pow(entity.x - x, 2) + Math.pow(entity.y - y, 2));
      return distance <= visibilityRange * GRID_CELL_SIZE * 1.2 && !entity.explored;
    });
    
    setNearbySkills(nearby);
    
    if (nearby.length > 0 && !showHint) {
      setShowHint(true);
      setGameMessage("Skill nodes detected nearby! Approach to discover.");
    } else if (nearby.length === 0 && showHint) {
      setShowHint(false);
      setGameMessage("Navigate through the Neural Maze to discover my skills");
    }
  };
  
  // Check for interactions with entities
  const checkInteractions = (x: number, y: number) => {
    // Check if player is near a skill node or powerup
    setSkillEntities(prev => {
      const updatedEntities = [...prev];
      let messageSet = false;
      
      updatedEntities.forEach(entity => {
        const distance = Math.sqrt(Math.pow(entity.x - x, 2) + Math.pow(entity.y - y, 2));
        
        if (distance < entity.size + player.size) {
          // Player has reached a skill node
          if (entity.type === 'skill' && !entity.discovered) {
            entity.discovered = true;
            setDiscoveredSkills(prev => [...prev, entity.id]);
            
            // Show message about discovered skill
            if (!messageSet) {
              setGameMessage(`Discovered: ${entity.id}! Click to learn more.`);
              messageSet = true;
            }
          }
          
          // Player has reached a powerup
          if (entity.type === 'powerup') {
            // Activate powerup effect
            activatePowerup(entity.id);
            
            // Remove powerup from game
            const index = updatedEntities.findIndex(e => e.id === entity.id);
            if (index !== -1) {
              updatedEntities.splice(index, 1);
            }
            
            if (!messageSet) {
              setGameMessage("Neural Amplifier activated! Nearby skills revealed.");
              messageSet = true;
            }
          }
        }
      });
      
      return updatedEntities;
    });
  };
  
  // Activate powerup effects
  const activatePowerup = (powerupId: string) => {
    // Neural amplifier powerup reveals skills in a wider radius
    const revealRadius = 4 * GRID_CELL_SIZE;
    
    setSkillEntities(prev => {
      return prev.map(entity => {
        if (entity.type === 'skill') {
          const distance = Math.sqrt(
            Math.pow(entity.x - player.x, 2) + 
            Math.pow(entity.y - player.y, 2)
          );
          
          if (distance <= revealRadius) {
            return { ...entity, discovered: true };
          }
        }
        return entity;
      });
    });
    
    // Clear more fog
    const newFog = [...fog];
    const gridX = Math.floor(player.x / GRID_CELL_SIZE);
    const gridY = Math.floor(player.y / GRID_CELL_SIZE);
    const visibilityRange = 4; // Wider reveal
    
    for (let i = Math.max(0, gridX - visibilityRange); i <= Math.min(GRID_SIZE - 1, gridX + visibilityRange); i++) {
      for (let j = Math.max(0, gridY - visibilityRange); j <= Math.min(GRID_SIZE - 1, gridY + visibilityRange); j++) {
        const cellCenterX = i * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
        const cellCenterY = j * GRID_CELL_SIZE + GRID_CELL_SIZE/2;
        const distance = Math.sqrt(Math.pow(player.x - cellCenterX, 2) + Math.pow(player.y - cellCenterY, 2));
        
        if (distance <= visibilityRange * GRID_CELL_SIZE) {
          newFog[j][i] = false;
        }
      }
    }
    
    setFog(newFog);
  };
  
  // Handle clicking on a skill node to open modal
  const handleSkillClick = (skill: GameEntity) => {
    if (!skill.discovered) return;
    
    // Mark skill as explored when clicked
    setSkillEntities(prev => 
      prev.map(entity => 
        entity.id === skill.id ? { ...entity, explored: true } : entity
      )
    );
    
    setSkillModal({ visible: true, skill });
    setGameMessage(`Analyzing ${skill.id} skill...`);
  };
  
  // Close skill modal
  const handleCloseModal = () => {
    setSkillModal({ visible: false, skill: null });
    setGameMessage("Continue exploring the Neural Maze...");
  };
  
  // Render fog of war
  const renderFog = () => {
    const fogCells = [];
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (fog[j][i]) {
          fogCells.push(
            <rect
              key={`fog-${i}-${j}`}
              x={i * GRID_CELL_SIZE}
              y={j * GRID_CELL_SIZE}
              width={GRID_CELL_SIZE}
              height={GRID_CELL_SIZE}
              fill="rgba(0, 0, 0, 0.85)"
            />
          );
        }
      }
    }
    
    return fogCells;
  };
  
  // Render game grid
  const renderGrid = () => {
    const gridLines = [];
    
    // Horizontal lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={i * GRID_CELL_SIZE}
          x2={MAZE_WIDTH}
          y2={i * GRID_CELL_SIZE}
          stroke="#222"
          strokeWidth="1"
        />
      );
    }
    
    // Vertical lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={i * GRID_CELL_SIZE}
          y1={0}
          x2={i * GRID_CELL_SIZE}
          y2={MAZE_HEIGHT}
          stroke="#222"
          strokeWidth="1"
        />
      );
    }
    
    return gridLines;
  };
  
  // Calculate discovery progress
  const calcProgress = () => {
    if (skillEntities.length === 0) return 0;
    const skillNodes = skillEntities.filter(e => e.type === 'skill');
    return Math.round((discoveredSkills.length / skillNodes.length) * 100);
  };
  
  return (
    <div className="relative">
      <div className="mb-4 w-full flex flex-col items-center">
        <h3 className="text-cyber-teal text-lg font-space mb-2">Neural Maze Explorer</h3>
        <div className="bg-black/60 rounded-md p-2 text-center mb-4 w-full max-w-xl">
          <p className="text-sm text-cyber-magenta">{gameMessage}</p>
        </div>
        
        <div className="flex items-center justify-between w-full max-w-xl px-4 mb-2">
          <div className="flex items-center">
            <div className="h-8 bg-black/50 rounded-md px-3 flex items-center border border-cyber-teal/30">
              <i className="fas fa-brain text-cyber-magenta mr-2"></i>
              <span className="text-sm text-gray-300">Skills: {discoveredSkills.length} found</span>
            </div>
          </div>
          
          <div className="w-40 h-4 bg-black/50 rounded-full overflow-hidden border border-cyber-teal/30">
            <div 
              className="h-full bg-gradient-to-r from-cyber-teal to-cyber-magenta"
              style={{ width: `${calcProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>
    
      <div 
        className="w-full h-[550px] bg-cyber-dark/50 rounded-lg border border-cyber-teal/20 overflow-hidden relative"
        aria-label="Neural Maze - Skill exploration game"
      >
        <svg 
          ref={svgRef}
          viewBox={`0 0 ${MAZE_WIDTH} ${MAZE_HEIGHT}`}
          className="w-full h-full cursor-crosshair"
          style={{ background: "rgba(10,10,10,0.9)" }}
          onClick={handleClick}
        >
          {/* Grid background */}
          <g className="grid opacity-30">
            {renderGrid()}
          </g>
          
          {/* Decorative neural patterns */}
          <g className="neural-patterns opacity-20">
            <path 
              d="M0,250 Q200,100 400,300 T700,200" 
              stroke="#00F7FF" 
              strokeWidth="1" 
              fill="none" 
              strokeDasharray="5,10"
            />
            <path 
              d="M0,500 Q300,400 500,100" 
              stroke="#FF00FF" 
              strokeWidth="1" 
              fill="none" 
              strokeDasharray="5,10"
            />
            <circle cx="200" cy="200" r="100" fill="none" stroke="#333" strokeWidth="1" />
            <circle cx="600" cy="500" r="120" fill="none" stroke="#333" strokeWidth="1" />
          </g>
          
          {/* Game obstacles */}
          <g className="obstacles">
            {obstacles.map(obstacle => (
              <rect 
                key={obstacle.id}
                x={obstacle.x - obstacle.size}
                y={obstacle.y - obstacle.size}
                width={obstacle.size * 2}
                height={obstacle.size * 2}
                rx="4"
                fill={obstacle.color}
                className="obstacle"
              />
            ))}
          </g>
          
          {/* Powerups and skills */}
          <g className="entities">
            {skillEntities.map(entity => {
              if (entity.type === 'skill') {
                // Only render discovered skills or undiscovered but nearby skills
                const isNearby = nearbySkills.some(s => s.id === entity.id);
                const shouldRender = entity.discovered || isNearby;
                if (!shouldRender) return null;
                
                return (
                  <g 
                    key={entity.id}
                    onClick={() => handleSkillClick(entity)}
                    style={{ cursor: entity.discovered ? 'pointer' : 'default' }}
                  >
                    {/* Skill node glow effect */}
                    <circle 
                      cx={entity.x}
                      cy={entity.y}
                      r={entity.size * 1.8}
                      fill={entity.color}
                      opacity={0.1}
                      className={entity.discovered ? "animate-pulse-slow" : ""}
                    />
                    
                    {/* Main skill node */}
                    <circle 
                      cx={entity.x}
                      cy={entity.y}
                      r={entity.size}
                      fill={entity.color}
                      fillOpacity={entity.discovered ? 0.8 : 0.3}
                      stroke={entity.explored ? "#FFFFFF" : entity.color}
                      strokeWidth="2"
                      className={isNearby && !entity.discovered ? "animate-pulse-fast" : ""}
                    />
                    
                    {/* Skill icon or question mark */}
                    <foreignObject 
                      x={entity.x - 10} 
                      y={entity.y - 10} 
                      width="20" 
                      height="20"
                    >
                      <div className="h-full w-full flex items-center justify-center">
                        <i className={`fas ${entity.discovered ? entity.icon : 'fa-question'} text-sm text-white`}></i>
                      </div>
                    </foreignObject>
                    
                    {/* Label for discovered skills */}
                    {entity.discovered && (
                      <text 
                        x={entity.x}
                        y={entity.y + entity.size + 15}
                        fontSize="14px"
                        textAnchor="middle"
                        fill={entity.color}
                        className="font-space font-bold"
                      >
                        {entity.id}
                      </text>
                    )}
                    
                    {/* Visual indicators */}
                    {entity.discovered && !entity.explored && (
                      <circle 
                        cx={entity.x}
                        cy={entity.y - entity.size - 10}
                        r="5"
                        fill="#FFFFFF"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              } else if (entity.type === 'powerup') {
                return (
                  <g key={entity.id}>
                    <polygon 
                      points={`
                        ${entity.x},${entity.y - entity.size}
                        ${entity.x + entity.size},${entity.y}
                        ${entity.x},${entity.y + entity.size}
                        ${entity.x - entity.size},${entity.y}
                      `}
                      fill={entity.color}
                      className="animate-pulse"
                    />
                    <foreignObject 
                      x={entity.x - 8} 
                      y={entity.y - 8} 
                      width="16" 
                      height="16"
                    >
                      <div className="h-full w-full flex items-center justify-center">
                        <i className="fas fa-bolt text-xs text-black"></i>
                      </div>
                    </foreignObject>
                  </g>
                );
              }
              return null;
            })}
          </g>
          
          {/* Player character */}
          <g className="player">
            {/* Player glow effect */}
            <circle 
              cx={player.x}
              cy={player.y}
              r={player.size * 1.6}
              fill="url(#player-glow)"
              opacity="0.4"
              className="animate-pulse-slow"
            />
            
            {/* Player body */}
            <circle 
              cx={player.x}
              cy={player.y}
              r={player.size}
              fill={player.color}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            
            {/* Player inner circle */}
            <circle 
              cx={player.x}
              cy={player.y}
              r={player.size * 0.6}
              fill="#FFFFFF"
              fillOpacity="0.8"
            />
            
            {/* Player direction indicator */}
            <line 
              x1={player.x}
              y1={player.y}
              x2={player.x + (targetX - player.x) * 0.5}
              y2={player.y + (targetY - player.y) * 0.5}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeOpacity="0.7"
              strokeLinecap="round"
              style={{
                display: Math.sqrt(Math.pow(targetX - player.x, 2) + Math.pow(targetY - player.y, 2)) > 5 ? 'block' : 'none'
              }}
            />
          </g>
          
          {/* Fog of war layer */}
          <g className="fog-of-war">
            {renderFog()}
          </g>
          
          {/* Definitions */}
          <defs>
            <radialGradient id="player-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor={player.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={player.color} stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        
        {/* Skill detail modal */}
        {skillModal.visible && skillModal.skill && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-cyber-dark border-2 border-cyber-teal/50 rounded-lg max-w-lg w-full p-5 relative">
              <button 
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-gray-800 flex items-center justify-center mr-4 border border-cyber-teal/50">
                  <i className={`fas ${skillModal.skill.icon} text-xl text-cyber-teal`}></i>
                </div>
                <h3 className="text-xl font-space text-cyber-teal">{skillModal.skill.id}</h3>
              </div>
              
              <div className="mb-6 border-l-2 border-cyber-magenta/50 pl-4 py-1">
                <p className="text-gray-300">{skillModal.skill.description}</p>
              </div>
              
              <div className="bg-black/50 p-3 rounded-md">
                <h4 className="text-sm text-cyber-magenta mb-2 font-space">Related Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {skillConnections
                    .filter(conn => conn.from === skillModal.skill!.id || conn.to === skillModal.skill!.id)
                    .map((conn, idx) => {
                      const relatedSkillName = conn.from === skillModal.skill!.id ? conn.to : conn.from;
                      const relatedSkill = skillEntities.find(s => s.id === relatedSkillName);
                      
                      return (
                        <div 
                          key={idx}
                          className={`px-2 py-1 text-xs rounded border ${relatedSkill?.discovered 
                            ? 'border-cyber-teal/50 text-cyber-teal bg-cyber-teal/10 cursor-pointer'
                            : 'border-gray-700 text-gray-500 bg-black/30'}`}
                          onClick={() => {
                            if (relatedSkill?.discovered) {
                              handleCloseModal();
                              // Focus the related skill by moving player there
                              setTargetX(relatedSkill.x);
                              setTargetY(relatedSkill.y);
                              setTimeout(() => {
                                handleSkillClick(relatedSkill);
                              }, 500);
                            }
                          }}
                        >
                          {relatedSkill?.discovered ? relatedSkillName : '???'}
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-cyber-magenta/20 hover:bg-cyber-magenta/30 text-cyber-magenta px-4 py-2 rounded-md border border-cyber-magenta/50 transition-colors"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-4 bg-black/60 rounded-md p-3 text-sm text-gray-300 border border-cyber-teal/20">
        <div className="flex items-center text-cyber-teal mb-2">
          <i className="fas fa-info-circle mr-2"></i>
          <span className="font-space">How To Play:</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <li className="flex items-center">
            <i className="fas fa-mouse-pointer text-cyber-magenta mr-2"></i>
            Click anywhere to move your neural probe
          </li>
          <li className="flex items-center">
            <i className="fas fa-lightbulb text-cyber-magenta mr-2"></i>
            Discover skill nodes by exploring the maze
          </li>
          <li className="flex items-center">
            <i className="fas fa-hand-point-up text-cyber-magenta mr-2"></i>
            Click on discovered skills to learn more
          </li>
          <li className="flex items-center">
            <i className="fas fa-diamond text-cyber-magenta mr-2"></i>
            Collect powerups to reveal nearby skills
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SkillGraph;
