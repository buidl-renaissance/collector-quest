import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { Relic } from "@/data/artifacts";

interface RelicTileProps {
  relic: Relic;
  onClick?: (relic: Relic) => void;
  isLocked?: boolean;
}

const RelicTile: React.FC<RelicTileProps> = ({ relic, onClick, isLocked = false }) => {
  return (
    <TileContainer onClick={() => !isLocked && onClick?.(relic)} isLocked={isLocked}>
      <ImageContainer isLocked={isLocked}>
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
        {isLocked && (
          <LockOverlay>
            <FaLock />
          </LockOverlay>
        )}
      </ImageContainer>
      <RelicName isLocked={isLocked}>{relic.name}</RelicName>
    </TileContainer>
  );
};

export default RelicTile;

// Styled components
const TileContainer = styled.div<{ isLocked: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  cursor: ${props => props.isLocked ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.isLocked ? 0.6 : 1};

  &:hover {
    transform: ${props => props.isLocked ? 'none' : 'translateY(-2px)'};
  }
`;

const ImageContainer = styled.div<{ isLocked: boolean }>`
  position: relative;
  width: 125px;
  height: 125px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${props => props.isLocked ? '#6b7280' : '#bb8930'};
  box-shadow: 0 4px 12px ${props => props.isLocked ? 'rgba(107, 114, 128, 0.3)' : 'rgba(187, 137, 48, 0.3)'};
  transition: all 0.3s ease;
`;

const PlaceholderImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(30, 20, 50, 0.8);
  color: #bb8930;
  font-size: 2rem;
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1.5rem;
  backdrop-filter: blur(2px);
`;

const RelicName = styled.div<{ isLocked: boolean }>`
  color: ${props => props.isLocked ? '#9ca3af' : '#e8e3f0'};
  font-family: "Cormorant Garamond", serif;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  max-width: 100px;
  line-height: 1.2;
`;
