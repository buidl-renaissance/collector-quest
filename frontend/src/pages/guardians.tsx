import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import Image from "next/image";
import { GetServerSideProps } from "next";

// Styled components
const PageWrapper = styled.div`
  background-color: #0a0a1a;
  color: white;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
`;

const HeroSection = styled.div`
  position: relative;
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Cinzel", serif;
  padding: 0 16px;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
    z-index: 1;
  }

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  > div {
    position: relative;
    z-index: 2;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const HeroTitle = styled.h1`
  font-family: "Cinzel", serif;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ContentSection = styled.div<{
  marginTop?: string;
  marginBottom?: string;
  paddingY?: string;
}>`
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}rem` : "0")};
  margin-bottom: ${(props) =>
    props.marginBottom ? `${props.marginBottom}rem` : "0"};
  padding-top: ${(props) => (props.paddingY ? `${props.paddingY}rem` : "0")};
  padding-bottom: ${(props) => (props.paddingY ? `${props.paddingY}rem` : "0")};
`;

const SectionTitle = styled.h2`
  font-family: "Cinzel", serif;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #d4af37;
  text-align: center;
`;

const GuardiansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const GuardianCard = styled.div`
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #d4af37;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
  }
`;

const GuardianImageContainer = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
`;

const GuardianName = styled.h3`
  font-family: "Cinzel", serif;
  font-size: 1.5rem;
  color: #d4af37;
  margin-bottom: 0.5rem;
`;

const GuardianSpecialty = styled.p`
  font-style: italic;
  margin-bottom: 1rem;
  color: #aaa;
`;

const GuardianStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #d4af37;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #aaa;
`;

const Button = styled.button`
  background-color: #d4af37;
  color: #0a0a1a;
  font-family: "Cinzel", serif;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: #f0c550;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ConnectWalletButton = styled(Button)`
  max-width: 300px;
  margin: 2rem auto;
  display: block;
`;

const NoGuardiansMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #aaa;
  margin: 3rem 0;
`;

// Mock data for guardians
const mockGuardians = [
  {
    id: "1",
    name: "Archibald Whisperwind",
    address: "0x1a2b3c4d5e6f7g8h9i0j",
    specialty: "Identity Verification",
    reputation: 95,
    handlesConfirmed: 124,
    image: "/images/guardian1.jpg",
  },
  {
    id: "2",
    name: "Elara Moonshade",
    address: "0x2b3c4d5e6f7g8h9i0j1k",
    specialty: "Digital Security",
    reputation: 88,
    handlesConfirmed: 97,
    image: "/images/guardian2.jpg",
  },
  {
    id: "3",
    name: "Thaddeus Cryptkeeper",
    address: "0x3c4d5e6f7g8h9i0j1k2l",
    specialty: "Recovery Specialist",
    reputation: 92,
    handlesConfirmed: 156,
    image: "/images/guardian3.jpg",
  },
  {
    id: "4",
    name: "Seraphina Codeweaver",
    address: "0x4d5e6f7g8h9i0j1k2l3m",
    specialty: "Smart Contract Auditing",
    reputation: 97,
    handlesConfirmed: 203,
    image: "/images/guardian4.jpg",
  },
];

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      metadata: {
        title: "Guardians of the Realm | Handle Registry",
        description:
          "Discover and connect with trusted guardians who help secure digital identities in the Handle Registry.",
        image: "/images/guardians-banner.jpg",
        url: "https://handle-registry.example.com/guardians",
      },
    },
  };
};

const GuardiansPage: React.FC = () => {
  const { connected } = useWallet();
  const [guardians, setGuardians] = useState(mockGuardians);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading guardians from an API
    const loadGuardians = async () => {
      setLoading(true);
      // In a real implementation, you would fetch guardians from your API
      // const response = await fetch('/api/guardians');
      // const data = await response.json();
      // setGuardians(data);

      // Using mock data for now
      setTimeout(() => {
        setGuardians(mockGuardians);
        setLoading(false);
      }, 1000);
    };

    loadGuardians();
  }, []);

  const handleBecomeGuardian = () => {
    // In a real implementation, this would navigate to a form or modal
    alert(
      "Guardian application process will be implemented in a future update!"
    );
  };

  const handleSelectGuardian = (guardianId: string) => {
    // In a real implementation, this would select the guardian for your handle
    alert(
      `You've selected guardian ${guardianId}. This functionality will be implemented soon!`
    );
  };

  return (
    <PageWrapper>
      <HeroSection>
        <video autoPlay muted loop playsInline>
          <source src="/videos/guardians-realm.mp4" type="video/mp4" />
        </video>
        <Container>
          <HeroTitle>Guardians of the Realm</HeroTitle>
        </Container>
      </HeroSection>

      <Container>
        <ContentSection paddingY="4">
          <SectionTitle>Trusted Protectors of Digital Identity</SectionTitle>

          {!connected ? (
            <div>
              <p style={{ textAlign: "center", marginBottom: "2rem" }}>
                Connect your wallet to interact with guardians and secure your
                digital identity.
              </p>
              <ConnectButton />
            </div>
          ) : loading ? (
            <p style={{ textAlign: "center" }}>Loading guardians...</p>
          ) : guardians.length === 0 ? (
            <NoGuardiansMessage>
              No guardians found. Be the first to become a guardian!
            </NoGuardiansMessage>
          ) : (
            <>
              <p style={{ textAlign: "center", marginBottom: "2rem" }}>
                Guardians help secure your digital identity by confirming handle
                registrations and assisting with recovery. Select a guardian to
                help protect your handle or apply to become one yourself.
              </p>

              <GuardiansGrid>
                {guardians.map((guardian) => (
                  <GuardianCard key={guardian.id}>
                    <GuardianImageContainer>
                      <Image
                        src={guardian.image}
                        alt={guardian.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </GuardianImageContainer>
                    <GuardianName>{guardian.name}</GuardianName>
                    <GuardianSpecialty>{guardian.specialty}</GuardianSpecialty>
                    <p style={{ fontSize: "0.8rem", wordBreak: "break-all" }}>
                      {guardian.address}
                    </p>

                    <GuardianStats>
                      <StatItem>
                        <StatValue>{guardian.reputation}</StatValue>
                        <StatLabel>Reputation</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>{guardian.handlesConfirmed}</StatValue>
                        <StatLabel>Handles Confirmed</StatLabel>
                      </StatItem>
                    </GuardianStats>

                    <Button onClick={() => handleSelectGuardian(guardian.id)}>
                      Select Guardian
                    </Button>
                  </GuardianCard>
                ))}
              </GuardiansGrid>

              <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <SectionTitle>Become a Guardian</SectionTitle>
                <p style={{ maxWidth: "600px", margin: "0 auto 2rem" }}>
                  Help secure the digital identities of others and earn
                  reputation in the process. Guardians play a crucial role in
                  our decentralized identity system.
                </p>
                <Button
                  onClick={handleBecomeGuardian}
                  style={{ maxWidth: "300px" }}
                >
                  Apply to Become a Guardian
                </Button>
              </div>
            </>
          )}
        </ContentSection>
      </Container>
    </PageWrapper>
  );
};

export default GuardiansPage;
