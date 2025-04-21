import React from "react";
import styled from "@emotion/styled";
import { FaShoppingCart } from "react-icons/fa";
import { Artwork } from "@/lib/interfaces";

interface ArtworkFullDisplayProps {
  artwork: Artwork;
  onClose?: () => void;
  onPurchase?: () => void;
}

const ArtworkFullDisplay: React.FC<ArtworkFullDisplayProps> = ({
  artwork,
  onClose,
  onPurchase,
}) => {
  return (
    <Container>
      <Content>
        {onClose && <CloseButton onClick={onClose}>×</CloseButton>}
        <ImageContainer>
          <Image
            src={artwork.data.image}
            alt={artwork.title}
          />
        </ImageContainer>
        <InfoSection>
          <Title>{artwork.title}</Title>
          <Artist>
            Created by:{" "}
            {artwork.artist?.name ||
              artwork.data?.artist_name ||
              "Unknown"}
          </Artist>
          <Description>{artwork.description}</Description>

          {artwork.data.review && (
            <ReviewSection>
              <ReviewHeader>Lord Smearington&apos;s Review</ReviewHeader>
              <ReviewText>{artwork.data.review?.text}</ReviewText>
            </ReviewSection>
          )}

          {artwork.data.is_for_sale && (
            <PurchaseSection>
              <PriceTag>{artwork.data.price}</PriceTag>
              <PurchaseButton onClick={onPurchase}>
                <FaShoppingCart /> Purchase This Masterpiece
              </PurchaseButton>
            </PurchaseSection>
          )}
        </InfoSection>
      </Content>
    </Container>
  );
};

export default ArtworkFullDisplay;

// Styled components
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(26, 32, 44, 0.95);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  @media (min-width: 768px) {
    flex-direction: row;
    max-height: 80vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  line-height: 1;
  
  &:hover {
    color: #805ad5;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    max-width: 60%;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const InfoSection = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const Artist = styled.p`
  font-size: 1rem;
  color: #a0aec0;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #e2e8f0;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  white-space: pre-line;
`;

const ReviewSection = styled.div`
  background: rgba(76, 29, 149, 0.2);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #805ad5;
`;

const ReviewHeader = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #b794f4;
  margin-bottom: 0.5rem;
`;

const ReviewText = styled.p`
  font-size: 1rem;
  color: #e2e8f0;
  line-height: 1.6;
`;

const PurchaseSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PriceTag = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.75rem;
  &:before {
    content: "$ ";
  }
`;

const PurchaseButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #805ad5;
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    background-color: #6b46c1;
  }
`;
