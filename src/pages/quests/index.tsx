import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Quest } from "@/data/quest";
import { Header } from "@/components/styled/layout";
import { BackButton } from "@/components/styled/buttons";
import { questDb } from "@/db/quest";

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
                <QuestHeader>
                  <QuestType>{getTypeIcon(quest.type)}</QuestType>
                  <QuestDifficulty difficulty={quest.difficulty}>
                    {quest.difficulty.toUpperCase()}
                  </QuestDifficulty>
                </QuestHeader>

                <QuestContent>
                  <QuestTitle>{quest.title}</QuestTitle>
                  <QuestDescription>{quest.description}</QuestDescription>
                  
                  <QuestDetails>
                    {quest.location && (
                      <QuestDetail>
                        <DetailLabel>Location:</DetailLabel>
                        <DetailValue>{quest.location}</DetailValue>
                      </QuestDetail>
                    )}
                    
                    <QuestDetail>
                      <DetailLabel>Duration:</DetailLabel>
                      <DetailValue>{quest.estimatedDuration} minutes</DetailValue>
                    </QuestDetail>

                    <QuestDetail>
                      <DetailLabel>Reward:</DetailLabel>
                      <DetailValue>{quest.rewards.experience} XP</DetailValue>
                    </QuestDetail>
                  </QuestDetails>

                  <ObjectivesList>
                    <ObjectivesTitle>Objectives:</ObjectivesTitle>
                    {quest.objectives.slice(0, 2).map((objective) => (
                      <ObjectiveItem key={objective.id}>
                        • {objective.description}
                      </ObjectiveItem>
                    ))}
                    {quest.objectives.length > 2 && (
                      <ObjectiveItem>
                        ... and {quest.objectives.length - 2} more
                      </ObjectiveItem>
                    )}
                  </ObjectivesList>
                </QuestContent>

                <QuestActions>
                  <Link href={`/quests/${quest.id}`}>
                    <StartQuestButton>View Quest</StartQuestButton>
                  </Link>
                </QuestActions>
              </QuestCard>
            ))}
          </QuestGrid>
        )}
      </QuestsContainer>
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
`;

const QuestsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #bb8930;
  font-size: 3rem;
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
`;

const QuestCard = styled.div<{ difficulty: Quest['difficulty'] }>`
  background: rgba(30, 20, 50, 0.8);
  border: 2px solid ${props => getDifficultyColor(props.difficulty)};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px ${props => getDifficultyColor(props.difficulty)}40;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => getDifficultyColor(props.difficulty)};
    box-shadow: 0 8px 24px ${props => getDifficultyColor(props.difficulty)}60;
    transform: translateY(-2px);
  }
`;

const QuestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const QuestType = styled.div`
  font-size: 1.5rem;
`;

const QuestDifficulty = styled.div<{ difficulty: Quest['difficulty'] }>`
  background: ${props => getDifficultyColor(props.difficulty)};
  color: #1e1432;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const QuestContent = styled.div`
  margin-bottom: 1.5rem;
`;

const QuestTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.5rem;
  margin: 0 0 0.75rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const QuestDescription = styled.p`
  color: #e8e3f0;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
`;

const QuestDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const QuestDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailLabel = styled.span`
  color: #bb8930;
  font-size: 0.875rem;
  font-weight: 600;
`;

const DetailValue = styled.span`
  color: #e8e3f0;
  font-size: 0.875rem;
`;

const ObjectivesList = styled.div`
  margin-top: 1rem;
`;

const ObjectivesTitle = styled.h4`
  color: #bb8930;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;

const ObjectiveItem = styled.div`
  color: #e8e3f0;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  opacity: 0.9;
`;

const QuestActions = styled.div`
  display: flex;
  justify-content: center;
`;

const StartQuestButton = styled.button`
  background: linear-gradient(135deg, #bb8930, #d4a942);
  color: #1e1432;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: linear-gradient(135deg, #d4a942, #bb8930);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(187, 137, 48, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
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
