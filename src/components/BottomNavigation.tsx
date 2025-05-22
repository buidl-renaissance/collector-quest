import React, { useEffect, useState } from 'react';
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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Detect keyboard visibility by checking window height changes
    const initialHeight = window.innerHeight;
    
    const handleResize = () => {
      // If window height significantly decreases, keyboard is likely visible
      const keyboardVisible = window.innerHeight < initialHeight * 0.75;
      setIsKeyboardVisible(keyboardVisible);
    };

    window.addEventListener('resize', handleResize);
    
    // For iOS devices that don't trigger resize events
    window.addEventListener('focusin', () => {
      if (document.activeElement?.tagName === 'INPUT') {
        setIsKeyboardVisible(true);
      }
    });
    
    window.addEventListener('focusout', () => {
      if (document.activeElement?.tagName !== 'INPUT') {
        setIsKeyboardVisible(false);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focusin', () => {});
      window.removeEventListener('focusout', () => {});
    };
  }, []);

  return (
    <NavigationContainer isKeyboardVisible={isKeyboardVisible}>
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

const NavigationContainer = styled.div<{ isKeyboardVisible: boolean }>`
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
  
  /* When keyboard is visible, position relative to viewport */
  position: ${props => props.isKeyboardVisible ? 'fixed' : 'fixed'};
  bottom: ${props => props.isKeyboardVisible ? 'env(safe-area-inset-bottom, 0)' : '0'};
  
  /* Add iOS-specific positioning */
  @supports (-webkit-touch-callout: none) {
    padding-bottom: ${props => props.isKeyboardVisible ? 'env(safe-area-inset-bottom, 1rem)' : '1rem'};
  }
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