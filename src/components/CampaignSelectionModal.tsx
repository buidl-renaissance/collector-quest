import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { Campaign } from "../data/campaigns";
import { Title, Subtitle } from "./styled/typography";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import Modal from "./Modal";

interface CampaignSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampaignSelectionModal = ({ isOpen, onClose }: CampaignSelectionModalProps) => {
  const router = useRouter();
  const { character } = useCurrentCharacter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!character?.id) {
        setCampaigns([]);
        setLoading(false);
        return;
      }

      try {
        const campaignsResponse = await fetch(
          `/api/campaigns?characterId=${character.id}`
        );
        if (!campaignsResponse.ok) {
          throw new Error("Failed to fetch campaigns");
        }
        const campaignsList = await campaignsResponse.json();
        setCampaigns(campaignsList);
      } catch (error) {
        console.error("Failed to load data:", error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      loadData();
    }
  }, [character?.id, isOpen]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <Modal onClose={onClose}>
        <LoadingMessage>Loading...</LoadingMessage>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <Container>
        <Title>Start Your Adventure</Title>
        <Subtitle>Choose your path and begin your adventure</Subtitle>

        <ButtonContainer>
          {campaigns.length === 0 && (
            <NoGamesMessage>No active campaigns found</NoGamesMessage>
          )}
          <ContinueButton
            onClick={() => router.push("/campaign/continue")}
            disabled={campaigns.length === 0}
          >
            Continue
          </ContinueButton>

          <NewButton onClick={() => router.push("/campaign/new")}>
            Start New Campaign
          </NewButton>
        </ButtonContainer>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 3rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const BaseButton = styled.button`
  width: 100%;
  padding: 1.5rem;
  border-radius: 8px;
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  transition: all 0.2s ease;
  position: relative;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ContinueButton = styled(BaseButton)<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? "rgba(187, 137, 48, 0.2)" : "#bb8930"};
  color: ${(props) => (props.disabled ? "#a77d3e" : "#1a1625")};
  border: 1px solid ${(props) => (props.disabled ? "#a77d3e" : "#bb8930")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
`;

const NewButton = styled(BaseButton)`
  background-color: rgba(46, 30, 15, 0.7);
  color: #bb8930;
  border: 1px solid #bb8930;
  cursor: pointer;

  &:hover {
    background-color: rgba(46, 30, 15, 0.9);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.5rem;
  padding: 2rem;
`;

const NoGamesMessage = styled.p`
  color: #a77d3e;
  font-size: 0.9rem;
  margin-top: 1rem;
  font-style: italic;
`;
