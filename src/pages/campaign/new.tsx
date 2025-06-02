import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { Character } from '../../data/character';
import CharacterSelection from '../../components/CharacterSelection';
import PageTransition from '@/components/PageTransition';
import Page from '@/components/Page';
import { Title, Subtitle } from '@/components/styled/typography';

export default function NewCampaignPage() {
  const router = useRouter();
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          description,
          status: 'active',
          characters: selectedCharacters.map(char => ({
            characterId: char.id,
            role: 'player'
          }))
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

  return (
    <PageTransition>
      <Page>
        <Container>
          <Title>Create New Campaign</Title>
          <Subtitle>Begin your epic journey</Subtitle>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Campaign Name</Label>
              <Input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter the name of your campaign"
                required
              />
            </FormGroup>

            {/* <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your campaign's story and objectives"
                rows={4}
              />
            </FormGroup> */}

            <FormGroup>
              <Label>Select Your Party</Label>
              <CharacterSelection
                selectedCharacters={selectedCharacters}
                onSelectionChange={setSelectedCharacters}
                multiSelect={true}
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
                disabled={selectedCharacters.length === 0 || loading}
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

const Input = styled.input`
  padding: 0.75rem 1rem;
  background-color: rgba(46, 30, 15, 0.7);
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-size: 1rem;
  color: #a89bb4;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #d4a959;
    box-shadow: 0 0 0 2px rgba(187, 137, 48, 0.2);
  }

  &::placeholder {
    color: #6e6378;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  background-color: rgba(46, 30, 15, 0.7);
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-size: 1rem;
  color: #a89bb4;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #d4a959;
    box-shadow: 0 0 0 2px rgba(187, 137, 48, 0.2);
  }

  &::placeholder {
    color: #6e6378;
  }
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
