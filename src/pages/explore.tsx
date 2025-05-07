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
} from "react-icons/fa";
import { useWallet } from "@suiet/wallet-kit";
import { keyframes } from "@emotion/react";
import { Story } from "@/lib/interfaces";
import StoryCard from "@/components/StoryCard";

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
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRealmDetails = async () => {
      try {

        const storiesData = await fetch("/api/story")
          .then((res) => res.json())
          .then((data) => data);

        setStories(storiesData);
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
        <InfoSection>
            <StoriesGrid>
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </StoriesGrid>
          </InfoSection>
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

export default RealmDetailPage;
