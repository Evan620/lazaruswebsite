import { useState, useEffect } from "react";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "#hero", label: "/home" },
  { href: "#skills", label: "/skills" },
  { href: "#projects", label: "/projects" },
  { href: "#resume", label: "/resume" },
  { href: "#contact", label: "/contact" }
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const targetId = e.currentTarget.getAttribute("href");
    if (targetId) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
      }
    }
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-cyber-dark/80 backdrop-blur-md px-4 lg:px-8 py-3 border-b ${
      scrolled ? "border-cyber-teal/30" : "border-cyber-teal/10"
    } transition-colors duration-300`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyber-teal to-cyber-magenta flex items-center justify-center mr-3">
            <span className="font-space font-bold text-xl">L</span>
          </div>
          <h1 className="terminal-text glow text-xl">LAZARUS_SYSTEM</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={handleNavClick}
              className="terminal-text hover:text-cyber-magenta transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-cyber-teal text-xl focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <i className="fas fa-terminal"></i>
        </button>
      </div>
      
      {/* Mobile navigation */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-cyber-dark/95 border-b border-cyber-teal/30 backdrop-blur-lg transition-all duration-300 ${
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
        <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={handleNavClick}
              className="terminal-text py-2 hover:text-cyber-magenta transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
