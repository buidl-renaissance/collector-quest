import React from 'react';
import styled from '@emotion/styled';
import { Race } from '@/data/races';
import { CharacterClass } from '@/data/character';

interface CharacterDescriptionProps {
  race: Race;
  characterClass: CharacterClass;
  size?: 'small' | 'medium' | 'large';
}

const DescriptionContainer = styled.div<{ size: string }>`
  background-color: rgba(30, 30, 40, 0.7);
  border-radius: 8px;
  padding: ${props => props.size === 'large' ? '20px' : props.size === 'medium' ? '16px' : '12px'};
  margin-bottom: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(100, 100, 150, 0.3);
`;

const RaceClassTitle = styled.h3`
  font-size: 1.2rem;
  color: #e0e0ff;
  margin-top: 0;
  margin-bottom: 12px;
  text-align: center;
`;

const DescriptionText = styled.p`
  color: #c0c0d0;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
`;

const CharacterDescription: React.FC<CharacterDescriptionProps> = ({ 
  race, 
  characterClass, 
  size = 'medium' 
}) => {
  return (
    <DescriptionContainer size={size}>
      <RaceClassTitle>{race.name} {characterClass.name}</RaceClassTitle>
      <DescriptionText>
        As a {race.name} {characterClass.name}, your character combines the unique traits of their 
        heritage with specialized training and abilities. {race.name}s are known for their 
        distinctive characteristics and cultural background, while {characterClass.name}s 
        have mastered specific skills and techniques that define their approach to 
        challenges and adventures.
      </DescriptionText>
    </DescriptionContainer>
  );
};

export default CharacterDescription;

