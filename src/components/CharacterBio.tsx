import React from 'react';
import styled from '@emotion/styled';
import { Character } from '@/data/character';

interface BioProps {
  character: Character;
  openModal?: (title: string, content: React.ReactNode) => void;
}

const CharacterBio: React.FC<BioProps> = ({ character, openModal }) => {
  
  // Create a truncated version of the backstory for display
  const truncateText = (text: string | undefined, maxLength: number = 150) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleOpenModal = () => {
    openModal?.(`About ${character.name}`, (
      <>
        {/* {character.traits && (
          <>
            {character.traits.personality && (
              <BioModalSection>
                <BioModalTitle>Personality Traits</BioModalTitle>
                <BioModalList>
                  {character.traits.personality.map((trait, index) => (
                    <BioModalListItem key={`personality-${index}`}>{trait}</BioModalListItem>
                  ))}
                </BioModalList>
              </BioModalSection>
            )}
            
            {character.traits.ideals && (
              <BioModalSection>
                <BioModalTitle>Ideals</BioModalTitle>
                <BioModalList>
                  {character.traits.ideals.map((ideal, index) => (
                    <BioModalListItem key={`ideal-${index}`}>{ideal}</BioModalListItem>
                  ))}
                </BioModalList>
              </BioModalSection>
            )}
            
            {character.traits.flaws && (
              <BioModalSection>
                <BioModalTitle>Flaws</BioModalTitle>
                <BioModalList>
                  {character.traits.flaws.map((flaw, index) => (
                    <BioModalListItem key={`flaw-${index}`}>{flaw}</BioModalListItem>
                  ))}
                </BioModalList>
              </BioModalSection>
            )}
            
            {character.traits.bonds && (
              <BioModalSection>
                <BioModalTitle>Bonds</BioModalTitle>
                <BioModalList>
                  {character.traits.bonds.map((bond, index) => (
                    <BioModalListItem key={`bond-${index}`}>{bond}</BioModalListItem>
                  ))}
                </BioModalList>
              </BioModalSection>
            )}
          </>
        )}
        
        {character.motivation && (
          <BioModalSection>
            <BioModalTitle>Motivation</BioModalTitle>
            <BioModalText>{character.motivation}</BioModalText>
          </BioModalSection>
        )} */}
        
        {character.backstory && (
          <BioModalSection>
            {/* <BioModalTitle>Backstory</BioModalTitle> */}
            <BioModalText>{character.backstory}</BioModalText>
          </BioModalSection>
        )}
      </>
    ));
  };

  return (
    <>
      <BioContainer>
        {character.backstory ? (
          <>
            <BioText>{truncateText(character.backstory, 250)}</BioText>
            {openModal && (
              <ViewMoreButton onClick={handleOpenModal}>
                Read Full Backstory
              </ViewMoreButton>
            )}
          </>
        ) : (
          <BioText>No backstory available</BioText>
        )}
      </BioContainer>
    </>
  );
};

const BioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BioText = styled.p`
  font-size: 0.85rem;
  line-height: 1.4;
  color: #c7bfd4;
`;

const ViewMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  align-self: flex-start;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
  }
`;

export const BioModalSection = styled.div`
  margin-bottom: 1rem;
`;

export const BioModalTitle = styled.h3`
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

export const BioModalText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #c7bfd4;
  white-space: pre-wrap;
`;

export const BioModalList = styled.ul`
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
`;

export const BioModalListItem = styled.li`
  font-size: 1rem;
  line-height: 1.6;
  color: #c7bfd4;
  margin-bottom: 0.25rem;
`;

export default CharacterBio;
