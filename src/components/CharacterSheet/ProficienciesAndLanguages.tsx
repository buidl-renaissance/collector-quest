import React from 'react';
import styled from '@emotion/styled';

const ProficiencyModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProficiencySection = styled.div`
  margin-bottom: 1rem;
`;

const ProficiencyTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #d6b87b;
  font-family: "Cinzel", serif;
`;

const ProficiencyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProficiencyItem = styled.div`
  font-size: 0.875rem;
  color: #f5e6d3;
`;

const ProficiencyLink = styled.button`
  color: #d6b87b;
  font-size: 0.875rem;
  font-family: "Cinzel", serif;
  text-transform: uppercase;
  transition: all 0.2s;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-align: center;
  width: 100%;
  border-radius: 0.25rem;
  background-color: #614921;
  border: 2px solid #a77d3e;

  &:hover {
    color: #f5e6d3;
    background-color: #a77d3e;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

interface ProficienciesAndLanguagesProps {
  proficiencies: string[];
  languages: string[];
  onOpenModal: () => void;
}

const ProficienciesAndLanguages: React.FC<ProficienciesAndLanguagesProps> = ({ proficiencies, languages, onOpenModal }) => (
  <div>
    <ProficiencyLink onClick={onOpenModal}>
      PROFICIENCIES & LANGUAGES
    </ProficiencyLink>
  </div>
);

export default ProficienciesAndLanguages;
