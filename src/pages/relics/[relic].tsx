import React from 'react';
import { GetServerSideProps } from 'next';
import styled from '@emotion/styled';
import Image from 'next/image';
import { Container } from '@/components/styled/layout';
import { getRelic } from '@/db/relics';
import { Relic } from '@/data/artifacts';
import { useRouter } from 'next/router';
import AddressDisplay from '@/components/AddressDisplay';

interface RelicPageProps {
  relic: Relic | null;
  metadata: {
    title: string;
    description: string;
    image?: string;
  };
}

const RelicPage: React.FC<RelicPageProps> = ({ relic }) => {
  const router = useRouter();
  if (!relic) {
    return (
      <Container>
        <PageContainer>
          <ErrorMessage>Relic not found</ErrorMessage>
        </PageContainer>
      </Container>
    );
  }

  return (
      <PageContainer>
        <RelicContainer>
          {/* <BackButton onClick={() => router.back()}>
            <FaArrowLeft />
            Back
          </BackButton> */}
          <ImageContainer>
            {relic.imageUrl && (
              <Image
                src={relic.imageUrl}
                alt={relic.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            )}
          </ImageContainer>
          
          <RelicDetails>
            <RelicTitle>{relic.name}</RelicTitle>
            {relic.objectId && (
              <AddressDisplay address={relic.objectId} explorerUrl={`https://suiscan.xyz/testnet/object/${relic.objectId}`}/>
            )}
            <PropertyGrid>
              <RelicType>
                <PropertyLabel>Effect</PropertyLabel>
                <PropertyValue>{relic.effect}</PropertyValue>
              </RelicType>
              
              <RelicType>
                <PropertyLabel>Element</PropertyLabel>
                <PropertyValue>{relic.element}</PropertyValue>
              </RelicType>
              
              <RelicType>
                <PropertyLabel>Class</PropertyLabel>
                <PropertyValue>{relic.class}</PropertyValue>
              </RelicType>
              
              <RelicType>
                <PropertyLabel>Rarity</PropertyLabel>
                <PropertyValue>{relic.rarity}</PropertyValue>
              </RelicType>
            </PropertyGrid>
            
            {relic.story && (
              <StorySection>
                <StoryTitle>Story</StoryTitle>
                <StoryText>{relic.story}</StoryText>
              </StorySection>
            )}
            
            {relic.properties && (
              <PropertiesSection>
                <PropertiesTitle>Properties</PropertiesTitle>
                <PropertiesGrid>
                  {Object.entries(relic.properties).map(([key, value]) => {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <PropertyItem key={key}>
                        <PropertyLabel>{label}</PropertyLabel>
                        <PropertyValue>{String(value)}</PropertyValue>
                      </PropertyItem>
                    )
                  })}
                </PropertiesGrid>
              </PropertiesSection>
            )}
          </RelicDetails>
        </RelicContainer>
      </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { relic } = context.query;

  const relicData = await getRelic(relic as string);

  return {
    props: {
      metadata: {
        title: `${relicData?.name || 'Unknown Relic'} | COLLECTOR QUEST Relic`,
        description: `${relicData?.story || 'A mysterious relic from the Collector Quest universe.'}`,
        image: relicData?.imageUrl,
      },
      relic: relicData || null,
    },
  };
};

export default RelicPage;

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  background: rgba(30, 20, 50, 0.95);
  min-height: 100vh;
`;

const RelicContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 3rem;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 256px;
  height: 256px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(187, 137, 48, 0.3);
  border: 2px solid #bb8930;
  background: rgba(30, 20, 50, 0.95);
  margin: 0 auto;
  margin-top: 2rem;
  
  @media (min-width: 768px) {
    width: 400px;
    height: 400px;
    flex-shrink: 0;
  }
`;

const RelicDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RelicTitle = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #bb8930;
  font-size: 2.5rem;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 1.5rem;
`;

const RelicType = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 1rem;
  text-align: center;
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const PropertyItem = styled.div`
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const PropertyLabel = styled.div`
  color: #bb8930;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`;

const PropertyValue = styled.div`
  color: #e8e3f0;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.4;
`;

const StorySection = styled.div`
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin-top: 1rem;
`;

const StoryTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const StoryText = styled.p`
  color: #e8e3f0;
  line-height: 1.6;
  font-size: 1.125rem;
  margin: 0;
`;

const PropertiesSection = styled.div`
  background: rgba(30, 20, 50, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const PropertiesTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e8e3f0;
  font-size: 1.5rem;
  padding: 3rem;
`;
