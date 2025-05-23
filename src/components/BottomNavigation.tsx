import React from 'react';
import styled from '@emotion/styled';
import { FaArrowRight } from 'react-icons/fa';
import { NextButton } from './styled/buttons';

interface BottomNavigationProps {
  selectedItem?: string;
  selectedItemLabel?: string;
  onNext: () => void;
  disabled?: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  selectedItem,
  selectedItemLabel,
  onNext,
  disabled = false,
}) => {
  return (
    <NavigationContainer>
      {selectedItem && selectedItemLabel && (
        <SelectedItem>
          <SelectedItemLabel>{selectedItemLabel}:</SelectedItemLabel>
          <SelectedItemValue>{selectedItem}</SelectedItemValue>
        </SelectedItem>
      )}
      <NextButton onClick={onNext} disabled={disabled}>
        Next Step <FaArrowRight />
      </NextButton>
    </NavigationContainer>
  );
};

const NavigationContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #bb8930;
  z-index: 1000;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
`;

const SelectedItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SelectedItemLabel = styled.span`
  color: #bb8930;
  font-size: 0.9rem;
`;

const SelectedItemValue = styled.span`
  color: #e0dde5;
  font-size: 1rem;
  font-weight: 500;
`;

export default BottomNavigation; 