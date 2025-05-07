import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaCrown, FaImage } from "react-icons/fa";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Race, coreRaces, expandedRaces } from "@/data/races";
import { GetServerSidePropsContext } from "next";
import { getRaceById, saveRace } from "@/db/races";
import { uploadImage, generateImage } from "@/lib/image";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const race = context.params?.race as string;

  let raceData = await getRaceById(race);

  if (!raceData) {
    raceData =
      coreRaces.find((r) => r.id === race) ||
      (expandedRaces.find((r) => r.id === race) as Race);
  }

  if (!raceData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      race: raceData,
      metadata: {
        title: `Character Images | Collector Quest`,
        description: "Generate and customize images for your character.",
        image: "/images/character-image-generator.jpg",
        url: `https://collectorquest.theethical.ai/character/images`,
      },
    },
  };
};

interface CharacterImagesPageProps {
  race: Race;
}

const CharacterImagesPage: React.FC<CharacterImagesPageProps> = ({ race }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedImage, setGeneratedImage] = useState(race.image || "");
  const [prompt, setPrompt] = useState(
    `${race.name}, a ${race.description}, replace the staff with a ${race.accessory}`
  );

  const handleGenerateImage = async () => {
    if (!prompt) {
      setError("Please enter a description for your character");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const image = await generateImage(prompt, generatedImage);
      if (!image) {
        throw new Error("Failed to generate image");
      }
      const imageData = await uploadRaceImage(image);
      console.log(imageData);
      setGeneratedImage(imageData.url);
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate your character image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadRaceImage = async (image: string) => {
    const data = await uploadImage(image);
    setGeneratedImage(data.url);
    return data;
  };

  const handleSaveRace = async () => {
    if (!generatedImage) {
      setError("Please generate an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      race.image = generatedImage;
      await saveRace(race);
      // Redirect to next step or character profile
      router.push("/character/race/admin");
    } catch (err) {
      console.error("Error saving race and image:", err);
      setError(
        "Failed to save your character race and image. Please try again."
      );
      setLoading(false);
    }
  };

  //   if (loading) {
  //     return (
  //       <Container>
  //         <LoadingMessage>
  //           <CrownIcon><FaCrown /></CrownIcon>
  //           {generatedImage ? "Saving your character image..." : "Generating your character image..."}
  //         </LoadingMessage>
  //       </Container>
  //     );
  //   }

  return (
    <Container>
      <BackLink href="/character/race">
        <FaArrowLeft /> Back to Character Creation
      </BackLink>

      <Title>Character Image Generator</Title>
      <Subtitle>Bring your character to life with a unique image</Subtitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <RaceDescription>
        <RaceName>{race.name}</RaceName>
        <RaceSource>{race.source}</RaceSource>
        <RaceDescriptionText>{race.description}</RaceDescriptionText>
      </RaceDescription>

      <GeneratorSection>
        <PromptInput
          placeholder="Describe your character in detail (appearance, clothing, pose, background, etc.)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <GenerateButton
          onClick={handleGenerateImage}
          disabled={loading || !prompt}
        >
          <FaImage /> Generate Image
        </GenerateButton>

        {generatedImage && (
          <ImagePreviewContainer>
            <ImagePreview src={generatedImage} alt="Generated character" />
            <SaveButton onClick={handleSaveRace}>Save</SaveButton>
          </ImagePreviewContainer>
        )}
      </GeneratorSection>

      <Tips>
        <TipsTitle>Tips for great results:</TipsTitle>
        <TipsList>
          <TipsItem>
            Be specific about physical features (hair color, eye color, skin
            tone)
          </TipsItem>
          <TipsItem>Describe clothing and accessories in detail</TipsItem>
          <TipsItem>Mention the character&apos;s pose and expression</TipsItem>
          <TipsItem>
            Include background elements that reflect your character&apos;s story
          </TipsItem>
        </TipsList>
      </Tips>
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-in;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 2rem;
  color: #bb8930;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #d4a959;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #c7bfd4;
  margin-bottom: 2rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #c7bfd4;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CrownIcon = styled.span`
  margin-right: 0.5rem;
  animation: ${fadeIn} 1s infinite alternate;
`;

const GeneratorSection = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const RaceDescription = styled.div`
  margin-bottom: 2rem;
`;

const RaceName = styled.h2`
  font-size: 1.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const RaceSource = styled.p`
  font-size: 1rem;
  color: #c7bfd4;
  margin-bottom: 0.5rem;
`;

const RaceDescriptionText = styled.p`
  font-size: 1rem;
  color: #c7bfd4;
  margin-bottom: 0.5rem;
`;

const PromptInput = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #bb8930;
  border-radius: 4px;
  color: #e6e6e6;
  font-family: "Cormorant Garamond", serif;
  resize: vertical;

  &::placeholder {
    color: rgba(199, 191, 212, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #d4a959;
  }
`;

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #bb8930;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #d4a959;
  }

  &:disabled {
    background: #6c5a30;
    cursor: not-allowed;
  }
`;

const ImagePreviewContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  border: 2px solid #bb8930;
  margin-bottom: 1rem;
`;

const SaveButton = styled.button`
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #388e3c;
  }
`;

const Tips = styled.div`
  background: rgba(187, 137, 48, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
`;

const TipsTitle = styled.h3`
  color: #bb8930;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const TipsList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
`;

const TipsItem = styled.li`
  color: #c7bfd4;
  margin-bottom: 0.5rem;
`;

export default CharacterImagesPage;
