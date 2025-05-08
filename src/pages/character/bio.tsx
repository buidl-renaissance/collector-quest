import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCopy,
  FaRandom,
  FaMoon,
  FaSun,
  FaPlus,
} from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { GetServerSidePropsContext } from "next";
import { getRaceById } from "@/db/races";
import { CharacterClass, getCharacterClassById } from "@/data/classes";
import { Race } from "@/data/races";
import CharacterImage from "@/components/CharacterImage";
import CharacterDescription from "@/components/CharacterDescription";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { race, class: characterClass } = context.query;

  const dbRace = await getRaceById(race as string);
  const dbClass = await getCharacterClassById(characterClass as string);

  return {
    props: { race: dbRace, class: dbClass },
  };
};

const CharacterBioPage: React.FC<{ race: Race; class: CharacterClass }> = ({
  race,
  class: selectedClass,
}) => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [characterBio, setCharacterBio] = useState("");

  // State for custom options
  const [customPersonality, setCustomPersonality] = useState("");
  const [customMotivation, setCustomMotivation] = useState("");
  const [customFear, setCustomFear] = useState("");

  // State for option arrays
  const [personalityOptions, setPersonalityOptions] = useState([
    "Brooding",
    "Cheerful",
    "Suspicious",
    "Bold",
    "Cautious",
    "Eccentric",
    "Honorable",
    "Mischievous",
  ]);
  const [motivationOptions, setMotivationOptions] = useState([
    "Revenge",
    "Knowledge",
    "Wealth",
    "Glory",
    "Power",
    "Justice",
    "Freedom",
    "Love",
  ]);
  const [fearOptions, setFearOptions] = useState([
    "Darkness",
    "Failure",
    "Betrayal",
    "Loss",
    "Confinement",
    "The Unknown",
    "Death",
    "Being Forgotten",
  ]);

  const [formData, setFormData] = useState({
    name: "",
    personality: [] as string[],
    motivation: [] as string[],
    fear: [] as string[],
    hauntingMemory: "",
    treasuredPossession: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomOption = (
    type: "personality" | "motivation" | "fear"
  ) => {
    if (type === "personality" && customPersonality.trim()) {
      setPersonalityOptions((prev) => [...prev, customPersonality.trim()]);
      setFormData((prev) => ({
        ...prev,
        personality: [...prev.personality, customPersonality.trim()],
      }));
      setCustomPersonality("");
    } else if (type === "motivation" && customMotivation.trim()) {
      setMotivationOptions((prev) => [...prev, customMotivation.trim()]);
      setFormData((prev) => ({
        ...prev,
        motivation: [...prev.motivation, customMotivation.trim()],
      }));
      setCustomMotivation("");
    } else if (type === "fear" && customFear.trim()) {
      setFearOptions((prev) => [...prev, customFear.trim()]);
      setFormData((prev) => ({
        ...prev,
        fear: [...prev.fear, customFear.trim()],
      }));
      setCustomFear("");
    }
  };

  const handleSelectChip = (
    type: "personality" | "motivation" | "fear",
    value: string
  ) => {
    setFormData((prev) => {
      const currentValues = prev[type] as string[];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [type]: currentValues.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [type]: [...currentValues, value],
        };
      }
    });
  };

  const handleRandomize = () => {
    // This would be expanded with actual random options
    const randomPersonality = [
      personalityOptions[Math.floor(Math.random() * personalityOptions.length)],
    ];
    const randomMotivation = [
      motivationOptions[Math.floor(Math.random() * motivationOptions.length)],
    ];
    const randomFear = [
      fearOptions[Math.floor(Math.random() * fearOptions.length)],
    ];

    setFormData({
      name: ["Thorne Blackwood", "Lyra Stormwhisper", "Galen Fireheart"][
        Math.floor(Math.random() * 3)
      ],
      personality: randomPersonality,
      motivation: randomMotivation,
      fear: randomFear,
      hauntingMemory: [
        "A village burning",
        "A lost love",
        "A broken promise",
        "A mysterious stranger",
      ][Math.floor(Math.random() * 4)],
      treasuredPossession: [
        "A family heirloom",
        "A mysterious map",
        "A mentor's gift",
        "A token of victory",
      ][Math.floor(Math.random() * 4)],
    });
  };

  const handleBack = () => {
    router.push("/character/class");
  };

  const generateBio = () => {
    setIsLoading(true);

    // Simulate API call or processing time
    setTimeout(() => {
      const personalityText =
        formData.personality.length > 0
          ? formData.personality.join(", ").replace(/, ([^,]*)$/, " and $1")
          : "mysterious";

      const motivationText =
        formData.motivation.length > 0
          ? formData.motivation.join(", ").replace(/, ([^,]*)$/, " and $1")
          : "survival";

      const fearText =
        formData.fear.length > 0
          ? formData.fear.join(", ").replace(/, ([^,]*)$/, " and $1")
          : "the unknown";

      const firstPersonBio = `I am ${formData.name}, a ${personalityText} ${race.name} ${selectedClass.name}. My quest for ${motivationText} drives me forward, though I am haunted by ${formData.hauntingMemory}. Above all, I fear ${fearText}, yet I find comfort in my most treasured possession: ${formData.treasuredPossession}.`;

      const thirdPersonBio = `${formData.name} is a ${personalityText} ${race.name} ${selectedClass.name}. Driven by a desire for ${motivationText}, they push forward despite being haunted by ${formData.hauntingMemory}. Though they deeply fear ${fearText}, they find solace in their most treasured possession: ${formData.treasuredPossession}.`;

      setCharacterBio(isFirstPerson ? firstPersonBio : thirdPersonBio);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(characterBio);
    // Could add a toast notification here
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
          <Title>Forge Your Legend in Seconds</Title>
          <Subtitle>
            Answer a few questions. Get a rich character backstory.
          </Subtitle>
        </HeroSection>

        <StepTitle>Create Your Character</StepTitle>

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
            <Label htmlFor="name">Character Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your character's name"
            />
          </FormGroup>

          <RandomizeButton onClick={handleRandomize}>
            <FaRandom /> Randomize All
          </RandomizeButton>

          <FormGroup>
            <Label htmlFor="personality">
              Personality Traits (select multiple)
            </Label>
            <ChipsContainer>
              {personalityOptions.map((option, index) => (
                <Chip
                  key={index}
                  selected={formData.personality.includes(option)}
                  onClick={() => handleSelectChip("personality", option)}
                >
                  {option}
                </Chip>
              ))}
              <CustomChipInput>
                <CustomInput
                  type="text"
                  value={customPersonality}
                  onChange={(e) => setCustomPersonality(e.target.value)}
                  placeholder="Add custom trait"
                />
                <AddChipButton
                  onClick={() => handleAddCustomOption("personality")}
                >
                  <FaPlus />
                </AddChipButton>
              </CustomChipInput>
            </ChipsContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="motivation">
              Primary Motivations (select multiple)
            </Label>
            <ChipsContainer>
              {motivationOptions.map((option, index) => (
                <Chip
                  key={index}
                  selected={formData.motivation.includes(option)}
                  onClick={() => handleSelectChip("motivation", option)}
                >
                  {option}
                </Chip>
              ))}
              <CustomChipInput>
                <CustomInput
                  type="text"
                  value={customMotivation}
                  onChange={(e) => setCustomMotivation(e.target.value)}
                  placeholder="Add custom motivation"
                />
                <AddChipButton
                  onClick={() => handleAddCustomOption("motivation")}
                >
                  <FaPlus />
                </AddChipButton>
              </CustomChipInput>
            </ChipsContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="fear">Greatest Fears (select multiple)</Label>
            <ChipsContainer>
              {fearOptions.map((option, index) => (
                <Chip
                  key={index}
                  selected={formData.fear.includes(option)}
                  onClick={() => handleSelectChip("fear", option)}
                >
                  {option}
                </Chip>
              ))}
              <CustomChipInput>
                <CustomInput
                  type="text"
                  value={customFear}
                  onChange={(e) => setCustomFear(e.target.value)}
                  placeholder="Add custom fear"
                />
                <AddChipButton onClick={() => handleAddCustomOption("fear")}>
                  <FaPlus />
                </AddChipButton>
              </CustomChipInput>
            </ChipsContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="hauntingMemory">A Memory That Haunts You</Label>
            <TextArea
              id="hauntingMemory"
              name="hauntingMemory"
              value={formData.hauntingMemory}
              onChange={handleInputChange}
              placeholder="Describe a memory that haunts your character..."
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="treasuredPossession">
              Most Treasured Possession
            </Label>
            <TextArea
              id="treasuredPossession"
              name="treasuredPossession"
              value={formData.treasuredPossession}
              onChange={handleInputChange}
              placeholder="Describe your character's most treasured possession..."
            />
          </FormGroup>
        </FormSection>

        {!characterBio ? (
          <NavigationFooter>
            <NextButton
              onClick={generateBio}
              disabled={
                !formData.name ||
                formData.personality.length === 0 ||
                formData.motivation.length === 0 ||
                formData.fear.length === 0 ||
                !formData.hauntingMemory ||
                !formData.treasuredPossession
              }
            >
              Create Bio <FaArrowRight />
            </NextButton>
          </NavigationFooter>
        ) : (
          <ResultSection>
            {isLoading ? (
              <LoadingContainer>
                <ScrollAnimation />
                <LoadingText>Crafting your legend...</LoadingText>
              </LoadingContainer>
            ) : (
              <>
                <BioScroll>
                  <BioContent>{characterBio}</BioContent>
                </BioScroll>
                <ActionButtons>
                  {/* <ActionButton onClick={copyToClipboard}>
                    <FaCopy /> Copy
                  </ActionButton> */}
                  <ActionButton onClick={() => router.push("/character/backstory")}>
                    Generate Backstory
                  </ActionButton>
                  <ViewToggle>
                    <ToggleLabel>
                      <input
                        type="checkbox"
                        checked={isFirstPerson}
                        onChange={() => {
                          setIsFirstPerson(!isFirstPerson);
                          if (characterBio) generateBio();
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
  background-color: ${(props) => (props.darkMode ? "#1a1a2e" : "#f5f5f7")};
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #bb8930;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s;

  &:hover {
    color: #d4a959;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: #bb8930;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #d4a959;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #c7bfd4;
  margin-bottom: 2rem;
`;

const RandomizeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto 2rem;
  padding: 0.6rem 1.2rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
  }
`;

const StepTitle = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  color: #bb8930;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-in;
`;

const FormSection = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #c7bfd4;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 4px;
  color: inherit;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;

  &:focus {
    border-color: #bb8930;
    outline: none;
  }
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CustomChipInput = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.2s;

  &:focus-within {
    border-color: #bb8930;
  }
`;

const CustomInput = styled.input`
  background: transparent;
  border: none;
  padding: 0.5rem 0.8rem;
  font-size: 0.9rem;
  color: inherit;
  font-family: "Cormorant Garamond", serif;
  width: 150px;

  &:focus {
    outline: none;
  }
`;

const AddChipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  margin-right: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #d4a959;
  }
`;

const Chip = styled.div<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${(props) =>
    props.selected ? "rgba(187, 137, 48, 0.4)" : "rgba(58, 51, 71, 0.3)"};
  border: 1px solid ${(props) => (props.selected ? "#bb8930" : "#3a3347")};
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
    border-color: #bb8930;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 4px;
  color: inherit;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;

  &:focus {
    border-color: #bb8930;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 4px;
  color: inherit;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #bb8930;
    outline: none;
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

  &:disabled {
    background-color: #3a3347;
    cursor: not-allowed;
  }
`;

const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-in;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const ScrollAnimation = styled.div`
  width: 60px;
  height: 80px;
  background-color: #bb8930;
  border-radius: 8px;
  position: relative;
  margin-bottom: 1rem;
  animation: ${float} 2s infinite ease-in-out;

  &:before,
  &:after {
    content: "";
    position: absolute;
    background-color: rgba(187, 137, 48, 0.3);
    border-radius: 4px;
  }

  &:before {
    width: 40px;
    height: 6px;
    top: 20px;
    left: 10px;
  }

  &:after {
    width: 40px;
    height: 6px;
    top: 34px;
    left: 10px;
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #bb8930;
`;

const BioScroll = styled.div`
  background-color: rgba(58, 51, 71, 0.2);
  border: 1px solid #bb8930;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
  animation: ${unfurl} 1s ease-out;
`;

const BioContent = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
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
  color: #c7bfd4;

  input {
    margin: 0;
  }
`;

const InspirationGallery = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #3a3347;
`;

const GalleryTitle = styled.h3`
  font-size: 1.5rem;
  color: #bb8930;
  margin-bottom: 1rem;
  text-align: center;
`;

const ExampleBios = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ExampleBio = styled.div`
  background-color: rgba(58, 51, 71, 0.2);
  border: 1px solid #3a3347;
  border-radius: 8px;
  padding: 1.5rem;
  font-style: italic;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export default CharacterBioPage;
