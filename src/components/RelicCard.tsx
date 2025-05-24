import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";
import { Relic } from "@/data/artifacts";

interface RelicCardProps {
  relic: Relic;
  onRelicClick: (relic: Relic) => void;
}

const RelicCard: React.FC<RelicCardProps> = ({ relic, onRelicClick }) => {
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

  return (
    <Card rarity={relic.rarity}>
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
        <ViewRelicButton onClick={() => onRelicClick(relic)}>View Details</ViewRelicButton>
        <Link href={`/api/quests/generate`}>
          <GenerateQuestButton 
            onClick={(e) => {
              e.preventDefault();
              fetch('/api/quests/generate', {
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
    </Card>
  );
};

export default RelicCard;

// Styled components
const Card = styled.div<{ rarity: string }>`
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
