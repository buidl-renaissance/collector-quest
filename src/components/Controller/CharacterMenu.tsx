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
import { GiSkills, GiSwordClash } from "react-icons/gi";
import CharacterImage from "@/components/CharacterImage";
import { useState } from "react";
import { Attack } from "@/data/attacks";
import CharacterSheetModal from "@/components/CharacterSheetModal";
import { MenuModal } from "./MenuModal";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";

interface CharacterMenuProps {
  size?: "small" | "normal";
}

type ModalType = "skills" | "equipment" | "attacks" | null;

export const CharacterMenu = ({ size = "normal" }: CharacterMenuProps) => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { character } = useCurrentCharacter();

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
      <MenuWrapper size={size}>
        <CharacterButton 
          onClick={handleMenuToggle} 
          title={isMenuExpanded ? "Close Menu" : "Open Menu"}
          size={size}
        >
          {character && (
            <CharacterImage character={character} size="nano" />
          )}
        </CharacterButton>
        <ActionButtonContainer expanded={isMenuExpanded} size={size}>
          <ActionButton
            title="Equipment"
            onClick={() => setActiveModal("equipment")}
            size={size}
            active={activeModal === "equipment"}
          >
            <FaShieldAlt />
          </ActionButton>
          <ActionButton
            title="Skills"
            onClick={() => setActiveModal("skills")}
            size={size}
            active={activeModal === "skills"}
          >
            <GiSkills />
          </ActionButton>
          <ActionButton
            title="Attacks"
            onClick={() => setActiveModal("attacks")}
            size={size}
            active={activeModal === "attacks"}
          >
            <GiSwordClash />
          </ActionButton>
          <ActionButton 
            title="Character Sheet" 
            onClick={handleSheetClick}
            size={size}
          >
            <FaScroll />
          </ActionButton>
        </ActionButtonContainer>
      </MenuWrapper>

      {character && character?.sheet && (
        <CharacterSheetModal
          isOpen={isSheetModalOpen}
          onClose={() => setIsSheetModalOpen(false)}
          character={character}
          characterSheet={character?.sheet}
        />
      )}

      <MenuModal
        isOpen={activeModal === "skills"}
        onClose={handleModalClose}
        title="Skills"
        bottom={146}
      >
        {character?.sheet?.skills ? (
          <SkillsList>
            {character?.sheet?.skills.map((skill, index) => (
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
        bottom={186}
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
        bottom={106}
      >
        {character?.sheet?.combat?.attacks ? (
          <AttacksList>
            {character?.sheet?.combat?.attacks.map((attack: Attack, index) => (
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

const MenuWrapper = styled.div<{ size?: "small" | "normal" }>`
  position: relative;
  width: ${props => props.size === "small" ? "40px" : "60px"};
  height: ${props => props.size === "small" ? "40px" : "60px"};
  z-index: 2000;
`;

const CharacterButton = styled.button<{ size?: "small" | "normal" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #d4af37;
  width: ${props => props.size === "small" ? "40px" : "60px"};
  height: ${props => props.size === "small" ? "40px" : "60px"};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  border: 1px solid #d4af37;
  border-radius: 4px;
  overflow: hidden;

  &:hover {
    color: #f5cc50;
    border-color: #f5cc50;
    background: #221e1c;
  }
`;

const ActionButtonContainer = styled.div<{ expanded: boolean; size?: "small" | "normal" }>`
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(26, 26, 46, 0.97);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.8);
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  opacity: ${props => props.expanded ? 1 : 0};
  visibility: ${props => props.expanded ? 'visible' : 'hidden'};
  transform: translateY(${props => props.expanded ? '0' : '10px'});
  transition: all 0.2s ease;
  z-index: 100;
`;

const ActionButton = styled.button<{ size?: "small" | "normal"; active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? 'rgba(212, 175, 55, 1)' : 'transparent'};
  color: #d4af37;
  border: 1px solid #d4af37;
  width: ${props => props.size === "small" ? "32px" : "40px"};
  height: ${props => props.size === "small" ? "32px" : "40px"};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  svg {
    font-size: ${props => props.size === "small" ? "1rem" : "1.2rem"};
  }

  &:hover {
    color: #f5cc50;
    border-color: #f5cc50;
    background: #221e1c;
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
