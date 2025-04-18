const Footer = () => {
  return (
    <footer className="bg-black py-8 px-4 border-t border-cyber-teal/20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyber-teal to-cyber-magenta flex items-center justify-center mr-2">
                <span className="font-space font-bold text-sm">L</span>
              </div>
              <h2 className="terminal-text text-lg">LAZARUS_SYSTEM</h2>
            </div>
            <p className="text-gray-400 text-sm mt-2">Advanced automation and AI solutions</p>
          </div>
          
          <div className="mb-6 md:mb-0">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Neural Interface. All systems operational.</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-cyber-teal hover:text-cyber-magenta transition-colors">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="text-cyber-teal hover:text-cyber-magenta transition-colors">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="text-cyber-teal hover:text-cyber-magenta transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-cyber-teal hover:text-cyber-magenta transition-colors">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
