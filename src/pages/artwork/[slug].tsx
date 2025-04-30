import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Artwork } from "@/lib/interfaces";
import ArtworkFullDisplay from "../../components/ArtworkFullDisplay";

// Mock data for artworks - in a real app, this would come from an API
const mockArtworks = [
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
  // Add more mock artworks as needed
];

export default function ArtworkDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // In a real app, fetch the artwork data from an API
    const fetchArtwork = async () => {
      setLoading(true);
      try {
        // Simulate API call
        // const response = await fetch(`/api/artworks/${slug}`);
        // const data = await response.json();
        
        // Using mock data for now
        const foundArtwork = mockArtworks.find(art => art.slug === slug);
        
        // Simulate network delay
        setTimeout(() => {
          setArtwork(foundArtwork as Artwork || null);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching artwork:", error);
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [slug]);

  const handlePurchase = () => {
    // Implement purchase functionality
    console.log("Purchase initiated for:", artwork?.title);
    // Could redirect to checkout or open a modal
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading masterpiece...</LoadingMessage>
      </Container>
    );
  }

  if (!artwork) {
    return (
      <Container>
        <ErrorMessage>
          Artwork not found. Perhaps it was too avant-garde for this world.
        </ErrorMessage>
        <BackButton>
          <Link href="/gallery">
            <FlexDiv>
              <FaArrowLeft /> Return to Gallery
            </FlexDiv>
          </Link>
        </BackButton>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton>
        <Link href="/gallery">
          <FlexDiv>
            <FaArrowLeft /> Back to Gallery
          </FlexDiv>
        </Link>
      </BackButton>

      <ArtworkContainer>
        <ArtworkFullDisplay 
          artwork={artwork} 
          onPurchase={handlePurchase}
        />
      </ArtworkContainer>
    </Container>
  );
}

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #2d3748, #1a202c);
  padding: 2rem;
  color: white;
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: #e2e8f0;
  text-align: center;
  margin-top: 4rem;
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: #fc8181;
  text-align: center;
  margin-top: 4rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.div`
  margin-bottom: 2rem;
  
  a {
    display: inline-block;
    color: #a0aec0;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: #e2e8f0;
    }
  }
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ArtworkContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
