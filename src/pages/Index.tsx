
import React, { useEffect, useRef } from "react";
import MeetingForm from "@/components/MeetingForm";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  // Subtle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      
      const scrollPosition = window.scrollY;
      headerRef.current.style.transform = `translateY(${scrollPosition * 0.3}px)`;
      headerRef.current.style.opacity = `${1 - scrollPosition * 0.003}`;
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden dark:bg-gray-900 transition-colors duration-300">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10 transition-colors duration-300" />
      
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.03] bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:20px_20px] dark:opacity-[0.05] -z-10" />
      
      <div className="flex-1 flex flex-col">
        {/* Header with theme toggle */}
        <header className="w-full py-12 md:py-20 px-6 relative">
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <ThemeToggle />
          </div>
          
          <div 
            ref={headerRef}
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium mb-3 transition-colors duration-300">
                MEETING COSTS MATTER
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
                Calculate Your Meeting Costs
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
                Track the financial impact of your meetings in real time. 
                Input the details and instantly see how much time and resources are being spent.
              </p>
            </motion.div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
          <MeetingForm />
          
          {/* Additional information */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-20 mb-12 max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-semibold mb-4 dark:text-white transition-colors duration-300">Why Calculate Meeting Costs?</h2>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Meetings are essential for collaboration but come at a cost. 
              By understanding the financial impact of your meetings, 
              you can make more informed decisions about scheduling, 
              attendance, and duration to optimize productivity and resource allocation.
            </p>
          </motion.section>
        </main>
        
        {/* Footer */}
        <footer className="w-full py-8 px-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            &copy; {new Date().getFullYear()} Meeting Cost Calculator
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
