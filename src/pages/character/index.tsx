import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  FaCheckCircle,
  FaFeather,
  FaPlus,
  FaSpinner,
  FaUserPlus,
  FaCopy,
  FaWallet,
} from "react-icons/fa";
import Image from "next/image";
import { GetServerSideProps } from "next";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { Title, Subtitle, SectionTitle } from "@/components/styled/typography";
import { CharacterDB } from "@/db/character";
import { Character } from "@/data/character";
import { Artifact } from "@/data/artifacts";
import CharacterBio from "@/components/CharacterBio";
import useModal from "@/hooks/useModal";
import { useCharacterRegistration } from "@/hooks/web3/useCharacterRegistration";
import { useCharacter } from "@/hooks/useCharacter";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";

interface CharacterPageProps {
  character: Character | null;
}

interface Realm {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  kingdomName: string;
  guardians: string[];
  invitationOnly: boolean;
  requiresVerification: boolean;
  createdAt: string;
}

const CharacterPage: React.FC<CharacterPageProps> = () => {
  const router = useRouter();
  const { openModal, closeModal, modalContent, Modal } = useModal();
  const { character, fetchCharacter } = useCharacter();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loadingArtifacts, setLoadingArtifacts] = useState(true);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [loadingRealms, setLoadingRealms] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { registerCharacter, isRegistering, registeredCharacter } =
    useCharacterRegistration();
  const wallet = useWallet();

  useEffect(() => {
    fetchArtifacts();
    fetchCharacter();
  }, []);

  const fetchArtifacts = async () => {
    try {
      const response = await fetch(
        `/api/characters/${character?.id}/artifacts`
      );
      if (!response.ok) throw new Error("Failed to fetch artifacts");
      const data = await response.json();
      setArtifacts(data);
    } catch (error) {
      console.error("Error fetching artifacts:", error);
    } finally {
      setLoadingArtifacts(false);
    }
  };

  // const fetchRealms = async () => {
  //   try {
  //     const response = await fetch(`/api/characters/${character?.id}/realms`);
  //     if (!response.ok) throw new Error('Failed to fetch realms');
  //     const data = await response.json();
  //     setRealms(data);
  //   } catch (error) {
  //     console.error('Error fetching realms:', error);
  //   } finally {
  //     setLoadingRealms(false);
  //   }
  // };

  const handleCreateArtifact = () => {
    router.push("/artifacts/create");
  };

  const handleRegisterCharacter = async () => {
    if (!character) {
      openModal("Error", "Character data is missing.");
      return;
    }

    setIsCreating(true);
    try {
      await registerCharacter();
    } catch (error) {
      console.error("Error registering character:", error);
      openModal(
        "Registration Failed",
        <div>
          <p>Failed to register character. Please try again later.</p>
          <p>
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (!character) {
    return (
      <PageTransition>
        <Page>
          <ErrorContainer>
            <ErrorTitle>Character Not Found</ErrorTitle>
            <ErrorMessage>
              We couldn&apos;t find this character. It may have been deleted or
              doesn&apos;t exist.
            </ErrorMessage>
            {/* <BackButton onClick={handleBack}>
              <FaArrowLeft /> Return Home
            </BackButton> */}
          </ErrorContainer>
        </Page>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Page>
        {/* <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back
        </BackButton> */}

        <CharacterContainer>
          <CharacterHeader>
            <CharacterImageWrapper>
              {character.image_url ? (
                <CharacterImageContainer>
                  <Image
                    src={character.image_url}
                    alt={character.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </CharacterImageContainer>
              ) : (
                <CharacterImagePlaceholder>
                  <FaFeather />
                  <span>No image available</span>
                </CharacterImagePlaceholder>
              )}
            </CharacterImageWrapper>
            <CharacterTitle>{character.name}</CharacterTitle>
            <CharacterSubtitle>
              {character.race?.name} • {character.class?.name}
            </CharacterSubtitle>
          </CharacterHeader>

          <CharacterContent>
            <CharacterImageSection>
              <BioCardContainer>
                <CharacterSectionTitle>Backstory</CharacterSectionTitle>
                <CharacterBio character={character} openModal={openModal} />
              </BioCardContainer>

              <RegisterSection>
                {!wallet.connected ? (
                  <>
                    <RegisterTitle>Connect Your Wallet</RegisterTitle>
                    <RegisterDescription>
                      Connect your Sui wallet to register your character and
                      begin your journey.
                    </RegisterDescription>
                    <StyledConnectButton>
                      <FaWallet /> Connect Wallet
                    </StyledConnectButton>
                  </>
                ) : character.registration_id ? (
                  <>
                    <RegisterTitle>Character Registered!</RegisterTitle>
                    <RegisterDescription>
                      Your character has been successfully registered on the
                      blockchain. You can now create artifacts, join realms, and
                      begin your journey.
                    </RegisterDescription>
                    <RegistredCharacter
                      onClick={() => {
                        if (character.registration_id) {
                          navigator.clipboard.writeText(
                            character.registration_id
                          );
                          openModal(
                            "Success",
                            "Character ID copied to clipboard!"
                          );
                        }
                      }}
                      data-full-id={character.registration_id}
                    >
                      <FaCheckCircle />
                      <span>
                        {character.registration_id.slice(0, 6)}...
                        {character.registration_id.slice(-4)}
                      </span>
                      <CopyButton
                        onClick={(e) => {
                          e.stopPropagation();
                          if (character.registration_id) {
                            navigator.clipboard.writeText(
                              character.registration_id
                            );
                            openModal(
                              "Success",
                              "Character ID copied to clipboard!"
                            );
                          }
                        }}
                      >
                        <FaCopy />
                      </CopyButton>
                    </RegistredCharacter>
                  </>
                ) : (
                  <>
                    <RegisterTitle>Begin Your Quest</RegisterTitle>
                    <RegisterDescription>
                      Register your character to begin your journey. Create and
                      discover artifacts, join realms, and forge your legacy.
                    </RegisterDescription>
                    <RegisterButton
                      onClick={handleRegisterCharacter}
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <FaSpinner className="animate-spin" /> Registering...
                        </>
                      ) : (
                        <>
                          <FaUserPlus /> Register Character
                        </>
                      )}
                    </RegisterButton>
                  </>
                )}
              </RegisterSection>

              {character.registration_id && (
                <ArtifactsSection>
                  <CharacterSectionTitle>Artifacts</CharacterSectionTitle>
                  {loadingArtifacts ? (
                    <LoadingText>Loading artifacts...</LoadingText>
                  ) : artifacts.length > 0 ? (
                    <ArtifactsGrid>
                      {artifacts.map((artifact) => (
                        <ArtifactCard
                          key={artifact.id}
                          onClick={() =>
                            router.push(`/artifacts/${artifact.id}`)
                          }
                        >
                          <ArtifactImageContainer>
                            <Image
                              src={artifact.imageUrl}
                              alt={artifact.title}
                              layout="fill"
                              objectFit="cover"
                            />
                          </ArtifactImageContainer>
                          <ArtifactInfo>
                            <ArtifactTitle>{artifact.title}</ArtifactTitle>
                            <ArtifactArtist>
                              By {artifact.artist}, {artifact.year}
                            </ArtifactArtist>
                            <BadgeContainer>
                              <Badge>{artifact.properties.rarity}</Badge>
                              <Badge>{artifact.properties.element}</Badge>
                            </BadgeContainer>
                          </ArtifactInfo>
                        </ArtifactCard>
                      ))}
                    </ArtifactsGrid>
                  ) : (
                    <EmptyState>
                      <EmptyStateText>No artifacts found</EmptyStateText>
                      <CreateArtifactButton onClick={handleCreateArtifact}>
                        <FaPlus /> Create Artifact
                      </CreateArtifactButton>
                    </EmptyState>
                  )}
                </ArtifactsSection>
              )}
            </CharacterImageSection>
          </CharacterContent>
        </CharacterContainer>

        <Modal
          isOpen={modalContent.isOpen}
          onClose={closeModal}
          title={modalContent.title}
        >
          {modalContent.content}
        </Modal>
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

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const CharacterContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in-out;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 2rem;
`;

const CharacterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const CharacterImageWrapper = styled.div`
  width: 256px;
  height: 256px;
  margin-bottom: 0.5rem;
`;

const CharacterImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 2px solid #4a3b6b;
`;

const CharacterImagePlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #2d2d44;
  border-radius: 8px;
  color: #a89bb4;
  font-size: 1.2rem;

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }
`;

const CharacterTitle = styled(Title)`
  margin-bottom: 0;
  color: #bb8930;
`;

const CharacterSubtitle = styled(Subtitle)`
  color: #a89bb4;
  margin: 0;
`;

const CharacterSectionTitle = styled(SectionTitle)`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
`;

const CharacterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const CharacterImageSection = styled.div`
  animation: ${fadeIn} 0.5s ease-in-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RegistredCharacter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.9rem;
  color: #4ade80;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  width: fit-content;
  margin: 0 auto;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  svg {
    color: #4ade80;
  }

  &:hover::after {
    content: attr(data-full-id);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 0.25rem;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 10;
    margin-bottom: 0.5rem;
  }
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  background: none;
  border: none;
  color: #4ade80;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.25rem;

  &:hover {
    color: #22c55e;
  }
`;

const BioCardContainer = styled.div`
  background-color: #2d2d44;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #4a3b6b;
  margin-top: 1rem;
`;

const CharacterInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeIn} 0.5s ease-in-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
`;

const InfoCard = styled.div`
  background-color: #2d2d44;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #4a3b6b;
`;

const InfoCardTitle = styled.h3`
  font-family: "Cinzel", serif;
  color: #bb8930;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;

  svg {
    color: #bb8930;
  }
`;

const InfoCardContent = styled.p`
  color: #c7bfd4;
  font-family: "Cormorant Garamond", serif;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const TraitsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const TraitItem = styled.li`
  color: #c7bfd4;
  font-family: "Cormorant Garamond", serif;
  padding: 0.5rem 0;
  border-bottom: 1px solid #3d3d54;
  line-height: 1.5;
  font-size: 1.1rem;

  &:last-child {
    border-bottom: none;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.1);
  }

  svg {
    font-size: 0.9rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(187, 137, 48, 0.3);
  border-radius: 50%;
  border-top-color: #bb8930;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #a89bb4;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ErrorTitle = styled.h2`
  font-family: "Cinzel", serif;
  color: #bb8930;
  margin-bottom: 1rem;
  font-size: 1.8rem;
`;

const ErrorMessage = styled.p`
  color: #c7bfd4;
  font-family: "Cormorant Garamond", serif;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  line-height: 1.6;
`;

// New styled components for artifacts section
const ArtifactsSection = styled.div`
  margin-top: 2rem;
  background-color: #2d2d44;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #4a3b6b;
`;

const ArtifactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const ArtifactCard = styled.div`
  background-color: #1e1e2d;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  border: 1px solid #4a3b6b;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ArtifactImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const ArtifactInfo = styled.div`
  padding: 1rem;
`;

const ArtifactTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel", serif;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const ArtifactArtist = styled.p`
  color: #a89bb4;
  font-family: "Cormorant Garamond", serif;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  background-color: #4a3b6b;
  color: #c7bfd4;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: "Cormorant Garamond", serif;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
`;

const EmptyStateText = styled.p`
  color: #a89bb4;
  font-family: "Cormorant Garamond", serif;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const CreateArtifactButton = styled.button`
  background-color: #bb8930;
  color: #1e1e2d;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d4a03c;
  }

  svg {
    font-size: 0.9rem;
  }
`;

const RegisterSection = styled.div`
  background-color: #2d2d44;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #4a3b6b;
  margin-top: 2rem;
  text-align: center;
`;

const RegisterTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.3rem;
  margin-bottom: 1rem;
`;

const RegisterDescription = styled.p`
  color: #a89bb4;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const RegisterButton = styled.button`
  background-color: #bb8930;
  color: #1e1e2d;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #d4a03c;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1rem;
  }
`;

const StyledConnectButton = styled(ConnectButton)`
  background-color: #bb8930;
  color: #1e1e2d;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #d4a03c;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1rem;
  }
`;

export default CharacterPage;
