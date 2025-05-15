import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useRouter } from "next/router";
import { useCharacter } from "@/hooks/useCharacter";
import { FaArrowLeft } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { BackButton } from "@/components/styled/character";
import BottomNavigation from "@/components/BottomNavigation";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const NamePage = () => {
  const router = useRouter();
  const { character, updateCharacter } = useCharacter();
  const [name, setName] = useState(character?.name || "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    if (!name.trim()) {
      setError("Please enter a name for your character");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await updateCharacter({
        ...character,
        name: name.trim(),
      });

      router.push("/character/image");
    } catch (err) {
      console.error("Error saving character name:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save character name"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push("/character/class");
  };

  const isNameValid = name.trim().length > 2;

  return (
    <PageTransition>
      <Page width="narrow">
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Class Selection
        </BackButton>

        <Title>Name Your Character</Title>
        
        <Description>
          Choose a name that reflects your character&apos;s personality and background.
          This name will be used throughout your adventure and by other players.
        </Description>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Section>
          <SectionTitle>Enter Character Name</SectionTitle>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your character's name"
            maxLength={50}
          />
        </Section>

        {isNameValid && (
          <BottomNavigation
            selectedItem={name}
            selectedItemLabel="Character Name"
            onNext={handleNext}
            disabled={isSaving}
          />
        )}
      </Page>
    </PageTransition>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 80px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Description = styled.p`
  color: #c7bfd4;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const Section = styled.div`
  background-color: rgba(26, 26, 46, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #bb8930;
  animation: ${slideUp} 0.5s ease-out;
`;

const SectionTitle = styled.h2`
  color: #bb8930;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-family: "Cormorant Garamond", serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: rgba(26, 26, 46, 0.9);
  border: 2px solid #bb8930;
  border-radius: 4px;
  color: #e0dde5;
  font-size: 1rem;
  font-family: "Cormorant Garamond", serif;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #d4a959;
    box-shadow: 0 0 0 2px rgba(187, 137, 48, 0.2);
  }

  &::placeholder {
    color: #c7bfd4;
    opacity: 0.7;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #ff6b6b;
`;

export default NamePage; 