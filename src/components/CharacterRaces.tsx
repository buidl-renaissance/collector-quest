import React from 'react';
import styled from '@emotion/styled';
import { FaUser, FaHatWizard } from 'react-icons/fa';
import { Race, coreRaces, expandedRaces } from '@/data/races';

interface CharacterRacesProps {
  onSelectRace?: (race: Race) => void;
  selectedRace?: string;
}
  
const CharacterRaces: React.FC<CharacterRacesProps> = ({ onSelectRace, selectedRace }) => {
  
  const handleRaceSelect = (race: Race) => {
    if (onSelectRace) {
      onSelectRace(race);
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
        {coreRaces.map((race) => (
          <RaceCard 
            key={race.name}
            isSelected={selectedRace === race.name}
            onClick={() => handleRaceSelect(race)}
          >
            <RaceName>{race.name}</RaceName>
            <RaceSource>{race.source}</RaceSource>
            <RaceBio>
              {race.name === "Human" && "Versatile and ambitious, humans adapt to any environment and excel through determination."}
              {race.name === "Elf" && "Ancient and graceful, elves live in harmony with nature, mastering magic and archery over their long lives."}
              {race.name === "Dwarf" && "Stout and sturdy, dwarves are master craftsmen with unmatched resilience and a deep connection to stone."}
              {race.name === "Halfling" && "Small in stature but big in heart, halflings value comfort, community, and have extraordinary luck."}
              {race.name === "Dragonborn" && "Proud draconic humanoids with breath weapons and scales, honoring their ancient heritage."}
              {race.name === "Gnome" && "Curious and clever tinkerers with boundless enthusiasm and a natural affinity for illusion magic."}
              {race.name === "Half-Elf" && "Blending elven grace with human versatility, half-elves excel as diplomats between worlds."}
              {race.name === "Half-Orc" && "Combining human adaptability with orcish strength, half-orcs are formidable warriors with indomitable endurance."}
              {race.name === "Tiefling" && "Bearing infernal heritage, tieflings overcome prejudice with cunning intellect and arcane talent."}
            </RaceBio>
          </RaceCard>
        ))}
      </RacesGrid>

      <RacesCategoryTitle>
        <CategoryIcon><FaHatWizard /></CategoryIcon>
        Expanded Races (Other Official Sourcebooks)
      </RacesCategoryTitle>
      <RacesGrid>
        {expandedRaces.map((race) => (
          <RaceCard 
            key={race.name}
            isSelected={selectedRace === race.name}
            onClick={() => handleRaceSelect(race)}
          >
            <RaceName>{race.name}</RaceName>
            <RaceSource>{race.source}</RaceSource>
          </RaceCard>
        ))}
      </RacesGrid>
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

const RaceBio = styled.div`
  font-size: 0.8rem;
  color: #bb8930;
  font-style: italic;
`;

const CategoryIcon = styled.span`
  color: #bb8930;
  font-size: 1rem;
`;

const RacesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
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
