import React, { useState } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { FaCrown, FaArrowLeft, FaCalendar, FaEnvelope, FaUser } from "react-icons/fa";
import Head from "next/head";
import RsvpSlotPicker from "@/components/RsvpSlotPicker";
export async function getStaticProps() {
  return {
    props: {
      metadata: {
        title: "RSVP | Lord Smearington&apos;s Absurd Gallery",
        description: "Reserve your spot at Lord Smearington&apos;s Absurd Gallery event",
        url: "https://lordsmearington.com/rsvp",
      },
    },
  };
}

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: 1,
    message: "",
  });
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) || 0 : value,
    }));
  };

  const handleTimeSlotChange = (slot: TimeSlot) => {
    setTimeSlot(slot);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError("There was an error submitting your RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Head>
        <title>RSVP | Lord Smearington&apos;s Absurd Gallery</title>
        <meta name="description" content="Reserve your spot at Lord Smearington&apos;s Absurd Gallery event" />
      </Head>

      <PageBackground />
      
      {/* Floating elements */}
      {[...Array(10)].map((_, i) => (
        <FloatingElement
          key={i}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          animationDuration={`${Math.random() * 5 + 3}s`}
        >
          <FloatingIcon>
            <FaCrown />
          </FloatingIcon>
        </FloatingElement>
      ))}

      <ContentContainer>
        <BackLink href="/">
          <FaArrowLeft /> Back to Home
        </BackLink>

        <FormContainer>
          <FormHeader>
            <CrownIcon>
              <FaCrown />
            </CrownIcon>
            <FormTitle>RSVP to Lord Smearington&apos;s Absurd Gallery</FormTitle>
            <FormSubtitle>
              Reserve your spot for this extraordinary interdimensional experience
            </FormSubtitle>
          </FormHeader>

          {isSubmitted ? (
            <SuccessMessage>
              <SuccessIcon>
                <FaCalendar />
              </SuccessIcon>
              <SuccessTitle>Your RSVP has been confirmed!</SuccessTitle>
              <SuccessText>
                Thank you for your interest in Lord Smearington&apos;s Absurd Gallery. We look forward to welcoming you to our interdimensional art experience.
              </SuccessText>
              <ReturnButton href="/">
                Return to Homepage
              </ReturnButton>
            </SuccessMessage>
          ) : (
            <RSVPForm onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>
                  <FormIcon>
                    <FaUser />
                  </FormIcon>
                  Your Name
                </FormLabel>
                <FormInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <FormIcon>
                    <FaEnvelope />
                  </FormIcon>
                  Email Address
                </FormLabel>
                <FormInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </FormGroup>

              <MayTimeSlotPicker onChange={handleTimeSlotChange} />

              <FormGroup>
                <FormLabel>
                  <FormIcon>
                    <FaUser />
                  </FormIcon>
                  Number of Guests
                </FormLabel>
                <FormSelect
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Additional Message (Optional)</FormLabel>
                <FormTextarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any special requests or questions?"
                  rows={4}
                />
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Confirm RSVP"}
              </SubmitButton>
            </RSVPForm>
          )}
        </FormContainer>
      </ContentContainer>
    </PageContainer>
  );
}

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  font-family: "Cormorant Garamond", serif;
  color: white;
  overflow: hidden;
`;

const PageBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  z-index: -1;
  
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/images/stars.png");
    opacity: 0.3;
  }
`;

const FloatingElement = styled.div<{ top: string; left: string; animationDuration: string }>`
  position: absolute;
  z-index: 0;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  animation: ${float} ${(props) => props.animationDuration} infinite ease-in-out;
  opacity: 0.3;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FloatingIcon = styled.div`
  color: #ffd700;
  font-size: 2rem;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #c7bfd4;
  text-decoration: none;
  margin-bottom: 2rem;
  font-family: "Cinzel Decorative", serif;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ffd700;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const FormContainer = styled.div`
  background: rgba(59, 76, 153, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 3px solid #ffd700;
  padding: 2.5rem;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const CrownIcon = styled.div`
  color: #ffd700;
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
  display: inline-block;
`;

const FormTitle = styled.h1`
  font-family: "Cinzel Decorative", serif;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  background: linear-gradient(90deg, #f4c4f3, #fc67fa, #f4c4f3);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 6s linear infinite;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FormSubtitle = styled.h2`
  font-size: 1.25rem;
  font-style: italic;
  color: #c7bfd4;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const RSVPForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-family: "Cinzel Decorative", serif;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormIcon = styled.span`
  color: #ffd700;
`;

const FormInput = styled.input`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 2px solid #ffd700;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.5);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const FormSelect = styled.select`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 2px solid #ffd700;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.5);
  }
  
  option {
    background: #3b4c99;
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 2px solid #ffd700;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.5);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid #ffd700;
  background: #5a3e85;
  color: white;
  font-family: "Cinzel Decorative", serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background: #3b4c99;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  animation: ${pulse} 2s ease-in-out;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  color: #ffd700;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
`;

const SuccessTitle = styled.h2`
  font-family: "Cinzel Decorative", serif;
  font-size: 1.75rem;
  color: #ffd700;
`;

const SuccessText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #c7bfd4;
  margin-bottom: 1rem;
`;

const ReturnButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: 2px solid #ffd700;
  background: #5a3e85;
  color: white;
  text-decoration: none;
  font-family: "Cinzel Decorative", serif;
  transition: all 0.3s ease;
  
  &:hover {
    background: #3b4c99;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

// Define the time slots for May 17th
const MayTimeSlots = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const TimeSlot = styled.div<{ selected: boolean }>`
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid ${props => props.selected ? '#ffd700' : 'rgba(255, 255, 255, 0.3)'};
  background: ${props => props.selected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(59, 76, 153, 0.5)'};
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ffd700;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const TimeSlotDate = styled.div`
  font-family: "Cinzel Decorative", serif;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const TimeSlotHours = styled.div`
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
`;

interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

const MayTimeSlotPicker: React.FC<{ onChange: (slot: TimeSlot) => void }> = ({ onChange }) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  
  const timeSlots = [
    { id: 1, date: "May 17th", startTime: "2:00 PM", endTime: "4:00 PM" },
    { id: 2, date: "May 17th", startTime: "4:00 PM", endTime: "6:00 PM" },
    { id: 3, date: "May 17th", startTime: "6:00 PM", endTime: "8:00 PM" }
  ];
  
  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId === selectedSlot ? null : slotId);
  };
  
  return (
    <FormGroup>
      <FormLabel>
        <FormIcon>
          <FaCalendar />
        </FormIcon>
        Select a Time Slot
        </FormLabel>
      <MayTimeSlots>
        <TimeSlotDate>May 17th</TimeSlotDate>
        {timeSlots.map(slot => (
          <TimeSlot 
            key={slot.id} 
            selected={selectedSlot === slot.id}
            onClick={() => handleSlotSelect(slot.id)}
          >
            <TimeSlotHours>{slot.startTime} - {slot.endTime}</TimeSlotHours>
          </TimeSlot>
        ))}
      </MayTimeSlots>
    </FormGroup>
  );
};
