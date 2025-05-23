import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FaArrowLeft, FaCrown } from 'react-icons/fa';
import { useWallet } from '@suiet/wallet-kit';
import { keyframes } from '@emotion/react';
import { Story as StoryInterface } from '@/lib/interfaces';
import Story from '@/components/Story';
import BuildCharacter, { Character } from '@/components/BuildCharacter';
import PreRegisterPage from '../pre-register';
import PreRegister from '@/components/PreRegister';
import { Title } from '@/components/styled/character';
import { markStoryAsVisited } from '@/lib/visited';

export const getServerSideProps: GetServerSideProps = async (context) => {  
  return {
    props: {
      storyId: 'quest',
      metadata: {
        title: `Story | Lord Smearington's Absurd NFT Gallery`,
        description: "Experience an interactive story in this unique realm.",
        image: "/images/story-banner.jpg",
        url: `https://smearington.theethical.ai/story/quest`,
      },
    },
  };
};

const StoryPage: React.FC<{ storyId: string }> = ({ storyId }) => {
  const router = useRouter();
  const wallet = useWallet();
  const [story, setStory] = useState<StoryInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        
        const storyData: StoryInterface = await fetch(`/api/story/${storyId}`)
          .then(res => res.json())
          .then(data => data);
        
        // Mock data
        setStory(storyData);
        
        markStoryAsVisited(storyData.slug);

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

  const handleCharacterCreated = (character: Character) => {
    console.log('Character created:', character);
    router.push('/explore');
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
      <Story story={story} hideDescription={true} />
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

export default StoryPage;
