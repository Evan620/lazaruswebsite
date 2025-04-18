import { ResumeMode } from "@/lib/types";

interface ResumeToggleProps {
  activeMode: ResumeMode;
  onModeChange: (mode: ResumeMode) => void;
}

const ResumeToggle = ({ activeMode, onModeChange }: ResumeToggleProps) => {
  return (
    <div className="bg-black/60 border border-cyber-teal/30 rounded-lg mb-10 p-6">
      <h3 className="font-space text-xl mb-6">Resume Perspective:</h3>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => onModeChange("hr")}
          className={`px-6 py-3 ${
            activeMode === "hr"
              ? "bg-cyber-teal/20 text-cyber-teal"
              : "bg-black/60 text-gray-300 hover:text-cyber-teal"
          } hover:bg-cyber-teal/30 border ${
            activeMode === "hr" ? "border-cyber-teal" : "border-cyber-teal/30"
          } rounded-md transition-all duration-300 font-space`}
        >
          HR Manager View
        </button>
        <button
          onClick={() => onModeChange("cto")}
          className={`px-6 py-3 ${
            activeMode === "cto"
              ? "bg-cyber-teal/20 text-cyber-teal"
              : "bg-black/60 text-gray-300 hover:text-cyber-teal"
          } hover:bg-cyber-teal/30 border ${
            activeMode === "cto" ? "border-cyber-teal" : "border-cyber-teal/30"
          } rounded-md transition-all duration-300 font-space`}
        >
          CTO View
        </button>
        <button
          onClick={() => onModeChange("summary")}
          className={`px-6 py-3 ${
            activeMode === "summary"
              ? "bg-cyber-teal/20 text-cyber-teal"
              : "bg-black/60 text-gray-300 hover:text-cyber-teal"
          } hover:bg-cyber-teal/30 border ${
            activeMode === "summary" ? "border-cyber-teal" : "border-cyber-teal/30"
          } rounded-md transition-all duration-300 font-space`}
        >
          Executive Summary
        </button>
      </div>
    </div>
  );
};

export default ResumeToggle;
