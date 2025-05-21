import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import Image from 'next/image';
import { Container } from '@/components/styled/layout';
import { 
  FormGroup, 
  Label, 
  Input, 
  TextArea 
} from '@/components/styled/forms';
import { UploadMedia } from '@/components/UploadMedia';
import { Artifact } from '@/data/artifacts';
import Link from 'next/link';

// Styled components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background-color: transparent;
  color: #bb8930;
  border: 1px solid #bb8930;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Cormorant Garamond", serif;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #bb8930;
    color: #1a1a2e;
  }
`;

const Title = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #c7bfd4;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #2d2d44;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-family: "Cinzel", serif;
  color: #c7bfd4;
  margin-bottom: 1.5rem;
`;

const ImagePreviewContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #1a1a2e;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #3a3347;
  border-radius: 0.25rem;
  background-color: #1a1a2e;
  color: #c7bfd4;
  font-size: 1rem;
  margin-top: 0.5rem;
  font-family: "Cormorant Garamond", serif;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.primary ? '#6c5ce7' : '#a29bfe'};
  color: #c7bfd4;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const UpdateArtifactPage = () => {
  const router = useRouter();
  const { artifact: artifactId } = router.query;
  
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    class: '',
    effect: '',
    element: '',
    rarity: ''
  });
  
  // Define the artifact classes, elements, effects, and rarities
  const ARTIFACT_CLASSES = ['Tool', 'Weapon', 'Symbol', 'Wearable', 'Key'];
  const ELEMENTS = ['Fire', 'Water', 'Nature', 'Shadow', 'Light', 'Electric'];
  const EFFECTS = ['Reveal', 'Heal', 'Unlock', 'Boost', 'Summon'];
  const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic'];
  
  useEffect(() => {
    if (artifactId) {
      fetchArtifact();
    }
  }, [artifactId]);
  
  const fetchArtifact = async () => {
    try {
      const response = await fetch(`/api/artifacts/${artifactId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artifact');
      }
      
      const data = await response.json();
      setArtifact(data);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        medium: data.medium || '',
        class: data.class || '',
        effect: data.effect || '',
        element: data.element || '',
        rarity: data.rarity || ''
      });
      setImagePreview(data.imageUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artifact:', error);
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageUpload = (url: string) => {
    setImagePreview(url);
    setErrors({...errors, image: ''});
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.medium.trim()) newErrors.medium = 'Medium is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.effect) newErrors.effect = 'Effect is required';
    if (!formData.element) newErrors.element = 'Element is required';
    if (!formData.rarity) newErrors.rarity = 'Rarity is required';
    if (!imagePreview) newErrors.image = 'Image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/artifacts/${artifactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          medium: formData.medium,
          class: formData.class,
          effect: formData.effect,
          element: formData.element,
          rarity: formData.rarity,
          imageUrl: imagePreview
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update artifact');
      }
      
      // Redirect to the artifact page
      router.push(`/artifacts/${artifactId}`);
    } catch (error) {
      console.error('Error updating artifact:', error);
      setErrors({...errors, submit: 'Failed to update artifact. Please try again.'});
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Container darkMode>
        <PageContainer>
          <Title>Loading...</Title>
        </PageContainer>
      </Container>
    );
  }
  
  if (!artifact) {
    return (
      <Container darkMode>
        <PageContainer>
          <Title>Artifact not found</Title>
          <Link href="/artifacts">
            <BackButton>Back to Artifacts</BackButton>
          </Link>
        </PageContainer>
      </Container>
    );
  }
  
  return (
    <Container darkMode>
      <PageContainer>
        <Header>
          <Link href={`/artifacts/${artifactId}`}>
            <BackButton>← Back to Artifact</BackButton>
          </Link>
        </Header>
        
        <Title>Update Artifact</Title>
        
        <form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>Artifact Image</SectionTitle>
            {imagePreview && (
              <ImagePreviewContainer>
                <Image 
                  src={imagePreview} 
                  alt="Artifact preview" 
                  layout="fill" 
                  objectFit="contain"
                />
              </ImagePreviewContainer>
            )}
            <UploadMedia onUploadComplete={handleImageUpload} />
            {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
          </Section>
          
          <Section>
            <SectionTitle>Artifact Details</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
              />
              {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="medium">Medium</Label>
              <Input 
                type="text" 
                id="medium" 
                name="medium" 
                value={formData.medium} 
                onChange={handleInputChange} 
              />
              {errors.medium && <ErrorMessage>{errors.medium}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea 
                id="description" 
                name="description" 
                rows={4} 
                value={formData.description} 
                onChange={handleInputChange} 
              />
              {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
            </FormGroup>
          </Section>
          
          <Section>
            <SectionTitle>Artifact Properties</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="class">Class</Label>
              <Select 
                id="class" 
                name="class" 
                value={formData.class} 
                onChange={handleInputChange}
              >
                <option value="">Select a class</option>
                {ARTIFACT_CLASSES.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </Select>
              {errors.class && <ErrorMessage>{errors.class}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="element">Element</Label>
              <Select 
                id="element" 
                name="element" 
                value={formData.element} 
                onChange={handleInputChange}
              >
                <option value="">Select an element</option>
                {ELEMENTS.map(element => (
                  <option key={element} value={element}>{element}</option>
                ))}
              </Select>
              {errors.element && <ErrorMessage>{errors.element}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="effect">Effect</Label>
              <Select 
                id="effect" 
                name="effect" 
                value={formData.effect} 
                onChange={handleInputChange}
              >
                <option value="">Select an effect</option>
                {EFFECTS.map(effect => (
                  <option key={effect} value={effect}>{effect}</option>
                ))}
              </Select>
              {errors.effect && <ErrorMessage>{errors.effect}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="rarity">Rarity</Label>
              <Select 
                id="rarity" 
                name="rarity" 
                value={formData.rarity} 
                onChange={handleInputChange}
              >
                <option value="">Select a rarity</option>
                {RARITIES.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </Select>
              {errors.rarity && <ErrorMessage>{errors.rarity}</ErrorMessage>}
            </FormGroup>
          </Section>
          
          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          
          <ButtonContainer>
            <Link href={`/artifacts/${artifactId}`}>
              <BackButton>Cancel</BackButton>
            </Link>
            <Button primary type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Artifact'}
            </Button>
          </ButtonContainer>
        </form>
      </PageContainer>
    </Container>
  );
};

export default UpdateArtifactPage;
