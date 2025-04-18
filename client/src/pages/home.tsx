import { useRef, useState } from "react";
import Terminal from "@/components/terminal/Terminal";
import AiGreeter from "@/components/terminal/AiGreeter";
import SkillGraph from "@/components/skills/SkillGraph";
import SkillCard from "@/components/skills/SkillCard";
import ProjectFilter from "@/components/projects/ProjectFilter";
import ProjectCard from "@/components/projects/ProjectCard";
import DynamicResume from "@/components/resume/DynamicResume";
import ContactForm from "@/components/contact/ContactForm";
import SocialLinks from "@/components/contact/SocialLinks";
import { skillCategories, projects } from "@/lib/data";

const Home = () => {
  // Refs for scrolling to sections
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const resumeRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  
  // State for project filtering
  const [filteredProjects, setFilteredProjects] = useState(projects);
  
  // Handle terminal navigation
  const handleTerminalCommand = (command: string) => {
    const cmd = command.toLowerCase();
    
    if (cmd.includes("skills")) {
      skillsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (cmd.includes("projects")) {
      projectsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (cmd.includes("resume")) {
      resumeRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (cmd.includes("contact")) {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  // Handle AI assistant navigation
  const handleAiNavigation = (section: string) => {
    if (section === "skills") {
      skillsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (section === "projects") {
      projectsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (section === "resume") {
      resumeRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (section === "contact") {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  // Handle project filtering
  const handleProjectFilter = (filter: string) => {
    if (filter === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(project => project.categories.includes(filter))
      );
    }
  };
  
  // Handle project search
  const handleProjectSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    setFilteredProjects(
      projects.filter(
        project =>
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.categories.some(cat => cat.toLowerCase().includes(term))
      )
    );
  };
  
  return (
    <main>
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-7/12 mb-10 md:mb-0">
              <Terminal onCommandExecuted={handleTerminalCommand} />
            </div>
            
            <div className="w-full md:w-4/12 relative">
              <AiGreeter onNavigationRequest={handleAiNavigation} />
              
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyber-magenta/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyber-teal/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="font-space text-3xl mb-4">
              Cybernetic <span className="text-cyber-teal glow">Portfolio</span> Interface
            </h2>
            <p className="max-w-2xl mx-auto text-gray-300 mb-8">
              Advanced automation engineer specializing in Python development, AWS infrastructure, data pipelines, and AI integration.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#skills"
                onClick={(e) => {
                  e.preventDefault();
                  skillsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 bg-cyber-teal/20 hover:bg-cyber-teal/30 border border-cyber-teal text-cyber-teal rounded-md transition-all duration-300 font-space"
              >
                Explore Skills <i className="fas fa-network-wired ml-2"></i>
              </a>
              <a 
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  projectsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 bg-cyber-magenta/20 hover:bg-cyber-magenta/30 border border-cyber-magenta text-cyber-magenta rounded-md transition-all duration-300 font-space"
              >
                View Projects <i className="fas fa-code-branch ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section ref={skillsRef} id="skills" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-space text-3xl mb-2">
              SKILL <span className="text-cyber-teal glow">MATRIX</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Interactive neural network of interconnected technologies and proficiencies.
            </p>
          </div>
          
          <SkillGraph />
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <SkillCard key={index} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section ref={projectsRef} id="projects" className="py-20 px-4 bg-gradient-to-b from-cyber-dark to-black relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-cyber-dark to-transparent"></div>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-space text-3xl mb-2">
              PROJECT <span className="text-cyber-magenta magenta-glow">ARCHIVES</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Browse the collection of automated systems, AI integrations, and development projects.
            </p>
          </div>
          
          <ProjectFilter 
            onFilterChange={handleProjectFilter} 
            onSearch={handleProjectSearch}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
          
          {filteredProjects.length > 0 && filteredProjects.length < projects.length && (
            <div className="text-center mt-8">
              <p className="text-gray-400">
                Showing {filteredProjects.length} of {projects.length} projects
              </p>
            </div>
          )}
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-cyber-magenta text-5xl mb-4">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="font-space text-xl mb-2">No matching projects found</h3>
              <p className="text-gray-300">Try adjusting your search criteria</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <a href="#" className="inline-block px-8 py-3 bg-cyber-magenta/20 hover:bg-cyber-magenta/40 border border-cyber-magenta text-cyber-magenta rounded-md transition-all duration-300 font-space">
              Load More Projects <i className="fas fa-terminal ml-2"></i>
            </a>
          </div>
        </div>
      </section>
      
      {/* Resume Section */}
      <DynamicResume />
      
      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="py-20 px-4 bg-gradient-to-t from-black to-cyber-dark relative">
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-space text-3xl mb-2">
              NEURAL <span className="text-cyber-magenta magenta-glow">LINKUP</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Connect with me for collaboration, opportunities, or technical discussions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ContactForm />
            
            <div>
              <SocialLinks />
              
              <div className="cyber-card rounded-lg p-8">
                <h3 className="font-space text-2xl text-cyber-teal mb-6">Location Matrix</h3>
                <div className="relative h-64 rounded-md overflow-hidden border border-cyber-teal/30">
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-cyber-teal text-5xl mb-4">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <p className="font-space text-xl text-cyber-teal">GRID: NAIROBI, KENYA</p>
                      <p className="text-gray-300 text-sm mt-2">Remote operations available globally</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
