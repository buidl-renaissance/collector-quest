import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";
import styled from "@emotion/styled";
import PageTransition from "@/components/PageTransition";
import { useCharacter } from "@/hooks/useCharacter";
import { useCharacterSheet } from "@/hooks/useCharacterSheet";
import Page from "@/components/Page";
import { Container, LoadingMessage } from "@/components/styled/layout";
import { Attack, attacks, getAttack } from "@/data/attacks";
import { BackButton } from "@/components/styled/character";

// Styled Components
const CharacterSheetContainer = styled.div`
  background-color: #2e1e0f;
  color: #d6b87b;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 4px solid #a77d3e;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    border-width: 2px;
  }
`;

const Header = styled.h1`
  font-family: "Cinzel", serif;
  font-size: 1.875rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #d6b87b;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const Section = styled.div`
  background-color: #2e1e0f;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 2px solid #a77d3e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const SectionLabel = styled.label`
  display: block;
  font-family: "Cinzel", serif;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #d6b87b;
  text-align: center;
  background-color: #2e1e0f;
  padding: 0.5rem;
  border-top: 1px solid #a77d3e;
  border-left: 1px solid #a77d3e;
  border-right: 1px solid #a77d3e;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  margin-bottom: 0;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.25rem;
  }
`;

const ContentBox = styled.div`
  background-color: #7e6230;
  padding: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border: 1px solid #a77d3e;
  font-family: "Merriweather", serif;
  
  @media (max-width: 768px) {
    padding: 0.15rem;
    font-size: 0.85rem;
  }
`;

const ListItem = styled.div`
  padding: 0.25rem 0;
  border-bottom: 1px solid #a77d3e;

  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.15rem 0;
    font-size: 0.85rem;
  }
`;

const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 1}, 1fr);
  gap: ${(props) => props.gap || "0.75rem"};
  
  @media (max-width: 768px) {
    grid-template-columns: ${(props) => props.columns && props.columns > 2 
      ? `repeat(2, 1fr)` 
      : `repeat(${props.columns || 1}, 1fr)`};
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const AbilityBox = styled(ContentBox)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 0 10px #d6b87b;
  }
`;

const StatBox = styled(ContentBox)`
  text-align: center;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 0 10px #d6b87b;
  }
`;

const StatValue = styled.div`
  font-family: "Cinzel", serif;
  font-size: 1.5rem;
  color: #d6b87b;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const TraitBox = styled(ContentBox)`
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.25rem;
  }
`;

const TraitLabel = styled.div`
  font-family: "Cinzel", serif;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #d6b87b;
  text-align: center;
  background-color: #2e1e0f;
  padding: 0.25rem;
  border-top: 1px solid #a77d3e;
  border-left: 1px solid #a77d3e;
  border-right: 1px solid #a77d3e;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  margin-bottom: 0;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.15rem;
  }
`;

const TraitValue = styled.div`
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const SkillCheckbox = styled.input`
  width: 1rem;
  height: 1rem;
  background-color: #2e1e0f;
  border: 1px solid #a77d3e;
  
  @media (max-width: 768px) {
    width: 0.85rem;
    height: 0.85rem;
  }
`;

const DeathSaveBox = styled.div`
  display: flex;
  gap: 0.25rem;
  
  @media (max-width: 768px) {
    gap: 0.15rem;
  }
`;

const DeathSaveCheck = styled.div<{ checked?: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid ${(props) => (props.checked ? "#d6b87b" : "#a77d3e")};
  border-radius: 0.25rem;
  background-color: ${(props) => (props.checked ? "#d6b87b" : "transparent")};
  
  @media (max-width: 768px) {
    width: 1rem;
    height: 1rem;
    border-width: 1px;
  }
`;

const CombatSection = styled.div`
  background-color: #7e6230;
  border: 1px solid #a77d3e;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.25rem;
    margin-bottom: 0.5rem;
  }
`;

const AttackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  @media (max-width: 768px) {
    gap: 0.15rem;
  }
`;

const AttackItem = styled.div`
  border-bottom: 1px solid #a77d3e;
  &:last-child {
    border-bottom: none;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
`;

const FeatureItem = styled(ListItem)`
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ProficiencySection = styled.div`
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

const ProficiencyList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProficiencyItem = styled(ListItem)`
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const AttackDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.25rem;
  background-color: #7e6230;
  border-radius: 0.25rem;
  
  @media (max-width: 768px) {
    gap: 0.15rem;
    padding: 0.15rem;
  }
`;

const AttackHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  align-items: center;
  font-weight: bold;
  color: #f5e6d3;
  font-size: 0.9rem;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #a77d3e;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    gap: 0.25rem;
    padding: 0.15rem 0;
  }
`;

const AttackInfo = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #f5e6d3;
  padding: 0.25rem 0;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
    font-size: 0.7rem;
    padding: 0.15rem 0;
  }
`;

const AttackDescription = styled.div`
  font-size: 0.8rem;
  color: #f5e6d3;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const HitDiceBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #7e6230;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.25rem;
    margin-bottom: 0.5rem;
  }
`;

const HitDiceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #f5e6d3;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const RegenerateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #7e6230;
  color: #d6b87b;
  padding: 0.75rem 1.5rem;
  border: 2px solid #a77d3e;
  border-radius: 0.25rem;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  margin-top: 1rem;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    background-color: #a77d3e;
    color: #f5e6d3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: #2e1e0f;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 42rem;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem;
    width: 90%;
    max-height: 85vh;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #f5e6d3;
  &:hover {
    color: #d6b87b;
  }
  
  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-family: "Cinzel", serif;
  color: #d6b87b;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
`;

const ModalBody = styled.div`
  color: #f5e6d3;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BioModalSection = styled.div`
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const BioModalTitle = styled.h3`
  color: #d6b87b;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
`;

const BioModalText = styled.p`
  color: #f5e6d3;
  font-size: 0.6rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalCloseButton onClick={onClose}>
          <FaTimes size={24} />
        </ModalCloseButton>
        <ModalTitle>{title}</ModalTitle>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

interface AttackDetails {
  name: string;
  element: string;
  type: string;
  effect: string;
  damage?: string;
  range?: string;
  duration?: string;
  components?: string[];
  description?: string;
}

const CharacterSheetPage: React.FC = () => {
  const router = useRouter();
  const { character, loading: characterLoading } = useCharacter();
  const {
    characterSheet,
    loading: sheetLoading,
    error: sheetError,
    generateCharacterSheet,
  } = useCharacterSheet();

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [modalContent, setModalContent] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    isOpen: false,
    title: "",
    content: null,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({
      isOpen: true,
      title,
      content,
    });
  };

  const closeModal = () => {
    setModalContent((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (!characterLoading && character && !characterSheet && !sheetLoading) {
      console.log("Generating character sheet with data:", {
        name: character.name,
        race: character.race?.name || "Unknown",
        class: character.class?.name || "Unknown",
        sex: character.sex || "Unknown",
        creature: character.creature || "Unknown",
        bio: character.bio || "Unknown",
        motivation: character.motivation || "Unknown",
        traits: {
          personality: character.traits?.personality || [],
          ideals: character.traits?.ideals || [],
          bonds: character.traits?.bonds || [],
          flaws: character.traits?.flaws || [],
        },
      });
      generateCharacterSheet(character);
    }
  }, [
    character,
    characterLoading,
    characterSheet,
    sheetLoading,
    generateCharacterSheet,
  ]);

  useEffect(() => {
    if (characterSheet) {
      console.log("Character sheet generated:", characterSheet);
      console.log("Combat data:", characterSheet.combat);
    }
  }, [characterSheet]);

  const handleBack = () => {
    router.push("/character/backstory");
  };

  const handleRegenerate = () => {
    if (character) {
      generateCharacterSheet(character);
    }
  };

  if (characterLoading || sheetLoading) {
    return (
      <Container>
        <LoadingMessage>Loading character sheet...</LoadingMessage>
      </Container>
    );
  }

  if (sheetError) {
    return (
      <Container>
        <div className="text-red-500 text-xl text-center my-8">
          Error: {sheetError}
        </div>
      </Container>
    );
  }

  if (!character || !characterSheet) {
    return null;
  }

  const getAbilityModifier = (score: number) => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const renderProficienciesAndLanguages = () => {
    return (
      <div>
        <button
          onClick={() =>
            openModal(
              "Proficiencies & Languages",
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Proficiencies</h3>
                  <div className="space-y-2">
                    {characterSheet.proficiencies.map((prof, index) => (
                      <div key={`prof-${index}`} className="text-sm">
                        {prof}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Languages</h3>
                  <div className="space-y-2">
                    {characterSheet.languages.map((lang, index) => (
                      <div key={`lang-${index}`} className="text-sm">
                        {lang}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          }
          className="text-yellow-300 hover:text-yellow-200 text-sm"
        >
          Proficiencies & Languages
        </button>
      </div>
    );
  };

  return (
    <Page width="wide">
      <BackButton onClick={handleBack}>
        <FaArrowLeft /> Back to Summary
      </BackButton>

      <CharacterSheetContainer>
        <Header>COLLECTOR QUEST</Header>

        <Section>
          <Grid columns={3} gap="0.75rem">
            <div>
              <SectionLabel>Character Name</SectionLabel>
              <ContentBox style={{ fontSize: "1.125rem", textAlign: "center" }}>
                {character.name}
              </ContentBox>
            </div>
            <div>
              <SectionLabel>Class</SectionLabel>
              <ContentBox style={{ fontSize: "1.125rem", textAlign: "center" }}>
                {character.class?.name || "Unknown"}
              </ContentBox>
            </div>
            <div>
              <SectionLabel>Race</SectionLabel>
              <ContentBox style={{ fontSize: "1.125rem", textAlign: "center" }}>
                {character.race?.name || "Unknown"}
              </ContentBox>
            </div>
          </Grid>
        </Section>

        <Grid columns={3} gap="0.75rem" style={{ marginBottom: "1rem" }}>
          <div>
            {Object.entries(characterSheet.abilities).map(
              ([ability, score]) => (
                <AbilityBox key={ability}>
                  <div className="text-sm font-['Cinzel'] uppercase text-[#d6b87b]">
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}
                  </div>
                  <div className="text-lg font-['Cinzel'] text-[#d6b87b]">
                    {score}/{getAbilityModifier(score)}
                  </div>
                </AbilityBox>
              )
            )}
          </div>

          <div>
            <SectionLabel>Bio</SectionLabel>
            <ContentBox>
              <div style={{ padding: '0.5rem' }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#f5e6d3',
                  cursor: 'pointer',
                  lineHeight: '1.4'
                }} onClick={() => openModal(
                  "Character Bio",
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <BioModalSection>
                      <BioModalTitle>Backstory</BioModalTitle>
                      <BioModalText>{character.backstory || 'No backstory provided'}</BioModalText>
                    </BioModalSection>
                    <BioModalSection>
                      <BioModalTitle>Motivation</BioModalTitle>
                      <BioModalText>{character.motivation || 'No motivation provided'}</BioModalText>
                    </BioModalSection>
                  </div>
                )}>
                  {character.backstory ? (
                    <>
                      {character.backstory.split('\n')[0]}
                      <div style={{ 
                        color: '#d6b87b', 
                        fontSize: '0.8rem', 
                        marginTop: '0.5rem',
                        textAlign: 'right'
                      }}>
                        Click to view full bio
                      </div>
                    </>
                  ) : (
                    'No backstory provided'
                  )}
                </div>
              </div>
            </ContentBox>
          </div>

          <div>
            <SectionLabel>Traits</SectionLabel>
            <ContentBox>
              <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ 
                    color: '#d6b87b', 
                    fontSize: '0.8rem', 
                    marginBottom: '0.25rem',
                    fontFamily: 'Cinzel, serif'
                  }}>Personality</div>
                  <div style={{ 
                    color: '#f5e6d3',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {characterSheet.effects?.personality_traits?.map((trait: string, index: number) => (
                      <div key={`personality-${index}`} style={{ marginBottom: '0.25rem' }}>
                        {trait}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ 
                    color: '#d6b87b', 
                    fontSize: '0.8rem', 
                    marginBottom: '0.25rem',
                    fontFamily: 'Cinzel, serif'
                  }}>Ideals</div>
                  <div style={{ 
                    color: '#f5e6d3',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {characterSheet.effects?.ideals?.map((ideal, index) => (
                      <div key={`ideal-${index}`} style={{ marginBottom: '0.25rem' }}>
                        {ideal}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ 
                    color: '#d6b87b', 
                    fontSize: '0.8rem', 
                    marginBottom: '0.25rem',
                    fontFamily: 'Cinzel, serif'
                  }}>Bonds</div>
                  <div style={{ 
                    color: '#f5e6d3',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {characterSheet.effects?.bonds?.map((bond, index) => (
                      <div key={`bond-${index}`} style={{ marginBottom: '0.25rem' }}>
                        {bond}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ 
                    color: '#d6b87b', 
                    fontSize: '0.8rem', 
                    marginBottom: '0.25rem',
                    fontFamily: 'Cinzel, serif'
                  }}>Flaws</div>
                  <div style={{ 
                    color: '#f5e6d3',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {characterSheet.effects?.flaws?.map((flaw, index) => (
                      <div key={`flaw-${index}`} style={{ marginBottom: '0.25rem' }}>
                        {flaw}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ContentBox>
          </div>

          <div>
            <StatBox>
              <SectionLabel>Armor Class</SectionLabel>
              <StatValue>{characterSheet.combatStats.armorClass}</StatValue>
            </StatBox>
            <StatBox>
              <SectionLabel>Initiative</SectionLabel>
              <StatValue>{characterSheet.combatStats.initiative}</StatValue>
            </StatBox>
            <StatBox>
              <SectionLabel>Current Hit Points</SectionLabel>
              <StatValue>
                {characterSheet.combatStats.currentHitPoints}
              </StatValue>
            </StatBox>
            <ContentBox>
              <SectionLabel>Skills</SectionLabel>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                {characterSheet.skills.map((skill) => (
                  <div
                    key={skill.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <SkillCheckbox
                      type="checkbox"
                      checked={skill.proficient}
                      readOnly
                    />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </ContentBox>
            <ContentBox>
              <SectionLabel>Death Saves</SectionLabel>
              <Grid columns={2} gap="0.5rem">
                <div>
                  <div style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                    Successes
                  </div>
                  <DeathSaveBox>
                    {[0, 1, 2].map((i) => (
                      <DeathSaveCheck
                        key={`success-${i}`}
                        checked={i < characterSheet.deathSaves.successes}
                      />
                    ))}
                  </DeathSaveBox>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                    Failures
                  </div>
                  <DeathSaveBox>
                    {[0, 1, 2].map((i) => (
                      <DeathSaveCheck
                        key={`failure-${i}`}
                        checked={i < characterSheet.deathSaves.failures}
                      />
                    ))}
                  </DeathSaveBox>
                </div>
              </Grid>
            </ContentBox>
          </div>
        </Grid>

        {/* Combat Section */}
        {characterSheet.combat && (
          <CombatSection>
            <Grid columns={2} gap="0.75rem">
              <div>
                <SectionLabel>Attacks & Spellcasting</SectionLabel>
                <ContentBox>
                  {characterSheet.combat.attacks.length > 0 && (
                    <>
                      <AttackList>
                        <AttackHeader>
                          <span>Name</span>
                          <span>Element</span>
                          <span>Type</span>
                        </AttackHeader>
                        {characterSheet.combat.attacks.map((attack, index) => {
                          const attackDetails: Attack | undefined =
                            getAttack(attack);
                          return (
                            <AttackItem key={index}>
                              <AttackDetails>
                                <AttackInfo>
                                  <span>{attackDetails?.name}</span>
                                  <span>{attackDetails?.element}</span>
                                  <span>{attackDetails?.attackType}</span>
                                </AttackInfo>
                                <AttackDescription>
                                  {attackDetails?.effect}
                                </AttackDescription>
                              </AttackDetails>
                            </AttackItem>
                          );
                        })}
                      </AttackList>
                    </>
                  )}
                </ContentBox>
              </div>

              <div>
                <SectionLabel>Hit Dice</SectionLabel>
                <ContentBox>
                  <HitDiceBox>
                    <HitDiceInfo>
                      <span>Hit Dice:</span>
                      <span>{characterSheet.combat?.hitDice?.current}</span>
                    </HitDiceInfo>
                    <HitDiceInfo>
                      <span>Type:</span>
                      <span>{characterSheet.combat?.hitDice?.type}</span>
                    </HitDiceInfo>
                    <HitDiceInfo>
                      <span>Constitution Bonus:</span>
                      <span>
                        {characterSheet.combat?.hitDice?.bonus >= 0 ? "+" : ""}
                        {characterSheet.combat?.hitDice?.bonus}
                      </span>
                    </HitDiceInfo>
                  </HitDiceBox>
                </ContentBox>
              </div>
            </Grid>
          </CombatSection>
        )}

        {/* Features & Traits Section */}
        <Section>
          <Grid columns={2} gap="0.75rem">
            <div>
              <SectionLabel>Features & Traits</SectionLabel>
              <ContentBox>
                <FeatureList>
                  {characterSheet.features.map((feature, index) => (
                    <FeatureItem key={`feature-${index}`}>
                      {feature}
                    </FeatureItem>
                  ))}
                </FeatureList>
              </ContentBox>
            </div>

            <div>
              <ContentBox>{renderProficienciesAndLanguages()}</ContentBox>
            </div>
          </Grid>
        </Section>

        <RegenerateButton onClick={handleRegenerate}>
          Regenerate Character Sheet
        </RegenerateButton>
      </CharacterSheetContainer>

      <Modal
        isOpen={modalContent.isOpen}
        onClose={closeModal}
        title={modalContent.title}
      >
        {modalContent.content}
      </Modal>
    </Page>
  );
};

export default CharacterSheetPage;
