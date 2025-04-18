import { useState } from "react";
import ResumeToggle from "./ResumeToggle";
import { 
  workExperience, 
  softSkills, 
  techSkills, 
  achievementStats,
  executiveSummary
} from "@/lib/data";
import { ResumeMode } from "@/lib/types";

const DynamicResume = () => {
  const [activeMode, setActiveMode] = useState<ResumeMode>("hr");
  
  return (
    <section id="resume" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-space text-3xl mb-2">
            CAREER <span className="text-cyber-teal glow">TRAJECTORY</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Adaptive resume with contextual views based on your professional requirements.
          </p>
        </div>
        
        <ResumeToggle activeMode={activeMode} onModeChange={setActiveMode} />
        
        <div className="cyber-card rounded-lg p-8 mb-10">
          {/* HR Manager View */}
          {activeMode === "hr" && (
            <div className="resume-content">
              <div className="mb-8">
                <h3 className="font-space text-2xl text-cyber-teal mb-4">Professional Summary</h3>
                <p className="text-gray-300">
                  Solutions-oriented automation engineer with 7+ years of experience building scalable systems that drive operational efficiency. Strong collaborator with excellent team leadership skills and a focus on mentoring junior talent.
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="font-space text-2xl text-cyber-teal mb-4">Work Experience</h3>
                
                <div className="border-l-2 border-cyber-teal/50 pl-6 space-y-8">
                  {workExperience.map((job, index) => (
                    <div className="relative" key={index}>
                      <div className={`absolute -left-8 top-0 w-4 h-4 rounded-full ${
                        job.level === "current" ? "bg-cyber-teal" : "bg-cyber-teal/60"
                      }`}></div>
                      <h4 className="font-space text-xl">{job.title}</h4>
                      <p className="text-cyber-magenta mb-1">{job.company} • {job.period}</p>
                      <ul className="text-gray-300 space-y-2 mt-3">
                        {job.achievements.hr.map((achievement, i) => (
                          <li key={i}>• {achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-space text-2xl text-cyber-teal mb-4">Soft Skills</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {softSkills.map((skill, index) => (
                    <div className="bg-cyber-teal/10 border border-cyber-teal/30 rounded-md p-3 text-center" key={index}>
                      <div className="text-cyber-teal text-2xl mb-2">
                        <i className={`fas ${skill.icon}`}></i>
                      </div>
                      <p className="text-gray-300">{skill.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* CTO View */}
          {activeMode === "cto" && (
            <div className="resume-content">
              <div className="mb-8">
                <h3 className="font-space text-2xl text-cyber-teal mb-4">Technical Profile</h3>
                <p className="text-gray-300">
                  Automation architect with deep expertise in cloud-native infrastructure, data pipelines, and AI integration. Specialized in high-performance, scalable systems with a focus on operational reliability and security.
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="font-space text-2xl text-cyber-teal mb-4">Technical Experience</h3>
                
                <div className="border-l-2 border-cyber-teal/50 pl-6 space-y-8">
                  {workExperience.map((job, index) => (
                    <div className="relative" key={index}>
                      <div className={`absolute -left-8 top-0 w-4 h-4 rounded-full ${
                        job.level === "current" ? "bg-cyber-teal" : "bg-cyber-teal/60"
                      }`}></div>
                      <h4 className="font-space text-xl">{job.title}</h4>
                      <p className="text-cyber-magenta mb-1">{job.company} • {job.period}</p>
                      <ul className="text-gray-300 space-y-2 mt-3">
                        {job.achievements.cto.map((achievement, i) => (
                          <li key={i}>• {achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-space text-2xl text-cyber-teal mb-4">Technical Expertise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {techSkills.map((category, index) => (
                    <div className="bg-cyber-teal/10 border border-cyber-teal/30 rounded-md p-4" key={index}>
                      <h4 className="font-space text-lg text-cyber-teal mb-2">{category.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, i) => (
                          <span className="bg-cyber-teal/20 text-cyber-teal px-2 py-1 rounded text-sm" key={i}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Executive Summary View */}
          {activeMode === "summary" && (
            <div className="resume-content">
              <div className="mb-8">
                <h3 className="font-space text-2xl text-cyber-teal mb-4">Executive Overview</h3>
                <p className="text-gray-300">
                  Strategic automation architect delivering quantifiable business impact through innovative technical solutions. Specialized in translating business requirements into scalable, efficient systems.
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="font-space text-2xl text-cyber-teal mb-4">Key Achievements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {executiveSummary.stats.map((stat, index) => (
                    <div className="cyber-card rounded-lg p-5" key={index}>
                      <div className="text-cyber-magenta text-4xl mb-3">{stat.value}</div>
                      <h4 className="font-space text-lg mb-2">{stat.label}</h4>
                      <p className="text-gray-300 text-sm">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-space text-2xl text-cyber-teal mb-4">Leadership & Vision</h3>
                <div className="cyber-card rounded-lg p-5">
                  <p className="text-gray-300 mb-4">
                    Strategic technical leader with a proven track record of aligning technology initiatives with business objectives. Expertise in building cross-functional teams and fostering innovation culture.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {executiveSummary.leadership.map((item, index) => (
                      <div className="text-center" key={index}>
                        <div className="text-cyber-teal text-3xl mb-2">
                          <i className={`fas ${item.icon}`}></i>
                        </div>
                        <h5 className="font-space text-lg mb-1">{item.title}</h5>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-10">
          <h3 className="font-space text-2xl text-cyber-teal mb-6">Achievement Heatmap</h3>
          <div className="cyber-card rounded-lg p-6">
            <div className="h-64 w-full">
              {/* Calendar heatmap visualization placeholder */}
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-300">
                  JavaScript heatmap visualization of coding activity and achievements.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-8">
              {achievementStats.map((stat, index) => (
                <div className="text-center" key={index}>
                  <div className="text-3xl font-space text-cyber-teal mb-1">{stat.value}</div>
                  <p className="text-gray-300 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicResume;
