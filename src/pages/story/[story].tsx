import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FaArrowLeft, FaCrown } from 'react-icons/fa';
import { useWallet } from '@suiet/wallet-kit';
import { keyframes } from '@emotion/react';
import { Story } from '@/lib/interfaces';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { story } = context.params || {};
  
  return {
    props: {
      storyId: story,
      metadata: {
        title: `Story | Lord Smearington's Absurd NFT Gallery`,
        description: "Experience an interactive story in this unique realm.",
        image: "/images/story-banner.jpg",
        url: `https://smearington.theethical.ai/story/${story}`,
      },
    },
  };
};

const StoryPage: React.FC<{ storyId: string }> = ({ storyId }) => {
  const router = useRouter();
  const wallet = useWallet();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        
        const storyData: Story = await fetch(`/api/story/${storyId}`)
          .then(res => res.json())
          .then(data => data);
        
        // Mock data
        setStory(storyData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching story details:', err);
        setError('Failed to load story details. Please try again later.');
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStoryDetails();
    }
  }, [storyId]);

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
        <BackLink href={`/realm`}>
          <FaArrowLeft /> Back to Realm
        </BackLink>
      </Container>
    );
  }

  if (!story) {
    return (
      <Container>
        <ErrorMessage>Story not found</ErrorMessage>
        <BackLink href={`/realm`}>
          <FaArrowLeft /> Back to Realm
        </BackLink>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink href={`/realm`}>
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
          {/* Video player component */}
          <video 
            controls 
            width="100%" 
            poster="/images/lord-smearington.jpg"
            src={story.videoUrl}
            autoPlay
            loop
            muted
            playsInline
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
  padding: 1rem;
  font-family: 'Cormorant Garamond', serif;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #C7BFD4;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin: 3rem 0;
  }
`;

const CrownIcon = styled.span`
  color: #FFD700;
  font-size: 1.5rem;
  margin-right: 0.75rem;
  animation: ${pulse} 2s infinite ease-in-out;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-right: 1rem;
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

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3B4C99;
  text-decoration: none;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
    font-size: 1rem;
  }
  
  &:hover {
    color: #5A3E85;
    text-decoration: underline;
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
  
  @media (min-width: 768px) {
    border-radius: 12px;
    grid-column: 1 / 3;
  }
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

const ResponseSection = styled.div`
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

const ResponseTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #FFD700;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const ResponseTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #5A3E85;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: 'Cormorant Garamond', serif;
  resize: vertical;
  margin-bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: #C7BFD4;
  
  @media (min-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2A3A87, #481790);
  color: white;
  padding: 0.5rem 0.9rem;
  border-radius: 4px;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid #FFD700;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  display: inline-block;
  cursor: pointer;
  width: 100%;
  
  @media (min-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    width: auto;
  }
  
  &:hover {
    transform: translateY(-5px);
    background: #481790;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
    color: #FFD700;
  }
`;

export default StoryPage;
