import React, { useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Relic } from "@/data/artifacts";
import { Header } from "@/components/styled/layout";
import { listRelics } from "@/db/relics";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import { EmptyState, EmptyIcon, EmptyTitle, EmptyDescription } from "@/components/styled/empty";
import RelicModal from "@/components/RelicModal";
import RelicTile from "@/components/RelicTile";
import { BackButton } from "@/components/styled/buttons";

interface RelicsPageProps {
  relics: Relic[];
  error?: string;
}

const RelicsPage: React.FC<RelicsPageProps> = ({ relics, error }) => {
  const [selectedRelic, setSelectedRelic] = useState<Relic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRelicClick = (relic: Relic) => {
    setSelectedRelic(relic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRelic(null);
  };

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>

      <RelicsContainer>
        <PageTitle>Relic Collection</PageTitle>
        <PageDescription>
          Discover the mystical relics and their ancient powers
        </PageDescription>

        {relics.length === 0 ? (
          <EmptyState>
            <EmptyIcon>⚱️</EmptyIcon>
            <EmptyTitle>No Relics Found</EmptyTitle>
            <EmptyDescription>
              The collection awaits the discovery of ancient relics.
            </EmptyDescription>
          </EmptyState>
        ) : (
          <RelicGrid>
            {relics.map((relic) => (
              <RelicTile 
                key={relic.id} 
                relic={relic} 
                onClick={handleRelicClick} 
                isLocked={true} 
              />
            ))}
          </RelicGrid>
        )}
      </RelicsContainer>
      
      <RelicModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        relic={selectedRelic}
      />
      
      <BottomNavigationBar />
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const relics = await listRelics(50, 0);
    
    return {
      props: {
        relics,
      },
    };
  } catch (error) {
    console.error('Error fetching relics:', error);
    
    return {
      props: {
        relics: [],
        error: 'Failed to load relics. Please try again later.',
      },
    };
  }
};

export default RelicsPage;

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  background: rgba(30, 20, 50, 0.95);
  font-family: "Cormorant Garamond", serif;
  padding-bottom: 180px;
`;

const RelicsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #bb8930;
  font-size: 2.5rem;
  text-align: center;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const PageDescription = styled.p`
  color: #e8e3f0;
  font-size: 1.25rem;
  text-align: center;
  margin: 0 0 3rem 0;
  opacity: 0.9;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #f87171;
  font-size: 1.5rem;
  padding: 3rem;
`;

const RelicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
  }
`;
