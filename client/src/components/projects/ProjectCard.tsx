import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div 
      className="cyber-card rounded-lg overflow-hidden project-card" 
      data-categories={project.categories.join(",")}
    >
      <div className="project-thumbnail h-52 relative">
        <div className="project-thumbnail-inner w-full h-full absolute">
          <div className="project-front absolute inset-0">
            {/* We'll use a gradient background instead of an actual image to avoid binary files */}
            <div className="w-full h-full bg-gradient-to-br from-cyber-dark via-black to-cyber-dark/80"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-space text-lg text-white">{project.title}</h3>
            </div>
          </div>
          <div className="project-back absolute inset-0 bg-black/90 p-4 flex flex-col">
            <h3 className="font-space text-lg text-cyber-teal mb-2">Tech Stack</h3>
            <ul className="text-sm text-gray-300 mb-4 flex-1">
              {project.techStack.map((tech, index) => (
                <li key={index} className="mb-1">● {tech}</li>
              ))}
            </ul>
            <div className="flex justify-between items-center">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  className="text-cyber-teal hover:text-cyber-magenta text-sm transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-github mr-1"></i> GitHub
                </a>
              )}
              {project.demoUrl && (
                <a 
                  href={project.demoUrl} 
                  className="text-cyber-teal hover:text-cyber-magenta text-sm transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-external-link-alt mr-1"></i> Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-wrap gap-2">
            {project.categories.map((category, index) => (
              <span 
                key={index} 
                className={`${
                  category === 'ai' || category === 'productivity' 
                    ? 'bg-cyber-magenta/20 text-cyber-magenta' 
                    : category === 'blockchain' || category === 'fintech' || category === 'web3'
                    ? 'bg-[#9945FF]/20 text-[#9945FF]'
                    : category === 'web' || category === 'consultancy'
                    ? 'bg-[#14F195]/20 text-[#14F195]'
                    : category === 'real-estate' || category === 'career'
                    ? 'bg-[#F5A623]/20 text-[#F5A623]'
                    : 'bg-cyber-teal/20 text-cyber-teal'
                } text-xs px-2 py-1 rounded`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            ))}
          </div>
          <div className="text-gray-400 text-sm">{project.year}</div>
        </div>
        <p className="text-gray-300 text-sm mb-4">{project.description}</p>
        <a 
          href={`#project-${project.id}`} 
          className="font-space text-cyber-teal hover:text-cyber-magenta transition-colors flex items-center text-sm"
        >
          access_project --id={project.id}
          <i className="fas fa-arrow-right ml-2"></i>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
