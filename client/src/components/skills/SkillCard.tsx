import { SkillCategory } from "@/lib/types";

interface SkillCardProps {
  category: SkillCategory;
}

const SkillCard = ({ category }: SkillCardProps) => {
  const colorClass = category.color === "teal" ? "text-cyber-teal" : "text-cyber-magenta";
  const dotClass = category.color === "teal" ? "text-cyber-teal" : "text-cyber-magenta";
  
  return (
    <div className="cyber-card rounded-lg p-6">
      <div className={`${colorClass} text-4xl mb-4`}>
        <i className={`fas ${category.icon}`}></i>
      </div>
      <h3 className="font-space text-xl mb-2 cyber-glitch">{category.title}</h3>
      <ul className="text-gray-300 space-y-2">
        {category.skills.map((skill, index) => (
          <li key={index}>
            <span className={dotClass}>●</span> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillCard;
