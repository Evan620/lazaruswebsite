import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`[Portfolio Contact] ${formData.subject}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}\n\n--- Sent from Neural Interface Portfolio ---`
      );
      
      // Open email client with prefilled email
      window.location.href = `mailto:lazarusgero1@gmail.com?subject=${subject}&body=${body}`;
      
      // Success notification
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Clear success message after a delay
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to open email client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="cyber-card rounded-lg p-8">
      <h3 className="font-space text-2xl text-cyber-teal mb-6">Direct Communication Channel</h3>
      
      {submitSuccess && (
        <div className="mb-6 bg-cyber-teal/10 border border-cyber-teal rounded-md p-4 text-cyber-teal">
          <i className="fas fa-check-circle mr-2"></i>
          Email client opened. Please send the message to complete transmission.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-space text-sm text-cyber-teal mb-2">
            YOUR IDENTIFIER
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-black/60 border border-cyber-teal/50 text-white rounded-md px-4 py-2 focus:outline-none focus:border-cyber-teal"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block font-space text-sm text-cyber-teal mb-2">
            NEURAL ENDPOINT (EMAIL)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-black/60 border border-cyber-teal/50 text-white rounded-md px-4 py-2 focus:outline-none focus:border-cyber-teal"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block font-space text-sm text-cyber-teal mb-2">
            TRANSMISSION SUBJECT
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-black/60 border border-cyber-teal/50 text-white rounded-md px-4 py-2 focus:outline-none focus:border-cyber-teal"
            placeholder="Enter message subject"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block font-space text-sm text-cyber-teal mb-2">
            TRANSMISSION CONTENT
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-black/60 border border-cyber-teal/50 text-white rounded-md px-4 py-2 focus:outline-none focus:border-cyber-teal resize-none"
            placeholder="Enter your message"
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-cyber-teal/20 hover:bg-cyber-teal/40 border border-cyber-teal text-cyber-teal font-space py-3 rounded-md transition-all duration-300 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>TRANSMITTING... <i className="fas fa-circle-notch fa-spin ml-2"></i></>
          ) : (
            <>TRANSMIT MESSAGE <i className="fas fa-paper-plane ml-2"></i></>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
