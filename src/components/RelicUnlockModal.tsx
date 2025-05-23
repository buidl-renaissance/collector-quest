import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import LoadingCandles from "@/components/LoadingCandles";
import { NextButton } from "@/components/styled/character";
import { useRouter } from "next/router";
import { Relic } from "@/data/artifacts";
import AddressDisplay from "./AddressDisplay";
import { spinAndGlow } from "./styled/animations";
import { LoadingContainer, LoadingMessage } from "./styled/loading";
interface RelicModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
  relic: Relic | null;
}

const RelicModal: React.FC<RelicModalProps> = ({
  isOpen,
  onClose,
  isGenerating,
  relic,
}) => {
  const router = useRouter();

  const handleExamineRelic = () => {
    router.push(`/relics/${relic?.id}`);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* {!isGenerating && (
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        )} */}
        {isGenerating ? (
          <LoadingContainer>
            <LoadingCandles />
            <LoadingMessage>Generating your relic...</LoadingMessage>
          </LoadingContainer>
        ) : relic ? (
          <RelicContainer>
            <RelicImage>
              <Image
                src={relic.imageUrl ?? ""}
                alt="Generated Relic"
                style={{ objectFit: "cover" }}
                width={256}
              height={256}
              />
            </RelicImage>
            <RelicDescription>
              <RelicTitle>RELIC UNLOCKED</RelicTitle>
              {relic.objectId && (
                <AddressDisplay address={relic.objectId} explorerUrl={`https://suiscan.xyz/testnet/object/${relic.objectId}`}/>
              )}
              <p>
                This is a unique Relic<br /> Examine it to learn about its
                mystical properties.
              </p>
              <ClaimButton onClick={handleExamineRelic}>
                Examine Relic
              </ClaimButton>
            </RelicDescription>
          </RelicContainer>
        ) : null}
      </ModalContent>
    </ModalOverlay>
  );
};

export default RelicModal;

// Styled components for the modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
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


const RelicContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RelicImage = styled.div`
  position: relative;
  width: 256px;
  height: 256px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #bb8930;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: rgba(30, 20, 50, 0.95);
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

const RelicTitle = styled.h2`
  font-family: "Cinzel", serif;
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #bb8930;
  margin: 0.5rem auto;
`;

const RelicDescription = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-family: "Cinzel", serif;
`;

const ClaimButton = styled(NextButton)`
  background-color: #4a3a6e;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  margin: 1rem auto;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5d4888;
  }
`;
