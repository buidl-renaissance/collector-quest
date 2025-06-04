import styled from "@emotion/styled";
import { motion, px } from "framer-motion";
import {
  FaFistRaised,
  FaScroll,
  FaUsers,
  FaChevronDown,
  FaDollarSign,
  FaShieldAlt,
  FaBrain,
} from "react-icons/fa";
import { GiSkills, GiSwordClash, GiBrain } from "react-icons/gi";
import CharacterImage from "@/components/CharacterImage";
import { useState } from "react";
import { Character } from "@/data/character";
import { Attack } from "@/data/attacks";
import CharacterSheetModal from "@/components/CharacterSheetModal";
import { useCharacterSheet } from "@/hooks/useCharacterSheet";
import { MenuModal } from "./MenuModal";

interface CharacterMenuProps {
  character: Character | null;
}

type ModalType = "skills" | "equipment" | "attacks" | null;

export const CharacterMenu = ({ character }: CharacterMenuProps) => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { characterSheet } = useCharacterSheet();

  const handleSheetClick = () => {
    setIsSheetModalOpen(true);
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const handleMenuToggle = () => {
    const newExpandedState = !isMenuExpanded;
    setIsMenuExpanded(newExpandedState);
    if (!newExpandedState) {
      setActiveModal(null);
    }
  };

  return (
    <>
      <MenuWrapper>
        <RightButtonPanel expanded={isMenuExpanded}>
          <ActionButtonContainer expanded={isMenuExpanded}>
            <ActionButton
              title="Equipment"
              onClick={() => setActiveModal("equipment")}
            >
              <FaShieldAlt />
              {isMenuExpanded && <span>EQUIP</span>}
            </ActionButton>
            <ActionButton
              title="Skills"
              onClick={() => setActiveModal("skills")}
            >
              <GiSkills />
              {isMenuExpanded && <span>SKILLS</span>}
            </ActionButton>
            <ActionButton
              title="Attacks"
              onClick={() => setActiveModal("attacks")}
            >
              <GiSwordClash />
              {isMenuExpanded && <span>ATTACKS</span>}
            </ActionButton>
            <ActionButton title="Character Sheet" onClick={handleSheetClick}>
              <FaScroll />
              {isMenuExpanded && <span>SHEET</span>}
            </ActionButton>
          </ActionButtonContainer>
        </RightButtonPanel>
        <CharacterImageContainer>
          <ToggleMenuButton
            onClick={handleMenuToggle}
            title={isMenuExpanded ? "Collapse Menu" : "Expand Menu"}
          >
            <FaChevronDown
              style={{
                transform: isMenuExpanded ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
            {character && (
              <CharacterImage character={character} bordered size="thumbnail" />
            )}
          </ToggleMenuButton>
        </CharacterImageContainer>
      </MenuWrapper>

      {character && characterSheet && (
        <CharacterSheetModal
          isOpen={isSheetModalOpen}
          onClose={() => setIsSheetModalOpen(false)}
          character={character}
          characterSheet={characterSheet}
        />
      )}

      <MenuModal
        isOpen={activeModal === "skills"}
        onClose={handleModalClose}
        title="Skills"
      >
        {characterSheet?.skills ? (
          <SkillsList>
            {characterSheet.skills.map((skill, index) => (
              <SkillItem key={index}>
                <SkillInfo>
                  <SkillName>{skill.name}</SkillName>
                  <SkillAbility>{skill.ability}</SkillAbility>
                  <SkillModifier>
                    {skill.modifier === 0 ? (
                      <span style={{ color: "#999999" }}>+0</span>
                    ) : skill.modifier > 0 ? (
                      `+${skill.modifier}`
                    ) : (
                      skill.modifier
                    )}
                  </SkillModifier>
                  <ProficiencyIcon title={skill.proficient ? "Proficient" : "Not Proficient"}>
                    <FaBrain />
                  </ProficiencyIcon>
                </SkillInfo>
              </SkillItem>
            ))}
          </SkillsList>
        ) : (
          <EmptyState>No skills available</EmptyState>
        )}
      </MenuModal>

      <MenuModal
        isOpen={activeModal === "equipment"}
        onClose={handleModalClose}
        title="Equipment"
      >
        {character?.equipment ? (
          <EquipmentList>
            {Object.entries(character.equipment).map(([category, items]) => (
              <EquipmentCategory key={category}>
                <CategoryTitle>{formatCategory(category)}</CategoryTitle>
                {Array.isArray(items) &&
                  items.map((item, index) => (
                    <EquipmentItem key={index}>
                      <span>{item.name}</span>
                      <QuantityBadge>×{item.quantity}</QuantityBadge>
                    </EquipmentItem>
                  ))}
              </EquipmentCategory>
            ))}
          </EquipmentList>
        ) : (
          <EmptyState>No equipment available</EmptyState>
        )}
      </MenuModal>

      <MenuModal
        isOpen={activeModal === "attacks"}
        onClose={handleModalClose}
        title="Attacks"
      >
        {characterSheet?.combat?.attacks ? (
          <AttacksList>
            {characterSheet.combat.attacks.map((attack: Attack, index) => (
              <AttackItem key={index}>
                <AttackType>
                  {attack.element} / {attack.attackType}
                </AttackType>
                <AttackName>{attack.name}</AttackName>
                <AttackEffect>{attack.effect}</AttackEffect>
              </AttackItem>
            ))}
          </AttacksList>
        ) : (
          <EmptyState>No attacks available</EmptyState>
        )}
      </MenuModal>
    </>
  );
};

const MenuWrapper = styled.div`
  position: fixed;
  right: 0.5rem;
  bottom: 164px;
  z-index: 10;
  width: 120px;
  display: flex;
  justify-content: flex-end;
`;

const RightButtonPanel = styled.div<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: ${(props) => (props.expanded ? "88px" : "60px")};
`;

const ActionButtonContainer = styled.div<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  max-height: ${(props) => (props.expanded ? "300px" : "0px")};
  opacity: ${(props) => (props.expanded ? "1" : "0")};
  transition: all 0.3s ease;
  transform-origin: bottom;
  order: -1;
  margin-bottom: 60px + 0.5rem;
`;

const CharacterImageContainer = styled.div`
  position: fixed;
  right: 0.5rem;
  bottom: 60px;
  z-index: 10;
  width: 60px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(26, 26, 46, 0.97);
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  justify-content: left;
  text-align: left;
  span {
    font-size: 0.9rem;
  }

  &:hover {
    color: #f5cc50;
    border-color: #f5cc50;
    background: #221e1c;
  }
`;

const ToggleMenuButton = styled.button`
  background: transparent;
  border: none;
  color: #d4af37;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  width: 100%;
  gap: 0.5rem;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #f5cc50;
  }
`;

const SkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  background: rgba(26, 26, 46, 0.5);
  border-radius: 4px;
`;

const SkillInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

const SkillName = styled.span`
  color: #fff;
  flex: 1;
`;

const SkillAbility = styled.span`
  color: #d4af37;
  font-size: 0.75rem;
  width: 40px;
  text-align: center;
`;

const SkillModifier = styled.span`
  color: ${(props) =>
    props.children && parseInt(props.children.toString()) >= 0
      ? "#4CAF50"
      : "#f44336"};
  font-weight: bold;
  width: 30px;
  text-align: right;
`;

const ProficiencyIcon = styled.div<{ title: string }>`
  color: #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.title === "Proficient" ? 1 : 0.2};
  transition: opacity 0.2s ease;
  width: 20px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EquipmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EquipmentItem = styled.div`
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmptyState = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 1rem 0;
  font-size: 0.875rem;
`;

const EquipmentCategory = styled.div`
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryTitle = styled.h3`
  color: #d4af37;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
  font-family: "Cinzel", serif;
`;

const QuantityBadge = styled.span`
  color: #d4af37;
  font-size: 0.75rem;
`;

const AttacksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AttackItem = styled.div`
  padding: 0.25rem 0.5rem;
  background: rgba(26, 26, 46, 0.5);
  border-radius: 4px;
`;

const AttackName = styled.div`
  color: #d4af37;
  font-weight: bold;
`;

const AttackType = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const AttackEffect = styled.div`
  margin-top: 0;
  font-size: 0.75rem;
`;

const formatCategory = (category: string): string => {
  return category
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
