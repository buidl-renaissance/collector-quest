import React from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/router';

interface Artifact {
  id: string;
  title: string;
  imageUrl: string;
  artist: string;
  year: string;
}

interface ArtifactsListProps {
  artifacts: Artifact[];
  loading: boolean;
  onCreateArtifact: () => void;
}

const ArtifactsList: React.FC<ArtifactsListProps> = ({
  artifacts,
  loading,
  onCreateArtifact,
}) => {
  const router = useRouter();

  if (loading) {
    return <LoadingText>Loading artifacts...</LoadingText>;
  }

  return (
    <>
      {artifacts.length > 0 && (
        <ArtifactsGrid>
          {artifacts.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              onClick={() => router.push(`/artifacts/${artifact.id}`)}
            >
              <ArtifactImageContainer>
                <Image
                  src={artifact.imageUrl}
                  alt={artifact.title}
                  layout="fill"
                  objectFit="cover"
                />
              </ArtifactImageContainer>
              <ArtifactInfo>
                <ArtifactTitle>{artifact.title}</ArtifactTitle>
                <ArtifactArtist>
                  By {artifact.artist}, {artifact.year}
                </ArtifactArtist>
              </ArtifactInfo>
            </ArtifactCard>
          ))}
        </ArtifactsGrid>
      )}
      <CreateArtifactContainer hasEmptyState={artifacts.length === 0}>
        {artifacts.length === 0 && (
          <EmptyStateText>No artifacts found</EmptyStateText>
        )}
        <CreateArtifactButton onClick={onCreateArtifact}>
          <FaPlus /> Create Artifact
        </CreateArtifactButton>
      </CreateArtifactContainer>
    </>
  );
};

const LoadingText = styled.p`
  text-align: center;
  color: #bb8930;
  font-size: 1.1rem;
  margin: 2rem 0;
`;

const ArtifactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ArtifactCard = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid #bb8930;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(187, 137, 48, 0.2);
  }
`;

const ArtifactImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const ArtifactInfo = styled.div`
  padding: 1rem;
`;

const ArtifactTitle = styled.h3`
  color: #bb8930;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-family: "Cinzel", serif;
`;

const ArtifactArtist = styled.p`
  color: #a89bb4;
  font-size: 0.9rem;
  margin: 0;
`;

const CreateArtifactContainer = styled.div<{ hasEmptyState: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: ${props => props.hasEmptyState ? '2rem' : '0'};
  background: ${props => props.hasEmptyState ? 'rgba(26, 26, 46, 0.8)' : 'transparent'};
  border: ${props => props.hasEmptyState ? '1px solid #bb8930' : 'none'};
  border-radius: 8px;
`;

const EmptyStateText = styled.p`
  color: #a89bb4;
  font-size: 1.1rem;
  margin: 0;
`;

const CreateArtifactButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-family: "Cinzel", serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d4a959;
    transform: translateY(-2px);
  }
`;

export default ArtifactsList; 