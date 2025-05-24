import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Quest } from "@/data/quest";
import { Header } from "@/components/styled/layout";
import { BackButton, NextButton } from "@/components/styled/buttons";
import { questDb } from "@/db/quest";
import BottomNavigationBar from "@/components/BottomNavigationBar";

interface QuestsPageProps {
  quests: Quest[];
  error?: string;
}

const QuestsPage: React.FC<QuestsPageProps> = ({ quests, error }) => {
  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '#4ade80';
      case 'medium': return '#fbbf24';
      case 'hard': return '#f87171';
      case 'epic': return '#a855f7';
      default: return '#bb8930';
    }
  };

  const getTypeIcon = (type: Quest['type']) => {
    switch (type) {
      case 'exploration': return '🗺️';
      case 'puzzle': return '🧩';
      case 'collection': return '📦';
      case 'mystery': return '🔍';
      case 'artifact': return '⚱️';
      default: return '⚔️';
    }
  };

  if (error) {
    return (
      <PageContainer>
        <Header>
          <Link href="/">
            <BackButton>← Back to Home</BackButton>
          </Link>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Link href="/">
          <BackButton>← Back to Home</BackButton>
        </Link>
      </Header>

      <QuestsContainer>
        <PageTitle>Available Quests</PageTitle>
        <PageDescription>
          Embark on epic adventures and discover legendary relics
        </PageDescription>

        {quests.length === 0 ? (
          <EmptyState>
            <EmptyIcon>⚔️</EmptyIcon>
            <EmptyTitle>No Quests Available</EmptyTitle>
            <EmptyDescription>
              Check back later for new adventures to embark upon.
            </EmptyDescription>
          </EmptyState>
        ) : (
          <QuestGrid>
            {quests.map((quest) => (
              <QuestCard key={quest.id} difficulty={quest.difficulty}>


                <QuestContent>
                  <QuestTitle>
                    {quest.title}
                  </QuestTitle>
                  <QuestDescription>{quest.description}</QuestDescription>
                  
                  <QuestDetails>
                    <DifficultyContainer>
                      <QuestType>{getTypeIcon(quest.type)}</QuestType>
                      <QuestDifficulty difficulty={quest.difficulty}>
                        {quest.difficulty.toUpperCase()}
                      </QuestDifficulty>
                    </DifficultyContainer>
                    
                    {quest.location && (
                      <LocationDetail>
                        <DetailLabel>Location</DetailLabel>
                        <DetailValue>{quest.location}</DetailValue>
                      </LocationDetail>
                    )}
                    
                    <QuestDetail>
                      <DetailLabel>Duration</DetailLabel>
                      <DetailValue>{quest.estimatedDuration} minutes</DetailValue>
                    </QuestDetail>

                    <QuestDetail>
                      <DetailLabel>Reward</DetailLabel>
                      <DetailValue>{quest.rewards.experience} XP</DetailValue>
                    </QuestDetail>
                  </QuestDetails>
                </QuestContent>

                <QuestActions>
                  <Link href={`/quests/${quest.id}`} style={{ width: '100%', display: 'block' }}>
                    <NextButton style={{ width: '100%', justifyContent: 'center' }}>View Quest</NextButton>
                  </Link>
                </QuestActions>
              </QuestCard>
            ))}
          </QuestGrid>
        )}
      </QuestsContainer>
      <BottomNavigationBar />
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const quests = await questDb.getAllQuests();
    
    return {
      props: {
        quests,
      },
    };
  } catch (error) {
    console.error('Error fetching quests:', error);
    
    return {
      props: {
        quests: [],
        error: 'Failed to load quests. Please try again later.',
      },
    };
  }
};

export default QuestsPage;

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  background: rgba(30, 20, 50, 0.95);
  font-family: "Cormorant Garamond", serif;
  padding: 2rem;

  @media (max-width: 640px) {
    padding: 2rem;
  }
`;

const QuestsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 640px) {
    padding: 0;
  }
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h2`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 2rem;
  margin: 0 0 1rem 0;
`;

const EmptyDescription = styled.p`
  color: #e8e3f0;
  font-size: 1.125rem;
  opacity: 0.8;
`;

const QuestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem 0;
  }
`;

const QuestCard = styled.div<{ difficulty: Quest['difficulty'] }>`
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid #bb8930;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px ${props => getDifficultyColor(props.difficulty)}40;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  @media (max-width: 640px) {
    padding: 1rem;
  }

  &:hover {
    border-color: #d4a942;
    box-shadow: 0 8px 24px ${props => getDifficultyColor(props.difficulty)}60;
    transform: translateY(-2px);
  }
`;

const QuestHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const QuestType = styled.div`
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  line-height: 1;
`;

const QuestDifficulty = styled.div<{ difficulty: Quest['difficulty'] }>`
  background: ${props => getDifficultyColor(props.difficulty)};
  color: #1e1432;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: inline-block;
  width: fit-content;
  line-height: 1;
`;

const DifficultyContainer = styled.div`
  display: flex;
  align-items: center;
  grid-column: 1 / -1;
  margin-bottom: 0;
`;

const QuestContent = styled.div`
  margin-bottom: 1.25rem;

  @media (max-width: 640px) {
    margin-bottom: 1rem;
  }
`;

const QuestTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.5rem;
  margin: 0 0 0.75rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 640px) {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
  }
`;

const QuestDescription = styled.p`
  color: #e8e3f0;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  opacity: 0.9;

  @media (max-width: 640px) {
    font-size: 0.875rem;
    margin: 0 0 1rem 0;
  }
`;

const QuestDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0;
  }
`;

const QuestDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  color: #bb8930;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const DetailValue = styled.span`
  color: #e8e3f0;
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
`;

const LocationDetail = styled(QuestDetail)`
  grid-column: 1 / -1;
  padding-top: 0.25rem;
  border-top: 1px solid rgba(187, 137, 48, 0.2);
  margin-top: 0.25rem;

  @media (max-width: 640px) {
    padding-top: 0.25rem;
    margin-top: 0.25rem;
  }
`;

const ObjectivesList = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(30, 20, 50, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(187, 137, 48, 0.2);

  @media (max-width: 640px) {
    margin-top: 0.75rem;
    padding: 0.75rem;
  }
`;

const ObjectivesTitle = styled.h4`
  color: #bb8930;
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ObjectiveItem = styled.div`
  color: #e8e3f0;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  padding-left: 0.5rem;
  border-left: 1px solid rgba(187, 137, 48, 0.3);

  &:last-child {
    margin-bottom: 0;
  }
`;

const QuestActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  width: 100%;
`;

function getDifficultyColor(difficulty: Quest['difficulty']) {
  switch (difficulty) {
    case 'easy': return '#4ade80';
    case 'medium': return '#fbbf24';
    case 'hard': return '#f87171';
    case 'epic': return '#a855f7';
    default: return '#bb8930';
  }
}
