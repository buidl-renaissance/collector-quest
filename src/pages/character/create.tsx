import { useRouter } from 'next/router';
import { useCharacter } from '@/hooks/useCharacter';
import Page from '@/components/Page';
import { Container, LoadingMessage } from '@/components/styled/layout';
import styled from '@emotion/styled';

const CreateButton = styled.button`
  background-color: #d6b87b;
  color: #2e1e0f;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #c4a76a;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #a77d3e;
    cursor: not-allowed;
    transform: none;
  }
`;

const CreatePage = () => {
  const router = useRouter();
  const { createCharacter, loading, error } = useCharacter();

  const handleCreateCharacter = async () => {
    try {
      await createCharacter();
      // Redirect to race selection after creating character
      router.push('/character/race');
    } catch (err) {
      console.error('Error creating character:', err);
    }
  };

  if (loading) {
    return (
      <Container darkMode>
        <LoadingMessage>Creating your character...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container darkMode>
        <div className="text-red-500 text-xl text-center my-8">
          Error: {error}
        </div>
      </Container>
    );
  }

  return (
    <Page>
      <Container darkMode>
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          <h1 className="text-4xl font-bold text-dnd-gold mb-8">
            Create a New Character
          </h1>
          <p className="text-dnd-gold text-lg mb-8 text-center max-w-2xl">
            Begin your journey by creating a new character. You&apos;ll be guided through
            the process of selecting your race, class, and other attributes.
          </p>
          <CreateButton
            onClick={handleCreateCharacter}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create New Character'}
          </CreateButton>
        </div>
      </Container>
    </Page>
  );
};

export default CreatePage; 