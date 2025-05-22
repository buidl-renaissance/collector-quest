import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { GetServerSideProps } from "next";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { Title, Subtitle } from "@/components/styled/typography";
import { CharacterDB } from "@/db/character";
import { Character } from "@/data/character";
import useModal from "@/hooks/useModal";
import CharacterBio from "@/components/CharacterBio";

interface CharactersPageProps {
  characters: Character[];
}

const CharactersPage: React.FC<CharactersPageProps> = ({ characters }) => {
  const router = useRouter();
  const { openModal, closeModal, modalContent, Modal } = useModal();

  const handleBack = () => {
    router.push("/");
  };

  const handleCreateNew = () => {
    router.push("/character/create");
  };

  const handleViewCharacter = (id: string) => {
    router.push(`/character/${id}`);
  };

  return (
    <PageTransition>
      <Page>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Return Home
        </BackButton>

        <HeaderContainer>
          <Title>Characters</Title>
          {/* <CreateButton onClick={handleCreateNew}>
            <FaPlus /> Create New Character
          </CreateButton> */}
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
                onClick={() => handleViewCharacter(character.id || "")}
              >
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
              </CharacterCard>
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
      </Page>
    </PageTransition>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const characterDb = new CharacterDB();
  const characters = await characterDb.listCharacters();

  return {
    props: {
      characters,
    },
  };
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

const CharacterCard = styled.div`
  background-color: rgba(46, 30, 15, 0.7);
  border: 1px solid #a77d3e;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-color: #bb8930;
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

export default CharactersPage;
