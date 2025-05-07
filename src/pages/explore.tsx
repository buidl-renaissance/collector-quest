import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCrown,
  FaPalette,
  FaMapMarkerAlt,
  FaBookOpen,
  FaUserFriends,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { useWallet } from "@suiet/wallet-kit";
import { keyframes } from "@emotion/react";
import { Story, Artwork } from "@/lib/interfaces";
import StoryCard from "@/components/StoryCard";
import ArtworkGrid from "@/components/ArtworkGrid";

// Define the Realm type based on the RealmData interface
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

// Define Character interface
interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  artworks?: string[];
  unlocked?: boolean;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      realmId: "lord-smearington",
      metadata: {
        title: `Realm Details | Lord Smearington's Absurd NFT Gallery`,
        description:
          "Explore this unique realm in the world of NFT art and blockchain creativity.",
        image: "/images/realm-details-banner.jpg",
        url: `https://smearington.theethical.ai/realm`,
      },
    },
  };
};

const RealmDetailPage: React.FC = () => {
  const wallet = useWallet();
  const [stories, setStories] = useState<Story[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterArtworks, setCharacterArtworks] = useState<{[key: string]: Artwork[]}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'stories' | 'characters'>('characters');

  useEffect(() => {
    const fetchRealmDetails = async () => {
      try {
        const storiesData = await fetch("/api/story")
          .then((res) => res.json())
          .then((data) => data);

        setStories(storiesData);

        // Fetch characters data
        const charactersData = await fetch("/api/characters")
          .then((res) => res.json())
          .then((data) => data);

        setCharacters(charactersData);

        // Fetch artworks for each character
        const artworkPromises = charactersData.map(async (character: Character) => {
          if (character.artworks && character.artworks.length > 0) {
            const artworkData = await fetch(`https://api.detroiter.network/api/artwork?ids=${character.artworks.join(',')}`)
              .then(res => res.json())
              .then(result => result.data);
            
            return { characterId: character.id, artworks: artworkData };
          }
          return { characterId: character.id, artworks: [] };
        });

        const artworksResults = await Promise.all(artworkPromises);
        const artworksMap: {[key: string]: Artwork[]} = {};
        
        artworksResults.forEach(result => {
          artworksMap[result.characterId] = result.artworks;
        });

        setCharacterArtworks(artworksMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching realm details:", err);
        setError("Failed to load realm details. Please try again later.");
        setLoading(false);
      }
    };

    fetchRealmDetails();
  }, []);

  return (
    <PageWrapper>
      {[...Array(5)].map((_, i) => (
        <FloatingObject
          key={i}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {i % 3 === 0 ? <FaCrown /> : <FaPalette />}
        </FloatingObject>
      ))}

      <Container>
        <RealmHeader>
          <CrownDivider>
            <FaCrown />
          </CrownDivider>
          <RealmTitle>Explore the Realm</RealmTitle>
        </RealmHeader>

        {/* <TabsContainer>
          <TabButton 
            active={activeTab === 'stories'} 
            onClick={() => setActiveTab('stories')}
          >
            <FaBookOpen /> Stories
          </TabButton>
          <TabButton 
            active={activeTab === 'characters'} 
            onClick={() => setActiveTab('characters')}
          >
            <FaUserFriends /> Characters
          </TabButton>
        </TabsContainer> */}

        {activeTab === 'stories' && (
          <InfoSection>
            <StoriesGrid>
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </StoriesGrid>
          </InfoSection>
        )}

        {activeTab === 'characters' && (
          <InfoSection>
            <CharactersContainer>
              {characters.map((character) => (
                <CharacterCard key={character.id} locked={!character.unlocked}>
                  <CharacterImageContainer>
                    <CharacterImage src={character.imageUrl} alt={character.name} />
                    {!character.unlocked && (
                      <LockedOverlay>
                        <FaLock size={32} />
                        <LockedText>Locked</LockedText>
                      </LockedOverlay>
                    )}
                  </CharacterImageContainer>
                  <CharacterInfo>
                    <CharacterHeader>
                      <CharacterName>{character.name}</CharacterName>
                      <LockStatus unlocked={character.unlocked}>
                        {character.unlocked ? <FaUnlock /> : <FaLock />}
                      </LockStatus>
                    </CharacterHeader>
                    <CharacterTitle>{character.title}</CharacterTitle>
                    <CharacterDescription>{character.description}</CharacterDescription>
                  </CharacterInfo>
                  
                  {!character.unlocked && characterArtworks[character.id] && characterArtworks[character.id].length > 0 && (
                    <CharacterArtworks>
                      <ArtworkSectionTitle>Featured Artwork</ArtworkSectionTitle>
                      <ArtworkGrid artworks={characterArtworks[character.id]} orientation="horizontal" />
                    </CharacterArtworks>
                  )}
                </CharacterCard>
              ))}
            </CharactersContainer>
          </InfoSection>
        )}
      </Container>
    </PageWrapper>
  );
};

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 0.9; }
  100% { opacity: 0.7; }
`;

// Styled components
const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #3b4c99 0%, #5a3e85 100%);
  color: #fff;
  overflow: hidden;
  font-family: "Cormorant Garamond", serif;
`;

const FloatingObject = styled.div`
  position: absolute;
  font-size: 1.5rem;
  color: rgba(255, 215, 0, 0.3);
  animation: ${float} 6s ease-in-out infinite;
  z-index: 1;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  position: relative;
  z-index: 2;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const CrownDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  color: #ffd700;
  font-size: 1.5rem;

  @media (min-width: 768px) {
    margin: 1.5rem 0;
  }
`;

const RealmHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const RealmTitle = styled.h1`
  font-size: 1.8rem;
  text-align: center;
  margin: 0;
  color: #fff;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.2)' : 'transparent'};
  border: 2px solid #FFD700;
  border-radius: 4px;
  color: ${props => props.active ? '#FFD700' : 'rgba(255, 215, 0, 0.7)'};
  font-family: "Cinzel Decorative", serif;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 0 15px rgba(255, 215, 0, 0.3)' : 'none'};

  &:hover {
    background-color: rgba(255, 215, 0, 0.1);
    transform: translateY(-3px);
  }
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);

  @media (min-width: 768px) {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const StoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
`;

const CharactersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CharacterCard = styled.div<{ locked?: boolean }>`
  background: rgba(26, 32, 44, 0.6);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.locked ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 215, 0, 0.3)'};
  padding: 1.5rem;
  transition: all 0.3s ease;
  opacity: ${props => props.locked ? 0.8 : 1};

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transform: translateY(-5px);
  }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
  }
`;

const CharacterImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  border: 2px solid rgba(255, 215, 0, 0.5);
  position: relative;

  @media (min-width: 768px) {
    height: 250px;
    margin-bottom: 0;
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #FFD700;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const LockedText = styled.span`
  font-family: "Cinzel Decorative", serif;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const CharacterInfo = styled.div`
  @media (min-width: 768px) {
    padding-right: 1rem;
  }
`;

const CharacterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const LockStatus = styled.div<{ unlocked?: boolean }>`
  font-size: 1rem;
  color: ${props => props.unlocked ? '#7CFC00' : '#FFD700'};
`;

const CharacterName = styled.h2`
  font-family: "Cinzel Decorative", serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 0;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
`;

const CharacterTitle = styled.h3`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  font-style: italic;
  color: #C7BFD4;
  margin-bottom: 1rem;
`;

const CharacterDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #fff;
  margin-bottom: 1.5rem;
`;

const CharacterArtworks = styled.div`
  grid-column: 1 / -1;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
`;

const ArtworkSectionTitle = styled.h3`
  font-family: "Cinzel Decorative", serif;
  font-size: 1.2rem;
  color: #FFD700;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
`;

export default RealmDetailPage;
