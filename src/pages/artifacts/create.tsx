import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import Image from "next/image";
import { FormGroup, Label, Input, TextArea } from "@/components/styled/forms";

import { ErrorMessage } from "@/components/styled/typography";
import { UploadMedia } from "@/components/UploadMedia";
import { NextButton } from "@/components/styled/buttons";
import BottomNavigation from "@/components/BottomNavigation";
import { Artifact } from "@/data/artifacts";

// Additional styled components specific to this page
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #2d2d44;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
`;

const Title = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #c7bfd4;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
`;

const SectionTitle = styled.h2`
  font-family: "Cinzel", serif;
  color: #c7bfd4;
  margin-bottom: 1.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #3a3347;
  border-radius: 0.25rem;
  background-color: #1a1a2e;
  color: #c7bfd4;
  font-size: 1rem;
  margin-top: 0.5rem;
  font-family: "Cormorant Garamond", serif;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.primary ? "#6c5ce7" : "#a29bfe")};
  color: #c7bfd4;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s, transform 0.2s;
  font-family: "Cinzel", serif;

  &:hover {
    background-color: ${(props) => (props.primary ? "#bb8930" : "#3a3347")};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #3a3347;
    cursor: not-allowed;
    transform: none;
  }
`;

const OptionalText = styled.span`
  font-size: 0.8rem;
  color: #a29bfe;
  font-weight: normal;
  margin-left: 0.5rem;
  font-family: "Cormorant Garamond", serif;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-family: "Cormorant Garamond", serif;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StepDot = styled.div<{ active: boolean; completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 8px;
  background-color: ${(props) =>
    props.completed ? "#bb8930" : props.active ? "#6c5ce7" : "#3a3347"};
  transition: background-color 0.3s;
`;

const StepLabel = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  color: #c7bfd4;
  font-family: "Cinzel", serif;
`;

const ArtifactPropertiesContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #1a1a2e;
  border-radius: 0.5rem;
  border: 1px solid #3a3347;
`;

const PropertyBadge = styled.div`
  display: inline-block;
  background-color: #2d2d44;
  color: #bb8930;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #bb8930;
  font-family: "Cormorant Garamond", serif;
`;

const ArtifactPreview = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #1a1a2e;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
`;

const InfoSection = styled.div`
  background-color: #1a1a2e;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #3a3347;
`;

const InfoTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel", serif;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const InfoText = styled.p`
  color: #c7bfd4;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PropertyCard = styled.div`
  background-color: #1a1a2e;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #3a3347;
  text-align: center;
`;

const PropertyValue = styled.div`
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
  margin-top: 0.5rem;
`;

const PropertyLabel = styled.div`
  color: #c7bfd4;
  font-family: "Cormorant Garamond", serif;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const StorySection = styled.div`
  background-color: #1a1a2e;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #3a3347;
  margin-bottom: 2rem;
`;

const AbilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const AbilityCard = styled.div`
  background-color: #1a1a2e;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #3a3347;
`;

const AbilityTitle = styled.h4`
  color: #bb8930;
  font-family: "Cinzel", serif;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const CreateArtifactPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    artistName: "",
    contactInfo: "",
    artworkTitle: "",
    medium: "",
    yearCreated: "",
    description: "",
    termsAgreed: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedArtifact, setGeneratedArtifact] = useState<Artifact | null>(null);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
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

  const handleImageUpload = (url: string) => {
    setImagePreview(url);
    setErrors({ ...errors, image: "" });
  };

  const validateImageUpload = () => {
    if (!imagePreview) {
      setErrors({ ...errors, image: "Artwork image is required" });
      return false;
    }
    if (!formData.medium) {
      setErrors({ ...errors, medium: "Medium is required" });
      return false;
    }
    if (!formData.yearCreated.trim()) {
      setErrors({ ...errors, yearCreated: "Year created is required" });
      return false;
    }
    return true;
  };

  const validateFormData = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.artistName.trim())
      newErrors.artistName = "Artist name is required";
    if (!formData.artworkTitle.trim())
      newErrors.artworkTitle = "Artwork title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.termsAgreed)
      newErrors.termsAgreed = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const analyzeArtwork = async () => {
    setIsAnalyzing(true);

    try {
      // Call API to analyze artwork and get suggested details
      const response = await fetch("/api/artifacts/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imagePreview,
          medium: formData.medium,
          yearCreated: formData.yearCreated,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze artwork");
      }

      const data = await response.json();
      setGeneratedArtifact(data);

      // Pre-fill the form with analyzed data
      setFormData((prev) => ({
        ...prev,
        artistName: data.artistName || prev.artistName,
        artworkTitle: data.artworkTitle || prev.artworkTitle,
        medium: data.medium || prev.medium,
        yearCreated: data.yearCreated || prev.yearCreated,
        description: data.description || prev.description,
      }));
    } catch (error) {
      console.error("Error analyzing artwork:", error);
      setErrors({
        ...errors,
        analyze: "Failed to analyze artwork. Please enter details manually.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateArtifactProperties = async () => {
    setIsSubmitting(true);

    try {
      // Call API to generate artifact properties
      const response = await fetch("/api/artifacts/generate-properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.artworkTitle,
          medium: formData.medium,
          description: formData.description,
          image: imagePreview,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate artifact properties");
      }

      const data = await response.json();
      setGeneratedArtifact(data);
    } catch (error) {
      console.error("Error generating properties:", error);
      setErrors({
        ...errors,
        generate: "Failed to generate artifact properties. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateImageUpload()) {
        analyzeArtwork();
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateFormData()) {
        generateArtifactProperties();
        setCurrentStep(4);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!generatedArtifact) {
      setErrors({
        ...errors,
        submit: "Artifact properties must be generated first",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/artifacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artistName: formData.artistName,
          contactInfo: formData.contactInfo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit artifact");
      }

      const data = await response.json();
      router.push(`/artifacts/${data.id}`);
    } catch (error) {
      console.error("Error submitting artifact:", error);
      setErrors({
        ...errors,
        submit: "Failed to submit artifact. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Section>
            <SectionTitle>Upload Your Artwork</SectionTitle>
            <p>First, upload an image of your artwork and provide basic details to transform it into a magical artifact.</p>
            
            <FormGroup>
              <Label htmlFor="medium">Medium</Label>
              <Select 
                id="medium" 
                name="medium" 
                value={formData.medium}
                onChange={handleInputChange}
              >
                <option value="">Select Medium</option>
                <option value="Acrylic">Acrylic</option>
                <option value="Digital">Digital</option>
                <option value="Mixed Media">Mixed Media</option>
                <option value="Sculpture">Sculpture</option>
                <option value="Oil">Oil</option>
                <option value="Watercolor">Watercolor</option>
                <option value="Photography">Photography</option>
                <option value="Other">Other</option>
              </Select>
              {errors.medium && <ErrorMessage>{errors.medium}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="yearCreated">Year Created</Label>
              <Select 
                id="yearCreated" 
                name="yearCreated" 
                value={formData.yearCreated}
                onChange={handleInputChange}
              >
                <option value="">Select Year</option>
                {yearOptions.map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </Select>
              {errors.yearCreated && <ErrorMessage>{errors.yearCreated}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Artwork Image Upload</Label>
              <p>Required format: .jpg, .png, .gif (Max 10MB)</p>
              
              <UploadMedia
                onUploadComplete={handleImageUpload}
                accept=".jpg,.jpeg,.png,.gif"
                maxSize={10 * 1024 * 1024}
                label={imagePreview ? 'Change Image' : 'Select Image'}
              />
              {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
            </FormGroup>
            
            <Button type="button" onClick={handleNextStep} primary>
              Continue to Artifact Properties
            </Button>
          </Section>
        );
      case 2:
        return (
          <Section>
            <SectionTitle>Artifact Properties</SectionTitle>
            
            {isAnalyzing ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Analyzing your artwork and generating magical properties...</p>
                {/* Could add a loading spinner here */}
              </div>
            ) : generatedArtifact ? (
              <>
                <ArtifactPreview>
                  <Image
                    src={imagePreview || ''}
                    alt={generatedArtifact.title}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </ArtifactPreview>

                <InfoGrid>
                  <InfoSection>
                    <InfoTitle>Artwork Details</InfoTitle>
                    <InfoText>{generatedArtifact.title}</InfoText>
                    <InfoText style={{ marginTop: '0.5rem', color: '#a29bfe' }}>
                      {generatedArtifact.medium} • {generatedArtifact.year}
                    </InfoText>
                  </InfoSection>
                  
                  <InfoSection>
                    <InfoTitle>Description</InfoTitle>
                    <InfoText style={{ fontStyle: 'italic' }}>
                      {generatedArtifact.description}
                    </InfoText>
                  </InfoSection>
                </InfoGrid>

                <InfoTitle style={{ marginBottom: '1rem' }}>Magical Properties</InfoTitle>
                <PropertyGrid>
                  <PropertyCard>
                    <PropertyLabel>Class</PropertyLabel>
                    <PropertyValue>{generatedArtifact.properties.class}</PropertyValue>
                  </PropertyCard>
                  <PropertyCard>
                    <PropertyLabel>Effect</PropertyLabel>
                    <PropertyValue>{generatedArtifact.properties.effect}</PropertyValue>
                  </PropertyCard>
                  <PropertyCard>
                    <PropertyLabel>Element</PropertyLabel>
                    <PropertyValue>{generatedArtifact.properties.element}</PropertyValue>
                  </PropertyCard>
                  <PropertyCard>
                    <PropertyLabel>Rarity</PropertyLabel>
                    <PropertyValue>{generatedArtifact.properties.rarity}</PropertyValue>
                  </PropertyCard>
                </PropertyGrid>

                <StorySection>
                  <InfoTitle>Artifact Story</InfoTitle>
                  <InfoText style={{ fontStyle: 'italic' }}>
                    {generatedArtifact.story}
                  </InfoText>
                </StorySection>

                <AbilityGrid>
                  <AbilityCard>
                    <AbilityTitle>Passive Bonus</AbilityTitle>
                    <InfoText>{generatedArtifact.properties.passiveBonus}</InfoText>
                  </AbilityCard>
                  <AbilityCard>
                    <AbilityTitle>Active Use</AbilityTitle>
                    <InfoText>{generatedArtifact.properties.activeUse}</InfoText>
                  </AbilityCard>
                  <AbilityCard>
                    <AbilityTitle>Unlock Condition</AbilityTitle>
                    <InfoText>{generatedArtifact.properties.unlockCondition}</InfoText>
                  </AbilityCard>
                  <AbilityCard>
                    <AbilityTitle>Reflection Trigger</AbilityTitle>
                    <InfoText>{generatedArtifact.properties.reflectionTrigger}</InfoText>
                  </AbilityCard>
                </AbilityGrid>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <NextButton type="button" onClick={handleNextStep}>
                    Claim Your Artifact
                  </NextButton>
                </div>
              </>
            ) : (
              <>
                <p>Failed to analyze artwork.</p>
                {errors.analyze && <ErrorMessage>{errors.analyze}</ErrorMessage>}
              </>
            )}
          </Section>
        );

      case 3:
        return (
          <Section>
            {/* <SectionTitle>Claim Your Artifact</SectionTitle> */}

            <FormGroup>
              <Label htmlFor="artistName">Name</Label>
              <Input
                type="text"
                id="artistName"
                name="artistName"
                value={formData.artistName}
                onChange={handleInputChange}
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
                marginTop: "1rem",
              }}
            >
              <Button type="button" onClick={handlePrevStep}>
                Back to Properties
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                primary
                onClick={handleSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit Artifact"}
              </Button>
            </div>

            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Title>Create an Artifact</Title>

      <StepIndicator>
        <StepDot active={currentStep === 1} completed={currentStep > 1} />
        <StepDot active={currentStep === 2} completed={currentStep > 2} />
        <StepDot active={currentStep === 3} completed={currentStep > 3} />
      </StepIndicator>

      <StepLabel>
        {currentStep === 1
          ? "Step 1: Upload & Basic Details"
          : currentStep === 2
          ? "Step 2: Artifact Properties"
          : "Step 3: Claim Artifact"}
      </StepLabel>

      <form onSubmit={handleSubmit}>{renderStepContent()}</form>
    </PageContainer>
  );
};

export default CreateArtifactPage;
