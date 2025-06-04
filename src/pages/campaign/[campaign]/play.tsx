import { useRouter } from "next/router";
import styled from "@emotion/styled";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { Title } from "@/components/styled/typography";
import BottomNavigation from "@/components/BottomNavigation";
import { useCampaign } from "@/hooks/useCampaign";
import CharacterList from "@/components/CharacterList";
import CharacterImageTile from "@/components/CharacterImageTile";

export default function CampaignPlayPage() {
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  const { campaign, loading, characters } = useCampaign(campaignId as string);

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
          <Title style={{ fontSize: "1rem", marginBottom: "2rem" }}>{campaign.name}</Title>

          <CharacterImageTile
            name={"Dungeon Master"}
            imageUrl={'/images/COLLECTOR-quest-intro-1024.jpg'}
          />

          <CharactersSection>
            <CharacterList characters={characters} highlightedCharacterId={characters[0]?.id} />
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
  padding: 0rem;
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
  padding: 1rem;
  color: #e0dde5;
`;

const CharactersSection = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
  text-align: center;
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
