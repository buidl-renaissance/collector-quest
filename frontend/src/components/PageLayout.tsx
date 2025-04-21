import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import NavigationBar from './NavigationBar';

// Page Layout Component
const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <NavigationBar />
    <PageContainer>
      <PageBackground />
      
      {/* Floating elements for visual interest */}
      {[...Array(10)].map((_, i) => (
        <FloatingElement
          key={i}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          size={`${Math.random() * 100 + 50}px`}
          opacity={Math.random() * 0.3 + 0.1}
          animationDuration={`${Math.random() * 10 + 10}s`}
        />
      ))}
      
      <ContentContainer>
        <BackLink href="/">
          <FaArrowLeft /> Back to Gallery
        </BackLink>
        
        <PageTitle>Submit Your Masterpiece</PageTitle>
        <PageSubtitle>Let Lord Smearington Judge Your Creation</PageSubtitle>
        
        {children}
      </ContentContainer>
    </PageContainer>
  </>
);

export default PageLayout;

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0); }
`;

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
`;

const PageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%);
  z-index: -2;
`;

const FloatingElement = styled.div<{ top: string; left: string; size: string; opacity: number; animationDuration: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  background: radial-gradient(circle at center, #805AD5 0%, transparent 70%);
  opacity: ${props => props.opacity};
  z-index: -1;
  animation: ${float} ${props => props.animationDuration} infinite ease-in-out;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #E2E8F0;
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 1rem;
  gap: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #805AD5;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
  text-align: center;
  background: linear-gradient(to right, #805AD5, #D53F8C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.h2`
  font-size: 1.25rem;
  color: #A0AEC0;
  margin-bottom: 3rem;
  text-align: center;
  font-style: italic;
`;
