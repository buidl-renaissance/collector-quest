import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaShare, FaRedo, FaDownload, FaHome } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import { useRace } from "@/hooks/useRace";
import { useTraits } from "@/hooks/useTraits";
import { useMotivation } from "@/hooks/useMotivation";
import { useCharacter } from "@/hooks/useCharacter";
import CharacterImage from "@/components/CharacterImage";
import CharacterDescription from "@/components/CharacterDescription";
import { useSex } from "@/hooks/useSex";

const CompletionPage: React.FC = () => {
  const router = useRouter();
  const { selectedClass } = useCharacterClass();
  const { selectedRace } = useRace();
  const { selectedTraits } = useTraits();
  const { motivation } = useMotivation();
  const { character } = useCharacter();
  const { selectedSex } = useSex();

  const handleStartNew = () => {
    // Clear all localStorage data
    localStorage.clear();
    router.push('/character/race');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Character',
        text: 'Check out my character!',
        url: window.location.href,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownload = () => {
    // Create a text file with character details
    const characterData = {
      name: character?.name,
      race: selectedRace,
      class: selectedClass,
      traits: selectedTraits,
      motivation: motivation,
      bio: character?.bio,
    };

    const blob = new Blob([JSON.stringify(characterData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${characterData.name || 'character'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PageTransition>
      <Page width="narrow">
        <HeroSection>
          <Title>Your Character is Complete!</Title>
          <Subtitle>
            Your legend has been forged. What will you do next?
          </Subtitle>
        </HeroSection>

        {selectedRace && selectedClass && (
          <CharacterSection>
            <CharacterImage
              race={selectedRace}
              characterClass={selectedClass}
              size="large"
            />
            <CharacterDescription
              race={selectedRace}
              characterClass={selectedClass}
              size="large"
            />
          </CharacterSection>
        )}

        <CharacterDetails>
          {character?.name && (
            <DetailSection>
              <DetailTitle>Name</DetailTitle>
              <DetailContent>{character.name}</DetailContent>
            </DetailSection>
          )}

          {selectedRace && (
            <DetailSection>
              <DetailTitle>Race</DetailTitle>
              <DetailContent>
                <strong>{selectedRace.name}</strong>
                <p>{selectedRace.description}</p>
                {selectedRace.accessory && (
                  <TraitGroup>
                    <TraitLabel>Accessory:</TraitLabel>
                    <TraitValue>{selectedRace.accessory}</TraitValue>
                  </TraitGroup>
                )}
              </DetailContent>
            </DetailSection>
          )}

          {selectedClass && (
            <DetailSection>
              <DetailTitle>Class</DetailTitle>
              <DetailContent>
                <strong>{selectedClass.name}</strong>
                <p>{selectedClass.description}</p>
                {selectedClass.abilities && selectedClass.abilities.length > 0 && (
                  <TraitGroup>
                    <TraitLabel>Class Abilities:</TraitLabel>
                    <TraitValue>
                      {selectedClass.abilities.map(ability => 
                        `${ability.name} (Level ${ability.level})`
                      ).join(", ")}
                    </TraitValue>
                  </TraitGroup>
                )}
              </DetailContent>
            </DetailSection>
          )}

          {selectedSex && (
            <DetailSection>
              <DetailTitle>Sex</DetailTitle>
              <DetailContent>
                <strong>{selectedSex.charAt(0).toUpperCase() + selectedSex.slice(1)}</strong>
              </DetailContent>
            </DetailSection>
          )}

          {character?.traits && (
            <DetailSection>
              <DetailTitle>Traits</DetailTitle>
              <DetailContent>
                {character.traits.personality && character.traits.personality.length > 0 && (
                  <TraitGroup>
                    <TraitLabel>Personality:</TraitLabel>
                    <TraitValue>{character.traits.personality.join(", ")}</TraitValue>
                  </TraitGroup>
                )}
                {character.traits.fear && character.traits.fear.length > 0 && (
                  <TraitGroup>
                    <TraitLabel>Fears:</TraitLabel>
                    <TraitValue>{character.traits.fear.join(", ")}</TraitValue>
                  </TraitGroup>
                )}
                {character.traits.memory && (
                  <TraitGroup>
                    <TraitLabel>Haunting Memory:</TraitLabel>
                    <TraitValue>{character.traits.memory}</TraitValue>
                  </TraitGroup>
                )}
                {character.traits.possession && (
                  <TraitGroup>
                    <TraitLabel>Treasured Possession:</TraitLabel>
                    <TraitValue>{character.traits.possession}</TraitValue>
                  </TraitGroup>
                )}
                {selectedTraits?.ideals && selectedTraits.ideals.length > 0 && (
                  <TraitGroup>
                    <TraitLabel>Ideals:</TraitLabel>
                    <TraitValue>{selectedTraits.ideals.join(", ")}</TraitValue>
                  </TraitGroup>
                )}
                {selectedTraits?.bonds && selectedTraits.bonds.length > 0 && (
                  <TraitGroup>
                    <TraitLabel>Bonds:</TraitLabel>
                    <TraitValue>{selectedTraits.bonds.join(", ")}</TraitValue>
                  </TraitGroup>
                )}
                {selectedTraits?.flaws && selectedTraits.flaws.length > 0 && (
                  <TraitGroup>
                    <TraitLabel>Flaws:</TraitLabel>
                    <TraitValue>{selectedTraits.flaws.join(", ")}</TraitValue>
                  </TraitGroup>
                )}
              </DetailContent>
            </DetailSection>
          )}

          {character?.motivation && (
            <DetailSection>
              <DetailTitle>Motivation</DetailTitle>
              <DetailContent>
                <p>{character.motivation}</p>
              </DetailContent>
            </DetailSection>
          )}

          {character?.bio && (
            <DetailSection>
              <DetailTitle>Biography</DetailTitle>
              <DetailContent>
                <BioText>{character.bio}</BioText>
              </DetailContent>
            </DetailSection>
          )}
        </CharacterDetails>

        <ActionSection>
          <ActionButton onClick={handleShare}>
            <FaShare /> Share Character
          </ActionButton>
          <ActionButton onClick={handleDownload}>
            <FaDownload /> Download Details
          </ActionButton>
          <ActionButton onClick={handleStartNew}>
            <FaRedo /> Create New Character
          </ActionButton>
          <ActionButton onClick={() => router.push('/')}>
            <FaHome /> Return Home
          </ActionButton>
        </ActionSection>

        <FireContainer>
          {[...Array(30)].map((_, i) => (
            <FireParticle key={i} delay={i * 0.1} />
          ))}
        </FireContainer>
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

const fireFloat = keyframes`
  0% { 
    transform: translateY(100vh) scale(0.3) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% { 
    transform: translateY(-20vh) scale(1) rotate(360deg);
    opacity: 0;
  }
`;

const fireGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px #ff4444,
                0 0 40px #ff8800,
                0 0 60px #ffaa00;
  }
  50% { 
    box-shadow: 0 0 30px #ff4444,
                0 0 50px #ff8800,
                0 0 70px #ffaa00;
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

const CharacterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.5s ease-in;
`;

const CharacterDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
  animation: ${fadeIn} 0.5s ease-in;
`;

const DetailSection = styled.div`
  background-color: rgba(26, 26, 46, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #444;
`;

const DetailTitle = styled.h3`
  font-size: 1.2rem;
  color: #bb8930;
  margin: 0 0 1rem 0;
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
`;

const DetailContent = styled.div`
  color: #c7bfd4;
  line-height: 1.6;

  p {
    margin: 0.5rem 0;
  }

  strong {
    color: #bb8930;
  }
`;

const TraitGroup = styled.div`
  margin: 0.5rem 0;
`;

const TraitLabel = styled.span`
  color: #bb8930;
  font-weight: 500;
  margin-right: 0.5rem;
`;

const TraitValue = styled.span`
  color: #c7bfd4;
`;

const ActionSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-in;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 8px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FireContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
`;

const FireParticle = styled.div<{ delay: number }>`
  position: absolute;
  width: ${() => Math.random() * 8 + 4}px;
  height: ${() => Math.random() * 8 + 4}px;
  background: radial-gradient(
    circle at center,
    #ffaa00 0%,
    #ff8800 50%,
    #ff4444 100%
  );
  border-radius: 50%;
  left: ${() => Math.random() * 100}vw;
  animation: ${fireFloat} 4s ease-out infinite,
             ${fireGlow} 2s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  filter: blur(1px);
  opacity: 0.8;
`;

const BioText = styled.p`
  color: #c7bfd4;
  line-height: 1.8;
  font-size: 1.1rem;
  white-space: pre-wrap;
  text-align: justify;
  margin: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border-left: 3px solid #bb8930;
`;

export default CompletionPage; 