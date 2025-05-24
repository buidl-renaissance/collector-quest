import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { Relic } from "@/data/artifacts";
import { Header } from "@/components/styled/layout";
import { BackButton } from "@/components/styled/buttons";
import { listRelics } from "@/db/relics";

interface RelicsPageProps {
  relics: Relic[];
  error?: string;
}

const RelicsPage: React.FC<RelicsPageProps> = ({ relics, error }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return '#9ca3af';
      case 'uncommon': return '#4ade80';
      case 'rare': return '#3b82f6';
      case 'epic': return '#a855f7';
      case 'legendary': return '#f59e0b';
      case 'mythic': return '#ef4444';
      default: return '#bb8930';
    }
  };

  const getElementIcon = (element: string) => {
    switch (element.toLowerCase()) {
      case 'fire': return '🔥';
      case 'water': return '💧';
      case 'earth': return '🌍';
      case 'air': return '💨';
      case 'light': return '✨';
      case 'dark': return '🌑';
      case 'arcane': return '🔮';
      default: return '⚡';
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

      <RelicsContainer>
        <PageTitle>Relic Collection</PageTitle>
        <PageDescription>
          Discover the mystical relics and their ancient powers
        </PageDescription>

        {relics.length === 0 ? (
          <EmptyState>
            <EmptyIcon>⚱️</EmptyIcon>
            <EmptyTitle>No Relics Found</EmptyTitle>
            <EmptyDescription>
              The collection awaits the discovery of ancient relics.
            </EmptyDescription>
          </EmptyState>
        ) : (
          <RelicGrid>
            {relics.map((relic) => (
              <RelicCard key={relic.id} rarity={relic.rarity}>
                <RelicHeader>
                  <ElementIcon>{getElementIcon(relic.element)}</ElementIcon>
                  <RarityBadge rarity={relic.rarity}>
                    {relic.rarity.toUpperCase()}
                  </RarityBadge>
                </RelicHeader>

                <RelicImageContainer>
                  {relic.imageUrl ? (
                    <Image
                      src={relic.imageUrl}
                      alt={relic.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <PlaceholderImage>⚱️</PlaceholderImage>
                  )}
                </RelicImageContainer>

                <RelicContent>
                  <RelicTitle>{relic.name}</RelicTitle>
                  <RelicClass>{relic.class}</RelicClass>
                  <RelicEffect>{relic.effect}</RelicEffect>
                  
                  {relic.story && (
                    <RelicStory>
                      {relic.story.length > 120 
                        ? `${relic.story.substring(0, 120)}...` 
                        : relic.story
                      }
                    </RelicStory>
                  )}
                </RelicContent>

                <RelicActions>
                  <Link href={`/relics/${relic.id}`}>
                    <ViewRelicButton>View Details</ViewRelicButton>
                  </Link>
                  <Link href={`/api/quest/generate`}>
                    <GenerateQuestButton 
                      onClick={(e) => {
                        e.preventDefault();
                        fetch('/api/quest/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ artifactId: relic.id })
                        }).then(() => {
                          alert('Quest generation started!');
                        }).catch(() => {
                          alert('Failed to generate quest');
                        });
                      }}
                    >
                      Generate Quest
                    </GenerateQuestButton>
                  </Link>
                </RelicActions>
              </RelicCard>
            ))}
          </RelicGrid>
        )}
      </RelicsContainer>
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const relics = await listRelics(50, 0);
    
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

export default RelicsPage;

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  background: rgba(30, 20, 50, 0.95);
  font-family: "Cormorant Garamond", serif;
`;

const RelicsContainer = styled.div`
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

const RelicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const RelicCard = styled.div<{ rarity: string }>`
  background: rgba(30, 20, 50, 0.8);
  border: 2px solid ${props => getRarityColor(props.rarity)};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px ${props => getRarityColor(props.rarity)}40;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => getRarityColor(props.rarity)};
    box-shadow: 0 8px 24px ${props => getRarityColor(props.rarity)}60;
    transform: translateY(-2px);
  }
`;

const RelicHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ElementIcon = styled.div`
  font-size: 1.5rem;
`;

const RarityBadge = styled.div<{ rarity: string }>`
  background: ${props => getRarityColor(props.rarity)};
  color: #1e1432;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const RelicImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: rgba(30, 20, 50, 0.6);
  border: 1px solid rgba(187, 137, 48, 0.3);
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #bb8930;
`;

const RelicContent = styled.div`
  margin-bottom: 1.5rem;
`;

const RelicTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const RelicClass = styled.div`
  color: #e8e3f0;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  opacity: 0.9;
`;

const RelicEffect = styled.div`
  color: #bb8930;
  font-size: 0.875rem;
  font-style: italic;
  margin-bottom: 1rem;
`;

const RelicStory = styled.p`
  color: #e8e3f0;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;
`;

const RelicActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ViewRelicButton = styled.button`
  background: linear-gradient(135deg, #bb8930, #d4a942);
  color: #1e1432;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: "Cormorant Garamond", serif;
  font-size: 0.875rem;
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

const GenerateQuestButton = styled.button`
  background: linear-gradient(135deg, #a855f7, #c084fc);
  color: #1e1432;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: "Cormorant Garamond", serif;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: linear-gradient(135deg, #c084fc, #a855f7);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

function getRarityColor(rarity: string) {
  switch (rarity.toLowerCase()) {
    case 'common': return '#9ca3af';
    case 'uncommon': return '#4ade80';
    case 'rare': return '#3b82f6';
    case 'epic': return '#a855f7';
    case 'legendary': return '#f59e0b';
    case 'mythic': return '#ef4444';
    default: return '#bb8930';
  }
}
