import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/router';
import useRace from '@/hooks/useRace';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ImageGeneratorPage = () => {
  const { selectedRace } = useRace();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [characteristics, setCharacteristics] = useState<Record<string, string | string[]>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUserImage(result);
      analyzeFace(result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFace = async (imageData: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const response = await fetch('/api/analyze-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze face');
      }

      const data = await response.json();
      setCharacteristics(data.characteristics);
    } catch (err) {
      console.error('Error analyzing face:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze face');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateCharacter = async () => {
    if (!characteristics || !selectedRace) return;

    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/generate-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          characteristics,
          race: selectedRace // You might want to pass the actual race image URL here
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate character');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      console.error('Error generating character:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate character');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Check if MediaDevices API is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in your browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });

      // Create a video element and show it in a modal
      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', ''); // Required for iOS
      video.setAttribute('autoplay', '');
      
      // Create a modal for the camera preview
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      modal.style.display = 'flex';
      modal.style.flexDirection = 'column';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '1000';

      // Add video to modal
      video.style.maxWidth = '90%';
      video.style.maxHeight = '80vh';
      video.style.borderRadius = '8px';
      modal.appendChild(video);

      // Add capture button
      const captureButton = document.createElement('button');
      captureButton.textContent = 'Capture Photo';
      captureButton.style.marginTop = '1rem';
      captureButton.style.padding = '0.75rem 1.5rem';
      captureButton.style.backgroundColor = '#bb8930';
      captureButton.style.color = '#1a1a1a';
      captureButton.style.border = 'none';
      captureButton.style.borderRadius = '4px';
      captureButton.style.cursor = 'pointer';
      modal.appendChild(captureButton);

      // Add close button
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Cancel';
      closeButton.style.marginTop = '0.5rem';
      closeButton.style.padding = '0.75rem 1.5rem';
      closeButton.style.backgroundColor = '#3a3347';
      closeButton.style.color = '#e0dde5';
      closeButton.style.border = '1px solid #bb8930';
      closeButton.style.borderRadius = '4px';
      closeButton.style.cursor = 'pointer';
      modal.appendChild(closeButton);

      // Add modal to document
      document.body.appendChild(modal);

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(null);
        };
      });

      // Handle capture button click
      captureButton.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/jpeg');
        setUserImage(imageData);
        analyzeFace(imageData);

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };

      // Handle close button click
      closeButton.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };

    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera. Please try uploading an image instead.');
    }
  };

  return (
    <Container>
      <Title>Character Image Generator</Title>
      
      <Description>
        Create your unique character by uploading a photo of yourself! Our AI will analyze your facial features 
        and combine them with your chosen race and class to generate a personalized fantasy character. 
        The result will maintain your distinct characteristics while adapting them to fit your selected 
        fantasy race, creating a character that&apos;s uniquely yours.
      </Description>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Section>
        <SectionTitle>Step 1: Upload Your Photo</SectionTitle>
        <ButtonGroup>
          <Button onClick={handleCameraCapture}>Take Photo</Button>
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            id="image-upload"
          />
          <UploadLabel htmlFor="image-upload">
            Upload Photo
          </UploadLabel>
        </ButtonGroup>
      </Section>

      {userImage && (
        <Section>
          <SectionTitle>Your Photo</SectionTitle>
          <ImagePreview src={userImage} alt="Uploaded" />
        </Section>
      )}

      {isAnalyzing && (
        <Section>
          <LoadingMessage>Analyzing facial characteristics...</LoadingMessage>
        </Section>
      )}

      {Object.keys(characteristics).length > 0 && userImage && (
        <Section>
          <SectionTitle>Facial Characteristics</SectionTitle>
          <CharacteristicsList>
            {Object.entries(characteristics).map(([key, value]) => (
              <CharacteristicItem key={key}>
                <CharacteristicLabel>{key}:</CharacteristicLabel>
                <CharacteristicValue>
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </CharacteristicValue>
              </CharacteristicItem>
            ))}
          </CharacteristicsList>
          <Button 
            onClick={generateCharacter}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating Character...' : 'Generate Character'}
          </Button>
        </Section>
      )}

      {generatedImage && (
        <Section>
          <SectionTitle>Generated Character</SectionTitle>
          <ImagePreview src={generatedImage} alt="Generated Character" />
        </Section>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Cormorant Garamond', serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 80px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Description = styled.p`
  color: #C7BFD4;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const Section = styled.div`
  background-color: rgba(26, 26, 46, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #bb8930;
  animation: ${slideUp} 0.5s ease-out;
`;

const SectionTitle = styled.h2`
  color: #bb8930;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-family: 'Cormorant Garamond', serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-family: 'Cormorant Garamond', serif;

  &:hover {
    background-color: #d4a959;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const UploadLabel = styled.label`
  padding: 0.75rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-family: 'Cormorant Garamond', serif;
  display: inline-block;

  &:hover {
    background-color: #d4a959;
    transform: translateY(-2px);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin-top: 1rem;
  border: 2px solid #bb8930;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #ff6b6b;
`;

const LoadingMessage = styled.div`
  color: #C7BFD4;
  text-align: center;
  padding: 1rem;
  font-style: italic;
`;

const CharacteristicsList = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CharacteristicItem = styled.div`
  display: flex;
  gap: 0.5rem;
  color: #C7BFD4;
`;

const CharacteristicLabel = styled.span`
  font-weight: 500;
  color: #bb8930;
`;

const CharacteristicValue = styled.span`
  color: #C7BFD4;
`;

export default ImageGeneratorPage; 