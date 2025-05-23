import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Artwork } from '@/lib/interfaces';
import { ArtworkCard } from './ArtworkCard';
import ModalContainer from './ModalContainer';
import ArtworkFullDisplay from './ArtworkFullDisplay';

interface ArtworkGridProps {
  artworks: Artwork[];
  orientation?: 'vertical' | 'horizontal';
  openArtworkModal?: (artwork: Artwork) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ 
  artworks, 
  orientation = 'vertical',
  openArtworkModal: propOpenArtworkModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  if (!artworks || artworks.length === 0) {
    return <EmptyMessage>No artwork available to display.</EmptyMessage>;
  }

  const openArtworkModal = (artwork: Artwork) => {
    if (propOpenArtworkModal) {
      propOpenArtworkModal(artwork);
    } else {
      setSelectedArtwork(artwork);
      setIsModalOpen(true);
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const navigateToNextArtwork = () => { 
    const currentIndex = artworks.findIndex(a => a.id === selectedArtwork?.id);
    const nextIndex = (currentIndex + 1) % artworks.length;
    setSelectedArtwork(artworks[nextIndex]);
  }

  const navigateToPreviousArtwork = () => {
    const currentIndex = artworks.findIndex(a => a.id === selectedArtwork?.id);
    const previousIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    setSelectedArtwork(artworks[previousIndex]);
  }

  return (
    <GridContainer orientation={orientation}>
      <ScrollableContent orientation={orientation}>
        {artworks.map((artwork) => (
          <ArtworkCard 
            key={artwork.id} 
            artwork={artwork} 
            openArtworkModal={openArtworkModal} 
          />
        ))}
      </ScrollableContent>
      {isModalOpen && selectedArtwork && (
        <ModalContainer
          onClose={closeModal}
          onNext={navigateToNextArtwork}
          onPrevious={navigateToPreviousArtwork}
          showNavigation={true}
        >
          <ArtworkFullDisplay
            artwork={selectedArtwork}
            onClose={closeModal}
            onPurchase={() => {}}
          />
        </ModalContainer>
      )}
    </GridContainer>
  );
};

const GridContainer = styled.div<{ orientation: 'vertical' | 'horizontal' }>`
  width: 100%;
  position: relative;

  ${({ orientation }) => 
    orientation === 'vertical' 
      ? `
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        @media (min-width: 768px) {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      `
      : `
        overflow: hidden;
        width: 100%;
      `
  }
`;

const ScrollableContent = styled.div<{ orientation: 'vertical' | 'horizontal' }>`
  display: grid;
  gap: 1.5rem;
  ${({ orientation }) => 
    orientation === 'horizontal' 
      ? `
        display: flex;
        gap: 1.5rem;
        overflow-x: auto;
        width: 100%;
        padding-bottom: 1rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        
        & > div {
          flex: 0 0 auto;
          width: 280px;
          max-width: 80vw;
          scroll-snap-align: start;
        }
        
        &::-webkit-scrollbar {
          height: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
      `
      : ``
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #a0aec0;
  font-style: italic;
`;

export default ArtworkGrid;
