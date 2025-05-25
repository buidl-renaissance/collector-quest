import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaCrown, FaSearch, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import { Quest } from '@/data/quest';
import { questDb } from '@/db/quest';
import useIsAdmin from '@/hooks/useIsAdmin';
import BottomNavigationBar from '@/components/BottomNavigationBar';

interface AdminPageProps {
  quests: Quest[];
}

const AdminPage: React.FC<AdminPageProps> = ({ quests: initialQuests }) => {
  const router = useRouter();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isAdminLoading, router]);

  const handleCreateQuest = () => {
    router.push('/quests/create');
  };

  const handleEditQuest = (id: string) => {
    router.push(`/quests/${id}/edit`);
  };

  const handleDeleteQuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quest? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/quests/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete quest');
      }

      setQuests(quests.filter(quest => quest.id !== id));
    } catch (err) {
      console.error('Error deleting quest:', err);
      setError('Failed to delete quest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuests = quests.filter(quest => 
    quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quest.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quest.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAdminLoading || loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          Processing...
        </LoadingMessage>
      </Container>
    );
  }

  if (!isAdmin) {
    return null; // Return null while redirecting
  }

  return (
    <Container>
      <BackLink href="/admin">
        <FaArrowLeft /> Back to Admin Panel
      </BackLink>

      <Title>Quest Administration</Title>
      <Subtitle>Manage quests and their objectives</Subtitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search quests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon><FaSearch /></SearchIcon>
      </SearchContainer>

      <ActionButton onClick={handleCreateQuest}>
        <FaPlus /> Create New Quest
      </ActionButton>

      <QuestsList>
        {filteredQuests.length === 0 ? (
          <EmptyState>No quests found. Create your first quest!</EmptyState>
        ) : (
          filteredQuests.map(quest => (
            <QuestItem key={quest.id}>
              <QuestInfo>
                <QuestImageContainer>
                  <Image
                    src={quest.imageUrl || '/images/default-quest.png'}
                    alt={quest.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </QuestImageContainer>
                <QuestDetails>
                  <QuestTitle>{quest.title}</QuestTitle>
                  <QuestDescription>{quest.description.substring(0, 150)}...</QuestDescription>
                  <QuestStats>
                    <StatBadge>
                      <CrownIcon><FaCrown /></CrownIcon>
                      Type: {quest.type}
                    </StatBadge>
                    <StatBadge>
                      <StarIcon><FaStar /></StarIcon>
                      Difficulty: {quest.difficulty}
                    </StatBadge>
                    <StatBadge>
                      <LocationIcon><FaMapMarkerAlt /></LocationIcon>
                      {quest.location || 'No location'}
                    </StatBadge>
                    <StatBadge>
                      <ClockIcon><FaClock /></ClockIcon>
                      {quest.estimatedDuration} min
                    </StatBadge>
                  </QuestStats>
                  <QuestObjectives>
                    <ObjectivesTitle>Objectives:</ObjectivesTitle>
                    {quest.objectives.map(objective => (
                      <ObjectiveItem key={objective.id}>
                        • {objective.description}
                      </ObjectiveItem>
                    ))}
                  </QuestObjectives>
                </QuestDetails>
              </QuestInfo>
              <QuestActions>
                <ActionButton onClick={() => handleEditQuest(quest.id)}>
                  <FaEdit /> Edit
                </ActionButton>
                <DeleteButton onClick={() => handleDeleteQuest(quest.id)}>
                  <FaTrash /> Delete
                </DeleteButton>
              </QuestActions>
            </QuestItem>
          ))
        )}
      </QuestsList>

      <BottomNavigationBar />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const quests = await questDb.getAllQuests();
    
    return {
      props: {
        quests,
      },
    };
  } catch (error) {
    console.error('Error fetching quests:', error);
    return {
      props: {
        quests: [],
      },
    };
  }
};

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-out;
  padding-bottom: 120px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #bb8930;
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #d4a959;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
`;

const Subtitle = styled.h2`
  font-size: 1.25rem;
  color: #c7bfd4;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 1px solid #bb8930;
  border-radius: 4px;
  background: rgba(26, 26, 46, 0.8);
  color: #e0dde5;
  font-size: 1rem;
  font-family: "Cormorant Garamond", serif;

  &:focus {
    outline: none;
    border-color: #d4a959;
    box-shadow: 0 0 0 2px rgba(187, 137, 48, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #bb8930;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Cinzel", serif;
  margin-bottom: 2rem;

  &:hover {
    background-color: #d4a959;
    transform: translateY(-2px);
  }
`;

const QuestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const QuestItem = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid #bb8930;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const QuestInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const QuestImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #bb8930;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const QuestDetails = styled.div`
  flex: 1;
`;

const QuestTitle = styled.h3`
  font-size: 1.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
`;

const QuestDescription = styled.p`
  color: #e0dde5;
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.5;
`;

const QuestStats = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const StatBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(187, 137, 48, 0.2);
  border: 1px solid #bb8930;
  border-radius: 4px;
  color: #bb8930;
  font-size: 0.9rem;
`;

const QuestObjectives = styled.div`
  margin-top: 1rem;
`;

const ObjectivesTitle = styled.h4`
  color: #bb8930;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
`;

const ObjectiveItem = styled.div`
  color: #e0dde5;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const QuestActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid #dc3545;

  &:hover {
    background-color: rgba(220, 53, 69, 0.3);
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.5rem;
  color: #bb8930;
  height: 100vh;
`;

const CrownIcon = styled.div`
  color: #bb8930;
`;

const StarIcon = styled.div`
  color: #bb8930;
`;

const LocationIcon = styled.div`
  color: #bb8930;
`;

const ClockIcon = styled.div`
  color: #bb8930;
`;

const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid #bb8930;
  border-radius: 8px;
  color: #c7bfd4;
  font-size: 1.2rem;
`;

export default AdminPage; 