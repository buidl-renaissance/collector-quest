import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const Section = styled.section<{ center?: boolean }>`
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  text-align: ${({ center }) => (center ? "center" : "left")};
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

export const SectionIcon = styled.div`
  color: #bb8930;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SectionTitle = styled.h2`
  font-family: "Cinzel", serif;
  font-size: 2rem;
  color: #bb8930;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const SectionSubtitle = styled.h3`
  font-family: "Cinzel", serif;
  font-size: 1.4rem;
  color: #bb8930;
  margin-bottom: 0.75rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const Description = styled.p`
  color: #a89bb4;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

export const GridItem = styled.div`
  background: rgba(187, 137, 48, 0.1);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(187, 137, 48, 0.2);
    border-color: rgba(187, 137, 48, 0.5);
  }
`;

export const ItemTitle = styled.h4`
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

export const ItemDescription = styled.p`
  color: #e6e6e6;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const Tagline = styled.div`
  text-align: center;
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
  font-style: italic;
  margin-top: 2rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-top: 1.5rem;
  }
`;

export const FeaturedSection = styled(Section)`
  background: rgba(58, 38, 6, 0.6);
`;

export const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

export const FeaturedIcon = styled.div`
  font-size: 2rem;
  color: #bb8930;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
`;

export const FeaturedItem = styled.div`
  background: rgba(187, 137, 48, 0.1);
  border: 1px solid rgba(187, 137, 48, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(187, 137, 48, 0.2);
    border-color: rgba(187, 137, 48, 0.5);
  }
`;

export const FeaturedTitle = styled.h4`
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

export const FeaturedDescription = styled.p`
  color: #e6e6e6;
  font-size: 0.9rem;
  line-height: 1.4;
`;
