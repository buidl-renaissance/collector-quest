import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useRouter } from "next/router";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import { useCharacterImageGenerator } from "@/hooks/useCharacterImageGenerator";
import { navigateTo } from "@/utils/navigation";
import { NextButton } from "@/components/styled/buttons";
import { FaArrowRight } from "react-icons/fa";

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
  const router = useRouter();
  const { character, updateCharacter } = useCurrentCharacter();
  const {
    generateImage,
    isGenerating,
    error: generationError,
    resultData,
    generatedImage,
    pollStatus,
  } = useCharacterImageGenerator();
  const [userImage, setUserImage] = useState<string | null>();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [generateNewImage, setGenerateNewImage] = useState(false);

  useEffect(() => {
    setUserImage(character?.image_url ?? null);
  }, [character]);

  const getStatusMessage = () => {
    if (!resultData) {
      return isGenerating ? "Starting image generation..." : "";
    }

    const step = resultData.step;
    switch (step) {
      case "analyze-facial-data":
        return "Analyzing facial features...";
      case "generate-character-image":
        return "Generating your character image...";
      case "uploading-image":
        return "Uploading your character image...";
      case "save-character-image":
        return "Saving your character image...";
      default:
        return resultData.message || "Processing your image...";
    }
  };

  const cropImageToWidth = (
    imageData: string,
    targetWidth: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Calculate dimensions while maintaining aspect ratio
        const aspectRatio = img.height / img.width;
        const newWidth = targetWidth;
        const newHeight = targetWidth * aspectRatio;

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Get the resized image as a data URL
        const croppedImageData = canvas.toDataURL("image/jpeg");
        resolve(croppedImageData);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = imageData;
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      try {
        // Crop the image to 600px width
        const croppedImage = await cropImageToWidth(result, 600);
        setUserImage(croppedImage);

        await generateImage(croppedImage);
        // Here you would typically start polling for the result
        // For now, we'll just show a success message
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate character image"
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    navigateTo(router, "/character/background");
  };

  const handleSkip = async () => {
    navigateTo(router, "/character/background");
  };

  const handleCameraCapture = async () => {
    try {
      // Check if MediaDevices API is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in your browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // Create a video element and show it in a modal
      const video = document.createElement("video");
      video.srcObject = stream;
      video.setAttribute("playsinline", ""); // Required for iOS
      video.setAttribute("autoplay", "");

      // Create a modal for the camera preview
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      modal.style.display = "flex";
      modal.style.flexDirection = "column";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
      modal.style.zIndex = "1000";

      // Add video to modal
      video.style.maxWidth = "90%";
      video.style.maxHeight = "80vh";
      video.style.borderRadius = "8px";
      modal.appendChild(video);

      // Add capture button
      const captureButton = document.createElement("button");
      captureButton.textContent = "Capture Photo";
      captureButton.style.marginTop = "1rem";
      captureButton.style.padding = "0.75rem 1.5rem";
      captureButton.style.backgroundColor = "#bb8930";
      captureButton.style.color = "#1a1a1a";
      captureButton.style.border = "none";
      captureButton.style.borderRadius = "4px";
      captureButton.style.cursor = "pointer";
      modal.appendChild(captureButton);

      // Add close button
      const closeButton = document.createElement("button");
      closeButton.textContent = "Cancel";
      closeButton.style.marginTop = "0.5rem";
      closeButton.style.padding = "0.75rem 1.5rem";
      closeButton.style.backgroundColor = "#3a3347";
      closeButton.style.color = "#e0dde5";
      closeButton.style.border = "1px solid #bb8930";
      closeButton.style.borderRadius = "4px";
      closeButton.style.cursor = "pointer";
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
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL("image/jpeg");

        // Crop the captured image to 600px width
        cropImageToWidth(imageData, 600)
          .then((croppedImage) => {
            setUserImage(croppedImage);
            return generateImage(croppedImage);
          })
          .catch((err) => {
            setError(
              err instanceof Error
                ? err.message
                : "Failed to generate character image"
            );
          });

        // Clean up
        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(modal);
      };

      // Handle close button click
      closeButton.onclick = () => {
        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(modal);
      };
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to access camera. Please try uploading an image instead."
      );
    }
  };

  return (
    <Container>
      <Title>Character Image Generator</Title>

      <Description>
        Create your unique character by uploading a photo of yourself! Our AI
        will analyze your facial features and combine them with your chosen race
        and class to generate a personalized fantasy character. The result will
        maintain your distinct characteristics while adapting them to fit your
        selected fantasy race, creating a character that&apos;s uniquely yours.
      </Description>

      {(error || generationError) && (
        <ErrorMessage>{error || generationError}</ErrorMessage>
      )}

      {(!userImage || generateNewImage) && (
        <Section>
          <SectionTitle>Upload Your Photo</SectionTitle>
          <ButtonGroup>
            <Button onClick={handleCameraCapture}>Take Photo</Button>
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="image-upload"
            />
            <UploadLabel htmlFor="image-upload">Upload Photo</UploadLabel>
          </ButtonGroup>
        </Section>
      )}

      {userImage && !generatedImage && (
        <ImageContainer>
          <ImagePreview src={userImage} alt="Uploaded" />
          {(isGenerating || pollStatus === "polling") && (
            <LoadingOverlay>
              <LoadingMessage>
                {getStatusMessage()}
                {pollStatus === "polling" && <LoadingDots>...</LoadingDots>}
              </LoadingMessage>
            </LoadingOverlay>
          )}
          <ButtonGroup>
            <Button
              onClick={() => {
                setUserImage(null);
                setGenerateNewImage(true);
              }}
            >
              Generate New Image
            </Button>
          </ButtonGroup>
        </ImageContainer>
      )}

      {generatedImage && (
        <Section>
          <SectionTitle>Your Generated Character</SectionTitle>
          <ImagePreview src={generatedImage} alt="Generated Character" />
          <ButtonGroup>
            <Button onClick={handleNext} disabled={isSaving} primary>
              {isSaving ? "Saving..." : "Next"}
            </Button>
          </ButtonGroup>
        </Section>
      )}

      <BottomActions>
        {!userImage ? (
          <SkipButton onClick={handleSkip}>Skip Image Generation</SkipButton>
        ) : (
          <NextButton onClick={handleNext}>Next <FaArrowRight /></NextButton>
        )}
      </BottomActions>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
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
  color: #c7bfd4;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1rem;
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
  font-family: "Cormorant Garamond", serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  background: ${(props) => (props.primary ? "#bb8930" : "transparent")};
  color: ${(props) => (props.primary ? "#1a1a1a" : "#bb8930")};
  border: 2px solid #bb8930;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  text-align: center;

  &:hover {
    background: ${(props) =>
      props.primary ? "#d4a959" : "rgba(187, 137, 48, 0.1)"};
    border-color: ${(props) => (props.primary ? "#d4a959" : "#d4a959")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UploadLabel = styled.label`
  padding: 0.375rem 0.75rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-family: "Cormorant Garamond", serif;
  display: inline-block;
  min-width: 100px;
  text-align: center;

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

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 1rem;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 2px solid #bb8930;
`;

const LoadingMessage = styled.div`
  color: #c7bfd4;
  text-align: center;
  padding: 1rem;
  font-style: italic;
  font-size: 1.1rem;
`;

const CharacteristicsList = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CharacteristicItem = styled.div`
  display: flex;
  gap: 0.5rem;
  color: #c7bfd4;
`;

const CharacteristicLabel = styled.span`
  font-weight: 500;
  color: #bb8930;
`;

const CharacteristicValue = styled.span`
  color: #c7bfd4;
`;

const BottomActions = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(26, 26, 46, 0.95);
  border-top: 2px solid #bb8930;
  padding: 1rem 2rem;
  display: flex;
  justify-content: flex-end;
  z-index: 100;
`;

const SkipButton = styled.button`
  background: transparent;
  color: #c7bfd4;
  border: 1px solid #c7bfd4;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  text-align: center;

  &:hover {
    background: rgba(199, 191, 212, 0.1);
    color: #e0dde5;
    border-color: #e0dde5;
  }
`;

const LoadingDots = styled.span`
  animation: ${keyframes`
    0% { opacity: 0.2; }
    20% { opacity: 1; }
    100% { opacity: 0.2; }
  `} 1.4s infinite;
  display: inline-block;
  width: 24px;
  text-align: left;
`;

export default ImageGeneratorPage;
