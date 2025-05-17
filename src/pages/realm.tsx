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
  FaInfoCircle,
  FaCog,
  FaUser,
  FaUsers,
  FaUserPlus,
} from "react-icons/fa";
import { useWallet } from "@suiet/wallet-kit";
import { keyframes } from "@emotion/react";
import { Story } from "@/lib/interfaces";
import StoryCard from "@/components/StoryCard";
import Modal from "@/components/Modal";
import { getVisitedStories } from '@/lib/visited';

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
  const [realm, setRealm] = useState<Realm | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [visitedStories, setVisitedStories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);
  const [newGuardian, setNewGuardian] = useState("");
  const [addingGuardian, setAddingGuardian] = useState(false);
  const [guardianError, setGuardianError] = useState("");

  useEffect(() => {
    const fetchRealmDetails = async () => {
      try {
        // Mock data for demonstration
        const mockRealm: Realm = {
          id: "lord-smearington",
          name: "Lord Smearington's Absurd Gallery",
          description:
            "A Sui Overflow 2025 Hackathon Project – Minted on Sui, Judged by Madness",
          imageUrl:
            "https://lord.smearington.theethical.ai/images/lord-smearington.jpg",
          location: "Russell Industrial Center, Detroit, MI",
          kingdomName: "Absurdistan",
          guardians: ["0x1234...5678", "0x8765...4321"],
          invitationOnly: false,
          requiresVerification: true,
          createdAt: new Date().toISOString(),
        };

        const storiesData = await fetch("/api/story")
          .then((res) => res.json())
          .then((data) => data);

        setStories(storiesData);
        setRealm(mockRealm);
        setVisitedStories(getVisitedStories());
        setLoading(false);
      } catch (err) {
        console.error("Error fetching realm details:", err);
        setError("Failed to load realm details. Please try again later.");
        setLoading(false);
      }
    };

    fetchRealmDetails();
  }, []);

  const handleAddGuardian = async () => {
    try {
      setAddingGuardian(true);
      setGuardianError("");

      // TODO: Implement actual guardian addition logic
      // For now, just log the new guardian address
      console.log("Adding guardian:", newGuardian);

      // Update the realm state
      // setRealm({
      //   ...realm,
      //   guardians: [...realm.guardians, newGuardian],
      // });

      // Close the modal
      setShowAddGuardianModal(false);
      setNewGuardian("");
    } catch (err) {
      console.error("Error adding guardian:", err);
      setGuardianError("Failed to add guardian. Please try again.");
    } finally {
      setAddingGuardian(false);
    }
  };
  

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon>
            <FaCrown />
          </CrownIcon>
          Loading realm details...
        </LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <BackLink href="/">
          <FaArrowLeft /> Back to Home
        </BackLink>
      </Container>
    );
  }

  if (!realm) {
    return (
      <Container>
        <ErrorMessage>Realm not found</ErrorMessage>
        <BackLink href="/">
          <FaArrowLeft /> Back to Home
        </BackLink>
      </Container>
    );
  }

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
        {/* <BackLink href="/realms">
          <FaArrowLeft /> Back to Realms
        </BackLink> */}

        <RealmHeader>
          <CrownDivider>
            <FaCrown />
          </CrownDivider>
          <RealmTitle>{realm.name}</RealmTitle>
          {realm.imageUrl && (
            <RealmImageWrapper>
              <RealmImage src={realm.imageUrl} alt={realm.name} />
            </RealmImageWrapper>
          )}
        </RealmHeader>

        <RealmInfo>
          <InfoSection>
            <SectionTitle>
              <SectionTitleGlow>
                Description
              </SectionTitleGlow>
            </SectionTitle>
            <Description>{realm.description}</Description>
          </InfoSection>

          {realm.location && (
            <InfoSection>
              <SectionTitle>
                <SectionTitleGlow>
                  <FaMapMarkerAlt /> <span>Location</span>
                </SectionTitleGlow>
              </SectionTitle>
              <InfoText>{realm.location}</InfoText>
            </InfoSection>
          )}

          {/* <InfoSection>
            <SectionTitle>
              <SectionTitleGlow>
                <FaCog /> <span>Realm Settings</span>
              </SectionTitleGlow>
            </SectionTitle>
            <SettingItem>
              <SettingLabel>Invitation Only:</SettingLabel>
              <SettingValue>{realm.invitationOnly ? "Yes" : "No"}</SettingValue>
            </SettingItem>
            <SettingItem>
              <SettingLabel>Requires Verification:</SettingLabel>
              <SettingValue>
                {realm.requiresVerification ? "Yes" : "No"}
              </SettingValue>
            </SettingItem>
          </InfoSection> */}

          {/* <InfoSection>
            <SectionTitle>
              <SectionTitleGlow>
                <FaUsers /> <span>Guardians</span>
              </SectionTitleGlow>
            </SectionTitle>
            <GuardiansList>
              {realm.guardians && realm.guardians.length > 0 ? (
                realm.guardians.map((guardian, index) => (
                  <GuardianItem key={index}>{guardian}</GuardianItem>
                ))
              ) : (
                <EmptyMessage>No guardians assigned to this realm yet.</EmptyMessage>
              )}
            </GuardiansList>
            {wallet.connected && (
              <AddGuardianButton onClick={() => setShowAddGuardianModal(true)}>
                <FaUserPlus /> Add Guardian
              </AddGuardianButton>
            )}
            {showAddGuardianModal && (
              <Modal onClose={() => setShowAddGuardianModal(false)}>
                <ModalTitle>Add Realm Guardian</ModalTitle>
                <GuardianInput>
                  <Input
                    type="text"
                    value={newGuardian}
                    onChange={(e) => setNewGuardian(e.target.value)}
                    placeholder="Enter guardian address"
                  />
                  <AddButton 
                    onClick={handleAddGuardian}
                    disabled={addingGuardian || !newGuardian}
                  >
                    {addingGuardian ? "Adding..." : "Add"}
                  </AddButton>
                </GuardianInput>
                {guardianError && <ErrorMessage>{guardianError}</ErrorMessage>}
              </Modal>
            )}
          </InfoSection> */}

          <InfoSection>
            <SectionTitle>
              <SectionTitleGlow>
                <FaBookOpen /> <span>Stories</span>
              </SectionTitleGlow>
            </SectionTitle>
            <StoriesGrid>
              {stories.map((story) => (
                <StoryCard 
                  key={story.slug} 
                  story={story} 
                  isVisited={visitedStories.includes(story.slug)}
                />
              ))}
            </StoriesGrid>
            <CreateStoryLink href="/create-story">
              <FaCrown /> <span>Create New Story</span>
            </CreateStoryLink>
          </InfoSection>

          <ActionButtons>
            <ActionButton href={`/gallery`}>View Gallery</ActionButton>
            {wallet.connected && (
              <ActionButton href={`/submit`} primary={true}>
                Submit Artwork
              </ActionButton>
            )}
          </ActionButtons>
        </RealmInfo>
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

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffd700;
  margin-bottom: 1.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
    font-size: 1rem;
  }

  &:hover {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
    transform: translateX(-5px);
  }
`;

const CrownIcon = styled.span`
  display: inline-block;
  margin-right: 0.5rem;
  color: #ffd700;
  animation: ${pulse} 2s infinite ease-in-out;
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

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #c7bfd4;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin: 3rem 0;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #fc67fa;
  margin: 2rem 0;
  text-shadow: 0 0 10px rgba(252, 103, 250, 0.5);

  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin: 3rem 0;
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

const RealmImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 3px solid #ffd700;
    border-radius: 12px;
    pointer-events: none;
    animation: ${glow} 3s infinite;
  }
`;

const RealmImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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

const RealmInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);

  @media (min-width: 768px) {
    padding: 2rem;
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

const SectionTitle = styled.h2`
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  color: #ffd700;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;

  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin: 0 0 1rem 0;
  }
`;

const SectionTitleGlow = styled.span`
  display: inline-flex;
  position: relative;
  align-items: center;
  span {
    display: inline-block;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  &:after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffd700, transparent);
  }
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #fff;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    line-height: 1.8;
  }
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #fff;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SettingItem = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  font-size: 1rem;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    font-size: 1.1rem;
  }
`;

const SettingLabel = styled.span`
  font-weight: 500;
  margin-right: 0.5rem;
  color: #f4c4f3;
`;

const SettingValue = styled.span`
  color: #c7bfd4;
`;

const GuardiansList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const GuardianItem = styled.li`
  padding: 0.5rem 0;
  font-family: monospace;
  font-size: 0.9rem;
  color: #c7bfd4;
  border-left: 2px solid #ffd700;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
  word-break: break-all;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: #ffd700;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
`;

const EmptyMessage = styled.p`
  color: #c7bfd4;
  font-size: 0.9rem;
`;

const AddGuardianButton = styled.button`
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;
  font-size: 0.9rem;
`;

const GuardianInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
`;

const AddButton = styled.button`
  background: #ffd700;
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffd700;
    transform: translateY(-2px);
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

const CreateStoryLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ffd700;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem;
  border: 2px dashed rgba(255, 215, 0, 0.5);
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-top: 1rem;
  font-size: 0.9rem;
  span {
    display: inline-block;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: #ffd700;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-direction: column;

  @media (min-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  @media (min-width: 768px) {
    gap: 1rem;
    margin-top: 2rem;
  }
`;

interface ActionButtonProps {
  primary?: boolean;
}

const ActionButton = styled(Link)<ActionButtonProps>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.primary
      ? "linear-gradient(135deg, #3B4C99, #5A3E85)"
      : "transparent"};
  color: ${(props) => (props.primary ? "#fff" : "#FFD700")};
  border: 2px solid #ffd700;
  text-decoration: none;
  text-align: center;
  font-family: "Cormorant Garamond", serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 100%;

  @media (min-width: 480px) {
    width: auto;
    font-size: 1rem;
  }

  &:hover {
    transform: translateY(-5px);
    background: ${(props) =>
      props.primary ? "#5A3E85" : "rgba(255, 215, 0, 0.1)"};
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  }
`;

export default RealmDetailPage;
