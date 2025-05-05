import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useWallet } from '@suiet/wallet-kit';

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
        <LoadingMessage>Loading story details...</LoadingMessage>
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

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 3rem 0;
  color: #636e72;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 3rem 0;
  color: #d63031;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c5ce7;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 2rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const StoryHeader = styled.div`
  margin-bottom: 2rem;
`;

const StoryTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2d3436;
`;

const StoryDescription = styled.p`
  font-size: 1.2rem;
  color: #636e72;
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    grid-column: 1 / 3;
  }
`;

const ScriptContainer = styled.div`
  background-color: #f5f6fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ScriptTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3436;
`;

const ScriptText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2d3436;
`;

const ResponseSection = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #dfe6e9;
`;

const ResponseTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3436;
`;

const ResponseTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #6c5ce7;
  color: #fff;
  border: none;
  
  &:hover {
    background-color: #5649c0;
  }
`;

export default StoryPage;
