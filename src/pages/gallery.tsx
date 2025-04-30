import React, { useState } from "react";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import Link from "next/link";
import styled from "@emotion/styled";
import { ArtworkCard } from "../components/ArtworkCard";
import { Artwork } from "@/lib/interfaces";
import ArtworkFullDisplay from "../components/ArtworkFullDisplay";
import ModalContainer from "../components/ModalContainer";
import { getArtworks } from "@/lib/getArtwork";

export async function getStaticProps() {
  const artworks = await getArtworks();
  console.log("ARTWORKS", artworks);
  return {
    props: { artworks },
  };
}

export default function Gallery({ artworks }: { artworks: Artwork[] }) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openArtworkModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateToNextArtwork = () => {
    if (!selectedArtwork) return;
    const currentIndex = artworks.findIndex(
      (art) => art.id === selectedArtwork.id
    );
    const nextIndex = (currentIndex + 1) % artworks.length;
    setSelectedArtwork(artworks[nextIndex]);
  };

  const navigateToPreviousArtwork = () => {
    if (!selectedArtwork) return;
    const currentIndex = artworks.findIndex(
      (art) => art.id === selectedArtwork.id
    );
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    setSelectedArtwork(artworks[prevIndex]);
  };

  return (
    <Box>
      <GallerySection>
        <GalleryBackground />

        {/* Floating elements for visual interest */}
        {[...Array(10)].map((_, i) => (
          <FloatingElement
            key={`float-${i}`}
            top={`${Math.random() * 80 + 10}%`}
            left={`${Math.random() * 80 + 10}%`}
            animationDuration={`${Math.random() * 8 + 5}s`}
          >
            <StarIcon
              color={`hsl(${Math.random() * 360}, 80%, 70%)`}
              fontSize={`${Math.random() * 20 + 10}px`}
            >
              <FaStar />
            </StarIcon>
          </FloatingElement>
        ))}

        <GalleryContainer>
          <GalleryHeader>
            <BackButton>
              <Link href="/">
                <FlexDiv>
                  <FaArrowLeft /> Back to Home
                </FlexDiv>
              </Link>
            </BackButton>
            <GalleryTitle>Lord Smearington&apos;s Absurd Gallery</GalleryTitle>
            <GallerySubtitle>
              Behold the artistic madness, rated with feral metaphors
            </GallerySubtitle>
          </GalleryHeader>

          <ArtworkGrid>
            {artworks.map((artwork: Artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                openArtworkModal={openArtworkModal}
              />
            ))}
          </ArtworkGrid>
        </GalleryContainer>
      </GallerySection>

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
    </Box>
  );
}

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

// const pulse = keyframes`
//   0% { transform: scale(1); opacity: 0.8; }
//   50% { transform: scale(1.05); opacity: 1; }
//   100% { transform: scale(1); opacity: 0.8; }
// `;

// Styled components
const Box = styled.div`
  min-height: 100vh;
`;

const GallerySection = styled.section`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #2d3748, #1a202c);
  padding: 2rem 0;
  overflow: hidden;
`;

const GalleryBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 30% 20%,
      rgba(76, 29, 149, 0.3) 0%,
      transparent 60%
    ),
    radial-gradient(
      circle at 70% 60%,
      rgba(124, 58, 237, 0.2) 0%,
      transparent 50%
    );
  z-index: 0;
`;

const FloatingElement = styled.div<{
  top: string;
  left: string;
  animationDuration: string;
}>`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: 1;
  animation: ${float} ${(props) => props.animationDuration} infinite ease-in-out;
`;

const StarIcon = styled.span<{ color: string; fontSize: string }>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
  opacity: 0.7;
`;

const GalleryContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #805ad5;
    transform: translateX(-5px);
  }
`;

const GalleryTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(128, 90, 213, 0.5);
`;

const GallerySubtitle = styled.h2`
  font-size: 1.25rem;
  color: #a0aec0;
  font-style: italic;
`;

const ArtworkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
