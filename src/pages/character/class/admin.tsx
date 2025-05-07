import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { useAuth } from '../../../hooks/useAuth';
import { NextApiRequest } from 'next';
import { getAllClasses } from '@/db/classes';
import { characterClasses, CharacterClass as CharacterClassType } from '@/data/classes';
import Link from 'next/link';

interface CharacterClass {
  id: string;
  name: string;
  description: string;
  abilities: string[];
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
        classes: allClasses
      }
    };
  } catch (error) {
    console.error("Failed to fetch classes:", error);
    return {
      props: {
        classes: [],
        error: "Failed to load classes"
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
        <PageTitle>Character Classes Administration</PageTitle>
        <CreateButton onClick={handleCreateNew}>Create New Class</CreateButton>
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
                      {typeof ability === 'string' ? ability : ability}
                    </AbilityItem>
                  ))}
                </AbilitiesList>
                <ActionButtons>
                  <ViewButton href={`/character/class/${characterClass.id}`}>
                    View
                  </ViewButton>
                  <EditButton href={`/character/class/${characterClass.id}/modify`}>
                    Edit
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
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #bb8930;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

const CreateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #218838;
  }
`;

const AlertBox = styled.div<{ severity: 'error' | 'success' }>`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: ${props => props.severity === 'error' ? '#f8d7da' : '#d4edda'};
  color: ${props => props.severity === 'error' ? '#721c24' : '#155724'};
  border: 1px solid ${props => props.severity === 'error' ? '#f5c6cb' : '#c3e6cb'};
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const ClassesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ClassCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ClassImageContainer = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
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
  background-color: ${props => props.isActive ? '#28a745' : '#dc3545'};
  color: white;
`;

const ClassInfo = styled.div`
  padding: 1.5rem;
`;

const ClassTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #333;
`;

const ClassDescription = styled.p`
  margin: 0 0 1rem 0;
  color: #6c757d;
  font-size: 0.875rem;
  line-height: 1.4;
  height: 2.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const AbilitiesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
`;

const AbilityItem = styled.li`
  font-size: 0.875rem;
  color: #495057;
  margin-bottom: 0.25rem;
  
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
  background-color: #f8f9fa;
  color: #212529;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e2e6ea;
  }
`;

const EditButton = styled(Link)`
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0069d9;
  }
`;

const NoClassesMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.25rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;