import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCrown,
} from "react-icons/fa";
import { CharacterClass, characterClasses } from "@/data/classes";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import PageTransition from "@/components/PageTransition";
import { getAllClasses } from "@/db/classes";
import { GetServerSideProps } from "next";
import { BackButton, Subtitle, Title } from "@/components/styled/character";
import { useModal } from "@/hooks/useModal";
import LearnClasses from "@/components/Learn/LearnClasses";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";

interface ClassSelectionPageProps {
  classes: CharacterClass[];
}

export const getServerSideProps: GetServerSideProps<
  ClassSelectionPageProps
> = async () => {
  const classes = await getAllClasses();
  return {
    props: {
      classes,
    },
  };
};

const ClassSelectionPage: React.FC<ClassSelectionPageProps> = ({ classes }) => {
  const router = useRouter();
  const {
    selectedClass,
    selectClass,
    loading: classLoading,
  } = useCharacterClass();
  const { openModal, closeModal, modalContent, Modal } = useModal();
  const { character } = useCurrentCharacter();

  const handleNext = () => {
    if (selectedClass) {
      router.push("/character/image");
    }
  };

  const handleBack = () => {
    router.push("/character/race");
  };

  if (classLoading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon>
            <FaCrown />
          </CrownIcon>
          Loading...
        </LoadingMessage>
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Race Selection
        </BackButton>

        <Title>Choose Your Class</Title>
        <LearnMoreButton
          onClick={() =>
            openModal(
              "Class Information",
              <LearnClasses />
            )
          }
        >
          Learn how classes define your character.
        </LearnMoreButton>

        {character?.race && (
          <SelectedRaceBanner>
            <RaceImage
              src={character.race.image || "/images/races/default.jpg"}
              alt={character.race.name}
            />
            <RaceInfo>
              <RaceName>Selected Race: {character.race.name}</RaceName>
              <RaceDescription>{character.race.description}</RaceDescription>
            </RaceInfo>
          </SelectedRaceBanner>
        )}

        <ClassesGrid>
          {classes.map((characterClass) => (
            <ClassCard
              key={characterClass.id}
              selected={selectedClass?.id === characterClass.id}
              onClick={() => selectClass(characterClass)}
            >
              <ClassInfo>
                <ClassName>{characterClass.name}</ClassName>
                <ClassDescription>
                  {characterClass.description}
                </ClassDescription>
                <AbilitiesList>
                  {characterClass.abilities.map((ability, index) => (
                    <AbilityItem key={index}>
                      <AbilityName>
                        {typeof ability === "string" ? ability : ability.name}:{" "}
                      </AbilityName>
                      {typeof ability === "object" && ability.description && (
                        <AbilityDescription>
                          {ability.description}
                        </AbilityDescription>
                      )}
                    </AbilityItem>
                  ))}
                </AbilitiesList>
              </ClassInfo>
            </ClassCard>
          ))}
        </ClassesGrid>

        <Quote>
          &quot;Your class defines how you interact with the gallery&apos;s
          mysteries. Choose wisely, for each path offers unique opportunities
          and challenges.&quot;
        </Quote>

        <Modal
          isOpen={modalContent.isOpen}
          onClose={closeModal}
          title={modalContent.title}
        >
          {modalContent.content}
        </Modal>


        {selectedClass && (
          <SelectionFooter>
            <SelectedClassInfo>
              <SelectedClassLabel>Selected Class:</SelectedClassLabel>
              <SelectedClassName>{selectedClass.name}</SelectedClassName>
            </SelectedClassInfo>
            <NextButton onClick={handleNext}>
              Next Step <FaArrowRight />
            </NextButton>
          </SelectionFooter>
        )}
      </Container>
    </PageTransition>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 120px; /* Make room for the footer */
`;

const AbilityName = styled.span`
  font-weight: bold;
`;

const AbilityDescription = styled.span`
  font-size: 0.85rem;
`;

const SelectedRaceBanner = styled.div`
  display: flex;
  align-items: center;
  background: rgba(187, 137, 48, 0.1);
  border: 1px solid #bb8930;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const RaceImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid #bb8930;
`;

const RaceInfo = styled.div`
  flex: 1;
`;

const RaceName = styled.h3`
  margin: 0 0 0.5rem;
  color: #bb8930;
`;

const RaceDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #c7bfd4;
`;

const ClassesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ClassCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${(props) => (props.selected ? "#d4a959" : "#bb8930")};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  background: ${(props) =>
    props.selected ? "rgba(187, 137, 48, 0.1)" : "rgba(26, 26, 46, 0.3)"};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(187, 137, 48, 0.3);
    border-color: #d4a959;
  }
`;

const ClassInfo = styled.div`
  padding: 1rem;
`;

const ClassName = styled.h3`
  margin: 0 0 0.5rem;
  color: #bb8930;
`;

const ClassDescription = styled.p`
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #c7bfd4;
  line-height: 1.4;
`;

const AbilitiesList = styled.ul`
  margin: 0;
  padding: 0 0 0 1.2rem;
  list-style-type: disc;
`;

const AbilityItem = styled.li`
  font-size: 0.85rem;
  color: #c7bfd4;
  margin-bottom: 0.3rem;
`;

const Quote = styled.blockquote`
  font-style: italic;
  color: #bb8930;
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  border-left: 3px solid #bb8930;
  background-color: rgba(187, 137, 48, 0.1);
`;

const SelectionFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(26, 26, 46, 0.95);
  border-top: 2px solid #bb8930;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideUp} 0.3s ease-out;
  z-index: 100;
`;

const SelectedClassInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectedClassLabel = styled.span`
  color: #c7bfd4;
`;

const SelectedClassName = styled.span`
  color: #bb8930;
  font-weight: bold;
  font-size: 1.1rem;
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d4a959;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #c7bfd4;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const CrownIcon = styled.span`
  color: #bb8930;
  font-size: 1.5rem;
  animation: ${fadeIn} 1s infinite alternate;
`;

const LearnMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #bb8930;
  color: #bb8930;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 1rem auto;
  margin-bottom: 2rem;

  &:hover {
    background-color: rgba(187, 137, 48, 0.1);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: #1a1a2e;
  border: 2px solid #bb8930;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(187, 137, 48, 0.8);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: #bb8930;
  }
`;

const ModalTitle = styled.h2`
  color: #bb8930;
  margin: 0 0 1.5rem;
  font-size: 1.8rem;
  text-align: center;
`;

const ModalSection = styled.div`
  margin-bottom: 2rem;
`;

const ModalSectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #bb8930;
  margin: 0 0 1rem;
  font-size: 1.3rem;
  border-bottom: 1px solid rgba(187, 137, 48, 0.3);
  padding-bottom: 0.5rem;
`;

const ModalIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bb8930;
`;

const ModalText = styled.p`
  color: #e6e6e6;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ModalList = styled.ul`
  padding-left: 1.5rem;
  margin: 0.5rem 0 1rem;
`;

const ModalListItem = styled.li`
  color: #e6e6e6;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

export default ClassSelectionPage;
