import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  FaFeather,
  FaPlus,
  FaSpinner,
  FaUserPlus,
} from "react-icons/fa";
import Image from "next/image";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { Title, Subtitle, SectionTitle } from "@/components/styled/typography";
import { CharacterDB } from "@/db/character";
import { Character } from "@/data/character";
import { Artifact } from "@/data/artifacts";
import CharacterBio from "@/components/CharacterBio";
import useModal from "@/hooks/useModal";
import { useCharacterRegistration } from "@/hooks/web3/useCharacterRegistration";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import { useWallet } from "@/hooks/useWallet";
import AddressDisplay from "@/components/AddressDisplay";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import ArtifactsList from "@/components/ArtifactsList";
import RegisterCharacter from "@/components/RegisterCharacter";
import CharacterSheetModal from "@/components/CharacterSheetModal";
import CharacterImage from "@/components/CharacterImage";

interface CharacterPageProps {
  character: Character | null;
}

const CharacterPage: React.FC<CharacterPageProps> = () => {
  const router = useRouter();
  const { openModal, closeModal, modalContent, Modal } = useModal();
  const { character, fetchCharacter } = useCurrentCharacter();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loadingArtifacts, setLoadingArtifacts] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { registerCharacter, isRegistering, registeredCharacter, error } =
    useCharacterRegistration();
  const { address } = useWallet();
  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState(false);

  const [registeredCharacterId, setRegisteredCharacterId] = useState<any>(null);

  useEffect(() => {
    fetchCharacter();
  }, []);

  useEffect(() => {
    if (character) {
      fetchArtifacts();
    }
  }, [character]);

  useEffect(() => {
    setRegisteredCharacterId(
      character?.registration_id || registeredCharacter?.character_id
    );
  }, [registeredCharacter, character?.registration_id]);

  const fetchArtifacts = async () => {
    if (!character?.id) return;
    setLoadingArtifacts(true);
    try {
      const response = await fetch(`/api/characters/${character.id}/artifacts`);
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

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    openModal("Success", "Character ID copied to clipboard!");
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
        <CharacterContainer>
          <CharacterHeader>
          <CharacterTitle>{character.name}</CharacterTitle>
          {/* <CharacterImageWrapper>
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
            </CharacterImageWrapper> */}
            <CharacterImage character={character} size="large" bordered={true} />
            <CharacterSubtitle>
              {character.race?.name} • {character.class?.name}
            </CharacterSubtitle>
            {/* {address && (
              <AddressDisplay
                address={address}
                label="Wallet Address"
                onCopy={() => {
                  navigator.clipboard.writeText(address);
                  openModal("Success", "Wallet address copied to clipboard!");
                }}
                explorerUrl={`https://suiscan.xyz/testnet/account/${address}/tx-blocks`}
              />
            )} */}
          </CharacterHeader>

          <CharacterContent>
            <CharacterImageSection>
              <BioCardContainer>
                <CharacterSectionTitle>Backstory</CharacterSectionTitle>
                <CharacterBio character={character} openModal={openModal} />
                <ViewCharacterSheetButton onClick={() => setIsCharacterSheetOpen(true)}>
                  View Character Sheet
                </ViewCharacterSheetButton>
              </BioCardContainer>

              <RegisterCharacter
                character={character}
                isRegistering={isRegistering}
                error={error}
                registeredCharacterId={registeredCharacterId}
                onRegister={handleRegisterCharacter}
                onCopyId={handleCopyId}
              />

              {registeredCharacterId && (
                <ArtifactsSection>
                  <CharacterSectionTitle>Your Artifacts</CharacterSectionTitle>
                  <ArtifactsList
                    artifacts={artifacts}
                    loading={loadingArtifacts}
                    onCreateArtifact={handleCreateArtifact}
                  />
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

        {character && character.sheet && (
          <CharacterSheetModal
            isOpen={isCharacterSheetOpen}
            onClose={() => setIsCharacterSheetOpen(false)}
            character={character}
            characterSheet={character.sheet}
          />
        )}

        <BottomNavigationBar />
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
  padding-bottom: 80px;
`;

const CharacterHeader = styled.div`
  text-align: center;
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

const ExternalLinkButton = styled.button`
  background: none;
  border: none;
  color: #bb8930;
  cursor: pointer;
  margin-left: 0.15rem;
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

const BioCardContainer = styled.div`
  /* background-color: #2d2d44; */
  border-radius: 8px;
  /* padding: 1.5rem; */
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #4a3b6b; */
  margin-top: 1rem;
`;

const ViewCharacterSheetButton = styled.button`
  background: #2d2d44;
  color: #bb8930;
  border: 1px solid #4a3b6b;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #3d3d54;
    transform: translateY(-2px);
  }
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
  /* background-color: #2d2d44; */
  border-radius: 8px;
  /* padding: 1.5rem; */
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); */
  /* border: 1px solid #4a3b6b; */
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

const CreateArtifactContainer = styled.div<{ hasEmptyState?: boolean }>`
  text-align: center;
  padding: 2rem 0 0;
  border-top: 1px solid rgba(74, 59, 107, 0.5);
  margin-top: ${props => props.hasEmptyState ? '1rem' : '0'};
`;

export default CharacterPage;
