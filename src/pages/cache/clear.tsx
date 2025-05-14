import React from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import Page from '@/components/Page';

const CacheContainer = styled.div`
  background-color: #2e1e0f;
  color: #d6b87b;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 4px solid #a77d3e;
`;

const Header = styled.h1`
  font-family: "Cinzel", serif;
  font-size: 1.875rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #d6b87b;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d6b87b;
  margin-bottom: 0.5rem;
  font-family: serif;

  &:hover {
    color: #f3e2b3;
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #7e6230;
  color: #d6b87b;
  padding: 0.75rem 1.5rem;
  border: 2px solid #a77d3e;
  border-radius: 0.25rem;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  margin-top: 1rem;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    background-color: #a77d3e;
    color: #f5e6d3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  background-color: ${props => props.type === 'success' ? '#2e1e0f' : '#4a1f1f'};
  color: ${props => props.type === 'success' ? '#d6b87b' : '#ff6b6b'};
  border: 1px solid ${props => props.type === 'success' ? '#a77d3e' : '#ff6b6b'};
`;

const CacheClearPage: React.FC = () => {
  const router = useRouter();
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBack = () => {
    router.push('/');
  };

  const handleClearCache = async () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear any other caches you might have
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      setMessage({
        type: 'success',
        text: 'Cache cleared successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to clear cache. Please try again.'
      });
    }
  };

  return (
    <Page width="wide">
      <BackButton onClick={handleBack}>
        <FaArrowLeft /> Back to Home
      </BackButton>

      <CacheContainer>
        <Header>Clear Cache</Header>
        
        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        <ClearButton onClick={handleClearCache}>
          <FaTrash /> Clear All Cache
        </ClearButton>
      </CacheContainer>
    </Page>
  );
};

export default CacheClearPage; 