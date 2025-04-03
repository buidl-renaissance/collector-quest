import React, { useState } from 'react';
import { keyframes } from '@emotion/react';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import styled from '@emotion/styled';

export default function Submit() {
  const [artworkName, setArtworkName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Here you would implement the actual submission logic
      // For example, uploading to IPFS and then calling the Sui contract
      
      // Upload image to API
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        // Upload to the specified API endpoint
        const uploadResponse = await fetch('https://api.detroiter.network/api/media-upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image to server');
        }
        
        const uploadData = await uploadResponse.json();
        console.log('Image uploaded successfully:', uploadData);
        
        // Here you would typically save the returned image URL/ID along with other artwork details
        // For example, calling another API endpoint to save the artwork metadata
      } else {
        throw new Error('No image file selected');
      }
      
      setSubmitSuccess(true);
      // Reset form
      setArtworkName('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      setPrice('');
    } catch (error) {
      setSubmitError('Failed to submit artwork. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageBackground />
      
      {/* Floating elements for visual interest */}
      {[...Array(10)].map((_, i) => (
        <FloatingElement
          key={i}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          size={`${Math.random() * 100 + 50}px`}
          opacity={Math.random() * 0.3 + 0.1}
          animationDuration={`${Math.random() * 10 + 10}s`}
        />
      ))}
      
      <ContentContainer>
        <BackLink href="/">
          <FaArrowLeft /> Back to Gallery
        </BackLink>
        
        <PageTitle>Submit Your Masterpiece</PageTitle>
        <PageSubtitle>Let Lord Smearington Judge Your Creation</PageSubtitle>
        
        {submitSuccess ? (
          <SuccessMessage>
            <SuccessIcon>🎨</SuccessIcon>
            <h3>Artwork Submitted Successfully!</h3>
            <p>Lord Smearington will now contemplate your creation with his usual unhinged fervor.</p>
            <ButtonGroup>
              <PrimaryButton onClick={() => setSubmitSuccess(false)}>Submit Another</PrimaryButton>
              <SecondaryButton>
                <Link href="/">Return to Gallery</Link>
              </SecondaryButton>
            </ButtonGroup>
          </SuccessMessage>
        ) : (
          <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="artworkName">Artwork Title</Label>
              <Input
                id="artworkName"
                type="text"
                value={artworkName}
                onChange={(e) => setArtworkName(e.target.value)}
                placeholder="e.g., 'Screaming Void of Technicolor Nightmares'"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your artistic vision in excruciating detail..."
                rows={4}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="price">Price (in SUI)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 1.5"
                min="0"
                step="0.01"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Artwork Image</Label>
              <ImageUploadContainer>
                {imagePreview ? (
                  <PreviewContainer>
                    <ImagePreview src={imagePreview} alt="Preview" />
                    <RemoveButton onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}>
                      Remove
                    </RemoveButton>
                  </PreviewContainer>
                ) : (
                  <UploadBox>
                    <UploadIcon>
                      <FaUpload />
                    </UploadIcon>
                    <UploadText>
                      Drag and drop your image here, or click to browse
                    </UploadText>
                    <UploadInput
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </UploadBox>
                )}
              </ImageUploadContainer>
            </FormGroup>
            
            {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit to Lord Smearington'}
            </SubmitButton>
          </FormContainer>
        )}
      </ContentContainer>
    </PageContainer>
  );
}

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
`;

const PageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%);
  z-index: -2;
`;

const FloatingElement = styled.div<{ top: string; left: string; size: string; opacity: number; animationDuration: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  background: radial-gradient(circle at center, #805AD5 0%, transparent 70%);
  opacity: ${props => props.opacity};
  z-index: -1;
  animation: ${float} ${props => props.animationDuration} infinite ease-in-out;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #E2E8F0;
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 1rem;
  gap: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #805AD5;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
  text-align: center;
  background: linear-gradient(to right, #805AD5, #D53F8C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.h2`
  font-size: 1.25rem;
  color: #A0AEC0;
  margin-bottom: 3rem;
  text-align: center;
  font-style: italic;
`;

const FormContainer = styled.form`
  background: rgba(26, 32, 44, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #E2E8F0;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(45, 55, 72, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #805AD5;
    box-shadow: 0 0 0 2px rgba(128, 90, 213, 0.3);
  }
  
  &::placeholder {
    color: #718096;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(45, 55, 72, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #805AD5;
    box-shadow: 0 0 0 2px rgba(128, 90, 213, 0.3);
  }
  
  &::placeholder {
    color: #718096;
  }
`;

const ImageUploadContainer = styled.div`
  width: 100%;
`;

const UploadBox = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #805AD5;
    background: rgba(128, 90, 213, 0.1);
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: #805AD5;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: #A0AEC0;
  margin: 0;
`;

const UploadInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const PreviewContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 0.5rem;
  display: block;
  margin: 0 auto;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: #E53E3E;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to right, #805AD5, #D53F8C);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #FC8181;
  background: rgba(252, 129, 129, 0.1);
  border: 1px solid rgba(252, 129, 129, 0.3);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled.div`
  background: rgba(72, 187, 120, 0.1);
  border: 1px solid rgba(72, 187, 120, 0.3);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  animation: ${pulse} 2s infinite ease-in-out;
  
  h3 {
    color: #48BB78;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #A0AEC0;
    margin-bottom: 2rem;
  }
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #805AD5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #6B46C1;
  }
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #E2E8F0;
  border: 1px solid #4A5568;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
`;
