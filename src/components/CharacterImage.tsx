import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { FaSpinner } from "react-icons/fa";
import { CharacterClass, Character } from "@/data/character";
import { Race } from "@/data/races";
import { generateImage } from "@/lib/image";

interface CharacterImageProps {
  character?: Character;
  size?: "small" | "medium" | "large" | "thumbnail";
  alt?: string;
  circular?: boolean;
  bordered?: boolean;
}

const CharacterImage: React.FC<CharacterImageProps> = ({
  character,
  size = "medium",
  alt = "Character Image",
  circular = false,
  bordered = false,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratedImage, setIsGeneratedImage] = useState<boolean>(false);

  useEffect(() => {
    const loadImage = async () => {
      // If character has an image, use that
      if (character?.image_url) {
        setImageUrl(character.image_url);
        setLoading(false);
        return;
      }

      if (!character?.race || !character?.class) {
        setImageUrl("/images/COLLECTOR-quest-intro-1024.png");
        setLoading(false);
        return;
      }

      if (character.race.image) {
        setImageUrl(character.race.image);
        setLoading(false);
        return;
      }

      try {
        // In a real app, this would be an API call to get a generated image
        // For now, we'll use a mock path based on race and class
        const formattedRace = character.race.name.toLowerCase().replace(/\s+/g, "-");
        const formattedClass = character.class.name
          .toLowerCase()
          .replace(/\s+/g, "-");

        // Check if the image exists in the public folder
        const imagePath = `/images/characters/${formattedRace}-${formattedClass}.jpg`;

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check if the specific character image exists
        const imageExists = await checkImageExists(imagePath);

        if (imageExists) {
          setImageUrl(imagePath);
          setIsGeneratedImage(false);
        } else {
          // If specific image doesn't exist, generate one based on race image and class
          await generateCharacterImage(character.race, character.class);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading character image:", err);
        setError("Failed to load character image");
        setImageUrl("/images/COLLECTOR-quest-intro-1024.png");
        setLoading(false);
      }
    };

    const checkImageExists = (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    const generateCharacterImage = async (
      race: Race,
      characterClass: CharacterClass
    ) => {
      try {
        // In a real implementation, we would send a prompt to an image generation API
        // Prompt would be something like: "A [race.name] [characterClass.name] character"
        console.log(`Generating image for ${race.name} ${characterClass.name}`);

        // Simulate image generation delay
        const generatedImage = await generateImage(
          `A ${race.name}, ${race.description}, that is a ${characterClass.name} which ${characterClass.description}`,
          race.image
        );

        // For now, just use the race image or default
        setImageUrl(generatedImage || "/images/COLLECTOR-quest-intro-1024.png");
        setIsGeneratedImage(true);
      } catch (error) {
        console.error("Error generating character image:", error);
        setImageUrl("/images/COLLECTOR-quest-intro-1024.png");
      }
    };

    setLoading(true);
    loadImage();
  }, [character]);

  if (loading) {
    return (
      <ImageContainer size={size} circular={circular} bordered={bordered}>
        <LoadingSpinner>
          <FaSpinner />
        </LoadingSpinner>
      </ImageContainer>
    );
  }

  if (error) {
    return (
      <ImageContainer size={size} circular={circular} bordered={bordered}>
        <ErrorMessage>{error}</ErrorMessage>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer size={size} circular={circular} bordered={bordered}>
      <StyledImage
        src={imageUrl}
        alt={alt}
        onError={(e) => {
          // Fallback to default image if the specific one doesn't exist
          (e.target as HTMLImageElement).src =
            "/images/COLLECTOR-quest-intro-1024.png";
        }}
      />
      {/* {isGeneratedImage && character?.race && character?.class && (
        <GeneratedOverlay>
          <GeneratedText>{`${character.race.name} ${character.class.name}`}</GeneratedText>
        </GeneratedOverlay>
      )} */}
    </ImageContainer>
  );
};

export default CharacterImage;

// Styled Components
const ImageContainer = styled.div<{ size: string; circular: boolean; bordered: boolean }>`
  width: ${(props) => {
    switch (props.size) {
      case "thumbnail":
        return "60px";
      case "small":
        return "100px";
      case "large":
        return "100%";
      default:
        return "200px";
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case "thumbnail":
        return "60px";
      case "small":
        return "100px";
      case "large":
        return "100%";
      default:
        return "200px";
    }
  }};
  max-width: 300px;
  border-radius: ${props => props.circular ? '50%' : '8px'};
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  position: relative;
  border: ${props => props.bordered ? '2px solid #d4af37' : 'none'};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #3498db;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
`;

const GeneratedOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px;
  text-align: center;
`;

const GeneratedText = styled.span`
  color: white;
  font-size: 0.8rem;
  font-style: italic;
`;
