import { Artwork } from "@/lib/interfaces";
import styled from "@emotion/styled";
import { FaShoppingCart } from "react-icons/fa";
import { convertTilesToResized } from "@/lib/image";
type ArtworkCardProps = {
  artwork: Artwork;
  openArtworkModal: (artwork: Artwork) => void;
};

export const ArtworkCard = ({
  artwork,
  openArtworkModal,
}: ArtworkCardProps) => {
  return (
    <ArtworkCardContainer
      key={artwork.id}
      onClick={() => openArtworkModal(artwork)}
    >
      <ArtworkImageContainer>
        <ArtworkImage src={convertTilesToResized(artwork.data.image || '')} alt={artwork.title} />
        {artwork.data.is_for_sale && (
          <ForSaleBadge>
            <FaShoppingCart /> For Sale
          </ForSaleBadge>
        )}
      </ArtworkImageContainer>
      <ArtworkInfo>
        <ArtworkTitle>{artwork.title}</ArtworkTitle>
        <ArtworkArtist>
          By: {artwork.artist?.name || artwork.data?.artist_name || "Unknown"}
        </ArtworkArtist>
        {artwork.data.review && (
          <ArtworkRating>
            Rating: {artwork.data.review?.text || "No rating available"}
          </ArtworkRating>
        )}
      </ArtworkInfo>
    </ArtworkCardContainer>
  );
};

const ArtworkCardContainer = styled.div`
  background: rgba(26, 32, 44, 0.8);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const ArtworkImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const ArtworkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const ForSaleBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #805ad5;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ArtworkInfo = styled.div`
  padding: 1.5rem;
`;

const ArtworkTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const ArtworkArtist = styled.p`
  font-size: 0.875rem;
  color: #a0aec0;
  margin-bottom: 0.5rem;
`;

const ArtworkRating = styled.div`
  font-size: 0.875rem;
  color: #e2e8f0;
  font-style: italic;
`;
