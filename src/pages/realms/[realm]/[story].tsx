import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FaArrowLeft, FaCrown } from 'react-icons/fa';
import { useWallet } from '@suiet/wallet-kit';
import { keyframes } from '@emotion/react';

interface Story {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  script: string;
  realmId: string;
  createdAt: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { realm, story } = context.params || {};
  
  return {
    props: {
      realmId: realm,
      storyId: story,
      metadata: {
        title: `Story | Lord Smearington's Absurd NFT Gallery`,
        description: "Experience an interactive story in this unique realm.",
        image: "/images/story-banner.jpg",
        url: `https://smearington.theethical.ai/realms/${realm}/${story}`,
      },
    },
  };
};

const StoryPage: React.FC<{ realmId: string; storyId: string }> = ({ realmId, storyId }) => {
  const router = useRouter();
  const wallet = useWallet();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        // In a real implementation, this would fetch story data from your API or blockchain
        // For now, we'll simulate a response with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStory({
          id: storyId as string,
          title: "The Mystery of the Enchanted Canvas",
          description: "A tale of art that comes to life under the moonlight",
          videoUrl: "https://example.com/videos/enchanted-canvas.mp4",
          script: "In the dimly lit gallery of Lord Smearington, there hangs a peculiar canvas. Visitors claim that at midnight, the figures in the painting begin to move, whispering secrets of the realm. What would you do if you witnessed this phenomenon?",
          realmId: realmId as string,
          createdAt: new Date().toISOString(),
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching story details:', err);
        setError('Failed to load story details. Please try again later.');
        setLoading(false);
      }
    };

    if (realmId && storyId) {
      fetchStoryDetails();
    }
  }, [realmId, storyId]);

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(e.target.value);
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      return;
    }

    if (!wallet.connected) {
      alert('Please connect your wallet to respond to this story');
      return;
    }

    try {
      // In a real implementation, this would submit the response to your API or blockchain
      console.log('Submitting response:', response);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Your response has been recorded!');
      setResponse('');
    } catch (err) {
      console.error('Error submitting response:', err);
      alert('Failed to submit your response. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          Loading story details...
        </LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <BackLink href={`/realms/${realmId}`}>
          <FaArrowLeft /> Back to Realm
        </BackLink>
      </Container>
    );
  }

  if (!story) {
    return (
      <Container>
        <ErrorMessage>Story not found</ErrorMessage>
        <BackLink href={`/realms/${realmId}`}>
          <FaArrowLeft /> Back to Realm
        </BackLink>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink href={`/realms/${realmId}`}>
        <FaArrowLeft /> Back to Realm
      </BackLink>
      
      <StoryHeader>
        <CrownDivider>
          <FaCrown />
        </CrownDivider>
        <StoryTitle>{story.title}</StoryTitle>
        <StoryDescription>{story.description}</StoryDescription>
      </StoryHeader>
      
      <ContentSection>
        <VideoContainer>
          {/* Replace with actual video player component */}
          <video 
            controls 
            width="100%" 
            poster="/images/video-placeholder.jpg"
            src={story.videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </VideoContainer>
        
        <ScriptContainer>
          <ScriptTitle>The Story</ScriptTitle>
          <ScriptText>{story.script}</ScriptText>
        </ScriptContainer>
        
        <ResponseSection>
          <ResponseTitle>Your Response</ResponseTitle>
          <ResponseTextarea 
            value={response}
            onChange={handleResponseChange}
            placeholder="How would you respond to this story?"
            rows={5}
          />
          <SubmitButton onClick={handleSubmitResponse}>
            Submit Response
          </SubmitButton>
        </ResponseSection>
      </ContentSection>
    </Container>
  );
};

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Cormorant Garamond', serif;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #C7BFD4;
  margin: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CrownIcon = styled.span`
  color: #FFD700;
  font-size: 1.8rem;
  margin-right: 1rem;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const CrownDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  color: #FFD700;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin: 3rem 0;
  color: #FC67FA;
  text-shadow: 0 0 10px rgba(252, 103, 250, 0.5);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3B4C99;
  text-decoration: none;
  font-weight: 700;
  margin-bottom: 2rem;
  font-family: 'Cormorant Garamond', serif;
  
  &:hover {
    color: #5A3E85;
    text-decoration: underline;
  }
`;

const StoryHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const StoryTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #fff;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const StoryDescription = styled.p`
  font-size: 1.2rem;
  color: #C7BFD4;
  line-height: 1.6;
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid #FFD700;
  
  @media (min-width: 768px) {
    grid-column: 1 / 3;
  }
`;

const ScriptContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const ScriptTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #FFD700;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
`;

const ScriptText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #C7BFD4;
`;

const ResponseSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const ResponseTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #FFD700;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
`;

const ResponseTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #5A3E85;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Cormorant Garamond', serif;
  resize: vertical;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #C7BFD4;
  
  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2A3A87, #481790);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid #FFD700;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.8rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  display: inline-block;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    background: #481790;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
    color: #FFD700;
  }
`;

export default StoryPage;
