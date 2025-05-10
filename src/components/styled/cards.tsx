import styled from "@emotion/styled";

export const Card = styled.div<{ selected?: boolean }>`
  border: 2px solid ${props => props.selected ? '#d4a959' : '#bb8930'};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  background: ${props => props.selected ? 'rgba(187, 137, 48, 0.1)' : 'rgba(26, 26, 46, 0.3)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(187, 137, 48, 0.3);
    border-color: #d4a959;
  }
`;

export const CardContent = styled.div`
  padding: 1rem;
`;

export const CardTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: #bb8930;
`;

export const CardDescription = styled.p`
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #C7BFD4;
  line-height: 1.4;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #bb8930;
`;

export const CardList = styled.ul`
  margin: 0;
  padding: 0 0 0 1.2rem;
`;

export const CardListItem = styled.li`
  font-size: 0.85rem;
  color: #C7BFD4;
  margin-bottom: 0.3rem;
`; 