import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { useAuth } from '../../../../hooks/useAuth';
import { FaEdit, FaCrown } from 'react-icons/fa';
import { getClassById } from '@/db/classes';
import { characterClasses, CharacterClass  } from '@/data/classes';


export async function getServerSideProps({ params }: { params: { class: string } }) {
  const classId = params.class;
  try {
    // First try to get from database
    const dbClass = await getClassById(classId);
    
    if (dbClass) {
      return {
        props: {
          characterClass: dbClass,
          fromDatabase: true,
          metadata: {
            title: `${dbClass.name} Class | Lord Smearington's Absurd NFT Gallery`,
            description: dbClass.description,
            image: dbClass.image || "/images/classes/default.jpg",
            url: `https://smearington.theethical.ai/character/class/${classId}`,
          }
        }
      };
    }
    
    // If not in database, check predefined classes
    const predefinedClass = characterClasses.find(c => c.id === classId);
    
    if (predefinedClass) {
      return {
        props: {
          characterClass: predefinedClass,
          fromDatabase: false,
          metadata: {
            title: `${predefinedClass.name} Class | Lord Smearington's Absurd NFT Gallery`,
            description: predefinedClass.description,
            image: predefinedClass.image || "/images/classes/default.jpg",
            url: `https://smearington.theethical.ai/character/class/${classId}`,
          }
        }
      };
    }
    
    // Class not found
    return {
      notFound: true
    };
  } catch (error) {
    console.error("Error fetching class:", error);
    return {
      props: {
        error: "Failed to load character class"
      }
    };
  }
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: #fffaed;
  background-image: url('/images/parchment-texture.png');
  background-blend-mode: multiply;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #b6551c;
  padding-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  font-family: 'Cinzel', serif;
  color: #b6551c;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #9f3515;
  border: 1px solid #b6551c;
  border-radius: 4px;
  color: #fffaed;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: 'EB Garamond', serif;
  transition: all 0.3s;
  
  &:hover {
    background: #b6551c;
    box-shadow: 0 0 8px rgba(182, 85, 28, 0.5);
  }
`;

const ClassCard = styled.div`
  background: #fffaed;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border: 1px solid #bb8930;
`;

const ClassImage = styled.div`
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #bb8930;
`;

const ClassDescription = styled.p`
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-family: 'EB Garamond', serif;
  font-size: 1.1rem;
  color: #3a2606;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-family: 'Cinzel', serif;
  color: #b6551c;
  border-bottom: 1px solid #bb8930;
  padding-bottom: 0.5rem;
`;

const AbilitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AbilityCard = styled.div`
  background: #fffaed;
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #bb8930;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const AbilityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const AbilityName = styled.h3`
  font-size: 1.3rem;
  margin: 0;
  font-family: 'Cinzel', serif;
  color: #1b3a54;
`;

const AbilityLevel = styled.span`
  background: #bb8930;
  color: #fffaed;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const AbilityDescription = styled.p`
  color: #3a2606;
  font-size: 1rem;
  line-height: 1.6;
  font-family: 'EB Garamond', serif;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  color: #4a3f30;
  font-size: 0.9rem;
  font-family: 'EB Garamond', serif;
  border-top: 1px solid #bb8930;
  padding-top: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #fffaed;
  border-top: 4px solid #b6551c;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #9f3515;
  font-size: 1.2rem;
  text-align: center;
  padding: 2rem;
  font-family: 'EB Garamond', serif;
  background: rgba(159, 53, 21, 0.1);
  border-radius: 8px;
  margin: 2rem 0;
`;

export default function CharacterClassView({ 
  characterClass, 
  fromDatabase, 
  error: serverError 
}: { 
  characterClass: CharacterClass, 
  fromDatabase: boolean, 
  error?: string 
}) {
  const router = useRouter();
  const { id } = router.query;
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(serverError || null);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (error || !characterClass) {
    return (
      <Container>
        <ErrorMessage>
          {error || 'Character class not found'}
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{characterClass.name}</Title>
        <ButtonGroup>
          {isAdmin && (
            <>
              <StyledButton onClick={() => router.push(`/character/class/${id}/modify`)}>
                <FaEdit /> Edit
              </StyledButton>
              <StyledButton onClick={() => router.push(`/character/class/${id}/admin`)}>
                <FaCrown /> Admin
              </StyledButton>
            </>
          )}
        </ButtonGroup>
      </Header>

      <ClassCard>
        {characterClass.image && (
          <ClassImage style={{ backgroundImage: `url(${characterClass.image})` }} />
        )}
        <ClassDescription>{characterClass.description}</ClassDescription>
      </ClassCard>

      <SectionTitle>Class Abilities</SectionTitle>
      <AbilitiesGrid>
        {characterClass.abilities.map((ability, index) => (
          <AbilityCard key={index}>
            <AbilityHeader>
              <AbilityName>{ability.name}</AbilityName>
              <AbilityLevel>Level {ability.level}</AbilityLevel>
            </AbilityHeader>
            <AbilityDescription>{ability.description}</AbilityDescription>
          </AbilityCard>
        ))}
      </AbilitiesGrid>

      <Footer>
        <span>The {characterClass.name} class is part of Lord Smearington&apos;s Absurd NFT Gallery</span>
      </Footer>
    </Container>
  );
}
