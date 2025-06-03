import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PageTransition from '@/components/PageTransition';
import Page from '@/components/Page';
import { Title } from '@/components/styled/typography';
import { Campaign } from '@/data/campaigns';
import { getCurrentCharacterId } from '@/utils/storage';
import CharacterImageTile from '@/components/CharacterImageTile';
import { useCharacters } from '@/hooks/useCharacters';

export default function ContinueCampaignPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) {
          router.push('/character');
          return;
        }

        const response = await fetch(`/api/campaigns?characterId=${characterId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error loading campaigns:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, [router]);

  const handleCampaignSelect = (campaignId: string) => {
    router.push(`/campaign/${campaignId}`);
  };

  if (loading) {
    return (
      <PageTransition>
        <Page>
          <LoadingMessage>Loading campaigns...</LoadingMessage>
        </Page>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Page>
        <Container>
          <Title>Continue Campaign</Title>

          {campaigns.length === 0 ? (
            <NoCampaignsMessage>No active campaigns found</NoCampaignsMessage>
          ) : (
            <CampaignList>
              {campaigns.map((campaign) => (
                <CampaignCard 
                  key={campaign.id}
                  onClick={() => handleCampaignSelect(campaign.id)}
                >
                  <CampaignTitle>{campaign.name}</CampaignTitle>
                  <CampaignDescription>
                    {campaign.description.length > 120 
                      ? campaign.description.substring(0, 120) + '...'
                      : campaign.description}
                  </CampaignDescription>
                  <CampaignStatus>Status: {campaign.status}</CampaignStatus>
                </CampaignCard>
              ))}
            </CampaignList>
          )}
        </Container>
      </Page>
    </PageTransition>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CampaignList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const CampaignCard = styled.div`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    border-color: #bb8930;
  }
`;

const CampaignTitle = styled.h2`
  font-family: "Cinzel", serif;
  color: #bb8930;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const CampaignDescription = styled.p`
  color: #e0dde5;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CampaignStatus = styled.div`
  color: #bb8930;
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #e0dde5;
  font-size: 1.2rem;
  padding: 2rem;
`;

const NoCampaignsMessage = styled.div`
  text-align: center;
  color: #e0dde5;
  font-size: 1.1rem;
  margin-top: 2rem;
`;
