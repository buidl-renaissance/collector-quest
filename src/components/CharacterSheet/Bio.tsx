import React from 'react';

interface BioProps {
  motivation?: string;
  backstory?: string;
  onOpenModal: () => void;
}

const BackstoryContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    {children}
  </div>
);

const Bio: React.FC<BioProps> = ({ motivation, backstory, onOpenModal }) => (
  <div style={{ padding: '0.5rem' }}>
    <div
      style={{
        fontSize: '0.9rem',
        color: '#f5e6d3',
        cursor: 'pointer',
        lineHeight: '1.4',
      }}
      onClick={onOpenModal}
    >
      {backstory ? (
        <BackstoryContainer>
          <div className="backstory-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 10, WebkitBoxOrient: 'vertical' }}>
            {backstory.split('\n')[0]}
          </div>
          <div
            style={{
              color: '#d6b87b',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
              textAlign: 'right',
            }}
          >
            Click to view full bio
          </div>
        </BackstoryContainer>
      ) : (
        'No backstory provided'
      )}
    </div>
  </div>
);

export default Bio;
