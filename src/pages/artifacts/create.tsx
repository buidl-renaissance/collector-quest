import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { FormGroup, Label, CheckboxContainer, Checkbox, CheckboxLabel } from "@/components/styled/forms";
import { ErrorMessage } from "@/components/styled/typography";
import { UploadMedia } from "@/components/UploadMedia";
import { useCharacter } from "@/hooks/useCharacter";
import { useArtifactRegistration } from "@/hooks/web3/useArtifactRegistration";
import LoadingBasic from "@/components/LoadingBasic";


const CreateArtifactPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    artistName: "",
    contactInfo: "",
    artworkTitle: "",
    medium: "",
    yearCreated: "",
    description: "",
    termsAgreed: false,
    isOriginalCreator: true,
    hasArtistConsent: false,
  });

  const { character } = useCharacter();
  const { registerArtifact } = useArtifactRegistration();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateImageUpload()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/artifacts/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artistName: character?.name || "Unknown",
          owner: character?.id || null,
          medium: formData.medium,
          yearCreated: formData.yearCreated,
          imageUrl: imagePreview,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create artifact");
      }

      const data = await response.json();

      await registerArtifact(data);

      router.push(`/artifacts/${data.id}`);
    } catch (error) {
      console.error("Error creating artifact:", error);
      setErrors({
        ...errors,
        submit: "Failed to create artifact. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      imagePreview !== null &&
      formData.medium !== "" &&
      formData.yearCreated !== "" &&
      formData.termsAgreed &&
      (formData.isOriginalCreator || formData.hasArtistConsent) &&
      !isSubmitting
    );
  };

  return (
    <PageContainer>
      <Title>Create an Artifact</Title>
      <Section>
        <SectionTitle>Upload Your Artwork</SectionTitle>
        <SectionDescription>
          Upload an image of your artwork and provide basic details to transform
          it into a magical artifact.
        </SectionDescription>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="medium">Medium <span style={{ color: '#bb8930' }}>*</span></Label>
            <Select
              id="medium"
              name="medium"
              value={formData.medium}
              onChange={handleInputChange}
              required
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
            <Label htmlFor="yearCreated">Year Created <span style={{ color: '#bb8930' }}>*</span></Label>
            <Select
              id="yearCreated"
              name="yearCreated"
              value={formData.yearCreated}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Year</option>
              <option value="Unknown">Unknown</option>
              {yearOptions.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </Select>
            {errors.yearCreated && (
              <ErrorMessage>{errors.yearCreated}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Artwork Image Upload <span style={{ color: '#bb8930' }}>*</span></Label>
            <p>Required format: .jpg, .png, .gif (Max 10MB)</p>

            <UploadMedia
              onUploadComplete={handleImageUpload}
              accept=".jpg,.jpeg,.png,.gif"
              maxSize={10 * 1024 * 1024}
              label={imagePreview ? "Change Image" : "Select Image"}
            />
            {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
          </FormGroup>

          <OwnershipContainer>
            <OwnershipTitle>Artwork Ownership</OwnershipTitle>
            <CheckboxContainer>
              <Checkbox
                type="radio"
                id="isOriginalCreator"
                name="ownershipType"
                checked={formData.isOriginalCreator}
                onChange={() => setFormData(prev => ({ ...prev, isOriginalCreator: true, hasArtistConsent: false }))}
              />
              <CheckboxLabel htmlFor="isOriginalCreator">
                I am the original creator of this artwork
              </CheckboxLabel>
            </CheckboxContainer>
            <CheckboxContainer>
              <Checkbox
                type="radio"
                id="hasArtistConsent"
                name="ownershipType"
                checked={!formData.isOriginalCreator}
                onChange={() => setFormData(prev => ({ ...prev, isOriginalCreator: false, hasArtistConsent: false }))}
              />
              <CheckboxLabel htmlFor="hasArtistConsent">
                I own this artwork but am not the original creator
              </CheckboxLabel>
            </CheckboxContainer>
            
            {!formData.isOriginalCreator && (
              <ConsentContainer>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    id="artistConsent"
                    name="hasArtistConsent"
                    checked={formData.hasArtistConsent}
                    onChange={handleCheckboxChange}
                    required={!formData.isOriginalCreator}
                  />
                  <CheckboxLabel htmlFor="artistConsent">
                    I have received express written consent from the original artist to include their artwork as an asset in COLLECTOR QUEST
                  </CheckboxLabel>
                </CheckboxContainer>
              </ConsentContainer>
            )}
          </OwnershipContainer>

          <TermsContainer>
            <TermsText>
              By submitting your artwork, you acknowledge that:
            </TermsText>
            <TermsList>
              <li>You are the original creator of the artwork OR you own the artwork and have express written consent from the artist</li>
              <li>You grant COLLECTOR QUEST the rights to use your artwork and any generated content in the game</li>
              <li>The artwork and generated content may be used for gameplay, marketing, and promotional purposes</li>
              <li>You retain ownership of your original artwork</li>
            </TermsList>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="termsAgreed"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleCheckboxChange}
                required
              />
              <CheckboxLabel htmlFor="termsAgreed">
                I acknowledge and agree to these terms
              </CheckboxLabel>
            </CheckboxContainer>
            {errors.termsAgreed && <ErrorMessage>{errors.termsAgreed}</ErrorMessage>}
          </TermsContainer>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
        </form>
      </Section>

      <BottomNav>
        <ActionButton 
          type="submit" 
          disabled={!isFormValid()} 
          primary
          style={{ 
            opacity: isFormValid() ? 1 : 0.6,
            cursor: isFormValid() ? 'pointer' : 'not-allowed'
          }}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Creating..." : "Create Artifact"}
        </ActionButton>
      </BottomNav>

      {isSubmitting && (<LoadingBasic />)}
    </PageContainer>
  );
};

export default CreateArtifactPage;

// Additional styled components specific to this page
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  font-family: "Cormorant Garamond", serif;
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1rem;
  margin: 1rem;
  background-color: #2d2d44;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
  
  @media (min-width: 640px) {
    padding: 1.5rem;
    margin-bottom: 120px;
  }
`;

const Title = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #bb8930;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2.5rem;
  
  @media (min-width: 640px) {
    margin-bottom: 2rem;
    font-size: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-family: "Cinzel", serif;
  color: #bb8930;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  
  @media (min-width: 640px) {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
`;

const SectionDescription = styled.p`
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  margin-bottom: 1rem;
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
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23c7bfd4%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

const Button = styled.button<{ primary?: boolean }>`
  width: 100%;
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

  @media (min-width: 480px) {
    width: auto;
  }

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

// Add new styled component for bottom nav
const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(30, 20, 50, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid #4a3b6b;
  padding: 1rem;
  display: flex;
  justify-content: center;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const ActionButton = styled(Button)`
  width: 100%;
  max-width: 300px;
  margin: 0;
  font-size: 1.1rem;
  padding: 1rem 2rem;
  background-color: #bb8930;
`;

const OwnershipContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(30, 20, 50, 0.5);
  border: 1px solid #4a3b6b;
  border-radius: 6px;
`;

const OwnershipTitle = styled.h3`
  color: #bb8930;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-family: "Cinzel", serif;
`;

const ConsentContainer = styled.div`
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(187, 137, 48, 0.1);
  border: 1px solid #bb8930;
  border-radius: 4px;
`;

const TermsContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(30, 20, 50, 0.5);
  border: 1px solid #4a3b6b;
  border-radius: 6px;
`;

const TermsText = styled.p`
  color: #c7bfd4;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-family: "Cormorant Garamond", serif;
`;

const TermsList = styled.ul`
  color: #c7bfd4;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  font-family: "Cormorant Garamond", serif;
  list-style-type: disc;

  li {
    margin-bottom: 0.5rem;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;