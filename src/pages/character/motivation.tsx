import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import styled from '@emotion/styled';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import MotivationalFusion from '@/components/MotivationalFusion';
import { CharacterClass, getCharacterClassById } from '@/data/classes';
import { getRaceById } from '@/db/races';
import { Race } from '@/data/races';

interface MotivationPageProps {
  race: Race | null;
  class: CharacterClass | null;
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { race, class: characterClass } = context.query;

  if (!race || !characterClass) {
    return {
      redirect: {
        destination: '/character/race',
        permanent: false,
      },
    };
  }

  const dbRace = await getRaceById(race as string);
  const dbClass = await getCharacterClassById(characterClass as string);

  return {
    props: { race: dbRace, class: dbClass },
  };
};

const MotivationPage: NextPage<MotivationPageProps> = ({
  race,
  class: characterClass
}: MotivationPageProps) => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to race selection if no race is selected
    if (!race) {
      router.push('/character/race');
    }
  }, [race, router]);

  const handleBack = () => {
    router.push(`/character/bio?race=${race}&class=${characterClass}`);
  };

  const handleNext = () => {
    router.push(`/character/summary?race=${race}&class=${characterClass}`);
  };

  return (
    <>
      <NextSeo
        title="Character Motivation | Lord Smearington's Gallery"
        description="Define what drives your character in Lord Smearington's Gallery"
      />
      <Container>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Bio
        </BackButton>
        
        <Title>Character Motivation</Title>
        <Subtitle>What drives your character? What are they seeking in Lord Smearington&apos;s Gallery?</Subtitle>
        
        <MotivationalFusion />
        
        <NavigationButtons>
          <NavButton onClick={handleBack}>
            <FaArrowLeft /> Previous
          </NavButton>
          <NavButton onClick={handleNext}>
            Next <FaArrowRight />
          </NavButton>
        </NavigationButtons>
      </Container>
    </>
  );
};

export default MotivationPage;

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #7f8c8d;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #3498db;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;
