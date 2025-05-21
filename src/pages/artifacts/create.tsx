import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  FormGroup, 
  Label, 
  Input, 
  TextArea, 
} from '@/components/styled/forms';

import {
  ErrorMessage, 
} from '@/components/styled/typography';
import { UploadMedia } from '@/components/UploadMedia';

// Additional styled components specific to this page
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #2d2d44;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #c7bfd4;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
`;

const SectionTitle = styled.h2`
  font-family: "Cinzel", serif;
  color: #c7bfd4;
  margin-bottom: 1.5rem;
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
  margin-top: 1rem;
  transition: background-color 0.3s, transform 0.2s;
  font-family: "Cinzel", serif;

  &:hover {
    background-color: ${props => props.primary ? '#bb8930' : '#3a3347'};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #3a3347;
    cursor: not-allowed;
    transform: none;
  }
`;

const OptionalText = styled.span`
  font-size: 0.8rem;
  color: #a29bfe;
  font-weight: normal;
  margin-left: 0.5rem;
  font-family: "Cormorant Garamond", serif;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-family: "Cormorant Garamond", serif;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const ImagePreviewContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
  max-width: 300px;
  position: relative;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border: 2px dashed #3a3347;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background-color: #2d2d44;
  font-family: "Cormorant Garamond", serif;
`;

const UploadLabel = styled.label`
  display: inline-block;
  background-color: #6c5ce7;
  color: #c7bfd4;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s;
  font-family: "Cinzel", serif;

  &:hover {
    background-color: #bb8930;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StepDot = styled.div<{ active: boolean; completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 8px;
  background-color: ${props => 
    props.completed ? '#bb8930' : 
    props.active ? '#6c5ce7' : '#3a3347'};
  transition: background-color 0.3s;
`;

const StepLabel = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  color: #c7bfd4;
  font-family: "Cinzel", serif;
`;

const ArtifactPropertiesContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #1a1a2e;
  border-radius: 0.5rem;
  border: 1px solid #3a3347;
`;

const PropertyBadge = styled.div`
  display: inline-block;
  background-color: #2d2d44;
  color: #bb8930;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #bb8930;
  font-family: "Cormorant Garamond", serif;
`;
const CreateArtifactPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    artistName: '',
    contactInfo: '',
    artworkTitle: '',
    medium: '',
    yearCreated: '',
    description: '',
    termsAgreed: false
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProperties, setGeneratedProperties] = useState<{
    class: string;
    effect: string;
    element: string;
    rarity: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageUpload = (url: string) => {
    setImagePreview(url);
    setErrors({...errors, image: ''});
  };

  const validateImageUpload = () => {
    if (!imagePreview) {
      setErrors({...errors, image: 'Artwork image is required'});
      return false;
    }
    return true;
  };

  const validateFormData = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.artistName.trim()) newErrors.artistName = 'Artist name is required';
    if (!formData.artworkTitle.trim()) newErrors.artworkTitle = 'Artwork title is required';
    if (!formData.medium) newErrors.medium = 'Medium is required';
    if (!formData.yearCreated.trim()) newErrors.yearCreated = 'Year created is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.termsAgreed) newErrors.termsAgreed = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateArtifactProperties = async () => {
    setIsGenerating(true);
    
    try {
      // Call API to generate artifact properties
      const response = await fetch('/api/artifacts/generate-properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.artworkTitle,
          medium: formData.medium,
          description: formData.description,
          image: imagePreview
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate artifact properties');
      }

      const data = await response.json();
      setGeneratedProperties(data);
    } catch (error) {
      console.error('Error generating properties:', error);
      setErrors({...errors, generate: 'Failed to generate artifact properties. Please try again.'});
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateImageUpload()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateFormData()) {
        generateArtifactProperties();
        setCurrentStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!generatedProperties) {
      setErrors({...errors, submit: 'Artifact properties must be generated first'});
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/artifacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artistName: formData.artistName,
          contactInfo: formData.contactInfo,
          artworkTitle: formData.artworkTitle,
          medium: formData.medium,
          yearCreated: formData.yearCreated,
          description: formData.description,
          artifactClass: generatedProperties.class,
          effect: generatedProperties.effect,
          element: generatedProperties.element,
          rarity: generatedProperties.rarity,
          imageUrl: imagePreview
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit artifact');
      }

      const data = await response.json();
      router.push(`/artifacts/${data.id}`);
    } catch (error) {
      console.error('Error submitting artifact:', error);
      setErrors({...errors, submit: 'Failed to submit artifact. Please try again.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Section>
            <SectionTitle>Upload Your Artwork</SectionTitle>
            <p>First, upload an image of your artwork to transform it into a magical artifact.</p>
            
            <FormGroup>
              <Label>Artwork Image Upload</Label>
              <p>Required format: .jpg, .png, .gif (Max 10MB)</p>
              
              <UploadMedia
                onUploadComplete={handleImageUpload}
                accept=".jpg,.jpeg,.png,.gif"
                maxSize={10 * 1024 * 1024}
                label={imagePreview ? 'Change Image' : 'Select Image'}
              />
              {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
            </FormGroup>
            
            <Button type="button" onClick={handleNextStep} primary>
              Continue to Artifact Details
            </Button>
          </Section>
        );
      case 2:
        return (
          <Section>
            <SectionTitle>Artifact Details</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="artistName">Artist Name</Label>
              <Input 
                type="text" 
                id="artistName" 
                name="artistName" 
                value={formData.artistName}
                onChange={handleInputChange}
              />
              {errors.artistName && <ErrorMessage>{errors.artistName}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="contactInfo">Email or Contact <OptionalText>(optional)</OptionalText></Label>
              <Input 
                type="text" 
                id="contactInfo" 
                name="contactInfo" 
                value={formData.contactInfo}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="artworkTitle">Artwork Title</Label>
              <Input 
                type="text" 
                id="artworkTitle" 
                name="artworkTitle" 
                value={formData.artworkTitle}
                onChange={handleInputChange}
              />
              {errors.artworkTitle && <ErrorMessage>{errors.artworkTitle}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="medium">Medium</Label>
              <Select 
                id="medium" 
                name="medium" 
                value={formData.medium}
                onChange={handleInputChange}
              >
                <option value="">Select Medium</option>
                <option value="Acrylic">Acrylic</option>
                <option value="Digital">Digital</option>
                <option value="Mixed Media">Mixed Media</option>
                <option value="Sculpture">Sculpture</option>
                <option value="Oil">Oil</option>
                <option value="Watercolor">Watercolor</option>
                <option value="Photography">Photography</option>
                <option value="Other">Other</option>
              </Select>
              {errors.medium && <ErrorMessage>{errors.medium}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="yearCreated">Year Created</Label>
              <Input 
                type="text" 
                id="yearCreated" 
                name="yearCreated" 
                value={formData.yearCreated}
                onChange={handleInputChange}
              />
              {errors.yearCreated && <ErrorMessage>{errors.yearCreated}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea 
                id="description" 
                name="description" 
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
              {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
            </FormGroup>
            
            <CheckboxContainer>
              <Checkbox 
                type="checkbox" 
                id="termsAgreed" 
                name="termsAgreed" 
                checked={formData.termsAgreed}
                onChange={handleCheckboxChange}
              />
              <Label htmlFor="termsAgreed" style={{ display: 'inline', marginBottom: 0 }}>
                I confirm this is my original creation and approve its use in Collector Quest.
              </Label>
            </CheckboxContainer>
            {errors.termsAgreed && <ErrorMessage>{errors.termsAgreed}</ErrorMessage>}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Button type="button" onClick={handlePrevStep}>
                Back to Upload
              </Button>
              <Button type="button" onClick={handleNextStep} primary>
                Generate Artifact Properties
              </Button>
            </div>
          </Section>
        );
      
      case 3:
        return (
          <Section>
            <SectionTitle>Magical Artifact Properties</SectionTitle>
            
            {isGenerating ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Analyzing your artwork and generating magical properties...</p>
                {/* Could add a loading spinner here */}
              </div>
            ) : generatedProperties ? (
              <>
                <p>Your artwork has been transformed into a magical artifact with the following properties:</p>
                
                <ArtifactPropertiesContainer>
                  <PropertyBadge>Class: {generatedProperties.class}</PropertyBadge>
                  <PropertyBadge>Effect: {generatedProperties.effect}</PropertyBadge>
                  <PropertyBadge>Element: {generatedProperties.element}</PropertyBadge>
                  <PropertyBadge>Rarity: {generatedProperties.rarity}</PropertyBadge>
                </ArtifactPropertiesContainer>
                
                <div style={{ marginTop: '2rem' }}>
                  <p>Are you satisfied with these properties for your artifact?</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <Button type="button" onClick={handlePrevStep}>
                      Back to Details
                    </Button>
                    <Button type="button" onClick={generateArtifactProperties}>
                      Regenerate Properties
                    </Button>
                    <Button type="submit" disabled={isSubmitting} primary onClick={handleSubmit}>
                      {isSubmitting ? 'Submitting...' : 'Submit Artifact'}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p>Failed to generate artifact properties.</p>
                {errors.generate && <ErrorMessage>{errors.generate}</ErrorMessage>}
                <Button type="button" onClick={generateArtifactProperties} primary>
                  Try Again
                </Button>
                <Button type="button" onClick={handlePrevStep}>
                  Back to Details
                </Button>
              </>
            )}
            
            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          </Section>
        );
      
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Title>Create an Artifact</Title>
      
      <StepIndicator>
        <StepDot active={currentStep === 1} completed={currentStep > 1} />
        <StepDot active={currentStep === 2} completed={currentStep > 2} />
        <StepDot active={currentStep === 3} completed={currentStep > 3} />
      </StepIndicator>
      
      <StepLabel>
        {currentStep === 1 ? 'Step 1: Upload Artwork' : 
         currentStep === 2 ? 'Step 2: Enter Details' : 
         'Step 3: Generate Magical Properties'}
      </StepLabel>
      
      <form onSubmit={handleSubmit}>
        {renderStepContent()}
      </form>
    </PageContainer>
  );
};

export default CreateArtifactPage;