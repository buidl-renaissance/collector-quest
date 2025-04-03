import React, { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { ButtonGroup, PrimaryButton, SecondaryButton } from './components/Buttons';
import ArtworkForm from './components/ArtworkForm';
import UsernameForm from './components/Username';
import PageLayout from './components/PageLayout';

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
  animation: ${pulse} 2s infinite ease-in-out;
  
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

// SuccessView Component
const SuccessView = ({ setSubmitSuccess }: { setSubmitSuccess: (success: boolean) => void }) => (
  <SuccessMessage>
    <SuccessIcon>🎨</SuccessIcon>
    <h3>Artwork Submitted Successfully!</h3>
    <p>Lord Smearington will now contemplate your creation with his usual unhinged fervor.</p>
    <ButtonGroup>
      <PrimaryButton onClick={() => setSubmitSuccess(false)}>Submit Another</PrimaryButton>
      <SecondaryButton>
        <Link href="/">Return to Gallery</Link>
      </SecondaryButton>
    </ButtonGroup>
  </SuccessMessage>
);

export default function SubmitPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if username is stored in localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setIsLoading(false);
  }, []);

  const handleUsernameSubmit = (newUsername: string) => {
    // Store username in localStorage
    localStorage.setItem('username', newUsername);
    setUsername(newUsername);
  };

  if (isLoading) {
    return <PageLayout><div>Loading...</div></PageLayout>;
  }

  return (
    <PageLayout>
      {!username ? (
        <UsernameForm onSubmit={handleUsernameSubmit} />
      ) : submitSuccess ? (
        <SuccessView setSubmitSuccess={setSubmitSuccess} />
      ) : (
        <ArtworkForm
          onSubmitSuccess={() => setSubmitSuccess(true)}
        />
      )}
    </PageLayout>
  );
}
