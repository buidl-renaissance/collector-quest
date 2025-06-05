import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaScroll, FaTimes } from "react-icons/fa";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import {
  Title,
  Subtitle,
  BackButton,
  HeroSection,
} from "@/components/styled/character";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import BottomNavigation from "@/components/BottomNavigation";
import { navigateTo } from "@/utils/navigation";

const BackgroundPage: React.FC = () => {
  const router = useRouter();
  const { character, updateCharacterTrait } =
    useCurrentCharacter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const [selectedBackground, setSelectedBackground] = useState(
    character?.traits?.background || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect if no race or class is selected
  useEffect(() => {
    if (!raceLoading && !classLoading) {
      if (!selectedRace) {
        router.push("/character/race");
      } else if (!selectedClass) {
        router.push("/character/class");
      }
    }
  }, [selectedRace, selectedClass, raceLoading, classLoading, router]);

  const handleBackgroundSelect = (backgroundId: string) => {
    setSelectedBackground(backgroundId);
    updateCharacterTrait("background", backgroundId);
  };

  const handleBack = () => {
    navigateTo(router, "/character/class");
  };

  const handleNext = async () => {
    navigateTo(router, "/character/alignment");
  };

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  if (raceLoading || classLoading) {
    return (
      <Page>
        <LoadingMessage>
          <BackgroundIcon>
            <FaScroll />
          </BackgroundIcon>
          Loading...
        </LoadingMessage>
      </Page>
    );
  }

  return (
    <PageTransition>
      <Page darkMode={true}>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Class
        </BackButton>

        <HeroSection>
          <Title>Choose Your Background</Title>
          <Subtitle>
            Your background reveals where you came from, how you became an
            adventurer, and your place in the world.{" "}
            <LearnMore href="#" onClick={handleLearnMoreClick}>
              Learn more.
            </LearnMore>
          </Subtitle>
        </HeroSection>

        <BackgroundSection>
          <BackgroundHeader>
            <BackgroundIcon>
              <FaScroll />
            </BackgroundIcon>
            <BackgroundTitle>Character Backgrounds</BackgroundTitle>
          </BackgroundHeader>

          <BackgroundGrid>
            {backgrounds.map((background) => (
              <BackgroundCard
                key={background.id}
                isSelected={selectedBackground === background.id}
                onClick={() => handleBackgroundSelect(background.id)}
              >
                <BackgroundName>{background.name}</BackgroundName>
                <BackgroundDescription>
                  {background.description}
                </BackgroundDescription>
                <BackgroundDetails>
                  <DetailItem>
                    <strong>Skills:</strong>{" "}
                    {background.skillProficiencies.join(", ")}
                  </DetailItem>
                  <DetailItem>
                    <strong>Feature:</strong> {background.feature}
                  </DetailItem>
                </BackgroundDetails>
              </BackgroundCard>
            ))}
          </BackgroundGrid>
        </BackgroundSection>

        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Understanding Backgrounds</ModalTitle>
                <CloseButton onClick={() => setIsModalOpen(false)}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              <ModalBody>
                <InfoTitle>📜 What Is A Background?</InfoTitle>
                <InfoText>
                  Your background represents your character&apos;s origin
                  story—their life before becoming an adventurer. It grants
                  specific skill proficiencies, equipment, and special features
                  that reflect your past experiences.
                </InfoText>

                <InfoTitle>🔄 How Backgrounds Shape Your Character</InfoTitle>
                <InfoList>
                  <InfoListItem>
                    <strong>Skills & Proficiencies:</strong> Each background
                    provides proficiency in two skills and sometimes tools or
                    languages.
                  </InfoListItem>
                  <InfoListItem>
                    <strong>Starting Equipment:</strong> Backgrounds determine
                    some of the gear you begin your adventure with.
                  </InfoListItem>
                  <InfoListItem>
                    <strong>Roleplaying Hooks:</strong> Your background suggests
                    personality traits, ideals, bonds, and flaws.
                  </InfoListItem>
                  <InfoListItem>
                    <strong>Special Feature:</strong> Each background grants a
                    unique feature that provides story and roleplaying
                    opportunities.
                  </InfoListItem>
                </InfoList>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}

        {selectedBackground && (
          <BottomNavigation
            onNext={handleNext}
            selectedItem={
              backgrounds.find((b) => b.id === selectedBackground)?.name || ""
            }
            selectedItemLabel="Background"
          />
        )}
      </Page>
    </PageTransition>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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

const BackgroundSection = styled.section`
  margin: 2rem 0;
`;

const BackgroundHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

const BackgroundIcon = styled.span`
  color: #8a5a44;
  font-size: 1.5rem;
  animation: ${fadeIn} 1s infinite alternate;
`;

const BackgroundTitle = styled.h2`
  font-size: 1.8rem;
  color: #8a5a44;
  margin: 0;
`;

const BackgroundGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const BackgroundCard = styled.div<{ isSelected: boolean }>`
  background: ${(props) =>
    props.isSelected ? "rgba(138, 90, 68, 0.3)" : "rgba(30, 30, 40, 0.6)"};
  border: 2px solid
    ${(props) => (props.isSelected ? "#8a5a44" : "rgba(80, 80, 100, 0.3)")};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8a5a44;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const LearnMore = styled.a`
  color: #bb8930;
`;

const BackgroundName = styled.h3`
  font-size: 1.4rem;
  color: #d4c0a1;
  margin: 0 0 0.8rem 0;
`;

const BackgroundDescription = styled.p`
  font-size: 0.95rem;
  color: #b8b8c0;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const BackgroundDetails = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const DetailItem = styled.p`
  margin: 0.5rem 0;
  color: #a0a0b0;

  strong {
    color: #c0b090;
  }
`;

const BackgroundInfo = styled.div`
  background: rgba(30, 30, 40, 0.6);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const InfoTitle = styled.h3`
  font-size: 1.3rem;
  color: #d4c0a1;
  margin: 0 0 1rem 0;

  &:not(:first-of-type) {
    margin-top: 1.5rem;
  }
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #b8b8c0;
  line-height: 1.6;
`;

const InfoList = styled.ul`
  padding-left: 1.5rem;
  margin: 0.5rem 0;
`;

const InfoListItem = styled.li`
  color: #b8b8c0;
  margin: 0.7rem 0;
  line-height: 1.5;

  strong {
    color: #c0b090;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContent = styled.div`
  background: #1a1a2e;
  border: 2px solid #bb8930;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #bb8930;
`;

const ModalTitle = styled.h2`
  color: #bb8930;
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #bb8930;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #d4a959;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

export default BackgroundPage;

// Define background options
const backgrounds = [
  {
    id: "acolyte",
    name: "Acolyte",
    description:
      "You have spent your life in service to a temple, learning religious texts and performing sacred rites.",
    skillProficiencies: ["Insight", "Religion"],
    equipment:
      "Holy symbol, prayer book, 5 sticks of incense, vestments, common clothes, pouch with 15 gold",
    feature:
      "Shelter of the Faithful: You can perform religious ceremonies and find shelter at temples of your faith.",
  },
  {
    id: "charlatan",
    name: "Charlatan",
    description:
      "You've always had a way with people, convincing them of outlandish tales and getting them to part with their coin.",
    skillProficiencies: ["Deception", "Sleight of Hand"],
    equipment:
      "Fine clothes, disguise kit, tools of the con, belt pouch with 15 gold",
    feature:
      "False Identity: You have a second identity complete with documentation and established contacts.",
  },
  {
    id: "criminal",
    name: "Criminal",
    description:
      "You have a history of breaking the law and still maintain contacts within the criminal underworld.",
    skillProficiencies: ["Deception", "Stealth"],
    equipment:
      "Crowbar, dark common clothes with hood, belt pouch with 15 gold",
    feature:
      "Criminal Contact: You have a reliable contact who acts as a liaison to a criminal network.",
  },
  {
    id: "entertainer",
    name: "Entertainer",
    description:
      "You thrive in front of an audience, entertaining them with music, dance, acting, storytelling, or some other form.",
    skillProficiencies: ["Acrobatics", "Performance"],
    equipment:
      "Musical instrument, favor from admirer, costume, belt pouch with 15 gold",
    feature:
      "By Popular Demand: You can find a place to perform and receive free lodging and food in exchange.",
  },
  {
    id: "folk_hero",
    name: "Folk Hero",
    description:
      "You come from a humble background, but you are destined for much more due to a defining event in your life.",
    skillProficiencies: ["Animal Handling", "Survival"],
    equipment:
      "Set of artisan's tools, shovel, iron pot, common clothes, belt pouch with 10 gold",
    feature:
      "Rustic Hospitality: Common folk will shelter you and shield you from the law or anyone searching for you.",
  },
  {
    id: "guild_artisan",
    name: "Guild Artisan",
    description:
      "You are a member of an artisan's guild, skilled in a particular craft and knowledgeable in the merchant trade.",
    skillProficiencies: ["Insight", "Persuasion"],
    equipment:
      "Artisan's tools, letter of introduction from guild, traveler's clothes, belt pouch with 15 gold",
    feature:
      "Guild Membership: Fellow guild members will provide you with lodging and support.",
  },
  {
    id: "hermit",
    name: "Hermit",
    description:
      "You lived in seclusion for a formative part of your life, either in a sheltered community or entirely alone.",
    skillProficiencies: ["Medicine", "Religion"],
    equipment:
      "Scroll case with notes, winter blanket, common clothes, herbalism kit, 5 gold",
    feature:
      "Discovery: Your isolation gave you access to a unique and powerful discovery.",
  },
  {
    id: "noble",
    name: "Noble",
    description:
      "You understand wealth, power, and privilege due to your noble birth and upbringing.",
    skillProficiencies: ["History", "Persuasion"],
    equipment:
      "Fine clothes, signet ring, scroll of pedigree, purse with 25 gold",
    feature:
      "Position of Privilege: People are inclined to think the best of you due to your noble birth.",
  },
  {
    id: "outlander",
    name: "Outlander",
    description:
      "You grew up in the wilds, far from civilization and the comforts of town and technology.",
    skillProficiencies: ["Athletics", "Survival"],
    equipment:
      "Staff, hunting trap, trophy from animal, traveler's clothes, belt pouch with 10 gold",
    feature:
      "Wanderer: You have an excellent memory for maps and geography, and can always recall the general layout of terrain.",
  },
  {
    id: "sage",
    name: "Sage",
    description:
      "You spent years learning the lore of the multiverse, studying ancient manuscripts and tomes.",
    skillProficiencies: ["Arcana", "History"],
    equipment:
      "Bottle of ink, quill, small knife, letter from dead colleague, common clothes, belt pouch with 10 gold",
    feature:
      "Researcher: When you attempt to learn or recall information, you know where to find it if it can be found.",
  },
  {
    id: "sailor",
    name: "Sailor",
    description:
      "You sailed on a seagoing vessel for years, facing storms, sea monsters, and those who wanted to sink your ship.",
    skillProficiencies: ["Athletics", "Perception"],
    equipment:
      "Belaying pin (club), 50 feet of silk rope, lucky charm, common clothes, belt pouch with 10 gold",
    feature:
      "Ship's Passage: You can secure free passage on a sailing ship for yourself and companions.",
  },
  {
    id: "soldier",
    name: "Soldier",
    description:
      "You trained as a soldier, learning the basics of combat and survival in an army camp or militia.",
    skillProficiencies: ["Athletics", "Intimidation"],
    equipment:
      "Insignia of rank, trophy from fallen enemy, set of dice or cards, common clothes, belt pouch with 10 gold",
    feature:
      "Military Rank: You have a military rank from your career as a soldier, and soldiers still recognize your authority.",
  },
  {
    id: "urchin",
    name: "Urchin",
    description:
      "You grew up on the streets, orphaned and poor, learning to fend for yourself in a harsh urban environment.",
    skillProficiencies: ["Sleight of Hand", "Stealth"],
    equipment:
      "Small knife, map of your home city, pet mouse, token from parents, common clothes, belt pouch with 10 gold",
    feature:
      "City Secrets: You know the secret patterns and flow of cities and can find passages through urban environments.",
  },
];
