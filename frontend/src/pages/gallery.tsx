import React, { useState, useEffect } from "react";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import Link from "next/link";
import styled from "@emotion/styled";
import { ArtworkCard } from "./components/ArtworkCard";
import { Artwork } from "@/lib/interfaces";
import ArtworkFullDisplay from "./components/ArtworkFullDisplay";
import ModalContainer from "./components/ModalContainer";
// Mock data for artworks - in a real app, this would come from an API
const mockArtworks: Artwork[] = [
  {
    id: 1,
    slug: "gods-work-1",
    title: 'Gods Work #1 - "Moments Between the Noise"',
    description:
      'A reflection on the quiet spaces within chaos, "Moments Between the Noise" captures the fleeting instants of clarity, creation, and connection that define the artistic journey. As the first installment in the God\'s Work series, this piece embodies the misadventures of a digital artist navigating the digital landscape.',
    data: {
      image:
        "https://dpop.nyc3.digitaloceanspaces.com/uploads/LhsRXi729Z828HQApR1gxHD58PfcVLqGV3MroovZ.jpg",
      artist_name: "Daniel Geanes | ECNTRC",
      is_for_sale: true,
      price: 1000,
      review: {
        text: "This piece HOWLS with the agony of a thousand neon signs drowning in a sea of melted crayons! The brushstrokes are VIOLENT whispers that tickle the eyeballs with ferocious gentleness!",
        image: "",
      },
    },
    meta: {},
  },
  {
    id: 2,
    slug: "city-of-angles",
    title: "City of Angles",
    description: "DET <3 LOS ANGELES\nOil, Gold Leaf on Canvas\n20 x 16 inches",
    data: {
      image:
        "https://dpop.nyc3.digitaloceanspaces.com/uploads/MQ4W4exztUkNheUJhcNqXXJEJQStm8UivHSoe9lh.png",
      artist_name: "Munera Ziad Kaakouch",
      is_for_sale: true,
      price: 400,
      review: {
        text: "These shapes are CONSPIRING against my retinas! Each triangle is a DERANGED manifesto on the futility of straight lines in a curved universe! I feel personally ATTACKED by the color palette!",
        image: "",
      },
    },
    meta: {},
  },
  {
    id: 3,
    slug: "digital-icons-tribute-to-daft-punk",
    title: "Digital Icons – A Tribute to Daft Punk",
    description:
      "This vibrant and striking painting pays homage to the legendary electronic duo Daft Punk. Their iconic helmets, depicted with shimmering highlights and bold contrasts, capture the futuristic and enigmatic essence of their personas.",
    data: {
      image:
        "https://dpop.nyc3.digitaloceanspaces.com/uploads/LIdk68Iy4WLdxPnzYx4EFhwAPoEtfpbnMzLTppPm.jpg",
      artist_name: "Nathan Karinen",
      is_for_sale: false,
      review: {
        text: "This artwork WEEPS with the sorrow of abandoned pixels! I can TASTE the digital despair - it's like licking a battery while crying in the rain! MAGNIFICENT desolation!",
        image: "",
      },
    },
    meta: {},
  },
  {
    id: 4,
    slug: "trippin-psychedelic-self-reflection",
    title: "Trippin' – A Psychedelic Self-Reflection",
    description:
      "This surreal and introspective artwork, titled Trippin' – A Psychedelic Self-Reflection, explores the fluid nature of perception and self-awareness. The portrait, outlined in fine blue lines, features abstract facial distortions, fragmented features, and delicate, colorful pathways.",
    data: {
      image:
        "https://dpop.nyc3.digitaloceanspaces.com/uploads/iMZV1ShrbGalvYla0ClWPi6iqK7LxoVWQycolYAq.jpg",
      artist_name: "Daniel Geanes | ECNTRC",
      is_for_sale: true,
      price: 400,
      review: {
        text: "The MIND-BENDING contortions of reality in this piece make my brain do BACKFLIPS! Every line SCREAMS with the ecstasy of consciousness expanding beyond its boundaries!",
        image: "",
      },
    },
    meta: {},
  },
  {
    id: 5,
    slug: "silent-samurai",
    title: "Silent Samurai",
    description:
      "This bold painting captures the essence of a ninja, featuring deep black strokes forming a mask and intense eyes that peer into the unknown. A vivid red headband crosses the top, adding a splash of color and hinting at the warrior's fierce determination.",
    data: {
      image:
        "https://dpop.nyc3.digitaloceanspaces.com/uploads/jTIQTGqhQrJQyl0z6ngXVVzOvBp9mTsvpxKNXOTz.jpg",
      artist_name: "WiredInSamurai",
      is_for_sale: true,
      price: 100,
      review: {
        text: "The INTENSITY of this warrior's gaze PENETRATES my soul with the precision of a thousand blades! Each stroke COMMANDS respect with the authority of an ancient battlefield!",
        image: "",
      },
    },
    meta: {},
  },
];

export default function Gallery() {
  const [artworks, setArtworks] = useState(mockArtworks);
  const [selectedArtwork, setSelectedArtwork] = useState<
    (typeof mockArtworks)[0] | null
  >(null);
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
