import React from "react";

interface SocialLink {
  icon: string;
  name: string;
  url: string;
  username: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: "fa-github",
    name: "GitHub",
    url: "#",
    username: "@Lazarus"
  },
  {
    icon: "fa-linkedin",
    name: "LinkedIn",
    url: "#",
    username: "linkedin.com/in/lazarus-dev"
  },
  {
    icon: "fa-twitter",
    name: "Twitter",
    url: "#",
    username: "@LazarusDev"
  },
  {
    icon: "fa-envelope",
    name: "Email",
    url: "mailto:contact@lazarus-dev.com",
    username: "contact@lazarus-dev.com"
  }
];

const SocialLinks = () => {
  return (
    <div className="cyber-card rounded-lg p-8 mb-8">
      <h3 className="font-space text-2xl text-cyber-magenta mb-6">Connection Methods</h3>
      
      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="flex items-center p-3 bg-black/60 hover:bg-cyber-magenta/20 border border-cyber-magenta/30 rounded-md transition-all duration-300 group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-12 h-12 rounded-full bg-cyber-magenta/20 flex items-center justify-center mr-4 text-cyber-magenta text-xl group-hover:bg-cyber-magenta/30">
              <i className={`fab ${link.icon.startsWith('fa-envelope') ? 'fas' : 'fab'} ${link.icon}`}></i>
            </div>
            <div>
              <h4 className="font-space text-cyber-magenta">{link.name}</h4>
              <p className="text-gray-300 text-sm">{link.username}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
