import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { getArtifact } from '@/db/artifacts';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #f0e6ff;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #f0e6ff;
  text-align: center;
`;

const Section = styled.div`
  background: rgba(30, 20, 50, 0.7);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #4a3b6b;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #d4b4ff;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #c7bfd4;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  background: rgba(20, 10, 30, 0.6);
  border: 1px solid #4a3b6b;
  color: #f0e6ff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #8a6bce;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Checkbox = styled.input`
  margin-right: 0.75rem;
  cursor: pointer;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.primary ? '#6a3ce2' : 'rgba(30, 20, 50, 0.7)'};
  color: #f0e6ff;
  border: 1px solid ${props => props.primary ? '#8a6bce' : '#4a3b6b'};
  
  &:hover {
    background: ${props => props.primary ? '#7d52e3' : 'rgba(40, 30, 60, 0.7)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const OptionalText = styled.span`
  color: #8a7b9c;
  font-size: 0.875rem;
`;

const ArtifactPreview = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const ArtifactImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #4a3b6b;
`;

const ArtifactTitle = styled.h3`
  font-size: 1.25rem;
  color: #d4b4ff;
  margin-bottom: 0.5rem;
`;

interface ArtifactClaimProps {
  artifact: any;
}

const ArtifactClaimPage = ({ artifact }: ArtifactClaimProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    artistName: '',
    contactInfo: '',
    termsAgreed: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!artifact) {
      router.push('/artifacts');
    }
  }, [artifact, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateFormData = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.artistName.trim())
      newErrors.artistName = "Artist name is required";
    if (!formData.termsAgreed)
      newErrors.termsAgreed = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/artifacts/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artifactId: artifact.id,
          artistName: formData.artistName,
          contactInfo: formData.contactInfo,
          termsAgreed: formData.termsAgreed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to claim artifact");
      }

      const data = await response.json();
      router.push(`/artifacts/${data.id}`);
    } catch (error) {
      console.error("Error claiming artifact:", error);
      setErrors({
        ...errors,
        submit: "Failed to claim artifact. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!artifact) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Title>Claim Artifact</Title>
      
      <ArtifactPreview>
        {artifact.imageUrl && (
          <ArtifactImage src={artifact.imageUrl} alt={artifact.title} />
        )}
        <ArtifactTitle>{artifact.title}</ArtifactTitle>
      </ArtifactPreview>
      
      <Section>
        <SectionTitle>Claim Your Artifact</SectionTitle>
        <p style={{ color: '#c7bfd4', marginBottom: '2rem' }}>
          Please provide your details to claim ownership of this artifact. By claiming, you confirm this is your original creation and approve its use in Collector Quest.
        </p>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="artistName">Name</Label>
            <Input
              type="text"
              id="artistName"
              name="artistName"
              value={formData.artistName}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
            {errors.artistName && (
              <ErrorMessage>{errors.artistName}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="contactInfo">
              Email or Contact <OptionalText>(optional)</OptionalText>
            </Label>
            <Input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              placeholder="Enter your contact information"
            />
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="termsAgreed"
              name="termsAgreed"
              checked={formData.termsAgreed}
              onChange={handleCheckboxChange}
            />
            <Label
              htmlFor="termsAgreed"
              style={{ display: "inline", marginBottom: 0 }}
            >
              I confirm this is my original creation and approve its use in
              Collector Quest.
            </Label>
          </CheckboxContainer>
          {errors.termsAgreed && (
            <ErrorMessage>{errors.termsAgreed}</ErrorMessage>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2rem",
            }}
          >
            <Button type="button" onClick={() => router.push(`/artifacts/${artifact.id}`)}>
              Back to Artifact
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              primary
            >
              {isSubmitting ? "Claiming..." : "Claim Artifact"}
            </Button>
          </div>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
        </form>
      </Section>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { artifact } = context.query;
  
  const artifactData = await getArtifact(artifact as string);

  return {
    props: {
      artifact: artifactData || null,
    },
  };
};

export default ArtifactClaimPage;
