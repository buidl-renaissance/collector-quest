import React from 'react';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Artifact } from '@/data/artifacts';
import { getArtifact } from '@/db/artifacts';
import { Title, Subtitle } from '@/components/styled/typography';
import BottomNavigationBar from '@/components/BottomNavigationBar';

interface ArtifactPageProps {
  artifact: Artifact;
}

const ArtifactPage: React.FC<ArtifactPageProps> = ({ artifact }) => {
  const router = useRouter();

  if (!artifact) {
    return (
      <PageContainer>
        <ErrorContainer>
          <Title>Artifact Not Found</Title>
          <Subtitle>The artifact you&apos;re looking for doesn&apos;t exist.</Subtitle>
        </ErrorContainer>
        <BottomNavigationBar />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ArtifactContainer>
        <ArtifactHeader>
          <Title>{artifact.title}</Title>
          <Subtitle>By {artifact.artist}, {artifact.year}</Subtitle>
        </ArtifactHeader>

        <ArtifactImageContainer>
          <Image
            src={artifact.imageUrl}
            alt={artifact.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </ArtifactImageContainer>

        <ArtifactDetails>
          <DetailSection>
            <DetailTitle>Description</DetailTitle>
            <DetailContent>{artifact.description}</DetailContent>
          </DetailSection>

          {artifact.relic && (
            <DetailSection>
              <DetailTitle>Relic Details</DetailTitle>
              <DetailContent>
                <RelicInfo>
                  <RelicLabel>Rarity:</RelicLabel>
                  <RelicValue>{artifact.relic.rarity}</RelicValue>
                </RelicInfo>
                <RelicInfo>
                  <RelicLabel>Element:</RelicLabel>
                  <RelicValue>{artifact.relic.element}</RelicValue>
                </RelicInfo>
              </DetailContent>
              {artifact.owner && artifact.relic.imageUrl && (
                <RelicImageContainer>
                  <Image
                    src={artifact.relic.imageUrl}
                    alt={`${artifact.relic.name} Relic`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </RelicImageContainer>
              )}
            </DetailSection>
          )}
        </ArtifactDetails>
      </ArtifactContainer>
      <BottomNavigationBar />
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const artifact = await getArtifact(params?.artifact as string);
    
    return {
      props: {
        artifact,
      },
    };
  } catch (error) {
    console.error('Error fetching artifact:', error);
    return {
      props: {
        artifact: null,
      },
    };
  }
};

export default ArtifactPage;

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  background: rgba(30, 20, 50, 0.95);
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
`;

const ArtifactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(45, 45, 68, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(187, 137, 48, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const ArtifactHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ArtifactImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid rgba(187, 137, 48, 0.3);
`;

const ArtifactDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DetailSection = styled.div`
  background: rgba(30, 20, 50, 0.8);
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid rgba(187, 137, 48, 0.3);
`;

const DetailTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const DetailContent = styled.div`
  color: #e8e3f0;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const RelicInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const RelicLabel = styled.span`
  color: #bb8930;
  font-weight: 600;
  min-width: 80px;
`;

const RelicValue = styled.span`
  color: #e8e3f0;
`;

const RelicImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  margin-top: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(187, 137, 48, 0.3);
  background: rgba(20, 15, 35, 0.8);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
`; 