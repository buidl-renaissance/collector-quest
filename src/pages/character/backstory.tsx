import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaSun, FaMoon, FaPlus, FaCopy } from "react-icons/fa";
import { GetServerSideProps } from "next";
import { Race } from "@/data/races";
import { CharacterClass, getCharacterClassById } from "@/data/classes";
import { getRaceById } from "@/db/races";
import CharacterImage from "@/components/CharacterImage";
import CharacterDescription from "@/components/CharacterDescription";
import PageTransition from "@/components/PageTransition";
import { generateImage } from "@/lib/image";

interface BackstoryPageProps {
  race: Race;
  class: CharacterClass;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { race, class: selectedClass } = context.query;

  if (!race || !selectedClass) {
    return {
      redirect: {
        destination: "/character/race",
        permanent: false,
      },
    };
  }

  const dbRace = await getRaceById(race as string);
  const dbClass = await getCharacterClassById(selectedClass as string);

  return {
    props: { race: dbRace, class: dbClass },
  };
};


const BackstoryPage: React.FC<BackstoryPageProps> = ({ race, class: selectedClass }) => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [characterBackstory, setCharacterBackstory] = useState<string>("");
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [formData, setFormData] = useState({
    childhoodEvent: "",
    formativeExperience: "",
    mentor: "",
    goal: "",
    secretOrRegret: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBack = () => {
    router.push("/character/bio");
  };

  const generateBackstory = () => {
    setIsLoading(true);

    // Simulate API call or processing time
    setTimeout(() => {
      const { childhoodEvent, formativeExperience, mentor, goal, secretOrRegret } = formData;

      const firstPersonBackstory = `
        I was born into a world that would shape me in ways I never expected. As a young ${race.name}, ${childhoodEvent}. This early experience set me on a path that would eventually lead me to become a ${selectedClass.name}.

        My journey truly began when ${formativeExperience}. It was during this time that I met ${mentor}, who saw potential in me that I hadn't yet recognized in myself. Under their guidance, I learned the ways of the ${selectedClass.name}, honing my skills and discovering my true calling.

        Now, I travel the lands with a clear purpose: ${goal}. This drive pushes me forward, even when the path grows dark and uncertain.

        Yet, there is something I keep hidden from those I meet along the way. ${secretOrRegret} This secret weighs on me, but perhaps one day I will find redemption or peace.
      `;

      const thirdPersonBackstory = `
        Born into a world that would shape them in unexpected ways, this ${race.name} experienced a childhood where ${childhoodEvent}. This early experience set them on a path that would eventually lead to becoming a ${selectedClass.name}.

        Their journey truly began when ${formativeExperience}. It was during this time that they met ${mentor}, who saw potential that hadn't yet been recognized. Under this guidance, they learned the ways of the ${selectedClass.name}, honing their skills and discovering their true calling.

        Now, they travel the lands with a clear purpose: ${goal}. This drive pushes them forward, even when the path grows dark and uncertain.

        Yet, there is something they keep hidden from those they meet along the way. ${secretOrRegret} This secret weighs heavily, but perhaps one day they will find redemption or peace.
      `;

      setCharacterBackstory(isFirstPerson ? firstPersonBackstory : thirdPersonBackstory);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(characterBackstory);
    // Could add a toast notification here
  };

  const handleRandomize = () => {
    const childhoodEvents = [
      "I grew up in the shadow of a great war that devastated my homeland",
      "I was raised by a community of scholars who valued knowledge above all else",
      "My family was constantly on the move, never staying in one place for long",
      "I was orphaned at a young age and raised by distant relatives who never truly accepted me"
    ];

    const formativeExperiences = [
      "I witnessed a powerful display of magic that changed my understanding of the world",
      "I survived a catastrophic event that claimed many lives around me",
      "I discovered an ancient text that revealed secrets about my heritage",
      "I was falsely accused of a crime and had to prove my innocence"
    ];

    const mentors = [
      "a grizzled veteran who saw potential in my raw talent",
      "an eccentric sage who taught me to see the world differently",
      "a mysterious stranger who appeared when I needed guidance most",
      "a childhood friend who pushed me to exceed my own limitations"
    ];

    const goals = [
      "to uncover the truth about my family's mysterious past",
      "to restore honor to a name that has been tarnished",
      "to find a legendary artifact that is said to grant immense power",
      "to protect the innocent from the darkness that threatens to consume the realm"
    ];

    const secrets = [
      "I am responsible for a tragedy that cost innocent lives, and I've never confessed my role",
      "I carry a cursed item that slowly corrupts my spirit, but I cannot part with it",
      "I made a pact with an entity I don't fully understand, and the price may be more than I can bear",
      "I am the last descendant of a bloodline thought extinct, and many would hunt me if they knew"
    ];

    setFormData({
      childhoodEvent: childhoodEvents[Math.floor(Math.random() * childhoodEvents.length)],
      formativeExperience: formativeExperiences[Math.floor(Math.random() * formativeExperiences.length)],
      mentor: mentors[Math.floor(Math.random() * mentors.length)],
      goal: goals[Math.floor(Math.random() * goals.length)],
      secretOrRegret: secrets[Math.floor(Math.random() * secrets.length)],
    });
  };

  return (
    <PageTransition>
      <Container darkMode={darkMode}>
        <Header>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back
          </BackButton>
          <ThemeToggle onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </ThemeToggle>
        </Header>

        <HeroSection>
          <Title>Craft Your Character&apos;s Past</Title>
          <Subtitle>
            Define the events that shaped your hero&apos;s journey
          </Subtitle>
          <RandomizeButton onClick={handleRandomize}>
            Randomize Answers
          </RandomizeButton>
        </HeroSection>

        <CharacterImage
          race={race}
          characterClass={selectedClass}
          size="large"
        />

        <CharacterDescription
          race={race}
          characterClass={selectedClass}
          size="large"
        />

        <FormSection>
          <FormGroup>
            <Label htmlFor="childhoodEvent">Childhood Event</Label>
            <TextArea
              id="childhoodEvent"
              name="childhoodEvent"
              value={formData.childhoodEvent}
              onChange={handleInputChange}
              placeholder="Describe a significant event from your character's childhood..."
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="formativeExperience">Formative Experience</Label>
            <TextArea
              id="formativeExperience"
              name="formativeExperience"
              value={formData.formativeExperience}
              onChange={handleInputChange}
              placeholder="What experience shaped your character's path to their class?"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="mentor">Mentor or Influence</Label>
            <TextArea
              id="mentor"
              name="mentor"
              value={formData.mentor}
              onChange={handleInputChange}
              placeholder="Who taught or influenced your character the most?"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="goal">Long-term Goal</Label>
            <TextArea
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              placeholder="What is your character's ultimate goal or purpose?"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="secretOrRegret">Secret or Regret</Label>
            <TextArea
              id="secretOrRegret"
              name="secretOrRegret"
              value={formData.secretOrRegret}
              onChange={handleInputChange}
              placeholder="What secret or regret does your character carry?"
            />
          </FormGroup>
        </FormSection>

        {!characterBackstory ? (
          <NavigationFooter>
            <NextButton
              onClick={generateBackstory}
              disabled={
                !formData.childhoodEvent ||
                !formData.formativeExperience ||
                !formData.mentor ||
                !formData.goal ||
                !formData.secretOrRegret
              }
            >
              Create Backstory <FaArrowRight />
            </NextButton>
          </NavigationFooter>
        ) : (
          <ResultSection>
            {isLoading ? (
              <LoadingContainer>
                <ScrollAnimation />
                <LoadingText>Weaving your tale...</LoadingText>
              </LoadingContainer>
            ) : (
              <>
                <BackstoryScroll>
                  <BackstoryContent>{characterBackstory}</BackstoryContent>
                </BackstoryScroll>
                <ActionButtons>
                  <ActionButton onClick={copyToClipboard}>
                    <FaCopy /> Copy
                  </ActionButton>
                  <ViewToggle>
                    <ToggleLabel>
                      <input
                        type="checkbox"
                        checked={isFirstPerson}
                        onChange={() => {
                          setIsFirstPerson(!isFirstPerson);
                          if (characterBackstory) generateBackstory();
                        }}
                      />
                      {isFirstPerson ? "First Person" : "Third Person"}
                    </ToggleLabel>
                  </ViewToggle>
                </ActionButtons>
              </>
            )}
          </ResultSection>
        )}
      </Container>
    </PageTransition>
  );
};

export default BackstoryPage;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const unfurl = keyframes`
  from { height: 0; opacity: 0; }
  to { height: 200px; opacity: 1; }
`;

// Styled Components
const Container = styled.div<{ darkMode: boolean }>`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 80px;
  color: ${(props) => (props.darkMode ? "#E0DDE5" : "#333")};
  background-color: ${(props) => (props.darkMode ? "#1A1A2E" : "#f5f5f7")};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 1.5rem;
`;

const RandomizeButton = styled.button`
  background-color: #4a4a6a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5d5d8a;
  }
`;

const FormSection = styled.div`
  margin-top: 2rem;
  animation: ${slideUp} 0.5s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid rgba(100, 100, 150, 0.3);
  background-color: rgba(30, 30, 40, 0.7);
  color: #e0e0ff;
  font-family: inherit;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #6a6aff;
    box-shadow: 0 0 0 2px rgba(106, 106, 255, 0.2);
  }

  &::placeholder {
    color: rgba(200, 200, 220, 0.5);
  }
`;

const NavigationFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #6a6aff;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #5a5aee;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #4a4a6a;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultSection = styled.div`
  margin-top: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

const ScrollAnimation = styled.div`
  width: 60px;
  height: 80px;
  border: 3px solid #6a6aff;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
  animation: ${pulse} 2s infinite ease-in-out;

  &:before {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(106, 106, 255, 0.8);
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    animation: ${float} 2s infinite ease-in-out;
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #6a6aff;
`;

const BackstoryScroll = styled.div`
  background-color: rgba(30, 30, 40, 0.7);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(100, 100, 150, 0.3);
  max-height: 500px;
  overflow-y: auto;
  animation: ${unfurl} 1s ease-out;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(30, 30, 40, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(106, 106, 255, 0.5);
    border-radius: 4px;
  }
`;

const BackstoryContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-line;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4a4a6a;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5d5d8a;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input {
    margin: 0;
  }
`;
