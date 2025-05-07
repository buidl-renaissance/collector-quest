import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaImage, FaUpload, FaSpinner } from 'react-icons/fa';

interface ImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      
      if (onImageGenerated) {
        onImageGenerated(data.imageUrl);
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImageToAPI = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);
      if (prompt) {
        formData.append('prompt', prompt);
      }

      // Replace with your actual API endpoint
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      
      if (onImageGenerated) {
        onImageGenerated(data.imageUrl);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Image Generator</Title>
      
      <PromptArea
        placeholder="Describe the image you want to generate..."
        value={prompt}
        onChange={handlePromptChange}
      />
      
      <ButtonsContainer>
        <GenerateButton onClick={generateImage} disabled={isLoading}>
          {isLoading ? <FaSpinner className="spinner" /> : <FaImage />} Generate Image
        </GenerateButton>
        
        <UploadContainer>
          <UploadLabel htmlFor="image-upload">
            <FaUpload /> Upload Image
          </UploadLabel>
          <UploadInput 
            id="image-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
          {uploadPreview && (
            <UploadButton onClick={uploadImageToAPI} disabled={isLoading}>
              {isLoading ? <FaSpinner className="spinner" /> : 'Process Uploaded Image'}
            </UploadButton>
          )}
        </UploadContainer>
      </ButtonsContainer>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <ResultsContainer>
        {uploadPreview && (
          <ImagePreviewContainer>
            <ImagePreviewTitle>Uploaded Image:</ImagePreviewTitle>
            <ImagePreview src={uploadPreview} alt="Uploaded preview" />
          </ImagePreviewContainer>
        )}
        
        {generatedImage && (
          <ImageResultContainer>
            <ImageResultTitle>Generated Image:</ImageResultTitle>
            <ImageResult src={generatedImage} alt="Generated result" />
          </ImageResultContainer>
        )}
        
        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Processing your request...</LoadingText>
          </LoadingContainer>
        )}
      </ResultsContainer>
    </Container>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Cormorant Garamond', serif;
  animation: ${fadeIn} 0.5s ease-in;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const PromptArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #bb8930;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  color: #e6e6e6;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #d4a959;
    box-shadow: 0 0 0 2px rgba(212, 169, 89, 0.3);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #d4a959;
  }
  
  &:disabled {
    background-color: #6c5a30;
    cursor: not-allowed;
  }
  
  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3a2606;
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.2);
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3a2606;
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ImagePreviewContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const ImagePreviewTitle = styled.h3`
  font-size: 1.2rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  border: 1px solid #3a2606;
`;

const ImageResultContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const ImageResultTitle = styled.h3`
  font-size: 1.2rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const ImageResult = styled.img`
  max-width: 100%;
  border-radius: 4px;
  border: 1px solid #bb8930;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
`;

const LoadingSpinner = styled(FaSpinner)`
  font-size: 2rem;
  color: #bb8930;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #C7BFD4;
  font-size: 1.2rem;
`;

export default ImageGenerator;
