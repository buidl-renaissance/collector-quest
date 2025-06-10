import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft, FaTimes, FaSpinner } from "react-icons/fa";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import { useCharacterSheet } from "@/hooks/useCharacterSheet";
import Page from "@/components/Page";
import { Container } from "@/components/styled/layout";
import { BackButton } from "@/components/styled/character";
import Emblems from "@/components/CharacterSheet/Emblems";
import Attacks from "@/components/CharacterSheet/Attacks";
import HitDice from "@/components/CharacterSheet/HitDice";
import Features from "@/components/CharacterSheet/Features";
import DeathSaves from "@/components/CharacterSheet/DeathSaves";
import Skills from "@/components/CharacterSheet/Skills";
import TraitsDisplay from "@/components/CharacterSheet/Traits";
import Bio from "@/components/CharacterSheet/Bio";
import ProficienciesAndLanguages from "@/components/CharacterSheet/ProficienciesAndLanguages";
import BottomNavigation from "@/components/BottomNavigation";
import { navigateTo } from "@/utils/navigation";

// Animations
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
`;

const SpinnerIcon = styled.div`
  font-size: 3rem;
  color: #bb8930;
  margin-bottom: 1.5rem;
  animation: ${spin} 1.5s linear infinite;
`;

const LoadingMessage = styled.div`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.8rem;
  color: #bb8930;
  margin-bottom: 1rem;
`;

const LoadingSubtext = styled.div`
  font-size: 1rem;
  color: #aaa;
  max-width: 400px;
`;

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
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border: 1px solid #a77d3e;
  font-family: "Merriweather", serif;

  @media (max-width: 768px) {
    padding: 0.15rem;
    font-size: 0.85rem;
  }
`;

const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 1}, 1fr);
  gap: ${(props) => props.gap || "0.75rem"};

  @media (max-width: 768px) {
    grid-template-columns: ${(props) =>
      props.columns && props.columns > 2
        ? `repeat(2, 1fr)`
        : `repeat(${props.columns || 1}, 1fr)`};
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled(ContentBox)`
  text-align: center;
  transition: box-shadow 0.2s;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  border: none;

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

const CombatSection = styled.div`
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    padding: 0.25rem;
    margin-bottom: 0.5rem;
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
  padding: 0;
  max-width: 42rem;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid #a77d3e;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 768px) {
    width: 90%;
    max-height: 85vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #a77d3e;
  background-color: #2e1e0f;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const ModalCloseButton = styled.button`
  color: #f5e6d3;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s;

  &:hover {
    color: #d6b87b;
    background-color: rgba(167, 125, 62, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.25rem;
    margin: -0.25rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-family: "Cinzel", serif;
  color: #d6b87b;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ModalBody = styled.div`
  color: #f5e6d3;
  padding: 1.5rem;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 768px) {
    padding: 1rem;
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
  font-size: 0.9rem;

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
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <FaTimes size={24} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

const CharacterSheetPage: React.FC = () => {
  const router = useRouter();
  const { character, loading: characterLoading } = useCurrentCharacter();
  const {
    characterSheet,
    loading: sheetLoading,
    error: sheetError,
    generateCharacterSheet,
    currentStep,
  } = useCharacterSheet();

  const [modalContent, setModalContent] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    isOpen: false,
    title: "",
    content: null,
  });

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
    if (characterSheet) {
      console.log("Character sheet generated:", characterSheet);
      console.log("Combat data:", characterSheet.combat);
    }
  }, [characterSheet]);

  const getLoadingSubtext = () => {
    switch (currentStep) {
      case "calculate-abilities":
        return "Calculating character abilities...";
      case "calculate-base-stats":
        return "Calculating combat stats and base attributes...";
      case "generate-skills":
        return "Generating character skills...";
      case "generate-features":
        return "Generating features and traits...";
      case "generate-languages":
        return "Determining languages...";
      case "generate-proficiencies":
        return "Determining proficiencies...";
      case "generate-attacks":
        return "Generating attacks...";
      default:
        return "Generating character sheet...";
    }
  };

  const handleRegenerate = () => {
    if (character) {
      generateCharacterSheet();
    }
  };

  if (characterLoading || sheetLoading) {
    return (
      <Container darkMode>
        <LoadingContainer>
          <SpinnerIcon>
            <FaSpinner />
          </SpinnerIcon>
          <LoadingMessage>Generating your character sheet...</LoadingMessage>
          <LoadingSubtext>{getLoadingSubtext()}</LoadingSubtext>
        </LoadingContainer>
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

  return (
    <Page width="wide">
      {/* <Header>COLLECTOR QUEST</Header> */}
      {/* <BackButton onClick={handleBack}>
        <FaArrowLeft /> Back to Summary
      </BackButton> */}

      {/* <CharacterCard character={character} /> */}

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

        <Grid
          columns={3}
          gap="0.75rem"
          style={{ marginBottom: "1rem", alignItems: "flex-start" }}
        >
          {characterSheet.abilitiesScores && (
            <Emblems abilitiesScores={characterSheet.abilitiesScores} />
          )}

          <div>
            <SectionLabel>Bio</SectionLabel>
            <ContentBox>
              <Bio
                motivation={character.motivation}
                backstory={character.backstory}
                onOpenModal={() =>
                  openModal(
                    "Character Bio",
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <BioModalSection>
                        <BioModalTitle>Motivation</BioModalTitle>
                        <BioModalText>
                          {character.motivation || "No motivation provided"}
                        </BioModalText>
                      </BioModalSection>
                      <BioModalSection>
                        <BioModalTitle>Backstory</BioModalTitle>
                        <BioModalText>
                          {character.backstory || "No backstory provided"}
                        </BioModalText>
                      </BioModalSection>
                    </div>
                  )
                }
              />
            </ContentBox>
          </div>

          {character.traits && (
            <div>
              <SectionLabel>Traits</SectionLabel>
              <ContentBox>
                <TraitsDisplay traits={character.traits} />
              </ContentBox>
            </div>
          )}
        </Grid>

        <Grid columns={3} gap="0.75rem">
          {characterSheet.combat && (
            <div>
              <StatBox>
                <SectionLabel>Armor Class</SectionLabel>
                <StatValue>
                  {characterSheet.combat.armor?.stats.acBonus}
                </StatValue>
              </StatBox>
              <StatBox>
                <SectionLabel>Initiative</SectionLabel>
                <StatValue>
                  {characterSheet.combat.initiative?.dexMod}
                </StatValue>
              </StatBox>
              <StatBox>
                <SectionLabel>Current Hit Points</SectionLabel>
                <StatValue>{characterSheet.combat.currentHitPoints}</StatValue>
              </StatBox>
            </div>
          )}
          {characterSheet.skills && (
            <StatBox>
              <SectionLabel>Skills</SectionLabel>
              <Skills skills={characterSheet.skills} />
            </StatBox>
          )}
          {characterSheet.deathSaves && (
            <StatBox>
              <SectionLabel>Death Saves</SectionLabel>
              <DeathSaves deathSaves={characterSheet.deathSaves} />
            </StatBox>
          )}
        </Grid>

        {/* Combat Section */}
        {characterSheet.combat && (
          <CombatSection>
            <Grid columns={2} gap="0.75rem">
              <div>
                <SectionLabel>Attacks & Spellcasting</SectionLabel>
                <ContentBox>
                  {characterSheet.combat.attacks && (
                    <Attacks attacks={characterSheet.combat.attacks} />
                  )}
                </ContentBox>
              </div>

              <Grid columns={1} gap="0.75rem">
                <div>
                  <SectionLabel>Hit Dice</SectionLabel>
                  <ContentBox>
                    {characterSheet.combat.hitDice && (
                      <HitDice hitDice={characterSheet.combat.hitDice} />
                    )}
                  </ContentBox>
                </div>

                <div>
                  <SectionLabel>Features & Traits</SectionLabel>
                  <ContentBox>
                    {characterSheet.featuresAndTraits && (
                      <Features
                        featuresAndTraits={characterSheet.featuresAndTraits}
                      />
                    )}
                  </ContentBox>
                </div>

                <div>
                  {characterSheet.proficiencies && characterSheet.languages && (
                    <ProficienciesAndLanguages
                      proficiencies={characterSheet.proficiencies}
                      languages={characterSheet.languages}
                      onOpenModal={() =>
                        openModal(
                          "Proficiencies & Languages",
                          <>
                            <div style={{ padding: "1rem" }}>
                              <h3
                                style={{
                                  color: "#d6b87b",
                                  fontFamily: "Cinzel, serif",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                Proficiencies
                              </h3>
                              <ul
                                style={{
                                  color: "#f5e6d3",
                                  marginBottom: "1rem",
                                }}
                              >
                                {characterSheet.proficiencies?.map(
                                  (prof, idx) => (
                                    <li key={idx}>{prof}</li>
                                  )
                                )}
                              </ul>
                              <h3
                                style={{
                                  color: "#d6b87b",
                                  fontFamily: "Cinzel, serif",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                Languages
                              </h3>
                              <ul style={{ color: "#f5e6d3" }}>
                                {characterSheet.languages?.map((lang, idx) => (
                                  <li key={idx}>{lang}</li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )
                      }
                    />
                  )}
                </div>
              </Grid>
            </Grid>
          </CombatSection>
        )}

        <RegenerateButton onClick={handleRegenerate}>
          Regenerate Character Sheet
        </RegenerateButton>
      </CharacterSheetContainer>

      <BottomNavigation 
        nextLabel="View Character"
        onNext={() => {
          navigateTo(router, "/character");
        }}
      />

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
