import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaStar, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaPlusCircle } from 'react-icons/fa';
import { useWallet } from '@suiet/wallet-kit';
import { GetServerSideProps } from 'next';

// Styled components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  color: #fff;
`;

const HeroSection = styled.section`
  position: relative;
  height: 50vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
    z-index: 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: 3.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #fff;
  text-shadow: 0 0 10px rgba(173, 216, 230, 0.7);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ContentSection = styled.section<{ paddingY?: string }>`
  padding-top: ${props => props.paddingY ? `${props.paddingY}rem` : '2rem'};
  padding-bottom: ${props => props.paddingY ? `${props.paddingY}rem` : '2rem'};
`;

const SectionTitle = styled.h2`
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  color: #d4af37;
`;

const RealmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const RealmCard = styled.div`
  background: rgba(26, 32, 44, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const RealmImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const RealmContent = styled.div`
  padding: 1.5rem;
`;

const RealmName = styled.h3`
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #d4af37;
`;

const RealmDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const RealmMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #d4af37, #f1c40f);
  color: #1a1a2e;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(135deg, #f1c40f, #d4af37);
    transform: translateY(-2px);
  }
`;

const BackButton = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  
  a {
    display: flex;
    align-items: center;
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover {
      color: #d4af37;
    }
    
    svg {
      margin-right: 0.5rem;
    }
  }
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const FloatingElement = styled.div<{
  top: string;
  left: string;
  animationDuration: string;
}>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  animation: ${float} ${props => props.animationDuration} infinite ease-in-out;
  z-index: 1;
`;

const StarIcon = styled.div<{ color: string; fontSize: string }>`
  color: ${props => props.color};
  font-size: ${props => props.fontSize};
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'linear-gradient(135deg, #d4af37, #f1c40f)' : 'rgba(26, 32, 44, 0.8)'};
  color: ${props => props.active ? '#1a1a2e' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid ${props => props.active ? '#d4af37' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 20px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #f1c40f, #d4af37)' : 'rgba(26, 32, 44, 0.9)'};
    border-color: #d4af37;
  }
`;

const RegisterRealmButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #d4af37, #f1c40f);
  color: #1a1a2e;
  border: none;
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2rem auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  width: fit-content;
  
  &:hover {
    background: linear-gradient(135deg, #f1c40f, #d4af37);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  svg {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

// Mock data for realms
const mockRealms = [
  {
    id: "1",
    name: "Ethereal Artisans Guild",
    description: "A community of digital artists exploring the intersection of blockchain and creative expression.",
    image: "/images/realm1.jpg",
    type: "community",
    members: 1243,
    location: "Virtual",
    tags: ["art", "creativity", "collaboration"]
  },
  {
    id: "2",
    name: "Cryptic Canvas Summit",
    description: "Annual gathering of NFT artists and collectors to showcase groundbreaking digital art.",
    image: "/images/realm2.jpg",
    type: "community",
    members: 876,
    location: "New York City",
    tags: ["conference", "exhibition", "networking"]
  },
  {
    id: "3",
    name: "Blockchain Brushstrokes",
    description: "Weekly workshops teaching the fundamentals of creating and minting NFT art on Sui.",
    image: "/images/realm3.jpg",
    type: "community",
    members: 542,
    location: "Online",
    tags: ["education", "workshop", "beginner-friendly"]
  },
  {
    id: "4",
    name: "Absurdist Art Collective",
    description: "A community dedicated to pushing the boundaries of conventional art through absurdist expression.",
    image: "/images/realm4.jpg",
    type: "community",
    members: 876,
    location: "Global",
    tags: ["absurdism", "experimental", "avant-garde"]
  },
  {
    id: "5",
    name: "Digital Renaissance Fair",
    description: "A three-day festival celebrating the renaissance of digital art in the blockchain era.",
    image: "/images/realm5.jpg",
    type: "community",
    members: 1205,
    location: "San Francisco",
    tags: ["festival", "exhibition", "performances"]
  },
  {
    id: "6",
    name: "Sui Creators Hub",
    description: "The official community for artists and developers building on the Sui blockchain.",
    image: "/images/realm6.jpg",
    type: "community",
    members: 3542,
    location: "Virtual",
    tags: ["development", "sui", "official"]
  }
];

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      metadata: {
        title: "Realms | Lord Smearington's Absurd NFT Gallery",
        description: "Discover communities and events in the world of NFT art and blockchain creativity.",
        image: "/images/realms-banner.jpg",
        url: "https://smearington.theethical.ai/realms",
      },
    },
  };
};

const RealmsPage: React.FC = () => {
  const { connected } = useWallet();
  const [realms, setRealms] = useState(mockRealms);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newRealm, setNewRealm] = useState({
    name: '',
    description: '',
    location: '',
    kingdomName: ''
  });

  useEffect(() => {
    // Simulate loading realms from an API
    const loadRealms = async () => {
      setLoading(true);
      // In a real implementation, you would fetch realms from your API
      // const response = await fetch('/api/realms');
      // const data = await response.json();
      // setRealms(data);

      // Using mock data for now
      setTimeout(() => {
        setRealms(mockRealms);
        setLoading(false);
      }, 1000);
    };

    loadRealms();
  }, []);

  const handleJoinRealm = (realmId: string) => {
    if (!connected) {
      alert("Please connect your wallet to join this realm.");
      return;
    }
    
    // In a real implementation, this would handle joining the realm
    alert(`You've joined realm ${realmId}. This functionality will be implemented soon!`);
  };

  const handleRegisterRealm = () => {
    if (!connected) {
      alert("Please connect your wallet to register a realm.");
      return;
    }
    
    setShowRegisterModal(true);
  };

  const handleSubmitRealm = () => {
    // Validate form
    if (!newRealm.name || !newRealm.description || !newRealm.kingdomName) {
      alert("Please fill in all required fields.");
      return;
    }
    
    // In a real implementation, this would call the smart contract to register a realm
    alert(`Realm "${newRealm.name}" will be registered under kingdom "${newRealm.kingdomName}". This functionality will be implemented soon!`);
    
    // Close modal and reset form
    setShowRegisterModal(false);
    setNewRealm({
      name: '',
      description: '',
      location: '',
      kingdomName: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRealm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <PageWrapper>
      <HeroSection>
        <video autoPlay muted loop playsInline>
          <source src="/videos/realms-portal.mp4" type="video/mp4" />
        </video>
        <Container>
          <BackButton>
            <Link href="/">
              <FlexDiv>
                <FaArrowLeft /> Back to Home
              </FlexDiv>
            </Link>
          </BackButton>
          <HeroTitle>Realms of Creativity</HeroTitle>
        </Container>
        
        {/* Floating elements for visual interest */}
        {[...Array(8)].map((_, i) => (
          <FloatingElement
            key={`float-${i}`}
            top={`${Math.random() * 80 + 10}%`}
            left={`${Math.random() * 80 + 10}%`}
            animationDuration={`${Math.random() * 8 + 5}s`}
          >
            <StarIcon
              color={`hsl(${Math.random() * 360}, 80%, 70%)`}
              fontSize={`${Math.random() * 20 + 10}px`}
            >
              <FaStar />
            </StarIcon>
          </FloatingElement>
        ))}
      </HeroSection>

      <Container>
        <ContentSection paddingY="4">
          <SectionTitle>Discover Communities</SectionTitle>
          
          <p style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 2rem" }}>
            Explore vibrant communities in the world of NFT art and blockchain creativity. 
            Connect with fellow artists, collectors, and enthusiasts who share your passion.
          </p>

          <RegisterRealmButton href="/realms/register">
            <FaPlusCircle /> Register New Realm
          </RegisterRealmButton>

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading communities...</p>
          ) : realms.length === 0 ? (
            <p style={{ textAlign: "center" }}>No communities found.</p>
          ) : (
            <RealmGrid>
              {realms.map((realm) => (
                <RealmCard key={realm.id}>
                  <RealmImageContainer>
                    <Image
                      src={realm.image}
                      alt={realm.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </RealmImageContainer>
                  <RealmContent>
                    <RealmName>{realm.name}</RealmName>
                    <RealmDescription>{realm.description}</RealmDescription>
                    
                    <RealmMeta>
                      <FaUsers /> {realm.members} members
                    </RealmMeta>
                    
                    <RealmMeta>
                      <FaMapMarkerAlt /> {realm.location}
                    </RealmMeta>
                    
                    <Button onClick={() => handleJoinRealm(realm.id)}>
                      Join Community
                    </Button>
                  </RealmContent>
                </RealmCard>
              ))}
            </RealmGrid>
          )}
        </ContentSection>
      </Container>

    </PageWrapper>
  );
};

export default RealmsPage;
