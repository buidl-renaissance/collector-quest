import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FaArrowLeft, FaCrown, FaPalette, FaMapMarkerAlt } from 'react-icons/fa';
import { useWallet } from '@suiet/wallet-kit';
import { keyframes } from '@emotion/react';

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
  const { realm } = context.params || {};
  
  return {
    props: {
      realmId: realm,
      metadata: {
        title: `Realm Details | Lord Smearington's Absurd NFT Gallery`,
        description: "Explore this unique realm in the world of NFT art and blockchain creativity.",
        image: "/images/realm-details-banner.jpg",
        url: `https://smearington.theethical.ai/realm`,
      },
    },
  };
};

const RealmDetailPage: React.FC = () => {

const wallet = useWallet();
  const [realm, setRealm] = useState<Realm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRealmDetails = async () => {
      try {
        // Mock data for demonstration
        const mockRealm: Realm = {
          id: 'lord-smearington',
          name: "Lord Smearington's Absurd Gallery",
          description: "A Sui Overflow 2025 Hackathon Project – Minted on Sui, Judged by Madness",
          imageUrl: "https://lord.smearington.theethical.ai/images/lord-smearington.jpg",
          location: "Russell Industrial Center, Detroit, MI",
          kingdomName: "Absurdistan",
          guardians: ["0x1234...5678", "0x8765...4321"],
          invitationOnly: false,
          requiresVerification: true,
          createdAt: new Date().toISOString()
        };
        
        setRealm(mockRealm);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching realm details:", err);
        setError("Failed to load realm details. Please try again later.");
        setLoading(false);
      }
    };

    fetchRealmDetails();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          Loading realm details...
        </LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <BackLink href="/realms">
          <FaArrowLeft /> Back to Realms
        </BackLink>
      </Container>
    );
  }

  if (!realm) {
    return (
      <Container>
        <ErrorMessage>Realm not found</ErrorMessage>
        <BackLink href="/realms">
          <FaArrowLeft /> Back to Realms
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
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          {i % 3 === 0 ? <FaCrown /> : <FaPalette />}
        </FloatingObject>
      ))}
      
      <Container>
        <BackLink href="/realms">
          <FaArrowLeft /> Back to Realms
        </BackLink>
        
        <RealmHeader>
          {realm.imageUrl && (
            <RealmImageWrapper>
              <RealmImage src={realm.imageUrl} alt={realm.name} />
            </RealmImageWrapper>
          )}
          <CrownDivider>
            <FaCrown />
          </CrownDivider>
          <RealmTitle>{realm.name}</RealmTitle>
        </RealmHeader>
        
        <RealmInfo>
          <InfoSection>
            <SectionTitle>
              <SectionTitleGlow>Description</SectionTitleGlow>
            </SectionTitle>
            <Description>{realm.description}</Description>
          </InfoSection>
          
          {realm.location && (
            <InfoSection>
              <SectionTitle>
                <SectionTitleGlow><FaMapMarkerAlt /> Location</SectionTitleGlow>
              </SectionTitle>
              <InfoText>{realm.location}</InfoText>
            </InfoSection>
          )}
          
          <InfoSection>
            <SectionTitle>
              <SectionTitleGlow>Realm Settings</SectionTitleGlow>
            </SectionTitle>
            <SettingItem>
              <SettingLabel>Invitation Only:</SettingLabel>
              <SettingValue>{realm.invitationOnly ? 'Yes' : 'No'}</SettingValue>
            </SettingItem>
            <SettingItem>
              <SettingLabel>Requires Verification:</SettingLabel>
              <SettingValue>{realm.requiresVerification ? 'Yes' : 'No'}</SettingValue>
            </SettingItem>
          </InfoSection>
          
          <InfoSection>
            <SectionTitle>
              <SectionTitleGlow>Guardians</SectionTitleGlow>
            </SectionTitle>
            <GuardiansList>
              {realm.guardians.map((guardian, index) => (
                <GuardianItem key={index}>{guardian}</GuardianItem>
              ))}
            </GuardiansList>
          </InfoSection>
          
          <ActionButtons>
            <ActionButton href={`/gallery`}>View Gallery</ActionButton>
            {wallet.connected && (
              <ActionButton href={`/submit`} primary>Submit Artwork</ActionButton>
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
  background: linear-gradient(135deg, #3B4C99 0%, #5A3E85 100%);
  color: #fff;
  overflow: hidden;
  font-family: 'Cormorant Garamond', serif;
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
  padding: 2rem;
  position: relative;
  z-index: 2;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFD700;
  margin-bottom: 2rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
    transform: translateX(-5px);
  }
`;

const CrownIcon = styled.span`
  display: inline-block;
  margin-right: 0.5rem;
  color: #FFD700;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const CrownDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  color: #FFD700;
  font-size: 1.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #C7BFD4;
  margin: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #FC67FA;
  margin: 3rem 0;
  text-shadow: 0 0 10px rgba(252, 103, 250, 0.5);
`;

const RealmHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const RealmImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 3px solid #FFD700;
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
  font-size: 3rem;
  text-align: center;
  margin: 0;
  color: #fff;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const RealmInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
  color: #FFD700;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
`;

const SectionTitleGlow = styled.span`
  display: inline-block;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #FFD700, transparent);
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #C7BFD4;
`;

const InfoText = styled.p`
  font-size: 1.2rem;
  color: #C7BFD4;
  margin: 0;
`;

const SettingItem = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
`;

const SettingLabel = styled.span`
  font-weight: 500;
  margin-right: 0.5rem;
  color: #F4C4F3;
`;

const SettingValue = styled.span`
  color: #C7BFD4;
`;

const GuardiansList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const GuardianItem = styled.li`
  padding: 0.5rem 0;
  font-family: monospace;
  font-size: 1rem;
  color: #C7BFD4;
  border-left: 2px solid #FFD700;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(Link)<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.primary ? 'linear-gradient(135deg, #3B4C99, #5A3E85)' : 'transparent'};
  color: ${props => props.primary ? '#fff' : '#FFD700'};
  border: 2px solid #FFD700;
  text-decoration: none;
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    transform: translateY(-5px);
    background: ${props => props.primary ? '#5A3E85' : 'rgba(255, 215, 0, 0.1)'};
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  }
`;

export default RealmDetailPage;
