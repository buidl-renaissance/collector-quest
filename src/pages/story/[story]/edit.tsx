import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FaArrowLeft, FaCrown, FaSave } from "react-icons/fa";
import { keyframes } from "@emotion/react";
import { UploadMedia } from "@/components/UploadMedia";
import { Story as StoryInterface } from '@/lib/interfaces';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { story } = context.params || {};
  
  return {
    props: {
      storyId: story,
      metadata: {
        title: `Edit Story | Lord Smearington's Absurd NFT Gallery`,
        description: "Edit an interactive story in this unique realm.",
        image: "/images/story-creation-banner.jpg",
        url: `https://lord.smearington.theethical.ai/story/${story}/edit`,
      },
    },
  };
};

const EditStoryPage: React.FC<{ storyId: string }> = ({ storyId }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        const storyData: StoryInterface = await fetch(`/api/story/${storyId}`)
          .then(res => res.json())
          .then(data => data);
        
        setTitle(storyData.title);
        setDescription(storyData.description);
        setVideoUrl(storyData.videoUrl);
        setScript(storyData.script);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching story details:', err);
        setError('Failed to load story details. Please try again later.');
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStoryDetails();
    }
  }, [storyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl || !script) {
      setError("Please fill in all fields");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/story/${storyId}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, videoUrl, script }),
      });
      const data = await response.json();

      if (response.ok) {
        router.push(`/story/${storyId}`);
      } else {
        setError(data.error || "Failed to update story. Please try again.");
      }

      setSaving(false);
    } catch (err) {
      console.error("Error updating story:", err);
      setError("Failed to update story. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <CrownIcon><FaCrown /></CrownIcon>
          Loading story details...
        </LoadingMessage>
      </Container>
    );
  }

  if (error && !title) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <BackLink href={`/story/${storyId}`}>
          <FaArrowLeft /> Back to Story
        </BackLink>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink href={`/story/${storyId}`}>
        <FaArrowLeft /> Back to Story
      </BackLink>

      <PageTitle>Edit Story</PageTitle>

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
            <Label htmlFor="videoUrl">Story Video</Label>
            <UploadMedia
              mediaUrl={videoUrl}
              accept="video/*"
              maxSize={50}
              onUploadComplete={(url: string) => setVideoUrl(url)}
              label="Upload a video for your story"
            />
            <HelpText>Upload a video that represents your story</HelpText>
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

          <SubmitButton type="submit" disabled={saving}>
            {saving ? (
              "Saving..."
            ) : (
              <>
                <FaSave /> Save Changes
              </>
            )}
          </SubmitButton>
        </Form>
      </FormContainer>
    </Container>
  );
};

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Cormorant Garamond', serif;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #FFD700;
  margin-bottom: 1.5rem;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
`;

const FormContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.2);
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #FFD700;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #5A3E85;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: 'Cormorant Garamond', serif;
  background: rgba(255, 255, 255, 0.1);
  color: #C7BFD4;
  
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
  
  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #5A3E85;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: 'Cormorant Garamond', serif;
  resize: vertical;
  background: rgba(255, 255, 255, 0.1);
  color: #C7BFD4;
  
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
  
  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const HelpText = styled.small`
  color: #C7BFD4;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2A3A87, #481790);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid #FFD700;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    background: #481790;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
    color: #FFD700;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #C7BFD4;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin: 3rem 0;
  }
`;

const CrownIcon = styled.span`
  color: #FFD700;
  font-size: 1.5rem;
  margin-right: 0.75rem;
  animation: ${pulse} 2s infinite ease-in-out;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-right: 1rem;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #FC67FA;
  text-shadow: 0 0 10px rgba(252, 103, 250, 0.5);
  padding: 0.75rem;
  background: rgba(252, 103, 250, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(252, 103, 250, 0.3);
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3B4C99;
  text-decoration: none;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
    font-size: 1rem;
  }
  
  &:hover {
    color: #5A3E85;
    text-decoration: underline;
  }
`;

export default EditStoryPage;
