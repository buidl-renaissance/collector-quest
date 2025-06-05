import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { Character } from "@/data/character";
import CharacterSheetModal from "@/components/CharacterSheetModal";
import { useCharacterSheet } from "@/hooks/useCharacterSheet";
import CharacterImageTile from "@/components/CharacterImageTile";
import { Campaign, CampaignCharacter } from "@/data/campaigns";
import { useCharacter } from "@/hooks/useCharacter";

interface TeamButtonProps {
  campaign: Campaign;
}

export const TeamButton = ({ campaign }: TeamButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CampaignCharacter | null>(null);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { character } = useCharacter(selectedCharacter?.character_id || null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleCharacterClick = (character: CampaignCharacter) => {
    setSelectedCharacter(character);
    setIsSheetModalOpen(true);
    setIsExpanded(false);
  };

  return (
    <>
      <IconNavButton 
        ref={buttonRef}
        title="View Team" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaUsers />
        <AnimatePresence>
          {isExpanded && (
            <TeamPopup
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {campaign.characters && campaign.characters.length > 0 ? (
                campaign.characters.map((member) => (
                  <TeamMember 
                    key={member.id}
                    onClick={() => handleCharacterClick(member)}
                  >
                    <CharacterImageTile 
                      name={member.character_name || ''} 
                      imageUrl={member.character_image || ''} 
                      horizontal={true}
                      subtext={`${member.role || ''}`}
                    />
                  </TeamMember>
                ))
              ) : (
                <EmptyTeam>No team members yet</EmptyTeam>
              )}
            </TeamPopup>
          )}
        </AnimatePresence>
      </IconNavButton>

      {selectedCharacter && character && character.sheet && (
        <CharacterSheetModal
          isOpen={isSheetModalOpen}
          onClose={() => setIsSheetModalOpen(false)}
          character={character}
          characterSheet={character.sheet}
        />
      )}
    </>
  );
};

const IconNavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  position: relative;

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    color: #f5cc50;
    border-color: #f5cc50;
    background: #221e1c;
  }
`;

const TeamPopup = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(26, 26, 46, 0.98);
  border: 1px solid #d4af37;
  border-radius: 4px;
  padding: 0rem;
  margin-bottom: 0.5rem;
  min-width: 200px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const TeamMember = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(212, 175, 55, 0.1);
  }
`;

const EmptyTeam = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
`;

const LoadingTeam = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  font-style: italic;
`;
