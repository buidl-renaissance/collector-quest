import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import Image from "next/image";
import { GetServerSideProps } from "next";
import {
  Header,
  LoadingContainer,
  LoadingMessage,
  ActionButtons,
} from "@/components/styled/layout";
import { BackButton } from "@/components/styled/buttons";
import { FaCrown, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { Artifact } from "@/data/artifacts";
import { getArtifact } from "@/db/artifacts";

// Styled components for this page
const ArtifactContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0;
  padding-bottom: 5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
    padding: 0;
  }
`;

const ImageContainer = styled.div<{ imageHeight?: number }>`
  position: relative;
  width: 100%;
  height: ${(props) => (props.imageHeight ? `${props.imageHeight}px` : "auto")};
  min-height: 250px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin: 0 auto;

  @media (min-width: 768px) {
    width: 100%;
    min-height: 400px;
    margin: 0;
  }
`;

const ArtifactDetails = styled.div`
  flex: 1;
  padding: 0.5rem 0;

  @media (min-width: 768px) {
    padding: 0;
  }
`;

const ArtifactTitle = styled.h1`
  font-family: "Cinzel", serif;
  font-size: 1.6rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: left;
  }
`;

const ArtistName = styled.h2`
  font-size: 1rem;
  color: #c7bfd4;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: "Cormorant Garamond", serif;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    text-align: left;
  }
`;

const DetailSection = styled.div`
  margin-bottom: 1.2rem;

  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const DetailTitle = styled.h3`
  font-size: 1rem;
  color: #bb8930;
  margin-bottom: 0.3rem;
  font-family: "Cinzel", serif;

  @media (min-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
`;

const DetailContent = styled.p`
  color: #c7bfd4;
  line-height: 1.5;
  font-size: 0.95rem;
  font-family: "Cormorant Garamond", serif;

  @media (min-width: 768px) {
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.2rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const PropertyCard = styled.div`
  background: rgba(30, 20, 50, 0.5);
  border-radius: 6px;
  padding: 0.75rem;
  border: 1px solid #4a3b6b;

  @media (min-width: 768px) {
    padding: 1rem;
  }
`;

const PropertyLabel = styled.div`
  font-size: 0.8rem;
  color: #a29bfe;
  margin-bottom: 0.3rem;
  text-align: left;
  font-family: "Cinzel", serif;

  @media (min-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const PropertyValue = styled.div`
  font-size: 1rem;
  color: #f0e6ff;
  font-weight: 500;
  font-family: "Cormorant Garamond", serif;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StorySection = styled.div`
  background: rgba(30, 20, 50, 0.5);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.2rem;
  border: 1px solid #4a3b6b;

  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const AbilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.2rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const AbilityCard = styled.div`
  background: rgba(30, 20, 50, 0.5);
  border-radius: 6px;
  padding: 0.75rem;
  border: 1px solid #4a3b6b;

  @media (min-width: 768px) {
    padding: 1rem;
  }
`;

const AbilityTitle = styled.div`
  font-size: 0.9rem;
  color: #bb8930;
  margin-bottom: 0.3rem;
  font-family: "Cinzel", serif;

  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  color: #bb8930;
  margin-bottom: 0.3rem;
  font-family: "Cinzel", serif;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const InfoText = styled.p`
  color: #f0e6ff;
  line-height: 1.5;
  font-size: 0.95rem;
  font-family: "Cormorant Garamond", serif;

  @media (min-width: 768px) {
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const NextButton = styled.button`
  background: linear-gradient(135deg, #bb8930 0%, #a67b29 100%);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 0.5rem;

  @media (min-width: 480px) {
    width: auto;
    margin-bottom: 0;
    margin-right: 0.5rem;
  }

  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  &:hover {
    background: linear-gradient(135deg, #d4a040 0%, #bb8930 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

// Add Modal styled components
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 320px;

  @media (min-width: 480px) {
    max-width: 400px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  border: 2px solid #bb8930;
  color: #bb8930;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: rgba(30, 20, 50, 0.9);

  &:hover {
    color: #d4a040;
    border-color: #d4a040;
  }
`;

const spinAndGlow = `
  @keyframes spin {
    0% {
      transform: rotateY(0deg) scale(0.3);
    }
    100% {
      transform: rotateY(360deg) scale(1);
    }
  }

  @keyframes glow {
    0% {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3),
                  0 0 20px rgba(187, 137, 48, 0.2);
    }
    50% {
      box-shadow: 0 4px 30px rgba(187, 137, 48, 0.5),
                  0 0 40px rgba(187, 137, 48, 0.4),
                  0 0 60px rgba(187, 137, 48, 0.2);
    }
    100% {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3),
                  0 0 20px rgba(187, 137, 48, 0.2);
    }
  }
`;

const RelicImage = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #bb8930;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: rgba(30, 20, 50, 0.95);
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: spin 1.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    glow 3s ease-in-out 1.5s infinite;
  transform-style: preserve-3d;
  perspective: 1000px;
  ${spinAndGlow}

  @media (min-width: 480px) {
    width: 320px;
    height: 320px;
  }
`;

// Add new styled component for bottom nav
const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(30, 20, 50, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid #4a3b6b;
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const ActionButton = styled(NextButton)`
  flex: 1;
  max-width: 200px;
  margin: 0;
  font-family: "Cormorant Garamond", serif;
`;

// Update Container styled component
const PageContainer = styled.div`
  padding: 2rem;
  
  @media (min-width: 768px) {
    padding-bottom: 100px;
  }
`;

const ArtifactPage = ({ artifact }: { artifact: Artifact }) => {
  const router = useRouter();
  const [showRelicModal, setShowRelicModal] = useState(false);
  const [generatedRelicUrl, setGeneratedRelicUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageHeight, setImageHeight] = useState<number | undefined>();

  const handleImageLoad = (event: any) => {
    const img = event.target;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const containerWidth = img.parentElement.offsetWidth;
    const newHeight = containerWidth / aspectRatio;
    setImageHeight(newHeight);
  };

  const handleRelicAction = async () => {
    if (artifact.relicImageUrl) {
      // If relic exists, just show it in the modal
      setGeneratedRelicUrl(artifact.relicImageUrl);
      setShowRelicModal(true);
    } else {
      // Generate new relic
      setShowRelicModal(true);
      setIsGenerating(true);
      try {
        const response = await fetch("/api/artifacts/relic", {
          method: "POST",
          body: JSON.stringify({ artifactId: artifact.id }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to generate relic");
        }

        const data = await response.json();
        console.log("Generated relic:", data);
        artifact.relicImageUrl = data.relicImageUrl;
        setGeneratedRelicUrl(data.relicImageUrl);
      } catch (error) {
        console.error("Error generating relic:", error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const closeModal = () => {
    setShowRelicModal(false);
    if (!artifact.relicImageUrl) {
      setGeneratedRelicUrl(null);
    }
  };

  return (
    <PageContainer>
      <Header>
        <Link href="/artifacts">
          <BackButton>← Back to Artifacts</BackButton>
        </Link>
      </Header>
      
      <ArtifactContainer>
        <ImageContainer imageHeight={imageHeight}>
          <Image 
            src={artifact.imageUrl} 
            alt={artifact.title}
            fill
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            onLoad={handleImageLoad}
          />
        </ImageContainer>
        
        <ArtifactDetails>
          <ArtifactTitle>{artifact.title}</ArtifactTitle>
          <ArtistName>
            By {artifact.artist}, {artifact.year}
          </ArtistName>
          
          <DetailSection>
            <DetailTitle>Description</DetailTitle>
            <DetailContent>{artifact.description}</DetailContent>
          </DetailSection>

          <DetailSection>
            <DetailTitle>Medium</DetailTitle>
            <DetailContent>{artifact.medium}</DetailContent>
          </DetailSection>

          <InfoTitle style={{ marginBottom: "1rem" }}>
            Magical Properties
          </InfoTitle>
          <PropertyGrid>
            <PropertyCard>
              <PropertyLabel>Class</PropertyLabel>
              <PropertyValue>{artifact.properties.class}</PropertyValue>
            </PropertyCard>
            <PropertyCard>
              <PropertyLabel>Effect</PropertyLabel>
              <PropertyValue>{artifact.properties.effect}</PropertyValue>
            </PropertyCard>
            <PropertyCard>
              <PropertyLabel>Element</PropertyLabel>
              <PropertyValue>{artifact.properties.element}</PropertyValue>
            </PropertyCard>
            <PropertyCard>
              <PropertyLabel>Rarity</PropertyLabel>
              <PropertyValue>{artifact.properties.rarity}</PropertyValue>
            </PropertyCard>
          </PropertyGrid>

          <StorySection>
            <InfoTitle>Artifact Story</InfoTitle>
            <InfoText style={{ fontStyle: "italic" }}>
              {artifact.story}
            </InfoText>
          </StorySection>

          <AbilityGrid>
            <AbilityCard>
              <AbilityTitle>Passive Bonus</AbilityTitle>
              <InfoText>{artifact.properties.passiveBonus}</InfoText>
            </AbilityCard>
            <AbilityCard>
              <AbilityTitle>Active Use</AbilityTitle>
              <InfoText>{artifact.properties.activeUse}</InfoText>
            </AbilityCard>
            <AbilityCard>
              <AbilityTitle>Unlock Condition</AbilityTitle>
              <InfoText>{artifact.properties.unlockCondition}</InfoText>
            </AbilityCard>
            <AbilityCard>
              <AbilityTitle>Reflection Trigger</AbilityTitle>
              <InfoText>{artifact.properties.reflectionTrigger}</InfoText>
            </AbilityCard>
          </AbilityGrid>
        </ArtifactDetails>
      </ArtifactContainer>

      <BottomNav>
        {!artifact.owner && (
          <ActionButton
            onClick={() => router.push(`/artifacts/${artifact.id}/claim`)}
          >
            Claim Artifact
          </ActionButton>
        )}
        <ActionButton onClick={handleRelicAction}>
          {artifact.relicImageUrl ? "View Relic" : "Generate Relic"}
        </ActionButton>
      </BottomNav>

      {showRelicModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>
              <FaTimes />
            </CloseButton>
            {isGenerating ? (
              <LoadingContainer>
                <LoadingMessage>Generating your relic...</LoadingMessage>
              </LoadingContainer>
            ) : generatedRelicUrl ? (
              <RelicImage>
                <Image
                  src={generatedRelicUrl}
                  alt="Generated Relic"
                  style={{ objectFit: "cover" }}
                  width={256}
                  height={256}
                />
              </RelicImage>
            ) : null}
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { artifact } = context.query;

  const artifactData = await getArtifact(artifact as string);

  return {
    props: {
      artifact: artifactData || null,
    },
  };
};

export default ArtifactPage;
