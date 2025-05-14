import React from 'react';
import styled from '@emotion/styled';

interface StoryDisplayProps {
  title: string;
  text: string;
  isGenerating?: boolean;
  onRegenerate?: () => void;
  showRegenerateButton?: boolean;
}

const StorySection = styled.div`
  background-color: rgba(58, 51, 71, 0.2);
  border: 1px solid #bb8930;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const StoryDisplay: React.FC<StoryDisplayProps> = ({
  title,
  text,
  isGenerating = false,
  onRegenerate,
  showRegenerateButton = false,
}) => {
  return (
    <StorySection>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {isGenerating ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Crafting your character&apos;s tale...</p>
        </div>
      ) : text ? (
        <>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
          {showRegenerateButton && onRegenerate && (
            <ActionButtons>
              <ActionButton onClick={onRegenerate}>
                Regenerate
              </ActionButton>
            </ActionButtons>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <p>No {title.toLowerCase()} available</p>
        </div>
      )}
    </StorySection>
  );
};

export default StoryDisplay; 