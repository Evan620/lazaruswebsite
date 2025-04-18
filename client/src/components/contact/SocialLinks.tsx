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
    url: "https://github.com/Evan620",
    username: "@Evan620"
  },
  {
    icon: "fa-linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/lazarus-magwaro-0067b333a/",
    username: "Lazarus Magwaro"
  },
  {
    icon: "fa-phone",
    name: "Phone",
    url: "tel:+254707892164",
    username: "+254 707 892 164"
  },
  {
    icon: "fa-envelope",
    name: "Email",
    url: "mailto:lazarusgero1@gmail.com",
    username: "lazarusgero1@gmail.com"
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
              <i className={`${link.icon.startsWith('fa-envelope') || link.icon.startsWith('fa-phone') ? 'fas' : 'fab'} ${link.icon}`}></i>
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
