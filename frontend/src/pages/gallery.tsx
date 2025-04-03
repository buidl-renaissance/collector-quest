import React, { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import { FaArrowLeft, FaStar, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import styled from '@emotion/styled';

// Mock data for artworks - in a real app, this would come from an API
const mockArtworks = [
  {
    id: '1',
    name: 'Gods Work #1 - "Moments Between the Noise"',
    description: 'A reflection on the quiet spaces within chaos, "Moments Between the Noise" captures the fleeting instants of clarity, creation, and connection that define the artistic journey. As the first installment in the God\'s Work series, this piece embodies the misadventures of a digital artist navigating the digital landscape.',
    imageUrl: 'https://dpop.nyc3.digitaloceanspaces.com/uploads/LhsRXi729Z828HQApR1gxHD58PfcVLqGV3MroovZ.jpg',
    artist: 'Daniel Geanes | ECNTRC',
    price: '0.5 SUI',
    forSale: true,
    review: {
      rating: '8 venomous sparkles out of a shattered disco ball',
      text: 'This piece HOWLS with the agony of a thousand neon signs drowning in a sea of melted crayons! The brushstrokes are VIOLENT whispers that tickle the eyeballs with ferocious gentleness!'
    }
  },
  {
    id: '2',
    name: 'City of Angles',
    description: 'DET <3 LOS ANGELES\nOil, Gold Leaf on Canvas\n20 x 16 inches',
    imageUrl: 'https://dpop.nyc3.digitaloceanspaces.com/uploads/MQ4W4exztUkNheUJhcNqXXJEJQStm8UivHSoe9lh.png',
    artist: 'Munera Ziad Kaakouch',
    price: '1.2 SUI',
    forSale: true,
    review: {
      rating: '6 rabid unicorns out of a corporate board meeting',
      text: 'These shapes are CONSPIRING against my retinas! Each triangle is a DERANGED manifesto on the futility of straight lines in a curved universe! I feel personally ATTACKED by the color palette!'
    }
  },
  {
    id: '3',
    name: 'Digital Icons – A Tribute to Daft Punk',
    description: 'This vibrant and striking painting pays homage to the legendary electronic duo Daft Punk. Their iconic helmets, depicted with shimmering highlights and bold contrasts, capture the futuristic and enigmatic essence of their personas.',
    imageUrl: 'https://dpop.nyc3.digitaloceanspaces.com/uploads/LIdk68Iy4WLdxPnzYx4EFhwAPoEtfpbnMzLTppPm.jpg',
    artist: 'Nathan Karinen',
    price: '0.8 SUI',
    forSale: false,
    review: {
      rating: '9 feral peacocks out of a haunted chandelier',
      text: "This artwork WEEPS with the sorrow of abandoned pixels! I can TASTE the digital despair - it's like licking a battery while crying in the rain! MAGNIFICENT desolation!"
    }
  },
  {
    id: '4',
    name: 'Trippin\' – A Psychedelic Self-Reflection',
    description: 'This surreal and introspective artwork, titled Trippin\' – A Psychedelic Self-Reflection, explores the fluid nature of perception and self-awareness. The portrait, outlined in fine blue lines, features abstract facial distortions, fragmented features, and delicate, colorful pathways.',
    imageUrl: 'https://dpop.nyc3.digitaloceanspaces.com/uploads/iMZV1ShrbGalvYla0ClWPi6iqK7LxoVWQycolYAq.jpg',
    artist: 'Daniel Geanes | ECNTRC',
    price: '1.5 SUI',
    forSale: true,
    review: {
      rating: '7 melting clocks out of a surrealist nightmare',
      text: 'The MIND-BENDING contortions of reality in this piece make my brain do BACKFLIPS! Every line SCREAMS with the ecstasy of consciousness expanding beyond its boundaries!'
    }
  },
  {
    id: '5',
    name: 'Silent Samurai',
    description: 'This bold painting captures the essence of a ninja, featuring deep black strokes forming a mask and intense eyes that peer into the unknown. A vivid red headband crosses the top, adding a splash of color and hinting at the warrior\'s fierce determination.',
    imageUrl: 'https://dpop.nyc3.digitaloceanspaces.com/uploads/jTIQTGqhQrJQyl0z6ngXVVzOvBp9mTsvpxKNXOTz.jpg',
    artist: 'WiredInSamurai',
    price: '0.9 SUI',
    forSale: true,
    review: {
      rating: '10 silent shadows out of a moonless night',
      text: 'The INTENSITY of this warrior\'s gaze PENETRATES my soul with the precision of a thousand blades! Each stroke COMMANDS respect with the authority of an ancient battlefield!'
    }
  }
];

export default function Gallery() {
  const [artworks, setArtworks] = useState(mockArtworks);
  const [selectedArtwork, setSelectedArtwork] = useState<typeof mockArtworks[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real app, you would fetch artworks from an API
  useEffect(() => {
    // Simulating API fetch
    const fetchArtworks = async () => {
      // const response = await fetch('/api/artworks');
      // const data = await response.json();
      // setArtworks(data);
      setArtworks(mockArtworks);
    };

    fetchArtworks();
  }, []);

  const openArtworkModal = (artwork: typeof mockArtworks[0]) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            <GalleryTitle>
              Lord Smearington&apos;s Absurd Gallery
            </GalleryTitle>
            <GallerySubtitle>
              Behold the artistic madness, rated with feral metaphors
            </GallerySubtitle>
          </GalleryHeader>

          <ArtworkGrid>
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} onClick={() => openArtworkModal(artwork)}>
                <ArtworkImageContainer>
                  <ArtworkImage src={artwork.imageUrl} alt={artwork.name} />
                  {artwork.forSale && (
                    <ForSaleBadge>
                      <FaShoppingCart /> For Sale
                    </ForSaleBadge>
                  )}
                </ArtworkImageContainer>
                <ArtworkInfo>
                  <ArtworkTitle>{artwork.name}</ArtworkTitle>
                  <ArtworkArtist>By: {artwork.artist}</ArtworkArtist>
                  <ArtworkRating>
                    Rating: {artwork.review.rating}
                  </ArtworkRating>
                </ArtworkInfo>
              </ArtworkCard>
            ))}
          </ArtworkGrid>
        </GalleryContainer>
      </GallerySection>

      {/* Artwork Detail Modal */}
      {isModalOpen && selectedArtwork && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={closeModal}>×</ModalCloseButton>
            <ModalImageContainer>
              <ModalImage src={selectedArtwork.imageUrl} alt={selectedArtwork.name} />
            </ModalImageContainer>
            <ModalInfo>
              <ModalTitle>{selectedArtwork.name}</ModalTitle>
              <ModalArtist>Created by: {selectedArtwork.artist}</ModalArtist>
              <ModalDescription>{selectedArtwork.description}</ModalDescription>
              
              <ReviewSection>
                <ReviewHeader>Lord Smearington&apos;s Review</ReviewHeader>
                <ReviewRating>{selectedArtwork.review.rating}</ReviewRating>
                <ReviewText>{selectedArtwork.review.text}</ReviewText>
              </ReviewSection>
              
              {selectedArtwork.forSale && (
                <PurchaseSection>
                  <PriceTag>{selectedArtwork.price}</PriceTag>
                  <PurchaseButton>
                    <FaShoppingCart /> Purchase This Masterpiece
                  </PurchaseButton>
                </PurchaseSection>
              )}
            </ModalInfo>
          </ModalContent>
        </ModalOverlay>
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
  background: linear-gradient(to bottom right, #2D3748, #1A202C);
  padding: 2rem 0;
  overflow: hidden;
`;

const GalleryBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(76, 29, 149, 0.3) 0%, transparent 60%),
              radial-gradient(circle at 70% 60%, rgba(124, 58, 237, 0.2) 0%, transparent 50%);
  z-index: 0;
`;

const FloatingElement = styled.div<{ top: string; left: string; animationDuration: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  z-index: 1;
  animation: ${float} ${props => props.animationDuration} infinite ease-in-out;
`;

const StarIcon = styled.span<{ color: string; fontSize: string }>`
  color: ${props => props.color};
  font-size: ${props => props.fontSize};
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
    color: #805AD5;
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
  color: #A0AEC0;
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

const ArtworkCard = styled.div`
  background: rgba(26, 32, 44, 0.8);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
  background-color: #805AD5;
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
  color: #A0AEC0;
  margin-bottom: 0.5rem;
`;

const ArtworkRating = styled.div`
  font-size: 0.875rem;
  color: #E2E8F0;
  font-style: italic;
`;

// Modal components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #2D3748;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 95vw;
  max-height: 95vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  
  @media (min-width: 768px) {
    flex-direction: row;
    height: 95vh;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    color: #805AD5;
  }
`;

const ModalImageContainer = styled.div`
  flex: 1;
  height: 50vh;
  
  @media (min-width: 768px) {
    height: 100%;
    max-width: 60%;
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ModalInfo = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const ModalArtist = styled.p`
  font-size: 1rem;
  color: #A0AEC0;
  margin-bottom: 1rem;
`;

const ModalDescription = styled.p`
  font-size: 1rem;
  color: #E2E8F0;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ReviewSection = styled.div`
  background: rgba(76, 29, 149, 0.2);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #805AD5;
`;

const ReviewHeader = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #B794F4;
  margin-bottom: 0.5rem;
`;

const ReviewRating = styled.div`
  font-size: 1.125rem;
  color: #E9D8FD;
  margin-bottom: 1rem;
  font-style: italic;
`;

const ReviewText = styled.p`
  font-size: 1rem;
  color: #E2E8F0;
  line-height: 1.8;
`;

const PurchaseSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PriceTag = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
`;

const PurchaseButton = styled.button`
  padding: 1rem 2rem;
  background-color: #805AD5;
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
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    background-color: #6B46C1;
  }
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
