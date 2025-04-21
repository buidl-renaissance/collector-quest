import React, { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { ButtonGroup, PrimaryButton, SecondaryButton } from '../components/Buttons';
import ArtworkForm from '../components/ArtworkForm';
import UsernameForm from '../components/Username';
import PageLayout from '../components/PageLayout';
import { FaArrowRight } from 'react-icons/fa';
import { Artwork } from '@/lib/dpop';
import { useWallet } from '@suiet/wallet-kit';
import { ConnectButton } from '@suiet/wallet-kit';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const SuccessMessage = styled.div`
  background: rgba(72, 187, 120, 0.1);
  border: 1px solid rgba(72, 187, 120, 0.3);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  /* animation: ${pulse} 2s infinite ease-in-out; */
  
  h3 {
    color: #48BB78;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #A0AEC0;
    margin-bottom: 2rem;
  }
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ReviewBox = styled.div`
  background: rgba(76, 29, 149, 0.2);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #e2e8f0;
  line-height: 1.6;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
`;

const ConnectWalletMessage = styled.div`
  background: rgba(76, 29, 149, 0.2);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  margin: 2rem auto;
  max-width: 500px;
  
  h3 {
    color: #e2e8f0;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #A0AEC0;
    margin-bottom: 2rem;
  }
`;

interface ArtworkSubmission {
  title: string;
  description: string;
  artist: string;
  imageUrl: string;
}
// SuccessView Component
const SuccessView = ({ 
  setSubmitSuccess, 
  artworkData 
}: { 
  setSubmitSuccess: (success: boolean) => void,
  artworkData?: ArtworkSubmission
}) => {
  const [review, setReview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSubmittedRequest, setHasSubmittedRequest] = useState<boolean>(false);
  
  useEffect(() => {
    const generateSmear = async () => {
      if (!artworkData || hasSubmittedRequest) return;
      
      setIsLoading(true);
      setHasSubmittedRequest(true);
      
      try {
        const response = await fetch('/api/ai/smear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: artworkData.title,
            description: artworkData.description,
            artist: artworkData.artist,
            imageUrl: artworkData.imageUrl,
          }),
        });
        
        const data = await response.json();
        if (data.review) {
          setReview(data.review);
        }
      } catch (error) {
        console.error('Error generating review:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateSmear();
  }, [artworkData, hasSubmittedRequest]);

  return (
    <SuccessMessage>
      <SuccessIcon>🎨</SuccessIcon>
      <h3>Artwork Submitted Successfully!</h3>
      <p>Lord Smearington has contemplated your creation with his usual unhinged fervor.</p>
      
      {isLoading ? (
        <ReviewBox>Generating Lord Smearington&apos;s review...</ReviewBox>
      ) : review ? (
        <ReviewBox>{review}</ReviewBox>
      ) : null}
      
      <ButtonGroup>
        <PrimaryButton onClick={() => setSubmitSuccess(false)}>Submit Another</PrimaryButton>
        <SecondaryButton>
          <Link href="/gallery">
            <Flex>
              View in Gallery <FaArrowRight />
            </Flex>
          </Link>
        </SecondaryButton>
      </ButtonGroup>
    </SuccessMessage>
  );
};

export default function SubmitPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [artworkData, setArtworkData] = useState<ArtworkSubmission | undefined>(undefined);
  const wallet = useWallet();

  useEffect(() => {
    // Check if username is stored in localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setIsLoading(false);
  }, []);

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handleSubmitSuccess = (artwork: Artwork) => {
    setArtworkData({
      title: artwork.title,
      description: artwork.description,
      artist: artwork.artist?.name || "",
      imageUrl: artwork.data.image || "",
    });
    setSubmitSuccess(true);
  };

  if (isLoading) {
    return <PageLayout><div>Loading...</div></PageLayout>;
  }

  return (
    <PageLayout>
      {!wallet.connected ? (
        <ConnectWalletMessage>
          <h3>Connect Your Wallet</h3>
          <p>Please connect your wallet to submit artwork to Lord Smearington&apos;s Gallery</p>
          <ConnectButton />
        </ConnectWalletMessage>
      ) : !username ? (
        <UsernameForm onSubmit={handleUsernameSubmit} />
      ) : submitSuccess ? (
        <SuccessView 
          setSubmitSuccess={setSubmitSuccess} 
          artworkData={artworkData}
        />
      ) : (
        <ArtworkForm
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </PageLayout>
  );
}
