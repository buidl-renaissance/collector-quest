import React, { useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaUser, FaEnvelope, FaPhone, FaArrowRight } from "react-icons/fa";
import { BackButton, NextButton } from "./styled/character";
import { useRouter } from "next/router";
const Title = styled.h1`
  font-size: 2.5rem;
  font-family: "Cinzel Decorative", "Uncial Antiqua", serif;
  text-align: center;
  margin-bottom: 0;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.2rem;
  font-weight: normal;
  color: #bb8930;
  text-align: center;
  margin-top: 0;
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;


// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const PageWrapper = styled.div`
  background: linear-gradient(135deg, rgba(58, 38, 6, 0.9) 0%, rgba(108, 58, 20, 0.9) 50%, rgba(58, 38, 6, 0.9) 100%);
  color: #e6e6e6;
  position: relative;
  overflow: hidden;
  font-family: "EB Garamond", "Merriweather", serif;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/collector-quest-background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.25;
    z-index: 0;
  }
`;

const FormContainer = styled.div`
  /* background: rgba(58, 38, 6, 0.7); */
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(187, 137, 48, 0.3);
  animation: ${slideUp} 0.5s ease-out 0.4s both;
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  p {
    text-align: center;
    font-size: 0.9rem;
    color: #bb8930;
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
  font-size: 1.1rem;
  color: #bb8930;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  background: rgba(58, 38, 6, 0.4);
  border: 1px solid #bb8930;
  border-radius: 4px;
  padding: 0.75rem;
  color: #e6e6e6;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #e0a714;
    box-shadow: 0 0 0 2px rgba(224, 167, 20, 0.3);
    background: rgba(58, 38, 6, 0.6);
  }

  &::placeholder {
    color: rgba(224, 224, 224, 0.5);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #9f3515, #b6551c);
  color: #e6e6e6;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(182, 85, 28, 0.3);
  font-family: "Cinzel", serif;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(187, 137, 48, 0.5);
    background: linear-gradient(90deg, #b6551c, #9f3515);
  }

  &:disabled {
    background: rgba(108, 58, 20, 0.5);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  background-color: rgba(231, 76, 60, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(231, 76, 60, 0.3);
`;

const EnterButton = styled(NextButton)`
  margin: auto;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  /* background: rgba(46, 204, 113, 0.1); */
  /* border: 1px solid rgba(46, 204, 113, 0.3); */
  /* color: #2ecc71; */
  padding: 1.5rem;
  border-radius: 4px;
  text-align: center;
  /* margin-top: 1rem; */
  animation: ${fadeIn} 0.5s ease-out;
  font-size: 1.1rem;
`;

interface PreRegisterProps {
  onSuccess?: () => void;
}

const PreRegister: React.FC<PreRegisterProps> = ({ onSuccess }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
        6,
        10
      )}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Format phone number as user types
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", phone: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    // Validate phone number if provided
    if (formData.phone) {
      const phoneNumbers = formData.phone.replace(/\D/g, "");
      if (phoneNumbers.length !== 10) {
        newErrors.phone = "Phone number must be 10 digits";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Format phone number before sending to API
      const formattedData = {
        ...formData,
        phone: formData.phone ? formData.phone.replace(/\D/g, "") : null,
      };

      const response = await fetch("/api/pre-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to pre-register");
      }

      setIsSuccess(true);
      // Save email to localStorage
      localStorage.setItem('preRegisteredEmail', formData.email);
      // Reset form after successful submission
      setFormData({ name: "", email: "", phone: "" });
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors((prev) => ({
        ...prev,
        email:
          error instanceof Error ? error.message : "Failed to pre-register",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        {isSuccess ? (
          <SuccessMessage>
            Thank you for pre-registering! We&apos;ll notify you when we launch.
            <EnterButton onClick={() => router.push("/realm")}>ENTER THE REALM</EnterButton>
          </SuccessMessage>
        ) : (
          <Form onSubmit={handleSubmit}>
            <TitleContainer>
              <Subtitle>
                COMING SOON
              </Subtitle>
              <Title>COLLECTOR QUEST</Title>
              <p>
                Pre-Register to be one of the first to experience the COLLECTOR QUEST.
              </p>
            </TitleContainer>

            <FormGroup>
              <Label>
                <FaUser /> Full Name
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                <FaEnvelope /> Email Address
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                <FaPhone /> Phone Number (Optional)
              </Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(XXX) XXX-XXXX"
                maxLength={14}
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Pre-Register"}{" "}
              {!isSubmitting && <FaArrowRight />}
            </SubmitButton>
          </Form>
        )}
      </FormContainer>
    </PageWrapper>
  );
};

export default PreRegister;
