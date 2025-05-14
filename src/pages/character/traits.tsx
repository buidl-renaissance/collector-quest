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
import { useCharacter } from "@/hooks/useCharacter";
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

const CharacterTraitsPage: React.FC = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
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
    }
  }, []);

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
    router.push("/character/image");
  };

  const handleNext = () => {
    router.push("/character/motivation");
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
          <FaArrowLeft /> Back to Character Image
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
