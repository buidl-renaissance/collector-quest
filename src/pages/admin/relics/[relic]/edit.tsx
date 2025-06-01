import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import type { Relic, ArtifactClass, Effect, Element, Rarity } from '@/data/artifacts';
import { getRelic } from '@/db/relics';
import useIsAdmin from '@/hooks/useIsAdmin';

// Define the available options for each enum
const artifactClasses: ArtifactClass[] = ["Tool", "Weapon", "Symbol", "Wearable", "Key"];
const effectTypes: Effect[] = ["Reveal", "Heal", "Unlock", "Boost", "Summon"];
const elementTypes: Element[] = ["Fire", "Water", "Nature", "Shadow", "Light", "Electric"];
const rarityLevels: Rarity[] = ["Common", "Uncommon", "Rare", "Epic"];

interface EditRelicPageProps {
  relic: Relic;
}

const EditRelicPage: React.FC<EditRelicPageProps> = ({ relic: initialRelic }) => {
  const router = useRouter();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [relic, setRelic] = useState(initialRelic);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isAdminLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/relics/${relic.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(relic),
      });

      if (!response.ok) {
        throw new Error('Failed to update relic');
      }

      router.push('/admin/relics');
    } catch (err) {
      console.error('Error updating relic:', err);
      setError('Failed to update relic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRelic(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isAdminLoading || loading) {
    return (
      <Container>
        <LoadingMessage>Processing...</LoadingMessage>
      </Container>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Container>
      <BackLink href="/admin/relics">
        <FaArrowLeft /> Back to Relics
      </BackLink>

      <Title>Edit Relic</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={relic.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Image URL</Label>
          <Input
            type="text"
            name="imageUrl"
            value={relic.imageUrl || ''}
            onChange={handleChange}
          />
          {relic.imageUrl && (
            <ImagePreview>
              <Image
                src={relic.imageUrl}
                alt={relic.name}
                width={100}
                height={100}
                style={{ objectFit: 'cover' }}
              />
            </ImagePreview>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Class</Label>
          <Select name="class" value={relic.class} onChange={handleChange}>
            {artifactClasses.map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Effect</Label>
          <Select name="effect" value={relic.effect} onChange={handleChange}>
            {effectTypes.map(effect => (
              <option key={effect} value={effect}>{effect}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Element</Label>
          <Select name="element" value={relic.element} onChange={handleChange}>
            {elementTypes.map(element => (
              <option key={element} value={element}>{element}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Rarity</Label>
          <Select name="rarity" value={relic.rarity} onChange={handleChange}>
            {rarityLevels.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Story</Label>
          <TextArea
            name="story"
            value={relic.story || ''}
            onChange={handleChange}
            rows={4}
          />
        </FormGroup>

        <SaveButton type="submit" disabled={loading}>
          <FaSave /> Save Changes
        </SaveButton>
      </Form>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { relic } = context.query;

  try {
    const relicData = await getRelic(relic as string);
    
    if (!relicData) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        relic: relicData,
      },
    };
  } catch (error) {
    console.error('Error fetching relic:', error);
    return {
      notFound: true,
    };
  }
};

export default EditRelicPage;

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #bb8930;
  text-decoration: none;
  margin-bottom: 2rem;
  font-family: "Cinzel", serif;
  
  &:hover {
    color: #d4a03c;
  }
`;

const Title = styled.h1`
  font-family: "Cinzel", serif;
  color: #bb8930;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #bb8930;
  font-family: "Cinzel", serif;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #4a3b6b;
  background: rgba(30, 20, 50, 0.5);
  color: #e8e3f0;
  font-family: "Cormorant Garamond", serif;
  
  &:focus {
    outline: none;
    border-color: #bb8930;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #4a3b6b;
  background: rgba(30, 20, 50, 0.5);
  color: #e8e3f0;
  font-family: "Cormorant Garamond", serif;
  
  &:focus {
    outline: none;
    border-color: #bb8930;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #4a3b6b;
  background: rgba(30, 20, 50, 0.5);
  color: #e8e3f0;
  font-family: "Cormorant Garamond", serif;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #bb8930;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #bb8930 0%, #d4a03c 100%);
  color: #1e1e2d;
  border: none;
  border-radius: 4px;
  font-family: "Cinzel", serif;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(187, 137, 48, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ImagePreview = styled.div`
  margin-top: 0.5rem;
  border-radius: 4px;
  overflow: hidden;
  width: 100px;
  height: 100px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
  margin: 2rem 0;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`; 