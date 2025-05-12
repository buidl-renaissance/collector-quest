import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <div style={{ 
      opacity: 1,
      transition: 'opacity 0.5s ease-in-out'
    }}>
      {children}
    </div>
  );
};

export default PageTransition;
