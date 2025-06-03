import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { Title } from "@/components/styled/typography";
import { Campaign } from "@/data/campaigns";
import BottomNavigation from "@/components/BottomNavigation";
import CharacterImageTile from "@/components/CharacterImageTile";
import { useCampaign } from "@/hooks/useCampaign";
import { useCharacters } from "@/hooks/useCharacters";
import { Character } from "@/data/character";

export default function CampaignPlayPage() {
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  const { campaign, loading, error } = useCampaign(campaignId as string);
  const {
    characters,
    loading: charactersLoading,
    error: charactersError,
  } = useCharacters(campaign?.characters?.map((c) => c.character_id) || []);

  if (loading) {
    return (
      <PageTransition>
        <Page>
          <LoadingMessage>Loading game...</LoadingMessage>
        </Page>
      </PageTransition>
    );
  }

  if (!campaign) {
    return (
      <PageTransition>
        <Page>
          <ErrorMessage>Campaign not found</ErrorMessage>
        </Page>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Page>
        <Container>
          <Title style={{ fontSize: "1rem" }}>{campaign.name}</Title>

          <CharactersSection>
            <CharactersList>
              {characters.map((char: Character) => (
                <CharacterImageTile
                  key={char.id}
                  name={char.name}
                  imageUrl={char.image_url}
                />
              ))}
            </CharactersList>
          </CharactersSection>

          <GameArea>
            <GameContent>
              <p>Your adventure awaits...</p>
            </GameContent>
          </GameArea>
        </Container>
        <BottomNavigation nextLabel="Continue" onNext={() => {}} />
      </Page>
    </PageTransition>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  padding-bottom: 80px;
`;

const GameArea = styled.div`
  margin-top: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(187, 137, 48, 0.3);
  min-height: 400px;
`;

const GameContent = styled.div`
  padding: 2rem;
  color: #e0dde5;
`;

const CharactersSection = styled.div`
  margin: 2rem 0;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: "Cinzel", serif;
  color: #bb8930;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const CharactersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const CharacterItem = styled.div`
  background: rgba(187, 137, 48, 0.1);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  min-width: 200px;
`;

const CharacterRole = styled.div`
  color: #bb8930;
  font-weight: 500;
  text-transform: capitalize;
  margin-bottom: 0.25rem;
`;

const CharacterID = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1.2rem;
  padding: 2rem;
`;
