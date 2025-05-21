import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { Container, Header, LoadingContainer, LoadingMessage, ActionButtons } from '@/components/styled/layout';
import { BackButton } from '@/components/styled/buttons';
import { FaCrown } from 'react-icons/fa';
import Link from 'next/link';
import { getArtifact, Artifact } from '@/data/artifacts';

// Styled components for this page
const ArtifactContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  @media (min-width: 768px) {
    width: 50%;
    height: 400px;
  }
`;

const ArtifactDetails = styled.div`
  flex: 1;
`;

const ArtifactTitle = styled.h1`
  font-family: "Cinzel", serif;
  font-size: 2rem;
  color: #bb8930;
  margin-bottom: 1rem;
`;

const ArtistName = styled.h2`
  font-size: 1.2rem;
  color: #c7bfd4;
  margin-bottom: 2rem;
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailTitle = styled.h3`
  font-size: 1.1rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const DetailContent = styled.p`
  color: #c7bfd4;
  line-height: 1.6;
`;

const Badge = styled.span`
  display: inline-block;
  background-color: #2d2d44;
  color: #bb8930;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #bb8930;
  font-family: "Cormorant Garamond", serif;
`;

const ArtifactPage = ({ artifact }: { artifact: Artifact }) => {
  return (
    <Container darkMode>
      <Header>
        <Link href="/artifacts">
          <BackButton>← Back to Artifacts</BackButton>
        </Link>
      </Header>
      
      <ArtifactContainer>
        <ImageContainer>
          <Image 
            src={artifact.imageUrl} 
            alt={artifact.title}
            layout="fill"
            objectFit="cover"
          />
        </ImageContainer>
        
        <ArtifactDetails>
          <ArtifactTitle>{artifact.title}</ArtifactTitle>
          <ArtistName>By {artifact.artist}, {artifact.year}</ArtistName>
          
          <DetailSection>
            <DetailTitle>Description</DetailTitle>
            <DetailContent>{artifact.description}</DetailContent>
          </DetailSection>
          
          <DetailSection>
            <DetailTitle>Medium</DetailTitle>
            <DetailContent>{artifact.medium}</DetailContent>
          </DetailSection>
          
          <DetailSection>
            <DetailTitle>Artifact Properties</DetailTitle>
            <div>
              <Badge>Class: {artifact.class}</Badge>
              <Badge>Effect: {artifact.effect}</Badge>
              <Badge>Element: {artifact.element}</Badge>
              <Badge>Rarity: {artifact.rarity}</Badge>
            </div>
          </DetailSection>
          
          <ActionButtons>
            <BackButton>Collect Artifact</BackButton>
          </ActionButtons>
        </ArtifactDetails>
      </ArtifactContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { artifact } = context.query;
  
  const artifactData = getArtifact(artifact as string);

  return {
    props: {
      artifact: artifactData || null,
    },
  };
};

export default ArtifactPage;
