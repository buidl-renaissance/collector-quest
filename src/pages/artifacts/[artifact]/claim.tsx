import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import { getArtifact } from '@/db/artifacts';
import Image from 'next/image';
import Link from 'next/link';
import { NextButton, Title as CharacterTitle } from '@/components/styled/character';
import { FormGroup, Label, Input, CheckboxContainer, Checkbox } from '@/components/styled/forms';
import PhoneInput from '@/components/PhoneInput';
import RelicModal from '@/components/RelicUnlockModal';

interface ArtifactClaimProps {
  artifact: any;
}

const ArtifactClaimPage = ({ artifact }: ArtifactClaimProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    phone: '',
    termsAgreed: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRelicModal, setShowRelicModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRelicUrl, setGeneratedRelicUrl] = useState<string | null>(null);

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

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
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

  const closeModal = () => {
    setShowRelicModal(false);
    router.push(`/artifacts/${artifact.id}`);
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
          email: formData.email,
          phone: formData.phone,
          termsAgreed: formData.termsAgreed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to claim artifact");
      }

      const data = await response.json();
      
      // Show relic modal instead of redirecting immediately
      setIsGenerating(true);
      setShowRelicModal(true);
      
      // Simulate relic generation (replace with actual API call if needed)
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratedRelicUrl(artifact.relic.imageUrl); // Use artifact image as placeholder
      }, 5000);
      
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
      <Link href={`/artifacts/${artifact.id}`}>
        <BackButton>← Back to Artifact</BackButton>
      </Link>
      
      <Title>CLAIM ARTIFACT</Title>
      
      <ArtifactPreview>
        {artifact.imageUrl && (
          <ArtifactImageContainer>
            <Image 
              src={artifact.imageUrl} 
              alt={artifact.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </ArtifactImageContainer>
        )}
        <ArtifactTitle>{artifact.title}</ArtifactTitle>
      </ArtifactPreview>
      
      <Section>
        {/* <SectionTitle>Claim Your Artifact</SectionTitle> */}
        <p style={{ color: '#c7bfd4', marginBottom: '2rem', fontFamily: '"Cormorant Garamond", serif' }}>
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
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your contact information"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">
              Phone <OptionalText>(optional)</OptionalText>
            </Label>
            <PhoneInput
              value={formData.phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              placeholder="(XXX) XXX-XXXX"
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
            <ClaimButton
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Claiming..." : "Claim Artifact"}
            </ClaimButton>
          </div>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
        </form>
      </Section>
      
      {showRelicModal && (
        <RelicModal 
          isOpen={showRelicModal}
          onClose={closeModal}
          isGenerating={isGenerating}
          relic={artifact.relic}
        />
      )}
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

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  color: #f0e6ff;
`;

const Title = styled(CharacterTitle)`
  margin: 2rem 0;
`;

const Section = styled.div`
  background: rgba(30, 20, 50, 0.7);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #4a3b6b;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-family: "Cormorant Garamond", serif;
`;

const OptionalText = styled.span`
  color: #8a7b9c;
  font-size: 0.875rem;
  font-family: "Cormorant Garamond", serif;
`;

const ArtifactPreview = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const ArtifactImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 300px;
  margin: 0 auto 1rem auto;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #4a3b6b;
`;

const ArtifactTitle = styled.h3`
  font-size: 1.5rem;
  color: #d4b4ff;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
`;

const ClaimButton = styled(NextButton)`
  background: #bb8930;
  color: #1a1a2e;
  border: none;
  font-family: "Cormorant Garamond", serif;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  width: 100%;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #c7bfd4;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  font-family: "Cinzel", serif;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    color: #d4b4ff;
  }
`;
