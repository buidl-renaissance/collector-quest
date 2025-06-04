import React from 'react';
import styled from '@emotion/styled';
import { Character } from '@/data/character';
import { FaTimes } from 'react-icons/fa';
import CharacterSummary from './CharacterSummary';

interface CharacterSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

const CharacterSummaryModal: React.FC<CharacterSummaryModalProps> = ({
  isOpen,
  onClose,
  character
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{character.name}</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <FaTimes size={24} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <CharacterSummary character={character} />
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #bb8930;
  width: 95%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #bb8930;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.5rem;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #bb8930;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #d4a849;
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
`;

export default CharacterSummaryModal;
