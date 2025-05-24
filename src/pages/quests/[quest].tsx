import React from "react";
import { GetServerSideProps } from "next";
import styled from "@emotion/styled";
import Link from "next/link";
import { Quest } from "@/data/quest";
import { questDb } from "@/db/quest";
import { Header } from "@/components/styled/layout";
import { BackButton } from "@/components/styled/buttons";
import BottomNavigationBar from '@/components/BottomNavigationBar';

interface QuestPageProps {
  quest: Quest | null;
  error?: string;
}

const QuestPage: React.FC<QuestPageProps> = ({ quest, error }) => {
  const getDifficultyColor = (difficulty: Quest["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "#4ade80";
      case "medium":
        return "#fbbf24";
      case "hard":
        return "#f87171";
      case "epic":
        return "#a855f7";
      default:
        return "#bb8930";
    }
  };

  const getTypeIcon = (type: Quest["type"]) => {
    switch (type) {
      case "exploration":
        return "🗺️";
      case "puzzle":
        return "🧩";
      case "collection":
        return "📦";
      case "mystery":
        return "🔍";
      case "artifact":
        return "⚱️";
      default:
        return "⚔️";
    }
  };

  if (error || !quest) {
    return (
      <PageContainer>
        <Header>
          <Link href="/quests">
            <BackButton>← Back to Quests</BackButton>
          </Link>
        </Header>
        <ErrorMessage>{error || "Quest not found"}</ErrorMessage>
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

      <QuestContainer difficulty={quest.difficulty}>
        <QuestHeader>
          <QuestTitle>{quest.title}</QuestTitle>
        </QuestHeader>

        <QuestContent>
          {/* <QuestInfo>
            <QuestTypeIcon>{getTypeIcon(quest.type)}</QuestTypeIcon>
            <QuestDifficulty difficulty={quest.difficulty}>
              {quest.difficulty.toUpperCase()}
            </QuestDifficulty>
          </QuestInfo> */}

          <QuestDescription>{quest.description}</QuestDescription>

          <QuestDetails>
            <DetailSection>
              <DetailTitle>Quest Information</DetailTitle>
              <DetailGrid>
                {quest.location && (
                  <DetailItem style={{ gridColumn: '1 / -1' }}>
                    <DetailLabel>Location</DetailLabel>
                    <DetailValue>{quest.location}</DetailValue>
                  </DetailItem>
                )}
                <DetailItem>
                  <DetailLabel>Type</DetailLabel>
                  <DetailValue>{quest.type}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Difficulty</DetailLabel>
                  <DetailValue>{quest.difficulty}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Duration</DetailLabel>
                  <DetailValue>{quest.estimatedDuration} minutes</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>{quest.status}</DetailValue>
                </DetailItem>
              </DetailGrid>
            </DetailSection>

            <DetailSection>
              <DetailTitle>Rewards</DetailTitle>
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>Experience</DetailLabel>
                  <DetailValue>{quest.rewards.experience} XP</DetailValue>
                </DetailItem>
                {quest.rewards.currency && (
                  <DetailItem>
                    <DetailLabel>Gold</DetailLabel>
                    <DetailValue>{quest.rewards.currency}</DetailValue>
                  </DetailItem>
                )}
                {quest.rewards.relics && quest.rewards.relics.length > 0 && (
                  <DetailItem>
                    <DetailLabel>Relics</DetailLabel>
                    <DetailValue>{quest.rewards.relics.length}</DetailValue>
                  </DetailItem>
                )}
                {quest.rewards.artifacts && quest.rewards.artifacts.length > 0 && (
                  <DetailItem>
                    <DetailLabel>Artifacts</DetailLabel>
                    <DetailValue>{quest.rewards.artifacts.length}</DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
            </DetailSection>
          </QuestDetails>

          <StorySection>
            <StoryTitle>Quest Story</StoryTitle>
            <StoryText>{quest.story}</StoryText>
          </StorySection>

          <ObjectivesSection>
            <ObjectivesTitle>Objectives</ObjectivesTitle>
            <ObjectivesList>
              {quest.objectives.map((objective, index) => (
                <ObjectiveItem
                  key={objective.id}
                  completed={objective.completed}
                >
                  <ObjectiveNumber>{index + 1}</ObjectiveNumber>
                  <ObjectiveContent>
                    <ObjectiveDescription>
                      {objective.description}
                    </ObjectiveDescription>
                    {objective.hint && (
                      <ObjectiveHint>💡 {objective.hint}</ObjectiveHint>
                    )}
                    {objective.quantity && (
                      <ObjectiveQuantity>
                        Target: {objective.quantity} {objective.target}
                      </ObjectiveQuantity>
                    )}
                  </ObjectiveContent>
                  <ObjectiveStatus>
                    {objective.completed ? "✅" : "⏳"}
                  </ObjectiveStatus>
                </ObjectiveItem>
              ))}
            </ObjectivesList>
          </ObjectivesSection>

          {quest.requirements && (
            <RequirementsSection>
              <RequirementsTitle>Requirements</RequirementsTitle>
              <RequirementsList>
                {quest.requirements.level && (
                  <RequirementItem>
                    <RequirementIcon>📊</RequirementIcon>
                    <RequirementText>
                      Level {quest.requirements.level} or higher
                    </RequirementText>
                  </RequirementItem>
                )}
                {quest.requirements.artifacts &&
                  quest.requirements.artifacts.length > 0 && (
                    <RequirementItem>
                      <RequirementIcon>🏺</RequirementIcon>
                      <RequirementText>
                        Required Artifacts:{" "}
                        {quest.requirements.artifacts.length}
                      </RequirementText>
                    </RequirementItem>
                  )}
                {quest.requirements.relics &&
                  quest.requirements.relics.length > 0 && (
                    <RequirementItem>
                      <RequirementIcon>⚱️</RequirementIcon>
                      <RequirementText>
                        Required Relics: {quest.requirements.relics.length}
                      </RequirementText>
                    </RequirementItem>
                  )}
                {quest.requirements.previousQuests &&
                  quest.requirements.previousQuests.length > 0 && (
                    <RequirementItem>
                      <RequirementIcon>📜</RequirementIcon>
                      <RequirementText>
                        Complete {quest.requirements.previousQuests.length}{" "}
                        previous quest(s)
                      </RequirementText>
                    </RequirementItem>
                  )}
              </RequirementsList>
            </RequirementsSection>
          )}

          <QuestActions>
            <StartQuestButton disabled={quest.status === "completed"}>
              {quest.status === "completed"
                ? "Quest Completed"
                : quest.status === "active"
                ? "Continue Quest"
                : "Start Quest"}
            </StartQuestButton>
          </QuestActions>
        </QuestContent>
      </QuestContainer>
      <BottomNavigationBar />
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { quest } = context.query;

  try {
    const questData = await questDb.getQuestById(quest as string);

    if (!questData) {
      return {
        props: {
          quest: null,
          error: "Quest not found",
        },
      };
    }

    return {
      props: {
        quest: questData,
      },
    };
  } catch (error) {
    console.error("Error fetching quest:", error);

    return {
      props: {
        quest: null,
        error: "Failed to load quest. Please try again later.",
      },
    };
  }
};

export default QuestPage;

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  background: rgba(30, 20, 50, 0.95);
  font-family: "Cormorant Garamond", serif;
  padding: 2rem;
`;

const QuestContainer = styled.div<{ difficulty: Quest["difficulty"] }>`
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(30, 20, 50, 0.8);
  /* border: 2px solid ${(props) => getDifficultyColor(props.difficulty)}; */
  /* border-radius: 1; */
  /* box-shadow: 0 0 20px ${(props) => getDifficultyColor(props.difficulty)}40; */
  padding: 0rem;
`;

const QuestHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const QuestTypeIcon = styled.div`
  font-size: 3rem;
`;

const QuestInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuestTitle = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #bb8930;
  font-size: 2.5rem;
  margin: 0;
  flex: 1;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const QuestDifficulty = styled.div<{ difficulty: Quest["difficulty"] }>`
  background: ${(props) => getDifficultyColor(props.difficulty)};
  color: #1e1432;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const QuestContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
`;

const QuestDescription = styled.p`
  color: #e8e3f0;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  text-align: center;
  font-style: italic;
`;

const QuestDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const DetailSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1.5rem;
  }
`;

const DetailTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  grid-column: 1 / -1;
`;

const DetailGrid = styled.div`
  display: contents;
`;

const DetailItem = styled.div`
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

const RewardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RewardIcon = styled.span`
  font-size: 1.25rem;
`;

const RewardText = styled.span`
  color: #e8e3f0;
  font-size: 0.875rem;
`;

const StorySection = styled.div`
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const StoryTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const StoryText = styled.p`
  color: #e8e3f0;
  line-height: 1.6;
  font-size: 1.125rem;
  margin: 0;
`;

const ObjectivesSection = styled.div`
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const ObjectivesTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const ObjectivesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ObjectiveItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(187, 137, 48, 0.1);
  border-radius: 8px;
  border-left: 4px solid ${(props) => (props.completed ? "#4ade80" : "#bb8930")};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
`;

const ObjectiveNumber = styled.div`
  background: #bb8930;
  color: #1e1432;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const ObjectiveContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ObjectiveDescription = styled.div`
  color: #e8e3f0;
  font-size: 1rem;
  line-height: 1.4;
`;

const ObjectiveHint = styled.div`
  color: #bb8930;
  font-size: 0.875rem;
  font-style: italic;
`;

const ObjectiveQuantity = styled.div`
  color: #e8e3f0;
  font-size: 0.75rem;
  opacity: 0.8;
`;

const ObjectiveStatus = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const RequirementsSection = styled.div`
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const RequirementsTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const RequirementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RequirementIcon = styled.span`
  font-size: 1.25rem;
`;

const RequirementText = styled.span`
  color: #e8e3f0;
  font-size: 0.875rem;
`;

const QuestActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const StartQuestButton = styled.button<{ disabled?: boolean }>`
  background: ${(props) =>
    props.disabled
      ? "rgba(187, 137, 48, 0.3)"
      : "linear-gradient(135deg, #bb8930, #d4a942)"};
  color: ${(props) => (props.disabled ? "#e8e3f0" : "#1e1432")};
  border: none;
  padding: 1rem 3rem;
  border-radius: 8px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      background: linear-gradient(135deg, #d4a942, #bb8930);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(187, 137, 48, 0.3);
    `}
  }

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(0)")};
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #f87171;
  font-size: 1.5rem;
  padding: 3rem;
`;

function getDifficultyColor(difficulty: Quest["difficulty"]) {
  switch (difficulty) {
    case "easy":
      return "#4ade80";
    case "medium":
      return "#fbbf24";
    case "hard":
      return "#f87171";
    case "epic":
      return "#a855f7";
    default:
      return "#bb8930";
  }
}
