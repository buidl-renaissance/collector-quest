import React from 'react';
import styled from '@emotion/styled';
import { FaUser, FaHatWizard } from 'react-icons/fa';
import { Race } from '@/data/races';

interface CharacterRacesProps {
  races: Race[];
  onSelectRace?: (race: Race) => void;
  selectedRace?: string;
}
  
const CharacterRaces: React.FC<CharacterRacesProps> = ({ races, onSelectRace, selectedRace }) => {
  
  const handleRaceSelect = (race: Race) => {
    if (onSelectRace) {
      onSelectRace(race);
      localStorage.setItem('selectedRaceId', race.id);
    }
  };

  return (
    <RacesContainer>
      <RacesHeader>
        <RacesIcon><FaUser /></RacesIcon>
        <RacesTitle>Choose Your Race</RacesTitle>
      </RacesHeader>
      
      <RacesCategoryTitle>
        <CategoryIcon><FaHatWizard /></CategoryIcon>
        Core Races (Player&apos;s Handbook)
      </RacesCategoryTitle>
      <RacesGrid>
        {races.map((race) => (
          <RaceCard 
            key={race.name}
            isSelected={selectedRace === race.name}
            onClick={() => handleRaceSelect(race)}
          >
            {race.image && (
              <RaceImageContainer>
                <RaceImage src={race.image} alt={race.name} />
              </RaceImageContainer>
            )}
            <RaceName>{race.name}</RaceName>
            <RaceSource>{race.source}</RaceSource>
            <RaceBio>
              {race.description}
            </RaceBio>
          </RaceCard>
        ))}
      </RacesGrid>

      {/* <RacesCategoryTitle>
        <CategoryIcon><FaHatWizard /></CategoryIcon>
        Expanded Races (Other Official Sourcebooks)
      </RacesCategoryTitle>
      <RacesGrid>
        {races.map((race) => (
          <RaceCard 
            key={race.name}
            isSelected={selectedRace === race.name}
            onClick={() => handleRaceSelect(race)}
          >
            <RaceName>{race.name}</RaceName>
            <RaceSource>{race.source}</RaceSource>
          </RaceCard>
        ))}
      </RacesGrid> */}
    </RacesContainer>
  );
};

const RacesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  background-color: rgba(58, 38, 6, 0.2);
  border-radius: 8px;
  border: 1px solid #bb8930;
`;

const RacesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const RacesIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #bb8930, #b6551c);
  border-radius: 50%;
  color: #fff;
  font-size: 1.2rem;
`;

const RacesTitle = styled.h2`
  font-size: 1.5rem;
  color: #bb8930;
  margin: 0;
`;

const RacesCategoryTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #bb8930;
  margin: 0.5rem 0;
  border-bottom: 1px solid rgba(187, 137, 48, 0.3);
  padding-bottom: 0.5rem;
`;

const CategoryIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bb8930;
`;

const RacesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const RaceImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const RaceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RaceBio = styled.div`
  font-size: 0.8rem;
  color: #bb8930;
  font-style: italic;
  &:hover {
    transform: scale(1.05);
  }
`;

const RaceCard = styled.div<{ isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background-color: ${props => props.isSelected ? 'rgba(187, 137, 48, 0.3)' : 'rgba(58, 38, 6, 0.4)'};
  border: 1px solid ${props => props.isSelected ? '#bb8930' : 'rgba(187, 137, 48, 0.3)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.2);
    border-color: #bb8930;
  }
`;

const RaceName = styled.span`
  font-weight: 600;
  color: #e6e6e6;
`;

const RaceSource = styled.span`
  font-size: 0.6rem;
  color: #78571e;
  font-style: italic;
`;

export default CharacterRaces;
