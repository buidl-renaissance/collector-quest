import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useRouter } from "next/router";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import { FaArrowLeft } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { BackButton, Input } from "@/components/styled/character";
import { NextButton } from "@/components/styled/buttons";

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
  const { character, updateCharacter } = useCurrentCharacter();
  const [name, setName] = useState(character?.name || "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (character?.name) {
      setName(character.name);
    }
  }, [character]);

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

      router.push("/character/sex");
    } catch (err) {
      console.error("Error saving character name:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save character name"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isNameValid = name.trim().length > 2;

  return (
    <PageTransition>
      <Page width="narrow">
        <Title>Name Your Character</Title>

        <Description>
          Choose a name that reflects your character&apos;s personality and
          background. This name will be used throughout your adventure and by
          other players.
        </Description>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SectionTitle>Enter Character Name</SectionTitle>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your character's name"
          maxLength={50}
        />
        {isNameValid && (
          <ButtonContainer>
            <NextButton onClick={handleNext} disabled={isSaving}>
              {isSaving ? "Saving..." : "Next"}
            </NextButton>
          </ButtonContainer>
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
  font-size: 2rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  text-align: center;
  margin-top: 1rem;
`;

const Description = styled.p`
  color: #c7bfd4;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1rem;
`;

const SectionTitle = styled.h2`
  color: #bb8930;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-family: "Cormorant Garamond", serif;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #ff6b6b;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

export default NamePage;
