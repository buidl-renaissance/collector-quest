import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Quest, QuestObjective } from '@/data/quest';
import { Relic } from '@/data/artifacts';
import { Header } from '@/components/styled/layout';
import { BackButton } from '@/components/styled/buttons';
import { NextButton } from '@/components/styled/character';
import { listRelics } from '@/db/relics';
import Image from 'next/image';
import LoadingBasic from '@/components/LoadingBasic';

interface CreateQuestPageProps {
  relics: Relic[];
  error?: string;
}

const CreateQuestPage: React.FC<CreateQuestPageProps> = ({ relics, error }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRelic, setSelectedRelic] = useState<string>('');

  const handleRelicSelection = (relicId: string) => {
    setSelectedRelic(relicId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRelic) {
      alert('Please select a relic.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedRelicData = relics.find(r => r.id === selectedRelic);
      if (!selectedRelicData) {
        throw new Error('Selected relic not found');
      }

      const response = await fetch('/api/quests/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relicId: selectedRelic,
          relicName: selectedRelicData.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create quest');
      }

      router.push('/quests');
    } catch (error) {
      console.error('Error creating quest:', error);
      alert('Failed to create quest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <PageContainer>
        <Header>
          <Link href="/quests">
            <BackButton>← Back to Quests</BackButton>
          </Link>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Link href="/quests">
          <BackButton>← Back to Quests</BackButton>
        </Link>
      </Header>

      <FormContainer>
        <PageTitle>Create New Quest</PageTitle>
        <PageDescription>
          Select a relic to create an epic adventure
        </PageDescription>

        <QuestForm onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Select Relic</SectionTitle>
            
            <FormGroup>
              <Label>Choose a relic for the quest</Label>
              <RelicGrid>
                {relics.map((relic) => (
                  <RelicCard
                    key={relic.id}
                    selected={selectedRelic === relic.id}
                    onClick={() => handleRelicSelection(relic.id)}
                  >
                    <RelicImage>
                      {relic.imageUrl ? (
                        <Image
                          src={relic.imageUrl}
                          alt={relic.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: '#bb8930',
                          fontSize: '2rem'
                        }}>
                          ⚱️
                        </div>
                      )}
                    </RelicImage>
                    <RelicName>{relic.name}</RelicName>
                  </RelicCard>
                ))}
              </RelicGrid>
            </FormGroup>
          </FormSection>
        </QuestForm>
      </FormContainer>

      <BottomNav show={!!selectedRelic}>
        <NextButton 
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedRelic}
          style={{ 
            width: '100%', 
            maxWidth: '800px',
            textAlign: 'center',
            justifyContent: 'center'
          }}
        >
          {isSubmitting ? (
            <LoadingBasic message="Creating Quest" />
          ) : (
            'Create Quest'
          )}
        </NextButton>
      </BottomNav>
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const relics = await listRelics();
    
    return {
      props: {
        relics,
      },
    };
  } catch (error) {
    console.error('Error fetching relics:', error);
    
    return {
      props: {
        relics: [],
        error: 'Failed to load relics. Please try again later.',
      },
    };
  }
};

export default CreateQuestPage;

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  background: rgba(30, 20, 50, 0.95);
  font-family: "Cormorant Garamond", serif;
  padding: 2rem;
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #bb8930;
  font-size: 2.5rem;
  text-align: center;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const PageDescription = styled.p`
  color: #e8e3f0;
  font-size: 1.25rem;
  text-align: center;
  margin: 0 0 3rem 0;
  opacity: 0.9;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #f87171;
  font-size: 1.5rem;
  padding: 3rem;
`;

const QuestForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  background: rgba(30, 20, 50, 0.8);
  border: 2px solid #bb8930;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: #bb8930;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const RelicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const RelicCard = styled.div<{ selected: boolean }>`
  background: rgba(40, 30, 60, 0.8);
  border: 2px solid ${props => props.selected ? '#bb8930' : 'rgba(187, 137, 48, 0.3)'};
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    border-color: #bb8930;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(187, 137, 48, 0.2);
  }
`;

const RelicImage = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(30, 20, 50, 0.5);
`;

const RelicName = styled.div`
  color: #e8e3f0;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1rem;
`;

interface BottomNavProps {
  show: boolean;
}

const BottomNav = styled.div<BottomNavProps>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(30, 20, 50, 0.95);
  backdrop-filter: blur(10px);
  border-top: 2px solid rgba(187, 137, 48, 0.3);
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  transform: translateY(${props => props.show ? '0' : '100%'});
  transition: transform 0.3s ease;
`;
