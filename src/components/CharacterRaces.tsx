import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { FaUser, FaBook, FaTimes } from 'react-icons/fa';
import { Race } from '@/data/races';

interface CharacterRacesProps {
  races: Race[];
  onSelectRace?: (race: Race) => void;
  selectedRace?: string;
}

const CharacterRaces: React.FC<CharacterRacesProps> = ({ races, onSelectRace, selectedRace }) => {
  const [modalRace, setModalRace] = useState<Race | null>(null);
  
  const handleRaceSelect = (race: Race) => {
    if (onSelectRace) {
      onSelectRace(race);
      localStorage.setItem('selectedRaceId', race.id);
    }
  };

  const openRaceModal = (race: Race, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalRace(race);
  };

  const closeRaceModal = () => {
    setModalRace(null);
  };

  // Group races by source
  const racesBySource = useMemo(() => {
    const grouped: Record<string, Race[]> = {};
    
    races.forEach(race => {
      const source = race.source || 'Unknown Source';
      if (!grouped[source]) {
        grouped[source] = [];
      }
      grouped[source].push(race);
    });
    
    return grouped;
  }, [races]);

  return (
    <>
      <RacesContainer>        
        {Object.entries(racesBySource).map(([source, sourceRaces]) => (
          <SourceSection key={source}>
            <RacesCategoryTitle>
              <CategoryIcon><FaBook /></CategoryIcon>
              {source}
            </RacesCategoryTitle>
            <RacesGrid>
              {sourceRaces.map((race) => (
                <RaceCard 
                  key={race.id}
                  isSelected={selectedRace === race.name}
                >
                  <RaceImageContainer onClick={(e) => openRaceModal(race, e)}>
                    <RaceImage src={race.image || '/images/races/default.jpg'} alt={race.name} />
                  </RaceImageContainer>
                  <RaceName>{race.name}</RaceName>
                </RaceCard>
              ))}
            </RacesGrid>
          </SourceSection>
        ))}
      </RacesContainer>

      {modalRace && (
        <RaceModal onClick={closeRaceModal}>
          <RaceModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeRaceModal}>
              <FaTimes />
            </CloseButton>
            <RaceModalImage src={modalRace.image || '/images/races/default.jpg'} alt={modalRace.name} />
            <RaceModalDetails>
              <RaceModalTitle>{modalRace.name}</RaceModalTitle>
              <RaceModalSource>Source: {modalRace.source || 'Unknown'}</RaceModalSource>
              <RaceModalDescription>{modalRace.description}</RaceModalDescription>
              {/* {modalRace.traits && modalRace.traits.length > 0 && (
                <RaceModalTraits>
                  <RaceModalSubtitle>Racial Traits:</RaceModalSubtitle>
                  <ul>
                    {modalRace.traits.map((trait, index) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </RaceModalTraits>
              )} */}
              <SelectButton 
                isSelected={selectedRace === modalRace.name}
                onClick={() => {
                  handleRaceSelect(modalRace);
                  closeRaceModal();
                }}
              >
                {selectedRace === modalRace.name ? 'Selected' : 'Select This Race'}
              </SelectButton>
            </RaceModalDetails>
          </RaceModalContent>
        </RaceModal>
      )}
    </>
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

const SourceSection = styled.div`
  margin-bottom: 1.5rem;
`;

const RacesCategoryTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #bb8930;
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
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const RaceImageContainer = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const RaceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RaceCard = styled.div<{ isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: ${props => props.isSelected ? 'rgba(187, 137, 48, 0.3)' : 'rgba(58, 38, 6, 0.4)'};
  border: 1px solid ${props => props.isSelected ? '#bb8930' : 'rgba(187, 137, 48, 0.3)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.2);
    border-color: #bb8930;
    transform: translateY(-2px);
  }
`;

const RaceName = styled.span`
  font-weight: 600;
  color: #e6e6e6;
  font-size: 0.9rem;
`;

// Modal Styles
const RaceModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const RaceModalContent = styled.div`
  background-color: #1a1a2e;
  border: 2px solid #bb8930;
  border-radius: 8px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(187, 137, 48, 0.8);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: #bb8930;
  }
`;

const RaceModalImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  
  @media (min-width: 768px) {
    width: 50%;
    height: auto;
    max-height: 80vh;
  }
`;

const RaceModalDetails = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RaceModalTitle = styled.h2`
  color: #bb8930;
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
`;

const RaceModalSource = styled.p`
  color: #a0a0a0;
  font-style: italic;
  margin: 0 0 1rem;
  font-size: 0.9rem;
`;

const RaceModalDescription = styled.p`
  color: #e6e6e6;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const RaceModalTraits = styled.div`
  margin-bottom: 1.5rem;
  
  ul {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }
  
  li {
    color: #e6e6e6;
    margin-bottom: 0.5rem;
  }
`;

const RaceModalSubtitle = styled.h3`
  color: #bb8930;
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
`;

const SelectButton = styled.button<{ isSelected?: boolean }>`
  background: ${props => props.isSelected ? '#8a6420' : '#bb8930'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.isSelected ? '#8a6420' : '#d4a959'};
  }
`;

export default CharacterRaces;
