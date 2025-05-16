import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FaArrowLeft, FaCrown, FaSave, FaMagic } from "react-icons/fa";
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

const welcomeStory = {
  title: "Lord Smearington Welcomes You to the Land of the Absurd",
  description: "An invitation to the immersive art gallery experience.",
  slug: "welcome",
  videoUrl:
    "https://dpop.nyc3.digitaloceanspaces.com/uploads/Md7C9BhGVsFplhuUbKGT8qVZHRimd6JcK7a7hzgh.mp4",
  script:
    "Mortals and cosmic entities alike, I, Lord Smearington, invite you to traverse the boundaries of reality at my Inter-dimensional Art Gallery. Opening Saturday, May 17th, 2025, the veil between worlds will thin, allowing glimpses into realms beyond human comprehension.\n\nThis is not merely an exhibition but a journey through the absurd landscapes of my mind, where digital art, physical installations, and interactive experiences collide in a symphony of beautiful chaos.",
};

const theAbsurdAwaitsStory = {
  title: "The Gallery of the Absurd",
  description: "You have found the gallery of the absurd, enter if you dare",
  slug: "gallery-of-the-absurd",
  videoUrl:
    "https://dpop.nyc3.digitaloceanspaces.com/uploads/4CooIY6wjYnOJ839CWXwFB1c7L4F6YiSLhPtADHA.mp4",
  script:
    "Congratulations, intrepid wanderer. You have discovered the entrance to Lord Smearington's Gallery of the Absurd. Beyond this threshold lies a realm where reality bends and imagination reigns supreme. The exhibits within defy explanation, challenge perception, and may forever alter your understanding of art itself. Do you possess the courage to step inside? The bizarre wonders await, but be warned - those who enter may never see the world the same way again. Enter if you dare, curious soul, and prepare to be transformed.",
};

const questBeginsStory = {
  title: "Welcome to Lord Smearington's Gallery of the Absurd",
  description: "Your quest begins here. Start by creating your character.",
  slug: "quest",
  videoUrl:
    "https://dpop.nyc3.digitaloceanspaces.com/uploads/YWKVNNmedKCYVKfVgf2wVpGt5wl2gGr6k80QWcd7.mp4",
  script:
    "Welcome, brave soul, to Lord Smearington's Gallery of the Absurd. Before you embark on this journey through realms of imagination and wonder, you must first forge your identity. Who will you be in this land of artistic chaos? A curious explorer? A skeptical critic? Or perhaps a fellow creator seeking inspiration?\n\nDefine your character, and let your choices guide your experience through the twisted corridors and magnificent exhibits that await you in this interdimensional gallery.",
};

const blankStory = {
  title: "",
  description: "",
  slug: "",
  videoUrl: "",
  script: "",
};

const data = blankStory;


const CreateStoryPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState(data.title);
  const [slug, setSlug] = useState(data.slug);
  const [description, setDescription] = useState(data.description);
  const [videoUrl, setVideoUrl] = useState(data.videoUrl);
  const [script, setScript] = useState(data.script);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatingContent, setGeneratingContent] = useState(false);

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
        body: JSON.stringify({ realmId: "lord-smearington", defaultSlug: slug, title, description, videoUrl, script }),
      });
      const data = await response.json();

      if (response.ok) {
        router.push(`/story/${data.slug}`);
      } else {
        setError(data.error || "Failed to create story. Please try again.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error creating story:", err);
      setError("Failed to create story. Please try again.");
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!prompt) {
      return;
    }

    setGeneratingContent(true);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
      setScript(data.script);
      setShowPromptModal(false);
    } catch (err) {
      console.error("Error generating content:", err);
      setError("Failed to generate content. Please try again.");
    } finally {
      setGeneratingContent(false);
    }
  };

  return (
    <Container>
      <BackLink href={`/realm`}>
        <FaArrowLeft /> Back to Realm
      </BackLink>

      <PageTitle>Create a Story</PageTitle>

      <FormContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <GenerateButton 
            type="button" 
            onClick={() => setShowPromptModal(true)}
          >
            <FaMagic /> Generate Story Content
          </GenerateButton>

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

      {showPromptModal && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>Generate Story Content</ModalTitle>
            <ModalDescription>
              Enter a prompt to generate a title, description, and script for your story.
            </ModalDescription>
            <PromptTextarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the story you want to create... (e.g., 'A surreal journey through a museum where paintings come to life')"
              rows={5}
            />
            <ModalButtonGroup>
              <ModalCancelButton 
                type="button" 
                onClick={() => setShowPromptModal(false)}
                disabled={generatingContent}
              >
                Cancel
              </ModalCancelButton>
              <ModalGenerateButton 
                type="button" 
                onClick={generateContent}
                disabled={!prompt || generatingContent}
              >
                {generatingContent ? "Generating..." : "Generate"}
              </ModalGenerateButton>
            </ModalButtonGroup>
          </Modal>
        </ModalOverlay>
      )}
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
  padding: 2rem 1rem;
  font-family: "Cormorant Garamond", serif;
  background: linear-gradient(
    135deg,
    rgba(59, 76, 153, 0.1),
    rgba(90, 62, 133, 0.1)
  );
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

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

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

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

  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ffd700, transparent);

    @media (max-width: 768px) {
      width: 100px;
      bottom: -10px;
    }
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

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

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

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
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

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

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

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 1rem;
  }

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

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 1rem;
    min-height: 80px;
  }

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

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
    width: 100%;
  }

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

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const GenerateButton = styled.button`
  background: linear-gradient(135deg, #5a3e85, #3b4c99);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #ffd700;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  align-self: center;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 1rem;
    width: 100%;
  }

  &:hover {
    background: linear-gradient(135deg, #3b4c99, #5a3e85);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
    color: #ffd700;
  }

  svg {
    font-size: 1.2rem;
    animation: ${float} 2s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
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

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

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

  @media (max-width: 768px) {
    margin: 2rem 0;
    font-size: 1.5rem;
  }

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

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

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

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 1.2rem;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffd700, transparent);

    @media (max-width: 768px) {
      width: 80px;
      bottom: -8px;
    }
  }
`;

const GuidelinesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 2rem;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
`;

const GuidelineItem = styled.li`
  margin-bottom: 1.2rem;
  padding-left: 2rem;
  position: relative;
  color: #c7bfd4;
  font-size: 1.2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    line-height: 1.5;
  }

  &:before {
    content: "✦";
    position: absolute;
    left: 0;
    color: #ffd700;
    font-size: 1.1rem;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

// Modal components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #3b4c99, #5a3e85);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 2px solid #ffd700;
  position: relative;
  overflow: hidden;

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
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.8rem;
  color: #ffd700;
  margin-bottom: 1rem;
  font-family: "Cinzel Decorative", serif;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ModalDescription = styled.p`
  color: #c7bfd4;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }
`;

const PromptTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #5a3e85;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: "Cormorant Garamond", serif;
  resize: vertical;
  background: rgba(255, 255, 255, 0.1);
  color: #c7bfd4;
  transition: all 0.3s ease;
  min-height: 120px;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 1rem;
    min-height: 100px;
    margin-bottom: 1.2rem;
  }

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

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const ModalButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  font-family: "Cinzel Decorative", serif;
`;

const ModalCancelButton = styled(ModalButton)`
  background: rgba(255, 255, 255, 0.1);
  color: #c7bfd4;
  border: 1px solid rgba(255, 215, 0, 0.3);
  flex: 1;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    color: #ffd700;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalGenerateButton = styled(ModalButton)`
  background: linear-gradient(135deg, #ffd700, #ffa500);
  color: #1a1a2e;
  border: none;
  flex: 1;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ffa500, #ffd700);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: linear-gradient(135deg, #666, #999);
  }
`;

export default CreateStoryPage;
