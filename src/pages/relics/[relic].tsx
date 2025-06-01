import React from 'react';
import { GetServerSideProps } from 'next';
import styled from '@emotion/styled';
import { Container } from '@/components/styled/layout';
import { getRelic } from '@/db/relics';
import { Relic } from '@/data/artifacts';
import { useRouter } from 'next/router';
import RelicDisplay from '@/components/RelicDisplay';

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
      <RelicDisplay relic={relic} />
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
        image: relicData?.imageUrl || null,
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

const ErrorMessage = styled.div`
  text-align: center;
  color: #e8e3f0;
  font-size: 1.5rem;
  padding: 3rem;
`;
