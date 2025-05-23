import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      {/* <FooterCastle /> */}
      <FooterText>
        Generated by <br />
        Escada Gordon & WiredInSamurai
      </FooterText>
      {/* <FooterLinks>
        <FooterLink href="/about">About</FooterLink>
        <FooterLink href="/terms">Terms</FooterLink>
        <FooterLink href="/socials">Socials</FooterLink>
      </FooterLinks> */}
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: rgba(58, 38, 6, 0.95);
  padding: 1.5rem 1rem;
  text-align: center;
  position: relative;
  border-top: 1px solid rgba(187, 137, 48, 0.3);
  backdrop-filter: blur(10px);
`;

const FooterCastle = styled.div`
  height: 160px;
  background-image: url('/images/castle-silhouette.png');
  background-repeat: repeat-x;
  background-position: center bottom;
  background-size: contain;
  margin-bottom: 0.75rem;
  opacity: 0.7;
  filter: invert(1) brightness(0.7) sepia(1) saturate(1000%) hue-rotate(5deg);
  mix-blend-mode: screen;
`;

const FooterText = styled.p`
  color: #bb8930;
  margin: 0;
  font-size: 0.9rem;
  font-family: "Cinzel", serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  padding: 2rem;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.75rem;
`;

const FooterLink = styled(Link)`
  color: #bb8930;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  font-family: "Cinzel", serif;
  
  &:hover {
    color: #b6551c;
    text-shadow: 0 0 8px rgba(187, 137, 48, 0.5);
  }
`;

export default Footer;
