import React, { useState } from 'react';
import styled from '@emotion/styled';
import { UploadButton } from './UploadButton';

interface UploadMediaProps {
  onUploadComplete?: (url: string) => void;
  onError?: (error: string) => void;
  mediaUrl?: string;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
}

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const PreviewContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  position: relative;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 4px;
`;

const PreviewVideo = styled.video`
  max-width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 4px;
`;

const ErrorMessage = styled.p`
  color: #FF3366;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LoadingIndicator = styled.div`
  margin-top: 1rem;
  color: #666;
  font-size: 0.875rem;
`;

export const UploadMedia: React.FC<UploadMediaProps> = ({
  onUploadComplete,
  onError,
  mediaUrl,
  accept = 'image/*',
  maxSize = 5, // Default 5MB
  label = 'Upload Media'
}) => {
  const [preview, setPreview] = useState<string | null>(mediaUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(
    accept.includes('video') ? 'video' : 'image'
  );

  const handleUploadComplete = async (url: string) => {
    setPreview(url);
    if (onUploadComplete) onUploadComplete(url);
  };

  const handleError = (error: string) => {
    setError(error);
    if (onError) onError(error);
  };

  return (
    <UploadContainer>
      <UploadButton 
        onUploadComplete={handleUploadComplete}
        onUploadError={handleError}
        accept={accept}
        maxSize={maxSize}
        label={label}
      />
      
      {isUploading && (
        <LoadingIndicator>Uploading...</LoadingIndicator>
      )}
      
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
      
      {preview && !isUploading && (
        <PreviewContainer>
          {mediaType === 'image' ? (
            <PreviewImage src={preview} alt="Preview" />
          ) : (
            <PreviewVideo autoPlay muted loop playsInline>
              <source src={preview} type="video/mp4" />
              Your browser does not support the video tag.
            </PreviewVideo>
          )}
        </PreviewContainer>
      )}
    </UploadContainer>
  );
};
