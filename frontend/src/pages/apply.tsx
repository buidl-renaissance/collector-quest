import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaArrowRight, FaDiscord, FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ApplyPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
    portfolio: '',
    discord: '',
    github: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }, 1500);
  };

  return (
    <Container>
      <PageBackground />
      
      {/* Floating elements for visual interest */}
      {[...Array(8)].map((_, i) => (
        <FloatingElement
          key={i}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          size={`${Math.random() * 50 + 20}px`}
          animationDuration={`${Math.random() * 10 + 5}s`}
        />
      ))}
      
      <Header>
        <HeaderTitle>Join Lord Smearington&apos;s Fellowship of Builders</HeaderTitle>
        <HeaderSubtitle>
          Apply now to help construct the most absurd blockchain realm in existence
        </HeaderSubtitle>
      </Header>
      
      <ContentWrapper>
        <InfoSection>
          <InfoTitle>We Seek Brave Builders</InfoTitle>
          <RoleList>
            <RoleItem>
              <RoleName>Game Developers</RoleName>
              <RoleDesc>React, TypeScript, and blockchain integration wizards</RoleDesc>
            </RoleItem>
            <RoleItem>
              <RoleName>Smart Contract Engineers</RoleName>
              <RoleDesc>Solidity or Move masters to craft on-chain logic</RoleDesc>
            </RoleItem>
            <RoleItem>
              <RoleName>Game Designers</RoleName>
              <RoleDesc>Creative minds to reimagine DnD for the blockchain</RoleDesc>
            </RoleItem>
            <RoleItem>
              <RoleName>Digital Artists</RoleName>
              <RoleDesc>Visionaries to create captivating visuals and NFTs</RoleDesc>
            </RoleItem>
          </RoleList>
          
          <InfoBox>
            <InfoBoxTitle>Why Join Our Quest?</InfoBoxTitle>
            <InfoBoxContent>
              <BenefitItem>🌟 Work on cutting-edge blockchain gaming</BenefitItem>
              <BenefitItem>🏆 Build your portfolio with innovative projects</BenefitItem>
              <BenefitItem>🧙‍♂️ Collaborate with talented creators</BenefitItem>
              <BenefitItem>💰 Potential revenue sharing from NFT sales</BenefitItem>
            </InfoBoxContent>
          </InfoBox>
          
          <DiscordBanner>
            <DiscordIcon><FaDiscord /></DiscordIcon>
            <DiscordContent>
              <DiscordText>Join our Discord community</DiscordText>
              <DiscordLink href="https://discord.gg/kSuS9kdgTk" target="_blank">
                Connect Now <FaArrowRight style={{ marginLeft: '8px' }} />
              </DiscordLink>
            </DiscordContent>
          </DiscordBanner>

          <GithubBanner>
            <GithubIcon><FaGithub /></GithubIcon>
            <GithubContent>
              <GithubText>Check out our GitHub repository</GithubText>
              <GithubLink href="https://github.com/buidl-renaissance" target="_blank">
                View Projects <FaArrowRight style={{ marginLeft: '8px' }} />
              </GithubLink>
            </GithubContent>
          </GithubBanner>
        </InfoSection>
        
        <FormSection>
          {submitSuccess ? (
            <SuccessMessage>
              <SuccessIcon>🎉</SuccessIcon>
              <SuccessTitle>Application Submitted!</SuccessTitle>
              <SuccessText>
                Thank you for applying to join Lord Smearington&apos;s fellowship of builders.
                We&apos;ll review your application and contact you soon.
              </SuccessText>
              <RedirectText>Redirecting you to the homepage...</RedirectText>
            </SuccessMessage>
          ) : (
            <ApplicationForm onSubmit={handleSubmit}>
              <FormTitle>Builder Application</FormTitle>
              
              <FormGroup>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="role">Desired Role</FormLabel>
                <FormSelect
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a role</option>
                  <option value="game-developer">Game Developer</option>
                  <option value="smart-contract">Smart Contract Engineer</option>
                  <option value="game-designer">Game Designer</option>
                  <option value="digital-artist">Digital Artist</option>
                  <option value="other">Other</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="experience">Years of Experience</FormLabel>
                <FormInput
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="portfolio">Portfolio/Website URL</FormLabel>
                <FormInput
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://"
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup style={{ flex: 1 }}>
                  <FormLabel htmlFor="discord">Discord Username</FormLabel>
                  <FormInput
                    type="text"
                    id="discord"
                    name="discord"
                    value={formData.discord}
                    onChange={handleChange}
                  />
                </FormGroup>
                
                <FormGroup style={{ flex: 1 }}>
                  <FormLabel htmlFor="github">GitHub Username</FormLabel>
                  <FormInput
                    type="text"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormLabel htmlFor="motivation">Why do you want to join our fellowship?</FormLabel>
                <FormTextarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </SubmitButton>
            </ApplicationForm>
          )}
        </FormSection>
      </ContentWrapper>
      
      <Footer>
        <FooterText>© 2023 Lord Smearington&apos;s Realm. All rights reserved.</FooterText>
        <FooterLinks>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/dnd">DnD Project</FooterLink>
          <FooterLink href="https://discord.gg/kSuS9kdgTk">Discord</FooterLink>
        </FooterLinks>
      </Footer>
    </Container>
  );
};

export default ApplyPage;

// Animations
const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #0d1117;
  color: #e6edf3;
  position: relative;
  overflow: hidden;
`;

const PageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, #1a1d29, #0d1117);
  z-index: -2;
`;

const FloatingElement = styled.div<{ top: string; left: string; size: string; animationDuration: string }>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  top: ${props => props.top};
  left: ${props => props.left};
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(254, 202, 87, 0.05));
  border-radius: 50%;
  z-index: -1;
  animation: ${float} ${props => props.animationDuration} infinite ease-in-out;
`;

const Header = styled.header`
  text-align: center;
  padding: 4rem 2rem 2rem;
  animation: ${fadeIn} 1s ease-out;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  color: #8b949e;
`;

const ContentWrapper = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  gap: 3rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const InfoSection = styled.div`
  flex: 1;
  animation: ${fadeIn} 1s ease-out 0.2s both;
`;

const InfoTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #e6edf3;
`;

const RoleList = styled.div`
  margin-bottom: 2rem;
`;

const RoleItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #ff6b6b;
`;

const RoleName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #e6edf3;
`;

const RoleDesc = styled.p`
  font-size: 0.9rem;
  color: #8b949e;
`;

const InfoBox = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoBoxTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #e6edf3;
`;

const InfoBoxContent = styled.div`
  color: #8b949e;
`;

const BenefitItem = styled.div`
  margin-bottom: 0.8rem;
  font-size: 1rem;
`;

const DiscordBanner = styled.div`
  display: flex;
  align-items: center;
  background: rgba(88, 101, 242, 0.2);
  border-radius: 12px;
  padding: 1.2rem;
  margin-top: 2rem;
`;

const DiscordIcon = styled.div`
  font-size: 2.5rem;
  color: #5865F2;
  margin-right: 1rem;
`;

const DiscordContent = styled.div`
  flex: 1;
`;

const DiscordText = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #e6edf3;
`;

const DiscordLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #5865F2;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const GithubBanner = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.2rem;
  margin-top: 2rem;
  color: #fff;
`;

const GithubIcon = styled.div`
  font-size: 2.5rem;
  color: #fff;
  margin-right: 1rem;
`;

const GithubContent = styled.div`
  flex: 1;  
`;

const GithubText = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #e6edf3;
`;

const GithubLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FormSection = styled.div`
  flex: 1;
  animation: ${fadeIn} 1s ease-out 0.4s both;
`;

const ApplicationForm = styled.form`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #e6edf3;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #8b949e;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e6edf3;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e6edf3;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
  
  option {
    background: #1a1d29;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e6edf3;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease-out;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #e6edf3;
`;

const SuccessText = styled.p`
  font-size: 1.1rem;
  color: #8b949e;
  margin-bottom: 2rem;
`;

const RedirectText = styled.p`
  font-size: 0.9rem;
  color: #8b949e;
  font-style: italic;
`;

const Footer = styled.footer`
  padding: 2rem;
  background-color: rgba(22, 27, 34, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterText = styled.p`
  color: #8b949e;
  font-size: 0.9rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled(Link)`
  color: #8b949e;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e6edf3;
  }
`;
