import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaArrowLeft, FaCrown, FaEdit, FaTrash, FaPlus, FaImage } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { NextApiRequest } from 'next';
import { getAllClasses } from '@/db/classes';
import { characterClasses, CharacterClass as CharacterClassType } from '@/data/classes';
import Link from 'next/link';

interface CharacterClass {
  id: string;
  name: string;
  description: string;
  abilities: Array<string | { name: string; description: string; level: number }>;
  image: string;
  isActive?: boolean;
}

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  try {
    const dbClasses = await getAllClasses();
    
    // Combine database classes with predefined classes
    const allClasses = [...characterClasses];
    
    // Mark classes that exist in the database
    dbClasses.forEach(dbClass => {
      const index = allClasses.findIndex(c => c.id === dbClass.id);
      if (index >= 0) {
        allClasses[index] = {
          ...allClasses[index],
          ...dbClass,
          isActive: true
        };
      } else {
        allClasses.push({
          ...dbClass,
          isActive: true
        });
      }
    });

    return {
      props: {
        classes: allClasses,
        metadata: {
          title: `Class Administration | Lord Smearington's Absurd NFT Gallery`,
          description: "Admin panel for managing character classes.",
          image: "/images/admin-panel-banner.jpg",
          url: `https://smearington.theethical.ai/character/class/admin`,
        },
      }
    };
  } catch (error) {
    console.error("Failed to fetch classes:", error);
    return {
      props: {
        classes: [],
        error: "Failed to load classes",
        metadata: {
          title: `Class Administration | Lord Smearington's Absurd NFT Gallery`,
          description: "Admin panel for managing character classes.",
          image: "/images/admin-panel-banner.jpg",
          url: `https://smearington.theethical.ai/character/class/admin`,
        },
      }
    };
  }
};

export default function CharacterClassAdmin({ classes, error: serverError }: { 
  classes: CharacterClass[], 
  error?: string 
}) {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(serverError || null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClasses, setFilteredClasses] = useState<CharacterClass[]>(classes);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/');
      return;
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClasses(classes);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredClasses(
        classes.filter(
          cls => 
            cls.name.toLowerCase().includes(term) || 
            cls.description.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, classes]);

  const handleCreateNew = () => {
    router.push('/character/class/create');
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <PageHeader>
        <BackLink href="/dashboard">
          <FaArrowLeft /> Back to Dashboard
        </BackLink>
        <PageTitle>Character Classes Administration</PageTitle>
        <CreateButton onClick={handleCreateNew}>
          <FaPlus /> Create New Class
        </CreateButton>
      </PageHeader>

      {error && (
        <AlertBox severity="error">
          {error}
        </AlertBox>
      )}

      {success && (
        <AlertBox severity="success">
          {success}
        </AlertBox>
      )}

      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="Search classes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      <ClassesGrid>
        {filteredClasses.length > 0 ? (
          filteredClasses.map(characterClass => (
            <ClassCard key={characterClass.id}>
              <ClassImageContainer>
                <ClassImage src={characterClass.image || '/images/classes/default.jpg'} alt={characterClass.name} />
                {characterClass.isActive !== undefined && (
                  <StatusBadge isActive={characterClass.isActive}>
                    {characterClass.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                )}
              </ClassImageContainer>
              <ClassInfo>
                <ClassTitle>{characterClass.name}</ClassTitle>
                <ClassDescription>{characterClass.description}</ClassDescription>
                <AbilitiesList>
                  {characterClass.abilities.slice(0, 3).map((ability, index) => (
                    <AbilityItem key={index}>
                      {typeof ability === 'string' 
                        ? ability 
                        : ability.name}
                    </AbilityItem>
                  ))}
                </AbilitiesList>
                <ActionButtons>
                  <ViewButton href={`/character/class/${characterClass.id}`}>
                    View
                  </ViewButton>
                  <EditButton href={`/character/class/${characterClass.id}/modify`}>
                    <FaEdit /> Edit
                  </EditButton>
                </ActionButtons>
              </ClassInfo>
            </ClassCard>
          ))
        ) : (
          <NoClassesMessage>
            {searchTerm ? 'No classes match your search.' : 'No classes available.'}
          </NoClassesMessage>
        )}
      </ClassesGrid>
    </Container>
  );
}

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.5s ease-in-out;
  background-color: #f8f5e6;
  background-image: url('/images/parchment-texture.png');
  background-blend-mode: overlay;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background-color: #f8f5e6;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(58, 38, 6, 0.1);
  border-radius: 50%;
  border-top: 4px solid #b6551c;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  border-bottom: 2px solid #bb8930;
  padding-bottom: 1rem;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3a2606;
  text-decoration: none;
  font-size: 0.9rem;
  position: absolute;
  left: 0;
  top: -1.5rem;
  font-family: 'EB Garamond', serif;
  
  &:hover {
    color: #9f3515;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.2rem;
  color: #b6551c;
  margin: 0;
  text-align: center;
  flex-grow: 1;
  font-family: 'Cinzel', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.05em;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #9f3515;
  color: #f8f5e6;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'EB Garamond', serif;
  
  &:hover {
    background-color: #b6551c;
    box-shadow: 0 0 8px rgba(182, 85, 28, 0.5);
  }
`;

const AlertBox = styled.div<{ severity: 'error' | 'success' }>`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: ${props => props.severity === 'error' ? '#f8d7da' : '#d4edda'};
  color: ${props => props.severity === 'error' ? '#721c24' : '#155724'};
  border: 1px solid ${props => props.severity === 'error' ? '#f5c6cb' : '#c3e6cb'};
  font-family: 'EB Garamond', serif;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  font-family: 'EB Garamond', serif;
  
  &:focus {
    outline: none;
    border-color: #1b3a54;
    box-shadow: 0 0 0 0.2rem rgba(27, 58, 84, 0.25);
  }
`;

const ClassesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ClassCard = styled.div`
  background-color: #f8f5e6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(58, 38, 6, 0.2);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #bb8930;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(58, 38, 6, 0.3);
  }
`;

const ClassImageContainer = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  border-bottom: 2px solid #bb8930;
`;

const ClassImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => props.isActive ? '#1b3a54' : '#9f3515'};
  color: #f8f5e6;
  font-family: 'EB Garamond', serif;
`;

const ClassInfo = styled.div`
  padding: 1.5rem;
`;

const ClassTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  color: #b6551c;
  font-family: 'Cinzel', serif;
  letter-spacing: 0.03em;
`;

const ClassDescription = styled.p`
  margin: 0 0 1rem 0;
  color: #3a2606;
  font-size: 0.95rem;
  line-height: 1.4;
  height: 2.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-family: 'EB Garamond', serif;
`;

const AbilitiesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
`;

const AbilityItem = styled.li`
  font-size: 0.95rem;
  color: #4a3f30;
  margin-bottom: 0.25rem;
  font-family: 'EB Garamond', serif;
  
  &:before {
    content: "•";
    color: #bb8930;
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled(Link)`
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  background-color: #f8f5e6;
  color: #3a2606;
  border: 1px solid #bb8930;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background-color 0.2s;
  font-family: 'EB Garamond', serif;
  
  &:hover {
    background-color: #bb8930;
    color: #f8f5e6;
  }
`;

const EditButton = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #1b3a54;
  color: #f8f5e6;
  border: 1px solid #1b3a54;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background-color 0.2s;
  font-family: 'EB Garamond', serif;
  
  &:hover {
    background-color: #9f3515;
    border-color: #9f3515;
  }
`;

const NoClassesMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #4a3f30;
  font-size: 1.25rem;
  background-color: #f8f5e6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(58, 38, 6, 0.2);
  border: 1px solid #bb8930;
  font-family: 'EB Garamond', serif;
`;