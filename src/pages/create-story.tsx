import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FaArrowLeft, FaCrown, FaSave } from "react-icons/fa";
import { keyframes } from "@emotion/react";
import { UploadMedia } from "@/components/UploadMedia";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      metadata: {
        title: `Create Story | Lord Smearington's Absurd NFT Gallery`,
        description: "Create a new interactive story for this realm.",
        image: "/images/story-creation-banner.jpg",
        url: `https://smearington.theethical.ai/create-story`,
      },
    },
  };
};

const data = {
  title: "Lord Smearington Welcomes You to the Land of the Absurd",
  description: "An invitation to the immersive art gallery experience.",
  videoUrl:
    "https://dpop.nyc3.digitaloceanspaces.com/uploads/Md7C9BhGVsFplhuUbKGT8qVZHRimd6JcK7a7hzgh.mp4",
  script:
    "Mortals and cosmic entities alike, I, Lord Smearington, invite you to traverse the boundaries of reality at my Inter-dimensional Art Gallery. Opening Saturday, May 17th, 2025, the veil between worlds will thin, allowing glimpses into realms beyond human comprehension.\n\nThis is not merely an exhibition but a journey through the absurd landscapes of my mind, where digital art, physical installations, and interactive experiences collide in a symphony of beautiful chaos.",
};

const CreateStoryPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [videoUrl, setVideoUrl] = useState(data.videoUrl);
  const [script, setScript] = useState(data.script);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl || !script) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        body: JSON.stringify({ realmId: "lord-smearington", title, description, videoUrl, script }),
      });
      const data = await response.json();

      if (response.ok) {
        router.push(`/story/${data.id}`);
      } else {
        setError(data.error || "Failed to create story. Please try again.");
      }

      setLoading(false);
      // Redirect to the realm page
      router.push(`/realms/${data.id}`);
    } catch (err) {
      console.error("Error creating story:", err);
      setError("Failed to create story. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackLink href={`/realm`}>
        <FaArrowLeft /> Back to Realm
      </BackLink>

      <PageTitle>Create a New Story</PageTitle>

      <FormContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Story Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a captivating title"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of your story"
              rows={3}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="imageUrl">Story Video</Label>
            <UploadMedia
              mediaUrl={videoUrl}
              accept="video/*"
              maxSize={50}
              onUploadComplete={(url: string) => setVideoUrl(url)}
              label="Upload a video for your story"
            />
            <small>Upload a video that represents your story</small>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="script">Story Script</Label>
            <Textarea
              id="script"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Write the script for your interactive story"
              rows={6}
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              "Creating..."
            ) : (
              <>
                <FaSave /> Save Story
              </>
            )}
          </SubmitButton>
        </Form>
      </FormContainer>

      <CrownDivider>
        <FaCrown />
      </CrownDivider>

      <StoryGuidelines>
        <GuidelinesTitle>Story Creation Guidelines</GuidelinesTitle>
        <GuidelinesList>
          <GuidelineItem>
            Create immersive and interactive narratives that engage visitors
          </GuidelineItem>
          <GuidelineItem>
            Include decision points that allow visitors to shape the outcome
          </GuidelineItem>
          <GuidelineItem>
            Embrace the absurd and surreal aesthetic of Lord Smearington&apos;s
            realm
          </GuidelineItem>
          <GuidelineItem>
            Keep scripts between 100-500 words for optimal engagement
          </GuidelineItem>
          <GuidelineItem>
            Ensure your video content aligns with the story theme
          </GuidelineItem>
        </GuidelinesList>
      </StoryGuidelines>
    </Container>
  );
};

// Animation keyframes
const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  background: linear-gradient(
    135deg,
    rgba(59, 76, 153, 0.1),
    rgba(90, 62, 133, 0.1)
  );
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("/images/fabric-texture.png");
    opacity: 0.05;
    pointer-events: none;
    z-index: -1;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #c7bfd4;
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #ffd700;
    transform: translateX(-5px);
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2.5rem;
  color: #ffd700;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ffd700, transparent);
  }
`;

const FormContainer = styled.div`
  background: rgba(59, 76, 153, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.3);
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b4c99, #ffd700, #5a3e85);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1.3rem;
  margin-bottom: 0.7rem;
  color: #ffd700;
  font-weight: 500;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;

  &::before {
    content: "✦";
    margin-right: 8px;
    font-size: 0.9rem;
    color: #ffd700;
  }
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #5a3e85;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: "Cormorant Garamond", serif;
  background: rgba(255, 255, 255, 0.07);
  color: #c7bfd4;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2), ${glow} 2s infinite;
  }

  &::placeholder {
    color: rgba(199, 191, 212, 0.5);
    font-style: italic;
  }
`;

const Textarea = styled.textarea`
  padding: 1rem;
  border: 1px solid #5a3e85;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: "Cormorant Garamond", serif;
  resize: vertical;
  background: rgba(255, 255, 255, 0.07);
  color: #c7bfd4;
  transition: all 0.3s ease;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2), ${glow} 2s infinite;
  }

  &::placeholder {
    color: rgba(199, 191, 212, 0.5);
    font-style: italic;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #3b4c99, #5a3e85);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  transition: all 0.4s ease;
  border: 2px solid #ffd700;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  cursor: pointer;
  align-self: center;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 215, 0, 0.3) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-5px);
    background: linear-gradient(135deg, #5a3e85, #3b4c99);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
    color: #ffd700;

    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.3rem;
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1.8rem;
  border: 1px solid rgba(255, 0, 0, 0.3);
  text-align: center;
  font-size: 1.1rem;
  position: relative;

  &::before {
    content: "!";
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ff6b6b;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
`;

const CrownDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 3rem 0;
  color: #ffd700;
  font-size: 1.8rem;
  position: relative;

  &::before,
  &::after {
    content: "";
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 215, 0, 0.5),
      transparent
    );
    flex-grow: 1;
    margin: 0 15px;
  }

  svg {
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const StoryGuidelines = styled.div`
  background: rgba(59, 76, 153, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #5a3e85, #ffd700, #3b4c99);
  }
`;

const GuidelinesTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ffd700;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffd700, transparent);
  }
`;

const GuidelinesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 2rem;
`;

const GuidelineItem = styled.li`
  margin-bottom: 1.2rem;
  padding-left: 2rem;
  position: relative;
  color: #c7bfd4;
  font-size: 1.2rem;
  line-height: 1.6;

  &:before {
    content: "✦";
    position: absolute;
    left: 0;
    color: #ffd700;
    font-size: 1.1rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export default CreateStoryPage;
