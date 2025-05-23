import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { 
  Title,
  SectionTitle,
} from '@/components/styled/typography';
import { Artifact } from '@/data/artifacts';
import { listArtifacts } from '@/db/artifacts';

interface ArtifactsPageProps {
  artifacts: Artifact[];
}

const ArtifactsPage = ({ artifacts }: ArtifactsPageProps) => {
  return (
    <PageContainer>
      <Header>
        <Title>Artifacts Collection</Title>
        <CreateButton href="/artifacts/create">
          Create Artifact
        </CreateButton>
      </Header>

      <SectionTitle>Browse Artifacts</SectionTitle>

      {artifacts.length > 0 ? (
        <ArtifactsGrid>
          {artifacts.map((artifact) => (
            <Link href={`/artifacts/${artifact.id}`} key={artifact.id} passHref>
              <ArtifactCard>
                <ArtifactImageContainer>
                  <Image
                    src={artifact.imageUrl}
                    alt={artifact.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </ArtifactImageContainer>
                <ArtifactInfo>
                  <ArtifactTitle>{artifact.title}</ArtifactTitle>
                  <ArtifactArtist>By {artifact.artist}, {artifact.year}</ArtifactArtist>
                  {/* <BadgeContainer>
                    <Badge>{artifact.relic?.rarity}</Badge>
                    <Badge>{artifact.relic?.element}</Badge>
                  </BadgeContainer> */}
                </ArtifactInfo>
              </ArtifactCard>
            </Link>
          ))}
        </ArtifactsGrid>
      ) : (
        <EmptyState>
          <p>No artifacts found. Create your first artifact!</p>
          <CreateButton href="/artifacts/create">
            Create Artifact
          </CreateButton>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const artifacts = await listArtifacts();
    
    return {
      props: {
        artifacts,
      },
    };
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    return {
      props: {
        artifacts: [],
      },
    };
  }
};

export default ArtifactsPage;

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
`;

const CreateButton = styled.a`
  display: inline-block;
  background-color: #6c5ce7;
  color: #c7bfd4;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  text-decoration: none;
  font-family: "Cinzel", serif;
  text-align: center;
  width: 100%;
  margin-bottom: 2rem;
  
  @media (min-width: 640px) {
    width: auto;
  }
  
  &:hover {
    background-color: #bb8930;
    transform: translateY(-2px);
  }
`;

const ArtifactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: 480px) {
    gap: 1.5rem;
  }
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ArtifactCard = styled.div`
  background-color: #2d2d44;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ArtifactImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  
  @media (min-width: 640px) {
    height: 220px;
  }
  
  @media (min-width: 1024px) {
    height: 250px;
  }
`;

const ArtifactInfo = styled.div`
  padding: 1rem;
  
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const ArtifactTitle = styled.h3`
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  
  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

const ArtifactArtist = styled.p`
  color: #c7bfd4;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  
  @media (min-width: 640px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Badge = styled.span`
  display: inline-block;
  background-color: #1a1a2e;
  color: #bb8930;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  border: 1px solid #bb8930;
  
  @media (min-width: 640px) {
    font-size: 0.8rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #2d2d44;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  font-family: "Cormorant Garamond", serif;
  p {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 640px) {
    padding: 3rem;
    margin-top: 2rem;
  }
`;