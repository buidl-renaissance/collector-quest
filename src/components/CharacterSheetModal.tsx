import React from "react";
import styled from "@emotion/styled";
import {
  Character,
  CharacterSheet as CharacterSheetType,
} from "@/hooks/useCharacter";
import CharacterSheet from "./CharacterSheet";
import { FaTimes } from "react-icons/fa";
import CharacterCard from "./CharacterCard";

interface CharacterSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  characterSheet: CharacterSheetType;
}

const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({
  isOpen,
  onClose,
  character,
  characterSheet,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{character.name}&apos;s Character Sheet</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <FaTimes size={24} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <div
            style={{
              marginBottom: "1rem",
              border: "2px solid #bb8930",
              borderRadius: "8px",
            }}
          >
            <CharacterCard character={character} />
          </div>

          <CharacterSheet
            character={character}
            characterSheet={characterSheet}
          />
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
  z-index: 10000;
`;

const ModalContent = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #bb8930;
  width: 95%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #bb8930;
  position: sticky;
  top: 0;
  background-color: #1a1a1a;
  z-index: 1;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.125rem;
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
  text-align: left;
`;

export default CharacterSheetModal;
