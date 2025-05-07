import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaCrown, FaSpinner } from 'react-icons/fa';
import { Story as StoryInterface } from '@/lib/interfaces';

interface StoryProps {
  story: StoryInterface;
  children?: React.ReactNode;
}

const Story: React.FC<StoryProps> = ({ story, children }) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  if (!story) {
    return <ErrorMessage>Story not found</ErrorMessage>;
  }

  const handleVideoLoaded = () => {
    setIsVideoLoading(false);
  };

  return (
    <StoryContainer>
      <StoryHeader>
        <CrownDivider>
          <FaCrown />
        </CrownDivider>
        <StoryTitle>{story.title}</StoryTitle>
        <StoryDescription>{story.description}</StoryDescription>
      </StoryHeader>
      
      <ContentSection>
        <VideoContainer>
          {isVideoLoading && (
            <VideoLoadingOverlay>
              <LoadingSpinner>
                <FaSpinner />
              </LoadingSpinner>
              <LoadingText>Loading video...</LoadingText>
            </VideoLoadingOverlay>
          )}
          <video 
            width="100%" 
            poster="/images/lord-smearington.jpg"
            src={story.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleVideoLoaded}
          >
            Your browser does not support the video tag.
          </video>
        </VideoContainer>
        
        <ScriptContainer>
          <ScriptTitle>The Story</ScriptTitle>
          <ScriptText>{story.script}</ScriptText>
        </ScriptContainer>
        
        {children}

      </ContentSection>
    </StoryContainer>
  );
};

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StoryContainer = styled.div`
  width: 100%;
  font-family: 'Cormorant Garamond', serif;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem 0;
  color: #FC67FA;
  text-shadow: 0 0 10px rgba(252, 103, 250, 0.5);
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin: 3rem 0;
  }
`;

const CrownDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  color: #FFD700;
  font-size: 1.2rem;
  
  @media (min-width: 768px) {
    margin: 1.5rem 0;
    font-size: 1.5rem;
  }
`;

const StoryHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const StoryTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #fff;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const StoryDescription = styled.p`
  font-size: 1rem;
  color: #C7BFD4;
  line-height: 1.6;
  padding: 0 0.5rem;
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
    padding: 0;
  }
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid #FFD700;
  grid-column: 1;
  position: relative;
  
  @media (min-width: 768px) {
    border-radius: 12px;
    grid-column: 1 / 3;
  }
`;

const VideoLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('/images/lord-smearington.jpg');
  background-size: cover;
  background-position: center;
  z-index: 10;
  opacity: 0.5;
  max-height: 200px;

  @media (min-width: 768px) {
    max-height: auto;
  }
`;

const LoadingSpinner = styled.div`
  color: #FFD700;
  font-size: 2rem;
  animation: ${spin} 1.5s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #FFD700;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const ScriptContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }
`;

const ScriptTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #FFD700;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const ScriptText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #C7BFD4;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.8;
  }
`;

export default Story;
