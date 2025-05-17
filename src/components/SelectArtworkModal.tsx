import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaCrown, FaSpinner, FaImage, FaTimes } from 'react-icons/fa';
import { getArtworks, getArtists, Artwork } from '@/lib/dpop';
import { convertDefaultToResized } from '@/lib/image';

interface SelectArtworkModalProps {
  onClose: () => void;
  onSelect: (artworks: Artwork[]) => void;
  multiSelect?: boolean;
}

const SelectArtworkModal: React.FC<SelectArtworkModalProps> = ({ onClose, onSelect, multiSelect = true }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [artworkData, artistsData] = await Promise.all([
          getArtworks(),
          getArtists()
        ]);
        
        setArtworks(artworkData);
        setFilteredArtworks(artworkData);
        
        // Extract unique artist names
        const artistNames = artistsData.map((artist: any) => artist.name);
        setArtists(['All Artists', ...artistNames]);
        
        setLoading(false);
        console.log('Artworks:', artworkData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load artworks. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter artworks based on selected artist
    let filtered = [...artworks];
    
    if (selectedArtist && selectedArtist !== 'All Artists') {
      filtered = filtered.filter(artwork => 
        artwork.artist?.name === selectedArtist
      );
    }
    
    setFilteredArtworks(filtered);
  }, [selectedArtist, artworks]);

  const handleSelectArtwork = (artwork: Artwork) => {
    if (multiSelect) {
      setSelectedArtworks(prevSelected => {
        const isAlreadySelected = prevSelected.some(item => item.id === artwork.id);
        
        if (isAlreadySelected) {
          return prevSelected.filter(item => item.id !== artwork.id);
        } else {
          return [...prevSelected, artwork];
        }
      });
    } else {
      setSelectedArtworks([artwork]);
    }
  };

  const isArtworkSelected = (artwork: Artwork) => {
    return selectedArtworks.some(item => item.id === artwork.id);
  };

  const handleConfirmSelection = () => {
    if (selectedArtworks.length > 0) {
      onSelect(selectedArtworks);
      onClose();
    }
  };

  const handleArtistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArtist(e.target.value);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <FaCrown /> Select Artwork
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner>
              <FaSpinner />
            </LoadingSpinner>
            <LoadingText>Loading artworks...</LoadingText>
          </LoadingContainer>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            <FilterContainer>
              <ArtistSelect 
                value={selectedArtist} 
                onChange={handleArtistChange}
              >
                {artists.map((artist, index) => (
                  <option key={index} value={artist}>
                    {artist}
                  </option>
                ))}
              </ArtistSelect>
            </FilterContainer>
            
            <SelectedCount>
              {selectedArtworks.length > 0 && (
                `${selectedArtworks.length} artwork${selectedArtworks.length > 1 ? 's' : ''} selected`
              )}
            </SelectedCount>
            
            <ArtworkGrid>
              {filteredArtworks.length > 0 ? (
                filteredArtworks.map((artwork: Artwork, index: number) => (
                  <ArtworkItem 
                    key={index} 
                    onClick={() => handleSelectArtwork(artwork)}
                    isSelected={isArtworkSelected(artwork)}
                  >
                    {artwork.data.image ? (
                      <ArtworkImage src={convertDefaultToResized(artwork.data.image)} alt={artwork.title || 'Artwork'} />
                    ) : (
                      <ArtworkPlaceholder>
                        <FaImage />
                      </ArtworkPlaceholder>
                    )}
                    <ArtworkTitle>{artwork.title || 'Untitled Artwork'}</ArtworkTitle>
                    {artwork.artist?.name && (
                      <ArtworkArtist>by {artwork.artist.name}</ArtworkArtist>
                    )}
                  </ArtworkItem>
                ))
              ) : (
                <NoArtworksMessage>No artworks match your filter</NoArtworksMessage>
              )}
            </ArtworkGrid>

            <ModalFooter>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
              <SelectButton 
                onClick={handleConfirmSelection}
                disabled={selectedArtworks.length === 0}
              >
                {multiSelect ? 'Select Artworks' : 'Select Artwork'}
              </SelectButton>
            </ModalFooter>
          </>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

// Animation keyframes
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
`;

// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #3b4c99 0%, #5a3e85 100%);
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  display: flex;
  flex-direction: column;
  font-family: 'Cormorant Garamond', serif;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
`;

const ModalTitle = styled.h2`
  color: #FFD700;
  font-size: 1.8rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Cinzel Decorative', 'Playfair Display SC', serif;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #FFD700;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #FFF;
    transform: scale(1.1);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
`;

const ArtistSelect = styled.select`
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 50px;
  color: #FFD700;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.7);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
  
  option {
    background: #3b4c99;
  }
`;

const SelectedCount = styled.div`
  padding: 0.5rem 1.5rem;
  color: #FFD700;
  font-size: 0.9rem;
  font-style: italic;
`;

const ArtworkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  overflow-y: auto;
`;

const ArtworkItem = styled.div<{ isSelected: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  /* overflow: hidden; */
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.isSelected ? '#FFD700' : 'transparent'};
  box-shadow: ${props => props.isSelected ? '0 0 15px rgba(255, 215, 0, 0.7)' : 'none'};
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  }
`;

const ArtworkImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const ArtworkPlaceholder = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.5);
  font-size: 2rem;
`;

const ArtworkTitle = styled.div`
  padding: 0.75rem 0.75rem 0.25rem;
  font-size: 1rem;
  color: #C7BFD4;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtworkArtist = styled.div`
  padding: 0 0.75rem 0.75rem;
  font-size: 0.85rem;
  color: rgba(199, 191, 212, 0.7);
  text-align: center;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Cormorant Garamond', serif;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  color: #C7BFD4;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SelectButton = styled(Button)`
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border: 1px solid rgba(255, 215, 0, 0.5);
  
  &:hover {
    background: rgba(255, 215, 0, 0.3);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const LoadingSpinner = styled.div`
  color: #FFD700;
  font-size: 2rem;
  animation: ${spin} 1.5s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #FFD700;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem;
  color: #FC67FA;
  text-shadow: 0 0 10px rgba(252, 103, 250, 0.5);
`;

const NoArtworksMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #C7BFD4;
  font-size: 1.2rem;
`;

export default SelectArtworkModal;
