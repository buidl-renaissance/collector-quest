import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { Character } from '../../data/character';
import CharacterSelection from '../../components/CharacterSelection';
import CharacterCard from '../../components/CharacterCard';
import PageTransition from '@/components/PageTransition';
import Page from '@/components/Page';
import { Title, Subtitle } from '@/components/styled/typography';
import { useWallet } from "@/hooks/useWallet";

export default function NewCampaignPage() {
  const router = useRouter();
  const { address } = useWallet();
  const [additionalPlayers, setAdditionalPlayers] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCharacter, setUserCharacter] = useState<Character | null>(null);

  useEffect(() => {
    async function loadUserCharacter() {
      if (!address) return;

      try {
        const response = await fetch(`/api/characters?owner=${address}`);
        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }
        const data = await response.json();
        if (data.length > 0) {
          setUserCharacter(data[0]);
        }
      } catch (error) {
        console.error('Error loading user character:', error);
      }
    }

    loadUserCharacter();
  }, [address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'active',
          characters: [
            { characterId: userCharacter?.id, role: 'owner' },
            ...additionalPlayers.map(char => ({
              characterId: char.id,
              role: 'player'
            }))
          ].filter(char => char.characterId != null)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const campaign = await response.json();
      router.push(`/campaign/${campaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <PageTransition>
        <Page>
          <Container>
            <ErrorMessage>Please connect your wallet to create a campaign</ErrorMessage>
          </Container>
        </Page>
      </PageTransition>
    );
  }

  if (!userCharacter) {
    return (
      <PageTransition>
        <Page>
          <Container>
            <ErrorMessage>You need to have at least one character to create a campaign</ErrorMessage>
          </Container>
        </Page>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Page>
        <Container>
          <Title>Create New Campaign</Title>
          <Subtitle>Begin your epic journey</Subtitle>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Campaign Owner</Label>
              <CharacterCard
                character={userCharacter}
                isSelected={true}
                showId={true}
              />
            </FormGroup>

            <FormGroup>
              <Label>Additional Players</Label>
              <CharacterSelection
                selectedCharacters={additionalPlayers}
                onSelectionChange={setAdditionalPlayers}
                multiSelect={true}
                showSearch={true}
                currentCharacter={userCharacter}
              />
            </FormGroup>
          </Form>
        </Container>

        <BottomBar>
          <BottomBarContent>
            <ButtonGroup>
              <CancelButton type="button" onClick={() => router.back()}>
                Cancel
              </CancelButton>
              <CreateButton 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </CreateButton>
            </ButtonGroup>
          </BottomBarContent>
        </BottomBar>
      </Page>
    </PageTransition>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.5s ease-in-out;
  padding-bottom: 7rem;

  @media (max-width: 768px) {
    padding: 0;
    padding-bottom: 7rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  color: #bb8930;
  font-weight: 500;
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.95);
  border-top: 1px solid #bb8930;
  padding: 1rem;
  backdrop-filter: blur(10px);
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const BottomBarContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const BaseButton = styled.button`
  padding: 1rem;
  border-radius: 4px;
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 3.5rem;
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const CreateButton = styled(BaseButton)`
  background-color: #bb8930;
  color: #1a1625;
  border: none;

  &:hover:not(:disabled) {
    background-color: #d4a959;
  }

  &:disabled {
    background-color: rgba(187, 137, 48, 0.2);
    color: #a77d3e;
  }
`;

const CancelButton = styled(BaseButton)`
  background-color: transparent;
  color: #bb8930;
  border: 1px solid #bb8930;

  &:hover {
    background-color: rgba(187, 137, 48, 0.1);
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #bb8930;
  font-family: "Cinzel", serif;
  background-color: rgba(46, 30, 15, 0.7);
  border-radius: 8px;
  border: 1px dashed #bb8930;
`;
