import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaArrowRight } from 'react-icons/fa';

interface BottomNavigationProps {
  selectedItem?: string;
  selectedItemLabel?: string;
  onNext: () => void;
  disabled?: boolean;
}

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const SelectionFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(26, 26, 46, 0.95);
  border-top: 2px solid #bb8930;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideUp} 0.3s ease-out;
  z-index: 100;
`;

const SelectedItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectedItemLabel = styled.span`
  color: #C7BFD4;
`;

const SelectedItemName = styled.span`
  color: #bb8930;
  font-weight: bold;
  font-size: 1.1rem;
`;

const NextButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.disabled ? '#666' : '#bb8930'};
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-family: 'Cormorant Garamond', serif;
  font-weight: bold;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.disabled ? '#666' : '#d4a959'};
  }
`;

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  selectedItem,
  selectedItemLabel = 'Selected',
  onNext,
  disabled = false
}) => {
  return (
    <SelectionFooter>
      {selectedItem && (
        <SelectedItemInfo>
          <SelectedItemLabel>{selectedItemLabel}:</SelectedItemLabel>
          <SelectedItemName>{selectedItem}</SelectedItemName>
        </SelectedItemInfo>
      )}
      <NextButton onClick={onNext} disabled={disabled}>
        Next Step <FaArrowRight />
      </NextButton>
    </SelectionFooter>
  );
};

export default BottomNavigation; 