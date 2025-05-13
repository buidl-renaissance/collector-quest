import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaRandom,
  FaPlus,
  FaMicrophone,
  FaPencilAlt,
} from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import { useRace } from "@/hooks/useRace";
import Page from "@/components/Page";
import { BackButton, NextButton } from "@/components/styled/buttons";
import { useCharacter } from "@/hooks/useCharacter";
import BottomNavigation from "@/components/BottomNavigation";
import { Container, LoadingContainer } from "@/components/styled/layout";
import { Title, Subtitle } from "@/components/styled/typography";
import {
  AddChipButton,
  Chip,
  ChipsContainer,
  CustomChipInput,
  CustomInput,
  Input,
  InputContainer,
  InputButton,
  InputButtons,
  Label,
} from "@/components/styled/forms";
import { FormGroup, TextArea } from "@/components/styled/forms";
import { FormSection } from "@/components/styled/forms";

const CharacterBioPage: React.FC = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [characterBio, setCharacterBio] = useState("");
  const { character } = useCharacter();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const { selectedRace, loading: raceLoading } = useRace();

  // State for custom options
  const [customPersonality, setCustomPersonality] = useState("");
  const [customIdeals, setCustomIdeals] = useState("");
  const [customFlaws, setCustomFlaws] = useState("");

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
  const [idealsOptions, setIdealsOptions] = useState([
    "Revenge",
    "Knowledge",
    "Wealth",
    "Glory",
    "Power",
    "Justice",
    "Freedom",
    "Love",
  ]);
  const [flawsOptions, setFlawsOptions] = useState([
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
    ideals: [] as string[],
    bonds: [] as string[],
    flaws: [] as string[],
    hauntingMemory: "",
    treasuredPossession: "",
  });

  const [isRecording, setIsRecording] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFormData = localStorage.getItem("selectedTraits");
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        // Transform old format to new format if needed
        if (parsedData.motivation || parsedData.fear) {
          const transformedData = {
            name: parsedData.name || "",
            personality: parsedData.personality || [],
            ideals: parsedData.motivation || [],
            bonds: [parsedData.hauntingMemory].filter(Boolean),
            flaws: parsedData.fear || [],
            hauntingMemory: parsedData.hauntingMemory || "",
            treasuredPossession: parsedData.treasuredPossession || "",
          };
          setFormData(transformedData);
          localStorage.setItem(
            "selectedTraits",
            JSON.stringify(transformedData)
          );
        } else {
          setFormData(parsedData);
        }
      }

      const savedName = localStorage.getItem("characterName");
      if (savedName) {
        setFormData((prev) => ({ ...prev, name: savedName }));
      }

      const savedPersonality = localStorage.getItem("personality");
      if (savedPersonality) {
        setPersonalityOptions(JSON.parse(savedPersonality));
      }

      const savedIdeals = localStorage.getItem("ideals");
      if (savedIdeals) {
        setIdealsOptions(JSON.parse(savedIdeals));
      }

      const savedFlaws = localStorage.getItem("flaws");
      if (savedFlaws) {
        setFlawsOptions(JSON.parse(savedFlaws));
      }

      const savedBio = localStorage.getItem("characterBio");
      if (savedBio) {
        setCharacterBio(savedBio);
      }

      const savedIsFirstPerson = localStorage.getItem("isFirstPerson");
      if (savedIsFirstPerson) {
        setIsFirstPerson(JSON.parse(savedIsFirstPerson));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && characterBio) {
      localStorage.setItem("characterBio", characterBio);
    }
  }, [characterBio]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isFirstPerson", JSON.stringify(isFirstPerson));
    }
  }, [isFirstPerson]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      localStorage.setItem("selectedTraits", JSON.stringify(updatedData));
      return updatedData;
    });
    if (name === "name") {
      localStorage.setItem("characterName", value);
    }
  };

  const handleAddCustomOption = (type: "personality" | "ideals" | "flaws") => {
    if (type === "personality" && customPersonality.trim()) {
      setPersonalityOptions((prev) => [...prev, customPersonality.trim()]);
      setFormData((prev) => {
        const updatedData = {
          ...prev,
          personality: [...prev.personality, customPersonality.trim()],
        };
        console.log(updatedData);
        localStorage.setItem("selectedTraits", JSON.stringify(updatedData));
        return updatedData;
      });
      setCustomPersonality("");
    } else if (type === "ideals" && customIdeals.trim()) {
      setIdealsOptions((prev) => [...prev, customIdeals.trim()]);
      setFormData((prev) => {
        const updatedData = {
          ...prev,
          ideals: [...prev.ideals, customIdeals.trim()],
        };
        localStorage.setItem("selectedTraits", JSON.stringify(updatedData));
        return updatedData;
      });
      setCustomIdeals("");
    } else if (type === "flaws" && customFlaws.trim()) {
      setFlawsOptions((prev) => [...prev, customFlaws.trim()]);
      setFormData((prev) => {
        const updatedData = {
          ...prev,
          flaws: [...prev.flaws, customFlaws.trim()],
        };
        localStorage.setItem("selectedTraits", JSON.stringify(updatedData));
        return updatedData;
      });
      setCustomFlaws("");
    }
  };

  const handleSelectChip = (
    type: "personality" | "ideals" | "flaws",
    value: string
  ) => {
    setFormData((prev) => {
      const currentValues = prev[type] as string[];
      let updatedData;
      if (currentValues.includes(value)) {
        updatedData = {
          ...prev,
          [type]: currentValues.filter((item) => item !== value),
        };
      } else {
        updatedData = {
          ...prev,
          [type]: [...currentValues, value],
        };
      }
      console.log(updatedData);
      localStorage.setItem("selectedTraits", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleRandomize = () => {
    // This would be expanded with actual random options
    const randomPersonality = [
      personalityOptions[Math.floor(Math.random() * personalityOptions.length)],
    ];
    const randomIdeals = [
      idealsOptions[Math.floor(Math.random() * idealsOptions.length)],
    ];
    const randomFlaws = [
      flawsOptions[Math.floor(Math.random() * flawsOptions.length)],
    ];

    const randomizedData = {
      name: ["Thorne Blackwood", "Lyra Stormwhisper", "Galen Fireheart"][
        Math.floor(Math.random() * 3)
      ],
      personality: randomPersonality,
      ideals: randomIdeals,
      bonds: [
        [
          "A village burning",
          "A lost love",
          "A broken promise",
          "A mysterious stranger",
        ][Math.floor(Math.random() * 4)],
      ],
      flaws: randomFlaws,
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
    };

    localStorage.setItem("selectedTraits", JSON.stringify(randomizedData));
    setFormData(randomizedData);
  };

  const handleBack = () => {
    router.push("/character/class");
  };

  const handleNext = () => {
    if (characterBio) {
      router.push("/character/motivation");
    }
  };

  const generateBio = async () => {
    setIsLoading(true);

    try {
      if (!selectedRace || !selectedClass) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/character/generate-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          race: {
            name: selectedRace.name,
            description: selectedRace.description || "",
          },
          class: {
            name: selectedClass.name,
            description: selectedClass.description || "",
          },
          sex: character?.sex || "",
          personality: formData.personality,
          motivation: formData.ideals,
          fear: formData.flaws,
          hauntingMemory: formData.hauntingMemory,
          treasuredPossession: formData.treasuredPossession,
          isFirstPerson,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate bio");
      }

      const data = await response.json();
      setCharacterBio(data.bio);
    } catch (error) {
      console.error("Error generating bio:", error);
      // Fallback to the original bio generation if the API call fails
      if (!selectedRace || !selectedClass) {
        setIsLoading(false);
        return;
      }

      const personalityText =
        formData.personality.length > 0
          ? formData.personality.join(", ").replace(/, ([^,]*)$/, " and $1")
          : "mysterious";

      const motivationText =
        formData.ideals.length > 0
          ? formData.ideals.join(", ").replace(/, ([^,]*)$/, " and $1")
          : "survival";

      const fearText =
        formData.flaws.length > 0
          ? formData.flaws.join(", ").replace(/, ([^,]*)$/, " and $1")
          : "the unknown";

      const raceClassContext = `${selectedRace.name} ${selectedClass.name}`;
      const raceDescription = selectedRace.description
        ? selectedRace.description.split(".")[0]
        : "";
      const classDescription = selectedClass.description
        ? selectedClass.description.split(".")[0]
        : "";
      const raceClassDescription = [raceDescription, classDescription]
        .filter(Boolean)
        .join(". ");

      const firstPersonBio = `I am ${formData.name}, a ${personalityText} ${raceClassContext}. ${raceClassDescription} My quest for ${motivationText} drives me forward, though I am haunted by ${formData.hauntingMemory}. Above all, I fear ${fearText}, yet I find comfort in my most treasured possession: ${formData.treasuredPossession}.`;

      const thirdPersonBio = `${formData.name} is a ${personalityText} ${raceClassContext}. ${raceClassDescription} Driven by a desire for ${motivationText}, they push forward despite being haunted by ${formData.hauntingMemory}. Though they deeply fear ${fearText}, they find solace in their most treasured possession: ${formData.treasuredPossession}.`;

      setCharacterBio(isFirstPerson ? firstPersonBio : thirdPersonBio);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Add speech recognition logic here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Add stop recording logic here
  };

  // Redirect if no race or class is selected
  React.useEffect(() => {
    if (!raceLoading && !classLoading) {
      if (!selectedRace) {
        router.push("/character/race");
      }
    }
  }, [selectedRace, raceLoading, classLoading, router]);

  const isFormComplete = () => {
    return (
      formData.name &&
      formData.personality.length > 0 &&
      formData.ideals.length > 0 &&
      formData.flaws.length > 0 &&
      formData.hauntingMemory &&
      formData.treasuredPossession
    );
  };

  return (
    <PageTransition>
      <Page width="narrow">
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Class Selection
        </BackButton>

        <HeroSection>
          <Title>Forge Your Legend in Seconds</Title>
          <Subtitle>
            Answer a few questions. Get a rich character backstory.
          </Subtitle>
        </HeroSection>

        <FormSection>
          <FormGroup>
            <Label htmlFor="name">Character Name</Label>
            <InputContainer>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your character's name"
              />
              {/* <InputButtons>
                  <InputButton
                    onClick={handleStartRecording}
                    disabled={isRecording}
                  >
                    <FaMicrophone />
                  </InputButton>
                  <InputButton>
                    <FaPencilAlt />
                  </InputButton>
                </InputButtons> */}
            </InputContainer>
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
            <Label htmlFor="ideals">
              Primary Motivations (select multiple)
            </Label>
            <ChipsContainer>
              {idealsOptions.map((option, index) => (
                <Chip
                  key={index}
                  selected={formData.ideals.includes(option)}
                  onClick={() => handleSelectChip("ideals", option)}
                >
                  {option}
                </Chip>
              ))}
              <CustomChipInput>
                <CustomInput
                  type="text"
                  value={customIdeals}
                  onChange={(e) => setCustomIdeals(e.target.value)}
                  placeholder="Add custom motivation"
                />
                <AddChipButton onClick={() => handleAddCustomOption("ideals")}>
                  <FaPlus />
                </AddChipButton>
              </CustomChipInput>
            </ChipsContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="flaws">Greatest Fears (select multiple)</Label>
            <ChipsContainer>
              {flawsOptions.map((option, index) => (
                <Chip
                  key={index}
                  selected={formData.flaws.includes(option)}
                  onClick={() => handleSelectChip("flaws", option)}
                >
                  {option}
                </Chip>
              ))}
              <CustomChipInput>
                <CustomInput
                  type="text"
                  value={customFlaws}
                  onChange={(e) => setCustomFlaws(e.target.value)}
                  placeholder="Add custom fear"
                />
                <AddChipButton onClick={() => handleAddCustomOption("flaws")}>
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
                formData.ideals.length === 0 ||
                formData.flaws.length === 0 ||
                !formData.hauntingMemory ||
                !formData.treasuredPossession ||
                !selectedRace ||
                !selectedClass
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
              </LoadingContainer>
            ) : (
              <>
                <BioScroll>
                  <BioContent>{characterBio}</BioContent>
                </BioScroll>
              </>
            )}
          </ResultSection>
        )}

        <BottomNavigation
          selectedItem={formData.name}
          selectedItemLabel="Character Name"
          onNext={handleNext}
          disabled={!isFormComplete()}
        />
      </Page>
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

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-out;
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

const NavigationFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-in;
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
  padding: 1rem;
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

export default CharacterBioPage;
