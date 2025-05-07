import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { FaArrowLeft, FaCrown } from 'react-icons/fa';
import { Race } from '@/data/races';
import { getRaceById } from '@/db/races';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { race } = context.params || {};
  
  if (!race || typeof race !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const raceData = await getRaceById(race);
    
    if (!raceData) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        race: raceData,
        metadata: {
          title: `${raceData.name} | Collector Quest`,
          description: raceData.description,
          image: raceData.image || "/images/default-race.jpg",
          url: `https://collectorquest.theethical.ai/character/race/${race}`,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching race data:", error);
    return {
      notFound: true,
    };
  }
};

interface RaceDetailsPageProps {
  race: Race;
}

const RaceDetailsPage: React.FC<RaceDetailsPageProps> = ({ race }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          Loading race details...
        </LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink href="/character/race">
        <FaArrowLeft /> Back to Races
      </BackLink>
      
      <Title>{race.name}</Title>
      <Subtitle>From {race.source}</Subtitle>
      
      <RaceDetails>
        {race.image && (
          <RaceImage src={race.image} alt={race.name} />
        )}
        
        <RaceInfo>
          <RaceDescription>{race.description}</RaceDescription>
          
          {/* {race.traits && race.traits.length > 0 && (
            <TraitsSection>
              <SectionTitle>Traits</SectionTitle>
              <TraitsList>
                {race.traits.map((trait, index) => (
                  <TraitItem key={index}>
                    <TraitName>{trait.name}</TraitName>
                    <TraitDescription>{trait.description}</TraitDescription>
                  </TraitItem>
                ))}
              </TraitsList>
            </TraitsSection>
          )} */}
          
          <ButtonContainer>
            <ModifyButton href={`/character/race/${race.id}/modify`}>
              Customize Character Image
            </ModifyButton>
            <SelectButton onClick={() => router.push('/explore')}>
              Select This Race
            </SelectButton>
          </ButtonContainer>
        </RaceInfo>
      </RaceDetails>
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Cormorant Garamond', serif;
  animation: ${fadeIn} 0.5s ease-in;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 2rem;
  color: #bb8930;
  text-decoration: none;
  transition: color 0.3s;
  
  &:hover {
    color: #d4a959;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #C7BFD4;
  margin-bottom: 2rem;
  font-style: italic;
`;

const RaceDetails = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RaceImage = styled.img`
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const RaceInfo = styled.div`
  flex: 1;
`;

const RaceDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #E0DDE5;
  margin-bottom: 2rem;
`;

const TraitsSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #bb8930;
  margin-bottom: 1rem;
  border-bottom: 1px solid #3a3347;
  padding-bottom: 0.5rem;
`;

const TraitsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TraitItem = styled.li`
  margin-bottom: 1.5rem;
`;

const TraitName = styled.h3`
  font-size: 1.3rem;
  color: #d4a959;
  margin-bottom: 0.5rem;
`;

const TraitDescription = styled.p`
  font-size: 1rem;
  color: #E0DDE5;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModifyButton = styled(Link)`
  padding: 0.8rem 1.5rem;
  background-color: #3a3347;
  color: #E0DDE5;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;
  
  &:hover {
    background-color: #4a4357;
  }
`;

const SelectButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #bb8930;
  color: #1a1625;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #d4a959;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  font-size: 1.5rem;
  color: #bb8930;
`;

const CrownIcon = styled.span`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

export default RaceDetailsPage;
