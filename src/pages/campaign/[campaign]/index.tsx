import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PageTransition from '@/components/PageTransition';
import Page from '@/components/Page';
import { Title, Subtitle } from '@/components/styled/typography';
import { Campaign, CampaignCharacter, CampaignQuest } from '@/data/campaigns';
import { NextButton } from '@/components/styled/buttons';
import BottomNavigation from '@/components/BottomNavigation';
import CharacterImageTile from '@/components/CharacterImageTile';
import { useCharacters } from '@/hooks/useCharacters';

export default function CampaignPage() {
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const { characters, loading: charactersLoading } = useCharacters(
    campaign?.characters?.map((c) => c.character_id) || []
  );

  useEffect(() => {
    async function loadCampaign() {
      if (!campaignId) return;

      try {
        const response = await fetch(`/api/campaigns/${campaignId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign');
        }
        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error('Error loading campaign:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCampaign();
  }, [campaignId]);

  const handlePlay = () => {
    router.push(`/campaign/${campaignId}/play`);
  };

  if (loading) {
    return (
      <PageTransition>
        <Page>
          <LoadingMessage>Loading campaign details...</LoadingMessage>
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
          <Title style={{ fontSize: "2rem" }}>{campaign.name}</Title>
          {/* <Subtitle>Status: {campaign.status}</Subtitle> */}

          {campaign.characters && campaign.characters.length > 0 && (
            <Section>
              <CharactersList>
                {characters.map((char) => (
                  <CharacterImageTile
                    key={char.id}
                    name={char.name}
                    imageUrl={char.image_url}
                  />
                ))}
              </CharactersList>
            </Section>
          )}

          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>{campaign.description}</Description>
          </Section>


          {campaign.quests && campaign.quests.length > 0 && (
            <Section>
              <SectionTitle>Quests</SectionTitle>
              <QuestList>
                {campaign.quests.map((quest: CampaignQuest) => (
                  <QuestItem key={quest.id}>
                    <div>Quest ID: {quest.quest_id}</div>
                    <div>Status: {quest.status}</div>
                  </QuestItem>
                ))}
              </QuestList>
            </Section>
          )}
        </Container>
        <BottomNavigation
          nextLabel="Play"
          onNext={handlePlay}
          disabled={campaign.status !== 'active'}
        />
      </Page>
    </PageTransition>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0rem;
  padding-bottom: 80px; /* Add padding to prevent content being hidden behind nav */
`;

const Section = styled.section`
  margin: 2rem 0;
`;

const SectionTitle = styled.h2`
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const CharactersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const QuestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const QuestItem = styled.div`
  padding: 1rem;
  border: 1px solid #333;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
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
