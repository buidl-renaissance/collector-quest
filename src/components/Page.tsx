import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import NavigationBar from './NavigationBar';

interface PageProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showNavigation?: boolean;
  darkMode?: boolean;
  width?: PageWidth;
}

type PageWidth = 'narrow' | 'default' | 'wide';

const Page: React.FC<PageProps> = ({
  children,
  title,
  subtitle,
  showNavigation = false,
  darkMode = true,
  width = 'default',
}) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    },
  };

  return (
    <PageContainer darkMode={darkMode}>
      {showNavigation && <NavigationBar />}
      
      <PageContent
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        width={width}
      >
        {title && <PageTitle>{title}</PageTitle>}
        {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
        {children}
      </PageContent>
    </PageContainer>
  );
};

const PageContainer = styled.div<{ darkMode: boolean }>`
  min-height: 100vh;
  background-color: ${props => props.darkMode ? '#1a1a2e' : '#f5f5f7'};
  color: ${props => props.darkMode ? '#E0DDE5' : '#333'};
  transition: background-color 0.3s, color 0.3s;
  font-family: "Cormorant Garamond", serif;
`;

const PageContent = styled(motion.main)<{ width: PageWidth }>`
  max-width: ${props => props.width === 'narrow' ? '800px' : props.width === 'wide' ? '1200px' : '1000px'};
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 80px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const PageSubtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.8;
`;

export default Page;
