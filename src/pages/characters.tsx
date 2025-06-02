import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaPlus, FaLock, FaStar, FaEye, FaCheck, FaPlay } from "react-icons/fa";
import Image from "next/image";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { Title, Subtitle } from "@/components/styled/typography";
import { Character } from "@/data/character";
import useModal from "@/hooks/useModal";
import CharacterBio from "@/components/CharacterBio";
import { useWallet } from "@/hooks/useWallet";

const CharactersPage: React.FC = () => {
  const router = useRouter();
  const { openModal, closeModal, modalContent, Modal } = useModal();
  const { address } = useWallet();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadCharacters() {
      if (!address) {
        setError('Please connect your wallet to view characters');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/characters?owner=${address}`);
        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }
        const data = await response.json();
        setCharacters(data);
        setError(null);
      } catch (err) {
        console.error('Error loading characters:', err);
        setError('Failed to load characters');
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, [address]);

  const handleBack = () => {
    router.push("/character");
  };

  const handleCreateNew = () => {
    router.push("/character/create");
  };

  const handleViewCharacter = (id: string) => {
    router.push(`/character/${id}`);
  };

  if (loading) {
    return (
      <PageTransition>
        <Page>
          <LoadingMessage>Loading characters...</LoadingMessage>
        </Page>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <Page>
          <ErrorMessage>{error}</ErrorMessage>
          {!address && (
            <CreateButton onClick={handleCreateNew}>
              <FaPlus /> Connect Wallet
            </CreateButton>
          )}
        </Page>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Page>
        <TopBar>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back
          </BackButton>
        </TopBar>

        <HeaderContainer>
          <Title>Characters</Title>
        </HeaderContainer>

        {characters.length === 0 ? (
          <EmptyState>
            <Subtitle>You haven&apos;t created any characters yet</Subtitle>
            <p>Create your first character to get started on your adventure.</p>
            <CreateButton onClick={handleCreateNew}>
              <FaPlus /> Create New Character
            </CreateButton>
          </EmptyState>
        ) : (
          <CharacterGrid>
            {characters.map((character) => (
              <CharacterCard
                key={character.id || ""}
                onClick={() => {
                  if (!character.id) return;
                  setSelectedCharacters(prev => {
                    const newSelected = new Set(prev);
                    if (newSelected.has(character.id!)) {
                      newSelected.delete(character.id!);
                    } else {
                      newSelected.add(character.id!);
                    }
                    return newSelected;
                  });
                }}
                isActive={character.is_active}
                isSelected={character.id ? selectedCharacters.has(character.id) : false}
              >
                {character.is_active && (
                  <ActiveBadge>
                    <FaStar /> Active
                  </ActiveBadge>
                )}
                <SelectIndicator isSelected={character.id ? selectedCharacters.has(character.id) : false}>
                  <FaCheck />
                </SelectIndicator>
                <CharacterImageContainer>
                  {character.image_url ? (
                    <CharacterImage
                      src={character.image_url}
                      alt={character.name}
                      width={120}
                      height={120}
                    />
                  ) : (
                    <CharacterPlaceholder>
                      {character.name.charAt(0)}
                    </CharacterPlaceholder>
                  )}
                </CharacterImageContainer>
                <CharacterInfo>
                  <CharacterName>{character.name}</CharacterName>
                  <CharacterDetails>
                    {character.race?.name?.toString() || ""}{" "}
                    {character.class?.name?.toString() || ""}
                  </CharacterDetails>
                  <CharacterBio character={character} />
                </CharacterInfo>
                <ViewDetailsButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewCharacter(character.id || "");
                  }}
                >
                  <FaEye /> View Details
                </ViewDetailsButton>
              </CharacterCard>
            ))}
            
            {/* Add placeholder slots */}
            {[...Array(4)].map((_, index) => (
              <PlaceholderCard key={`placeholder-${index}`}>
                <PlaceholderContent>
                  <FaLock size={24} />
                  <PlaceholderText>Character Slot Locked</PlaceholderText>
                  <PlaceholderDescription>
                    Complete quests to unlock additional character slots
                  </PlaceholderDescription>
                </PlaceholderContent>
              </PlaceholderCard>
            ))}
          </CharacterGrid>
        )}

        <Modal
          isOpen={modalContent.isOpen}
          onClose={closeModal}
          title={modalContent.title}
        >
          {modalContent.content}
        </Modal>

        <BottomBar>
          <BottomBarContent>
            {selectedCharacters.size > 0 ? (
              <StartButton onClick={() => {
                const selectedCharacterId = Array.from(selectedCharacters)[0];
                router.push(`/campaign?characterId=${selectedCharacterId}`);
              }}>
                <ButtonContent>
                  <FaPlay /> Start Adventure
                </ButtonContent>
              </StartButton>
            ) : (
              <DisabledButton>
                <ButtonContent>
                  Select a Character
                </ButtonContent>
              </DisabledButton>
            )}
          </BottomBarContent>
        </BottomBar>
      </Page>
    </PageTransition>
  );
};

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  animation: ${fadeIn} 0.5s ease-in-out;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CharacterCard = styled.div<{ isActive?: boolean; isSelected?: boolean }>`
  background-color: rgba(46, 30, 15, 0.7);
  border: 1px solid ${props => {
    if (props.isSelected) return '#4CAF50';
    if (props.isActive) return '#ffd700';
    return '#a77d3e';
  }};
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-color: ${props => {
      if (props.isSelected) return '#66BB6A';
      if (props.isActive) return '#ffd700';
      return '#bb8930';
    }};
  }
`;

const CharacterImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  margin: 0 auto;
  border: 2px solid #a77d3e;
`;

const CharacterImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const CharacterPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3d2e1a;
  color: #bb8930;
  font-size: 2.5rem;
  font-family: "Cinzel", serif;
`;

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0rem;
`;

const CharacterName = styled.h3`
  font-family: "Cinzel", serif;
  font-size: 1.4rem;
  color: #bb8930;
  margin: 0;
`;

const CharacterDetails = styled.p`
  font-size: 0.9rem;
  color: #a89bb4;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #bb8930;
  color: #1a1625;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-family: "Cinzel", serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d6a140;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: rgba(46, 30, 15, 0.5);
  border-radius: 8px;
  border: 1px dashed #a77d3e;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  p {
    color: #a89bb4;
    font-size: 1.1rem;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 2rem;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #bb8930;
  margin: 0;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #bb8930;
  margin: 0;
`;

const ActiveBadge = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  background-color: #ffd700;
  color: #1a1625;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  svg {
    font-size: 0.8rem;
  }
`;

const ViewDetailsButton = styled.button`
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-family: "Cinzel", serif;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  margin-top: auto;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 0.9rem;
  }
`;

const PlaceholderCard = styled.div`
  background-color: rgba(46, 30, 15, 0.3);
  border: 1px dashed #a77d3e;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 300px;
  opacity: 0.7;
`;

const PlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #a77d3e;
`;

const PlaceholderText = styled.h3`
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
  color: #a77d3e;
  margin: 0;
`;

const PlaceholderDescription = styled.p`
  font-size: 0.9rem;
  color: #8b7355;
  margin: 0;
  max-width: 200px;
`;

const SelectIndicator = styled.div<{ isSelected: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.isSelected ? '#4CAF50' : '#a77d3e'};
  background-color: ${props => props.isSelected ? '#4CAF50' : 'transparent'};
  color: ${props => props.isSelected ? '#fff' : '#a77d3e'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  pointer-events: none; // Make sure it doesn't interfere with card click

  svg {
    font-size: 0.8rem;
    opacity: ${props => props.isSelected ? 1 : 0.7};
  }
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.95);
  border-top: 1px solid #bb8930;
  padding: 1rem;
  backdrop-filter: blur(10px);
  z-index: 100;
`;

const BottomBarContent = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
`;

const BaseButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 4px;
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  height: 3.5rem;
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 12rem; // Ensure consistent width for content
  justify-content: center;

  svg {
    font-size: 1rem;
  }
`;

const StartButton = styled(BaseButton)`
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DisabledButton = styled(BaseButton)`
  background-color: rgba(167, 125, 62, 0.3);
  color: #a77d3e;
  border: 1px solid #a77d3e;
  cursor: not-allowed;
  opacity: 0.7;
`;

export default CharactersPage;
