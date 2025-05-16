import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  FaArrowLeft,
  FaRandom,
  FaPlus,
} from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import { useRace } from "@/hooks/useRace";
import Page from "@/components/Page";
import { BackButton } from "@/components/styled/character";
import { useCharacter, Traits } from "@/hooks/useCharacter";
import BottomNavigation from "@/components/BottomNavigation";
import { Title, Subtitle } from "@/components/styled/typography";
import {
  AddChipButton,
  Chip,
  ChipsContainer,
  CustomChipInput,
  CustomInput,
  Input,
  InputContainer,
  Label,
} from "@/components/styled/forms";
import { FormGroup, TextArea } from "@/components/styled/forms";
import { FormSection } from "@/components/styled/forms";
import { navigateTo } from "@/utils/navigation";

const CharacterTraitsPage: React.FC = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const { character, updateCharacter } = useCharacter();
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (!character || !name) return;
    
    // Create a copy of traits to avoid direct mutation
    const updatedTraits: Traits = { ...character.traits };
    
    // Handle the assignment based on the field type
    if (Array.isArray(updatedTraits[name as keyof Traits])) {
      // For array fields, we need to handle differently
      (updatedTraits[name as keyof Traits] as string[]) = [value];
    } else {
      // For string fields
      (updatedTraits[name as keyof Traits] as string) = value;
    }
    
    updateCharacter({
      ...character,
      traits: updatedTraits
    });
  };

  const handleAddCustomOption = (type: "personality" | "ideals" | "flaws") => {

    if (!character) return;
    if (type === "personality" && customPersonality.trim()) {
      setPersonalityOptions((prev) => [...prev, customPersonality.trim()]);
      updateCharacter({
        ...character,
        traits: {
          ...character.traits,
          personality: [...(character.traits?.personality || []), customPersonality.trim()]
        }
      });
      setCustomPersonality("");
    } else if (type === "ideals" && customIdeals.trim()) {
      setIdealsOptions((prev) => [...prev, customIdeals.trim()]);
      updateCharacter({
        ...character,
        traits: {
          ...character.traits,
          ideals: [...(character.traits?.ideals || []), customIdeals.trim()]
        }
      });
      setCustomIdeals("");
    } else if (type === "flaws" && customFlaws.trim()) {
      setFlawsOptions((prev) => [...prev, customFlaws.trim()]);
      updateCharacter({
        ...character,
        traits: {
          ...character.traits,
          flaws: [...(character.traits?.flaws || []), customFlaws.trim()]
        }
      });
      setCustomFlaws("");
    }
  };

  const handleSelectChip = (
    type: "personality" | "ideals" | "flaws",
    value: string
  ) => {
    if (!character) return;
    const currentValues = character.traits?.[type] as string[] ?? [];
    let updatedData;
    if (currentValues.includes(value)) {
      updatedData = {
        ...character,
        traits: {
          ...character.traits,
          [type]: currentValues.filter((item) => item !== value),
        },
      };
    } else {
      updatedData = {
        ...character,
        traits: {
          ...character.traits,
          [type]: [...currentValues, value],
        },
      };
    }
    console.log(updatedData);
    updateCharacter(updatedData);
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
      name: character?.name,
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

    updateCharacter({
      ...character,
      traits: randomizedData
    });
  };

  const handleBack = () => {
    navigateTo(router, "/character/image");
  };

  const handleNext = () => {
    navigateTo(router, "/character/motivation");
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
      character?.name &&
      (character?.traits?.personality?.length || 0) > 0 &&
      (character?.traits?.ideals?.length || 0) > 0 &&
      (character?.traits?.flaws?.length || 0) > 0 &&
      character?.traits?.hauntingMemory &&
      character?.traits?.treasuredPossession
    );
  };

  return (
    <PageTransition>
      <Page width="narrow">
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Character Image
        </BackButton>

        <HeroSection>
          <Title>Forge Your Legend in Seconds</Title>
          <Subtitle>
            Answer a few questions. Get a rich character backstory.
          </Subtitle>
        </HeroSection>

        <FormSection>

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
                  selected={character?.traits?.personality?.includes(option)}
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
                  selected={character?.traits?.ideals?.includes(option)}
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
                  selected={character?.traits?.flaws?.includes(option)}
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
              value={character?.traits?.hauntingMemory}
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
              value={character?.traits?.treasuredPossession}
              onChange={handleInputChange}
              placeholder="Describe your character's most treasured possession..."
            />
          </FormGroup>
        </FormSection>

        <BottomNavigation
          selectedItem={character?.name}
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

export default CharacterTraitsPage;
