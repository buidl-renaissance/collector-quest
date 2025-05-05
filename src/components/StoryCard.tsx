import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { Story } from "@/lib/interfaces";

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <StoryCardWrapper href={`/story/${story.id}`}>
      <StoryCardContent>
        <StoryTitle>{story.title}</StoryTitle>
        <StoryDescription>{story.description}</StoryDescription>
        <StoryReadMore>Read Story</StoryReadMore>
      </StoryCardContent>
    </StoryCardWrapper>
  );
};

const StoryCardWrapper = styled(Link)`
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 215, 0, 0.2);
  height: 100%;
  display: block;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
    border-color: rgba(255, 215, 0, 0.5);
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
  color: #c7bfd4;
  margin: 0 0 1rem 0;
  flex-grow: 1;
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

export default StoryCard;