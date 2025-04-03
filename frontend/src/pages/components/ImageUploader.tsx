import { FaUpload } from "react-icons/fa";
import styled from "@emotion/styled";
import { FormGroup, Label } from "./Forms";
import { uploadMedia } from "@/lib/dpop";
import { useState } from "react";

type ImageUploaderProps = {
  imagePreview: string;
  setImagePreview: (preview: string | null) => void;
};

// ImageUploader Component
export const ImageUploader = ({ imagePreview, setImagePreview, }: ImageUploaderProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [, setImageFile] = useState<File | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setImageFile(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
    
          setIsUploading(true);
          const result = await uploadMedia(file);
          if (result && result.url) {
            setIsUploading(false);
            setImagePreview(result.url);
          } else {
            throw new Error('Failed to upload image');
          }
        }
      };
      
      return (
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
    {isUploading && <UploadingText>Uploading...</UploadingText>}
  </FormGroup>
);
}

// Image Upload Components
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
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 2rem;
  
  &:hover {
    border-color: #805AD5;
    background: rgba(128, 90, 213, 0.1);
  }
`;

const UploadingText = styled.p`
  color: #A0AEC0;
  margin: 0;
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: #805AD5;
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
