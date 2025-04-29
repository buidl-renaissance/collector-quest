import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaSearch, FaUserCircle, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { getHandles, getHandleByOwner } from '../services/handleService';
import PageWrapper from '../components/PageWrapper'

// Types
interface Handle {
  id: string;
  name: string;
  owner: string;
  confirmed: boolean;
  createdAt: string;
}

// Animations
// const float = keyframes`
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-10px); }
//   100% { transform: translateY(0px); }
// `;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// Styled Components
const HeroSection = styled.section`
  position: relative;
  height: 40vh;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  video {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    filter: brightness(0.4);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ContentSection = styled.section<{ paddingY?: string }>`
  padding: ${props => props.paddingY ? `${props.paddingY}rem 0` : '3rem 0'};
`;

const SectionTitle = styled.h2`
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  max-width: 600px;
  margin: 0 auto 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #6e48aa, #9d50bb);
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(157, 80, 187, 0.4);
  }
`;

const HandlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const HandleCard = styled.div`
  background: rgba(30, 30, 40, 0.7);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(157, 80, 187, 0.5);
  }
`;

const HandleImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  background: linear-gradient(45deg, #2d3748, #1a202c);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HandleIcon = styled.div`
  font-size: 5rem;
  color: rgba(255, 255, 255, 0.3);
  animation: ${pulse} 3s infinite ease-in-out;
`;

const HandleContent = styled.div`
  padding: 1.5rem;
`;

const HandleName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const HandleOwner = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
  word-break: break-all;
`;

const HandleStatus = styled.div<{ confirmed: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
  background: ${props => props.confirmed ? 'rgba(72, 187, 120, 0.2)' : 'rgba(237, 137, 54, 0.2)'};
  color: ${props => props.confirmed ? '#48bb78' : '#ed8936'};
  border: 1px solid ${props => props.confirmed ? 'rgba(72, 187, 120, 0.4)' : 'rgba(237, 137, 54, 0.4)'};
`;

const Button = styled.button`
  display: block;
  width: 100%;
  background: linear-gradient(135deg, #6e48aa, #9d50bb);
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(157, 80, 187, 0.4);
  }
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const NoHandlesMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(30, 30, 40, 0.7);
  border-radius: 12px;
  margin: 2rem 0;
`;

const HandleDetailLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const HandlePage: React.FC = () => {
  const [handles, setHandles] = useState<Handle[]>([]);
  const [filteredHandles, setFilteredHandles] = useState<Handle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const wallet = useWallet();
  const [userHandle, setUserHandle] = useState<string | null>(null);

  useEffect(() => {
    const fetchHandles = async () => {
      setLoading(true);
      try {
        const handlesData = await getHandles();
        setHandles(handlesData);
        setFilteredHandles(handlesData);
      } catch (error) {
        console.error('Error fetching handles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHandles();
  }, []);

  useEffect(() => {
    if (wallet.connected) {
      const fetchUserHandle = async () => {
        try {
          const handle = await getHandleByOwner(wallet.address || "");
          setUserHandle(handle?.name || null);
        } catch (error) {
          console.error('Error fetching user handle:', error);
        }
      };
      
      fetchUserHandle();
    }
  }, [wallet.connected, wallet.address]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = handles.filter(handle => 
        handle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        handle.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHandles(filtered);
    } else {
      setFilteredHandles(handles);
    }
  }, [searchTerm, handles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect above
  };

  return (
    <PageWrapper>
      <HeroSection>
        <video autoPlay muted loop playsInline>
          <source src="/videos/digital-identity.mp4" type="video/mp4" />
        </video>
        <Container>
          <HeroTitle>Handle Registry</HeroTitle>
        </Container>
      </HeroSection>

      <Container>
        <ContentSection paddingY="4">
          <SectionTitle>Discover Digital Identities</SectionTitle>
          
          <form onSubmit={handleSearch}>
            <SearchContainer>
              <SearchInput 
                type="text" 
                placeholder="Search by handle or address..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchButton type="submit">
                <FaSearch />
              </SearchButton>
            </SearchContainer>
          </form>

          {!wallet.connected ? (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ marginBottom: '1rem' }}>Connect your wallet to register your own handle</p>
              <ConnectButton />
            </div>
          ) : !userHandle ? (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ marginBottom: '1rem' }}>You don&apos;t have a handle yet. Register one now!</p>
              <Link href="/register" passHref>
                <Button as="a">
                  <FlexDiv>
                    Register Handle <FaArrowRight />
                  </FlexDiv>
                </Button>
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ marginBottom: '1rem' }}>Your handle: <strong>{userHandle}</strong></p>
              <Link href={`/handle/${userHandle}`} passHref>
                <Button as="a">
                  <FlexDiv>
                    View Your Handle <FaArrowRight />
                  </FlexDiv>
                </Button>
              </Link>
            </div>
          )}

          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading handles...</p>
          ) : filteredHandles.length === 0 ? (
            <NoHandlesMessage>
              <p>No handles found matching your search.</p>
            </NoHandlesMessage>
          ) : (
            <HandlesGrid>
              {filteredHandles.map((handle) => (
                <HandleCard key={handle.id}>
                  <Link href={`/handle/${handle.name}`} passHref>
                    <HandleDetailLink>
                      <HandleImageContainer>
                        <HandleIcon>
                          <FaUserCircle />
                        </HandleIcon>
                      </HandleImageContainer>
                      <HandleContent>
                        <HandleName>@{handle.name}</HandleName>
                        <HandleOwner>{handle.owner}</HandleOwner>
                        <HandleStatus confirmed={handle.confirmed}>
                          {handle.confirmed ? 'Confirmed' : 'Pending Confirmation'}
                        </HandleStatus>
                        <Button>View Details</Button>
                      </HandleContent>
                    </HandleDetailLink>
                  </Link>
                </HandleCard>
              ))}
            </HandlesGrid>
          )}
        </ContentSection>
      </Container>
    </PageWrapper>
  );
};

export default HandlePage;
