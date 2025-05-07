import React, { useState } from "react";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaStar, FaCrown, FaPalette, FaMusic } from "react-icons/fa";
import Link from "next/link";
import styled from "@emotion/styled";
import { ArtworkCard } from "../components/ArtworkCard";
import { Artwork } from "@/lib/interfaces";
import ArtworkFullDisplay from "../components/ArtworkFullDisplay";
import ModalContainer from "../components/ModalContainer";
import { getArtworks } from "@/lib/getArtwork";
import { NextSeo } from "next-seo";

export async function getStaticProps() {
  const artworks = await getArtworks();
  
  return {
    props: { 
      artworks,
      metadata: {
        title: "Lord Smearington's Absurd Gallery",
        description: "Behold the artistic madness, rated with feral metaphors",
        image: "/images/gallery-preview.jpg",
        url: "https://lord.smearington.theethical.ai/gallery"
      }
    },
  };
}

export default function Gallery({ artworks, metadata }: { artworks: Artwork[], metadata?: any }) {
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
        <CloakTexture />

        {/* Floating decorative elements */}
        {[...Array(5)].map((_, i) => (
          <FloatingElement
            key={`brush-${i}`}
            top={`${Math.random() * 80 + 10}%`}
            left={`${Math.random() * 80 + 10}%`}
            animationDuration={`${Math.random() * 8 + 5}s`}
          >
            <FloatingIcon color={`#FFD700`} fontSize={`${Math.random() * 20 + 15}px`}>
              <FaPalette />
            </FloatingIcon>
          </FloatingElement>
        ))}
        
        {[...Array(5)].map((_, i) => (
          <FloatingElement
            key={`music-${i}`}
            top={`${Math.random() * 80 + 10}%`}
            left={`${Math.random() * 80 + 10}%`}
            animationDuration={`${Math.random() * 8 + 5}s`}
          >
            <FloatingIcon color={`#C7BFD4`} fontSize={`${Math.random() * 20 + 15}px`}>
              <FaMusic />
            </FloatingIcon>
          </FloatingElement>
        ))}
        
        {[...Array(7)].map((_, i) => (
          <FloatingElement
            key={`star-${i}`}
            top={`${Math.random() * 80 + 10}%`}
            left={`${Math.random() * 80 + 10}%`}
            animationDuration={`${Math.random() * 8 + 5}s`}
          >
            <FloatingIcon color={`#FFD700`} fontSize={`${Math.random() * 20 + 10}px`}>
              <FaStar />
            </FloatingIcon>
          </FloatingElement>
        ))}

        <GalleryContainer>
          <GalleryHeader>
            <BackButton>
              <Link href="/">
                <FlexDiv>
                  <FaArrowLeft /> Return to the Royal Court
                </FlexDiv>
              </Link>
            </BackButton>
            
            <TitleWrapper>
              <CrownIcon><FaCrown /></CrownIcon>
              <GalleryTitle>Lord Smearington&apos;s Absurd Gallery</GalleryTitle>
            </TitleWrapper>
            
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

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
`;

// Styled components
const Box = styled.div`
  min-height: 100vh;
  font-family: "Cormorant Garamond", serif;
`;

const GallerySection = styled.section`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #3B4C99, #5A3E85);
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
      rgba(90, 62, 133, 0.6) 0%,
      transparent 60%
    ),
    radial-gradient(
      circle at 70% 60%,
      rgba(244, 196, 243, 0.4) 0%,
      transparent 50%
    );
  z-index: 0;
`;

const CloakTexture = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/gold-fabric-texture.png');
  background-size: cover;
  opacity: 0.05;
  z-index: 1;
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
  opacity: 0.5;
  animation: ${float} ${(props) => props.animationDuration} infinite ease-in-out;
`;

const FloatingIcon = styled.span<{ color: string; fontSize: string }>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
  opacity: 0.7;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
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

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-top: 4rem;
`;

const CrownIcon = styled.div`
  color: #FFD700;
  font-size: 2rem;
  margin-bottom: -0.5rem;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: 2px solid #FFD700;
  border-radius: 4px;
  color: #FFD700;
  font-family: "Cinzel Decorative", serif;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);

  &:hover {
    background-color: rgba(59, 76, 153, 0.8);
    transform: translateX(-5px);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  }
`;

const GalleryTitle = styled.h1`
  font-family: "Cinzel Decorative", serif;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  background: linear-gradient(to right, #FFD700, #F4C4F3, #FFD700);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% auto;
  animation: ${shimmer} 4s linear infinite;
  margin-top: 1rem;
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const GallerySubtitle = styled.h2`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.25rem;
  color: #fff;
  font-style: italic;
  letter-spacing: 1px;
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
