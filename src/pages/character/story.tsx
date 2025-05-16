import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useStoryGenerator } from '@/hooks/useStoryGenerator';
import { Character, useCharacter } from '@/hooks/useCharacter';
import Head from 'next/head';
import { Title, Subtitle } from '@/components/styled/character';
import PageTransition from '@/components/PageTransition';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Cormorant Garamond', serif;
  animation: ${fadeIn} 0.5s ease-in;
`;

const Section = styled.div`
  background-color: rgba(26, 26, 46, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #bb8930;
  animation: ${slideUp} 0.5s ease-out;
`;

const SectionTitle = styled.h2`
  color: #bb8930;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-family: 'Cormorant Garamond', serif;
`;

const ContentBox = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 4px;
  line-height: 1.6;
`;

const StoryContent = styled(ContentBox)`
  white-space: pre-wrap;
`;

const Button = styled.button<{ primary?: boolean }>`
  background: ${(props) => (props.primary ? "#bb8930" : "#4a4a6a")};
  color: ${(props) => (props.primary ? "#1a1a1a" : "#ffffff")};
  border: 2px solid ${(props) => (props.primary ? "#bb8930" : "#4a4a6a")};
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: ${(props) => (props.primary ? "#d4a959" : "#5a5a7a")};
    border-color: ${(props) => (props.primary ? "#d4a959" : "#5a5a7a")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
  text-align: center;
  width: 100%;
`;

const ProgressBar = styled.div`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  height: 8px;
  margin-top: 0.5rem;
`;

const ProgressIndicator = styled.div`
  background-color: #bb8930;
  height: 100%;
  border-radius: 8px;
  width: 25%;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  border-left: 3px solid #ff6b6b;
`;

export default function CharacterStoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const { character } = useCharacter();
  const { generateStory, isLoading, story, progress, error: storyError } = useStoryGenerator();

  useEffect(() => {
    if (character && !isLoading && !story) {
      generateStory();
    }
  }, [character, isLoading, story, generateStory]);
  
  if (!character) {
    return <Container>Character not found</Container>;
  }

  return (
    <PageTransition>
      <Container>
        <Head>
          <title>{character.name}&apos;s Story</title>
        </Head>
        
        <Title>{character.name}&apos;s Story</Title>
        
        <Section>
          <SectionTitle>Motivation</SectionTitle>
          <ContentBox>
            {character.motivation || "No motivation provided"}
          </ContentBox>
        </Section>
        
        <Section>
          <SectionTitle>Backstory</SectionTitle>
          <ContentBox>
            {character.backstory || "No backstory provided"}
          </ContentBox>
        </Section>

      </Container>
    </PageTransition>
  );
}
