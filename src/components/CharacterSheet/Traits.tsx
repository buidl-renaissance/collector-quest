import React from 'react';

interface TraitsProps {
  traits: {
    personality_traits?: string[];
    ideals?: string[];
    bonds?: string[];
    flaws?: string[];
  };
}

const sectionStyle = {
  color: '#d6b87b',
  fontSize: '0.8rem',
  marginBottom: '0.25rem',
  fontFamily: 'Cinzel, serif',
};

const valueStyle = {
  color: '#f5e6d3',
  fontSize: '0.9rem',
  lineHeight: '1.4',
};

const itemStyle = { marginBottom: '0.25rem' };

const Traits: React.FC<TraitsProps> = ({ traits }) => (
  <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div>
      <div style={sectionStyle}>Personality</div>
      <div style={valueStyle}>
        {traits.personality_traits?.map((trait, index) => (
          <div key={`personality-${index}`} style={itemStyle}>{trait}</div>
        ))}
      </div>
    </div>
    <div>
      <div style={sectionStyle}>Ideals</div>
      <div style={valueStyle}>
        {traits.ideals?.map((ideal, index) => (
          <div key={`ideal-${index}`} style={itemStyle}>{ideal}</div>
        ))}
      </div>
    </div>
    <div>
      <div style={sectionStyle}>Bonds</div>
      <div style={valueStyle}>
        {traits.bonds?.map((bond, index) => (
          <div key={`bond-${index}`} style={itemStyle}>{bond}</div>
        ))}
      </div>
    </div>
    <div>
      <div style={sectionStyle}>Flaws</div>
      <div style={valueStyle}>
        {traits.flaws?.map((flaw, index) => (
          <div key={`flaw-${index}`} style={itemStyle}>{flaw}</div>
        ))}
      </div>
    </div>
  </div>
);

export default Traits;
