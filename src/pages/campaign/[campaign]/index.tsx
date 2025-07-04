import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PageTransition from '@/components/PageTransition';
import Page from '@/components/Page';
import { Title, Subtitle } from '@/components/styled/typography';
import { Campaign, CampaignCharacter, CampaignQuest } from '@/data/campaigns';
import { NextButton } from '@/components/styled/buttons';
import BottomNavigation from '@/components/BottomNavigation';
import { useCharacters } from '@/hooks/useCharacters';
import CharacterList from '@/components/CharacterList';
import { useCurrentCampaign } from '@/hooks/useCurrentCampaign';
import { useCampaign } from '@/hooks/useCampaign';

export default function CampaignPage() {
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  const { campaign, characters, loading } = useCampaign(campaignId as string);
  const { setCampaign: setCurrentCampaign } = useCurrentCampaign();

  const handlePlay = useCallback(() => {
    if (campaign) {
      setCurrentCampaign(campaign);
      router.push('/play');
    }
  }, [campaign, setCurrentCampaign, router]);

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
              <CharacterList characters={characters} />
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
