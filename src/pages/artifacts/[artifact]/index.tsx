import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import Image from "next/image";
import { GetServerSideProps } from "next";
import {
  Header,
} from "@/components/styled/layout";
import { BackButton } from "@/components/styled/buttons";
import { NextButton } from "@/components/styled/character";
import Link from "next/link";
import { Artifact } from "@/data/artifacts";
import { getArtifact } from "@/db/artifacts";
import { useArtifact } from "@/hooks/useArtifact";
import RelicModal from "@/components/RelicUnlockModal";
import { keyframes } from "@emotion/react";
import AddressDisplay from "@/components/AddressDisplay";
import { getCurrentCharacterId } from "@/utils/storage";

const ArtifactPage = ({ artifact: initialArtifact }: { artifact: Artifact }) => {
  const router = useRouter();
  const [imageHeight, setImageHeight] = useState<number | undefined>();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);
  const {
    artifact,
    isGenerating,
    generatedRelic,
    showRelicModal,
    setShowRelicModal,
    handleRelicAction,
    closeModal,
  } = useArtifact(initialArtifact);

  useEffect(() => {
    setCurrentCharacterId(getCurrentCharacterId());
  }, []);

  useEffect(() => {
    if ((!artifact.relic || (artifact.relic && !artifact.relic.objectId)) && artifact.owner === currentCharacterId) {
      const timer = setTimeout(() => {
        setShowRegisterModal(true);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [artifact.owner, artifact.relic, currentCharacterId]);

  const handleImageLoad = (event: any) => {
    const img = event.target;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const containerWidth = img.parentElement.offsetWidth;
    const newHeight = containerWidth / aspectRatio;
    setImageHeight(newHeight);
  };

  const handleRelicClick = () => {
    if (artifact.relic?.id) {
      router.push(`/relics/${artifact.relic.id}`);
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

          {artifact.registration_id && (
            <AddressDisplay address={artifact.registration_id} explorerUrl={`https://suiscan.xyz/testnet/object/${artifact.registration_id}`}/>
          )}
          
          <DetailSection>
            <DetailTitle>Description</DetailTitle>
            <DetailContent>{artifact.description}</DetailContent>
          </DetailSection>

          <DetailSection>
            <DetailTitle>Medium</DetailTitle>
            <DetailContent>{artifact.medium}</DetailContent>
          </DetailSection>

          {currentCharacterId && artifact.owner === currentCharacterId && artifact.relic && artifact.relic.imageUrl && (
            <DetailSection>
              <GlowingRelicImageContainer onClick={handleRelicClick}>
                <Image
                  src={artifact.relic.imageUrl}
                  alt={`${artifact.relic.name} Relic`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </GlowingRelicImageContainer>
            </DetailSection>
          )}

        </ArtifactDetails>
      </ArtifactContainer>

      {showRelicModal && (
        <RelicModal 
          isOpen={true}
          onClose={closeModal}
          isGenerating={isGenerating}
          relic={generatedRelic ?? null}
        />
      )}

      {showRegisterModal && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <ModalTitle>Congratulations!</ModalTitle>
            </ModalHeader>
            <ModalContent>
              <p>You&apos;ve created a powerful artifact! Unlock its full potential by creating a digital relic!</p>
              <ModalActions>
                <ModalButton primary onClick={() => {
                  handleRelicAction();
                  setShowRegisterModal(false);
                }}>
                  Claim Digital Relic
                </ModalButton>
              </ModalActions>
            </ModalContent>
          </Modal>
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
      metadata: {
        title: `${artifactData?.title} | COLLECTOR QUEST Artifact`,
        description: `${artifactData?.description}`,
        image: artifactData?.imageUrl,
      },
      artifact: artifactData || null,
    },
  };
};

export default ArtifactPage;

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
  max-width: 256px;

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
  
const RegisterArtifactButton = styled(NextButton)`
  margin: 1rem auto;
  font-weight: 600;
  font-family: "Cinzel", serif;
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

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(187, 137, 48, 0.2); }
  50% { box-shadow: 0 0 20px rgba(187, 137, 48, 0.4); }
  100% { box-shadow: 0 0 5px rgba(187, 137, 48, 0.2); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #2d2d44 0%, #1e1e2d 100%);
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid #4a3b6b;
  position: relative;
  animation: ${slideUp} 0.4s ease-out;
  animation: ${glow} 2s infinite;

  @media (min-width: 768px) {
    padding: 2.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, #bb8930 0%, #4a3b6b 100%);
    border-radius: 12px;
    z-index: -1;
    opacity: 0.5;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(187, 137, 48, 0.2);

  @media (min-width: 768px) {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
  }
`;

const ModalTitle = styled.h2`
  font-family: "Cinzel", serif;
  color: #bb8930;
  margin: 0;
  font-size: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #bb8930 0%, #d4a03c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #a89bb4;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 50%;
  width: 32px;
  height: 32px;

  &:hover {
    color: #bb8930;
    background-color: rgba(187, 137, 48, 0.1);
    transform: rotate(90deg);
  }
`;

const ModalContent = styled.div`
  color: #c7bfd4;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  line-height: 1.5;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  p {
    margin: 0 0 0.75rem 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }
`;

const ModalButton = styled.button<{ primary?: boolean }>`
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-family: "Cinzel", serif;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 1rem;
  width: 100%;
  
  @media (min-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    min-width: 180px;
    width: auto;
  }
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #bb8930 0%, #d4a03c 100%);
    color: #1e1e2d;
    box-shadow: 0 4px 15px rgba(187, 137, 48, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(187, 137, 48, 0.4);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(187, 137, 48, 0.3);
    }
  ` : `
    background: transparent;
    color: #a89bb4;
    border: 1px solid #4a3b6b;
    
    &:hover {
      background-color: rgba(74, 59, 107, 0.2);
      color: #c7bfd4;
    }
  `}
`;

const GlowingRelicImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 1rem auto;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(187, 137, 48, 0.3);
  background: rgba(30, 20, 50, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: ${glow} 2s infinite;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(187, 137, 48, 0.4);
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, #bb8930 0%, #4a3b6b 100%);
    border-radius: 50%;
    z-index: -1;
    opacity: 0.5;
  }
`;
