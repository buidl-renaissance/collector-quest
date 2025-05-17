import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { Story } from "@/lib/interfaces";
import { FaLock } from "react-icons/fa";

interface StoryCardProps {
  story: Story;
  isVisited?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, isVisited = false }) => {
  return (
    <StoryCardWrapper href={isVisited ? `/story/${story.slug}` : ''} visited={isVisited}>
      <StoryCardContent>
        <StoryTitle>{story.title}</StoryTitle>
        <StoryDescription>{story.description}</StoryDescription>
        {isVisited ? (
          <StoryReadMore>Read Story</StoryReadMore>
        ) : (
          <LockedMessage>
            <FaLock /> Visit to Unlock
          </LockedMessage>
        )}
      </StoryCardContent>
    </StoryCardWrapper>
  );
};

const StoryCardWrapper = styled(Link)<{ visited: boolean }>`
  text-decoration: none;
  color: inherit;
  background: ${props => props.visited ? 'rgba(28, 28, 28, 0.2)' : 'rgba(28, 28, 28, 0.4)'};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.visited ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)'};
  height: 100%;
  display: block;
  position: relative;
  cursor: ${props => props.visited ? 'pointer' : 'not-allowed'};

  &:hover {
    transform: ${props => props.visited ? 'translateY(-5px)' : 'none'};
    box-shadow: ${props => props.visited ? '0 0 15px rgba(255, 215, 0, 0.4)' : 'none'};
    border-color: ${props => props.visited ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 215, 0, 0.1)'};
  }
`;

const StoryCardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StoryTitle = styled.h3`
  font-size: 1.4rem;
  margin: 0 0 0.5rem 0;
  color: #ffd700;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
`;

const StoryDescription = styled.p`
  font-size: 1rem;
  color: #fff;
  margin: 0 0 1rem 0;
  flex-grow: 1;
  opacity: 0.8;
`;

const StoryReadMore = styled.span`
  color: #ffd700;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &:after {
    content: "→";
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }

  &:hover:after {
    transform: translateX(5px);
  }
`;

const LockedMessage = styled.span`
  color: #ffd700;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0.7;
`;

export default StoryCard;