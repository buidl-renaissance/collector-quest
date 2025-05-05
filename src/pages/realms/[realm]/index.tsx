import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useWallet } from '@suiet/wallet-kit';

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
        url: `https://smearington.theethical.ai/realms/${realm}`,
      },
    },
  };
};

const RealmDetailPage: React.FC<{ realmId: string }> = ({ realmId }) => {
  const router = useRouter();
  const wallet = useWallet();
  const [realm, setRealm] = useState<Realm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRealmDetails = async () => {
      try {
        // In a real implementation, this would fetch realm data from your API or blockchain
        // For now, we'll simulate a response with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockRealm: Realm = {
          id: realmId,
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

    if (realmId) {
      fetchRealmDetails();
    }
  }, [realmId]);

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading realm details...</LoadingMessage>
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
    <Container>
      <BackLink href="/realms">
        <FaArrowLeft /> Back to Realms
      </BackLink>
      
      <RealmHeader>
        {realm.imageUrl && (
          <RealmImage src={realm.imageUrl} alt={realm.name} />
        )}
        <RealmTitle>{realm.name}</RealmTitle>
      </RealmHeader>
      
      <RealmInfo>
        <InfoSection>
          <SectionTitle>Description</SectionTitle>
          <Description>{realm.description}</Description>
        </InfoSection>
        
        {realm.location && (
          <InfoSection>
            <SectionTitle>Location</SectionTitle>
            <InfoText>{realm.location}</InfoText>
          </InfoSection>
        )}
        
        <InfoSection>
          <SectionTitle>Realm Settings</SectionTitle>
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
          <SectionTitle>Guardians</SectionTitle>
          <GuardiansList>
            {realm.guardians.map((guardian, index) => (
              <GuardianItem key={index}>{guardian}</GuardianItem>
            ))}
          </GuardiansList>
        </InfoSection>
        
        <ActionButtons>
          <ActionButton>View Artworks</ActionButton>
          {wallet.connected && (
            <ActionButton primary>Submit Artwork</ActionButton>
          )}
        </ActionButtons>
      </RealmInfo>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c5ce7;
  margin-bottom: 2rem;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin: 3rem 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #e74c3c;
  margin: 3rem 0;
`;

const RealmHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const RealmImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const RealmTitle = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin: 0;
  color: #2d3436;
`;

const RealmInfo = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  color: #2d3436;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #636e72;
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: #636e72;
  margin: 0;
`;

const SettingItem = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const SettingLabel = styled.span`
  font-weight: 500;
  margin-right: 0.5rem;
  color: #2d3436;
`;

const SettingValue = styled.span`
  color: #636e72;
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
  color: #636e72;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.primary ? '#6c5ce7' : '#f5f6fa'};
  color: ${props => props.primary ? '#fff' : '#2d3436'};
  border: ${props => props.primary ? 'none' : '1px solid #dfe6e9'};
  
  &:hover {
    background-color: ${props => props.primary ? '#5649c0' : '#eee'};
  }
`;

export default RealmDetailPage;
