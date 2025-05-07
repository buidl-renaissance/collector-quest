import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaArrowLeft, FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../../hooks/useAuth';
import { getClassById } from '@/db/classes';
import { characterClasses, CharacterClass, CharacterClassAbility } from '@/data/classes';



export async function getServerSideProps({ params }: { params: { class: string } }) {
  const classId = params.class;
  try {
    // First try to get from database
    const dbClass = await getClassById(classId);
    
    if (dbClass) {
      return {
        props: {
          characterClass: dbClass,
          fromDatabase: true
        }
      };
    }
    
    // If not in database, check predefined classes
    const predefinedClass = characterClasses.find(c => c.id === classId);
    
    if (predefinedClass) {
      return {
        props: {
          characterClass: predefinedClass,
          fromDatabase: false
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

export default function CharacterClassModify({ 
  characterClass: initialClass, 
  fromDatabase, 
  error: serverError 
}: { 
  characterClass: CharacterClass, 
  fromDatabase: boolean, 
  error?: string 
}) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(serverError || null);
  const [success, setSuccess] = useState(false);
  const [characterClass, setCharacterClass] = useState<CharacterClass>(initialClass || {
    id: '',
    name: '',
    description: '',
    tags: [],
    abilities: [],
  });
  const [newTag, setNewTag] = useState('');
  const [newAbility, setNewAbility] = useState<CharacterClassAbility>({
    name: '',
    description: '',
    level: 1,
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
  }, [isAdmin, router]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/character/class/${characterClass.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterClass),
      });

      if (!response.ok) {
        throw new Error('Failed to update character class');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/character/class/${characterClass.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAbility = () => {
    if (newAbility.name && newAbility.description) {
      setCharacterClass({
        ...characterClass,
        abilities: Array.isArray(characterClass.abilities) 
          ? [...characterClass.abilities, { ...newAbility }]
          : [{ ...newAbility }],
      });
      setNewAbility({
        name: '',
        description: '',
        level: 1,
      });
    }
  };

  const handleRemoveAbility = (index: number) => {
    setCharacterClass({
      ...characterClass,
      abilities: characterClass.abilities.filter((_: any, i: number) => i !== index),
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Title>Edit Character Class</Title>

      {error && (
        <ErrorAlert>
          {error}
        </ErrorAlert>
      )}

      {success && (
        <SuccessAlert>
          Character class updated successfully!
        </SuccessAlert>
      )}

      <FormPaper>
        <FormStack>
          <FormField>
            <Label>Name</Label>
            <Input
              value={characterClass.name}
              onChange={(e) => setCharacterClass({ ...characterClass, name: e.target.value })}
              placeholder="Class name"
            />
          </FormField>

          <FormField>
            <Label>Description</Label>
            <TextArea
              value={characterClass.description}
              onChange={(e) => setCharacterClass({ ...characterClass, description: e.target.value })}
              rows={4}
              placeholder="Describe this character class"
            />
          </FormField>

          <FormSection>
            <SectionTitle>Abilities</SectionTitle>
            <AbilitiesStack>
              {characterClass.abilities.map((ability: any, index: number) => (
                <AbilityCard key={index}>
                  <AbilityContent>
                    <AbilityName>{ability.name}</AbilityName>
                    <AbilityDescription>{ability.description}</AbilityDescription>
                    <AbilityLevel>Level {ability.level}</AbilityLevel>
                  </AbilityContent>
                  <DeleteButton
                    onClick={() => handleRemoveAbility(index)}
                  >
                    <FaTrash />
                  </DeleteButton>
                </AbilityCard>
              ))}
            </AbilitiesStack>
            <AbilityForm>
              <FormField>
                <Label>Ability Name</Label>
                <Input
                  value={newAbility.name}
                  onChange={(e) => setNewAbility({ ...newAbility, name: e.target.value })}
                  placeholder="Name of ability"
                />
              </FormField>
              <FormField>
                <Label>Ability Description</Label>
                <TextArea
                  value={newAbility.description}
                  onChange={(e) => setNewAbility({ ...newAbility, description: e.target.value })}
                  rows={2}
                  placeholder="Describe what this ability does"
                />
              </FormField>
              <FormField>
                <Label>Level</Label>
                <Input
                  type="number"
                  value={newAbility.level}
                  onChange={(e) => setNewAbility({ ...newAbility, level: parseInt(e.target.value) })}
                  min={1}
                  max={20}
                />
              </FormField>
              <AddButton
                onClick={handleAddAbility}
                disabled={!newAbility.name || !newAbility.description}
              >
                <FaPlus /> Add Ability
              </AddButton>
            </AbilityForm>
          </FormSection>
        </FormStack>
      </FormPaper>

      <ButtonRow>
        <CancelButton
          onClick={() => router.push(`/character/class/${characterClass.id}`)}
          disabled={saving}
        >
          <FaTimes /> Cancel
        </CancelButton>
        <SaveButton
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Spinner small /> : <><FaSave /> Save Changes</>}
        </SaveButton>
      </ButtonRow>
    </Container>
  );
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.3s ease-in;
  background-color: #f8f3e6;
  background-image: url('/textures/parchment.png');
  font-family: 'EB Garamond', serif;
  color: #3a2606;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background-color: #f8f3e6;
  background-image: url('/textures/parchment.png');
`;

const Spinner = styled.div<{ small?: boolean }>`
  width: ${props => props.small ? '24px' : '40px'};
  height: ${props => props.small ? '24px' : '40px'};
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #bb8930;
  animation: ${spin} 1s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #b6551c;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.05em;
`;

const FormPaper = styled.div`
  background: #fffaed;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border: 1px solid #d9c8a0;
`;

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #3a2606;
  font-size: 1.1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d9c8a0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'EB Garamond', serif;
  background-color: #fffdf7;
  color: #3a2606;
  
  &:focus {
    outline: none;
    border-color: #bb8930;
    box-shadow: 0 0 0 2px rgba(187, 137, 48, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d9c8a0;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  font-family: 'EB Garamond', serif;
  background-color: #fffdf7;
  color: #3a2606;
  
  &:focus {
    outline: none;
    border-color: #bb8930;
    box-shadow: 0 0 0 2px rgba(187, 137, 48, 0.2);
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #b6551c;
  margin-bottom: 0.5rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  border-bottom: 2px solid #d9c8a0;
  padding-bottom: 0.5rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  background: #e9dfc3;
  padding: 0.5rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  color: #3a2606;
  border: 1px solid #d9c8a0;
`;

const TagDeleteButton = styled.button`
  background: none;
  border: none;
  color: #4a3f30;
  cursor: pointer;
  margin-left: 0.5rem;
  padding: 0;
  font-size: 0.75rem;
  
  &:hover {
    color: #9f3515;
  }
`;

const TagInputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AbilitiesStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AbilityCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0e9d6;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #d9c8a0;
`;

const AbilityContent = styled.div`
  flex: 1;
`;

const AbilityName = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #b6551c;
  font-family: 'Cinzel', serif;
  font-weight: 600;
`;

const AbilityDescription = styled.p`
  font-size: 1rem;
  color: #3a2606;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const AbilityLevel = styled.span`
  font-size: 0.9rem;
  color: #4a3f30;
  font-style: italic;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #4a3f30;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #9f3515;
  }
`;

const AbilityForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #d9c8a0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AddButton = styled(Button)`
  background: #1b3a54;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background: #142c40;
  }
`;

const SaveButton = styled(Button)`
  background: #bb8930;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background: #9f7428;
  }
`;

const CancelButton = styled(Button)`
  background: #f0e9d6;
  color: #3a2606;
  border: 1px solid #d9c8a0;
  
  &:hover:not(:disabled) {
    background: #e9dfc3;
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease-in;
  font-family: 'EB Garamond', serif;
`;

const ErrorAlert = styled(Alert)`
  background-color: #f8e7e7;
  color: #9f3515;
  border-left: 4px solid #9f3515;
`;

const SuccessAlert = styled(Alert)`
  background-color: #e8f0e7;
  color: #3a5a28;
  border-left: 4px solid #3a5a28;
`;
