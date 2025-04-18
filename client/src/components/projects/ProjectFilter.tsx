import { useState } from "react";

interface ProjectFilterProps {
  onFilterChange: (filter: string) => void;
  onSearch: (searchTerm: string) => void;
}

const ProjectFilter = ({ onFilterChange, onSearch }: ProjectFilterProps) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 2 || value.length === 0) {
      onSearch(value);
    }
  };
  
  return (
    <div className="mb-8">
      <div className="bg-black/60 rounded-lg border border-cyber-magenta/30 p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="flex-1">
          <label htmlFor="project-filter" className="text-cyber-magenta block mb-2 font-space text-sm">
            AI PROJECT FILTER
          </label>
          <input
            type="text"
            id="project-filter"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-black/60 border border-cyber-magenta/50 text-white rounded-md px-4 py-2 focus:outline-none focus:border-cyber-magenta"
            placeholder="E.g., 'Show me automation projects'"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            className={`${
              activeFilter === "all"
                ? "bg-cyber-magenta/20"
                : "bg-black/60 hover:bg-cyber-magenta/30"
            } border border-cyber-magenta/50 text-cyber-magenta px-4 py-2 rounded-md transition-colors`}
            onClick={() => handleFilterClick("all")}
          >
            All
          </button>
          <button
            className={`${
              activeFilter === "automation"
                ? "bg-cyber-magenta/20"
                : "bg-black/60 hover:bg-cyber-magenta/30"
            } border border-cyber-magenta/50 text-cyber-magenta px-4 py-2 rounded-md transition-colors`}
            onClick={() => handleFilterClick("automation")}
          >
            Automation
          </button>
          <button
            className={`${
              activeFilter === "ai"
                ? "bg-cyber-magenta/20"
                : "bg-black/60 hover:bg-cyber-magenta/30"
            } border border-cyber-magenta/50 text-cyber-magenta px-4 py-2 rounded-md transition-colors`}
            onClick={() => handleFilterClick("ai")}
          >
            AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;
