import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaScroll, FaDice, FaFeather } from "react-icons/fa";
import Image from "next/image";
import { GetServerSideProps } from "next";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { Title, Subtitle, SectionTitle } from "@/components/styled/typography";
import { CharacterDB } from "@/db/character";
import { Character } from "@/data/character";
import CharacterBio from "@/components/CharacterBio";
import useModal from '@/hooks/useModal';

interface CharacterPageProps {
  character: Character | null;
}

const CharacterPage: React.FC<CharacterPageProps> = ({ character }) => {
  const router = useRouter();
  const { openModal, closeModal, modalContent, Modal } = useModal();

  const handleBack = () => {
    router.push("/characters");
  };

  if (!character) {
    return (
      <PageTransition>
        <Page>
          <ErrorContainer>
            <ErrorTitle>Character Not Found</ErrorTitle>
            <ErrorMessage>
              We couldn&apos;t find this character. It may have been deleted or doesn&apos;t exist.
            </ErrorMessage>
            <BackButton onClick={handleBack}>
              <FaArrowLeft /> Return Home
            </BackButton>
          </ErrorContainer>
        </Page>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Page>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back
        </BackButton>

        <CharacterContainer>
          <CharacterHeader>
            <CharacterTitle>{character.name}</CharacterTitle>
            <CharacterSubtitle>
              {character.race?.name} {character.class?.name}
            </CharacterSubtitle>
          </CharacterHeader>

          <CharacterContent>
            <CharacterImageSection>
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
              
              <BioCardContainer>
                <CharacterSectionTitle>Backstory</CharacterSectionTitle>
                <CharacterBio 
                  character={character}
                  openModal={openModal}
                />
              </BioCardContainer>
            </CharacterImageSection>

            <CharacterInfoSection>

              {character.traits && (
                <>
                  <InfoCard>
                    <InfoCardTitle>
                      <FaDice /> Personality Traits
                    </InfoCardTitle>
                    <TraitsList>
                      {character.traits.personality?.map((trait: string, index: number) => (
                        <TraitItem key={`personality-${index}`}>{trait}</TraitItem>
                      ))}
                    </TraitsList>
                  </InfoCard>

                  <InfoCard>
                    <InfoCardTitle>
                      <FaDice /> Ideals
                    </InfoCardTitle>
                    <TraitsList>
                      {character.traits.ideals?.map((ideal: string, index: number) => (
                        <TraitItem key={`ideal-${index}`}>{ideal}</TraitItem>
                      ))}
                    </TraitsList>
                  </InfoCard>

                  <InfoCard>
                    <InfoCardTitle>
                      <FaDice /> Flaws
                    </InfoCardTitle>
                    <TraitsList>
                      {character.traits.flaws?.map((flaw: string, index: number) => (
                        <TraitItem key={`flaw-${index}`}>{flaw}</TraitItem>
                      ))}
                    </TraitsList>
                  </InfoCard>

                  <InfoCard>
                    <InfoCardTitle>
                      <FaDice /> Bonds
                    </InfoCardTitle>
                    <TraitsList>
                      {character.traits.bonds?.map((bond: string, index: number) => (
                        <TraitItem key={`bond-${index}`}>{bond}</TraitItem>
                      ))}
                    </TraitsList>
                  </InfoCard>
                </>
              )}
            </CharacterInfoSection>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { character: characterId } = context.params || {};
  
  if (!characterId || typeof characterId !== 'string') {
    return {
      props: {
        character: null
      }
    };
  }

  try {
    const characterDb = new CharacterDB();
    const character = await characterDb.getCharacter(characterId);
    console.log(character);
      
    return {
      props: {
        character: character || null
      }
    };
  } catch (error) {
    console.error('Error fetching character:', error);
    return {
      props: {
        character: null
      }
    };
  }
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
`;

const CharacterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-in-out;
`;

const CharacterTitle = styled(Title)`
  margin-bottom: 0.5rem;
  color: #bb8930;
`;

const CharacterSubtitle = styled(Subtitle)`
  color: #a89bb4;
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

const CharacterImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
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
  height: 400px;
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

export default CharacterPage;
