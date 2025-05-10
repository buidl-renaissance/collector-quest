import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import styled from 'styled-components';
import { FaCrown, FaCoins, FaImage, FaVoteYea } from 'react-icons/fa';
import { useWallet } from '@suiet/wallet-kit';
import { useAuth } from '@/hooks/useAuth';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { Submission } from '@/data/submissions';

interface CompetitionPhase {
  name: 'submission' | 'voting' | 'distribution';
  startDate: Date;
  endDate: Date;
  description?: string;
  location?: string;
}

interface CompetitionVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Interface for submission requirements (commented out as not currently used)
// interface ArtSubmissionRequirements {
//   maxFileSize: number; // in MB
//   allowedFormats: string[];
//   minDimensions: {
//     width: number;
//     height: number;
//   };
//   printable: boolean;
// }

interface Competition {
  id: string;
  title: string;
  description: string;
  currentPhase: CompetitionPhase['name'];
  phases: CompetitionPhase[];
  totalPrizePool: number;
  submissions: Submission[];
  venue?: CompetitionVenue;
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #f8f8f2;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #bd93f9;
  max-width: 800px;
  margin: 0 auto;
`;

const PhaseIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #44475a;
    z-index: 0;
  }
`;

const Phase = styled.div<{ active: boolean }>`
  background: ${props => props.active ? '#50fa7b' : '#282a36'};
  color: ${props => props.active ? '#282a36' : '#f8f8f2'};
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  z-index: 1;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-around;
  background: #44475a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #50fa7b;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #f8f8f2;
  margin-top: 0.5rem;
`;

const SubmissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const SubmissionCard = styled.div`
  background: #282a36;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const SubmissionImage = styled.div`
  height: 200px;
  background-size: cover;
  background-position: center;
`;

const SubmissionContent = styled.div`
  padding: 1.5rem;
`;

const SubmissionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #f8f8f2;
`;

const SubmissionArtist = styled.p`
  font-size: 0.9rem;
  color: #bd93f9;
  margin-bottom: 1rem;
`;

const SubmissionStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const StakeAmount = styled.div`
  display: flex;
  align-items: center;
  color: #f1fa8c;
  font-weight: bold;

  svg {
    margin-right: 0.5rem;
  }
`;

const VoteCount = styled.div`
  display: flex;
  align-items: center;
  color: #8be9fd;
  font-weight: bold;

  svg {
    margin-right: 0.5rem;
  }
`;

const Button = styled.button`
  background: #bd93f9;
  color: #282a36;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #ff79c6;
  }

  &:disabled {
    background: #6272a4;
    cursor: not-allowed;
  }
`;

const SubmissionForm = styled.form`
  background: #44475a;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #f8f8f2;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid #6272a4;
  background: #282a36;
  color: #f8f8f2;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid #6272a4;
  background: #282a36;
  color: #f8f8f2;
  min-height: 100px;
`;

const ErrorMessage = styled.div`
  color: #ff5555;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 85, 85, 0.1);
  border-radius: 4px;
`;

const EventDetails = styled.div`
  background: #44475a;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
`;

const EventTitle = styled.h2`
  color: #50fa7b;
  margin-bottom: 1rem;
`;

const EventSchedule = styled.div`
  margin-top: 1.5rem;
`;

const ScheduleItem = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const ScheduleDay = styled.div`
  font-weight: bold;
  width: 100px;
  color: #ff79c6;
`;

const ScheduleContent = styled.div`
  flex: 1;
`;

const CompetitionPage: NextPage = () => {
  const { user } = useAuth();
  const wallet = useWallet();
  const { generateImage } = useImageGeneration();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    stakeAmount: 5
  });

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be fetched from an API
    const mockCompetition: Competition = {
      id: '1',
      title: 'Staked Art Competition + Gallery Activation',
      description: 'Artists stake tokens (or $) behind their submissions. The more confident they are in their work, the more they stake. Community votes on submissions during Movement Festival Weekend, and winner(s) receive the combined stake pool!',
      currentPhase: 'submission',
      phases: [
        {
          name: 'submission',
          startDate: new Date('2024-05-01'),
          endDate: new Date('2024-05-23')
        },
        {
          name: 'voting',
          startDate: new Date('2024-05-24'),
          endDate: new Date('2024-05-26')
        },
        {
          name: 'distribution',
          startDate: new Date('2024-05-27'),
          endDate: new Date('2024-05-27')
        }
      ],
      totalPrizePool: 250,
      venue: {
        name: 'Movement Festival Detroit',
        address: '1 Hart Plaza',
        city: 'Detroit',
        state: 'MI'
      },
      submissions: [
        {
          id: '1',
          artistId: '123',
          artistName: 'CryptoArtist',
          title: 'Dimensional Rift',
          description: 'A glimpse into the space between worlds',
          imageUrl: '/images/sample-art-1.jpg',
          stakeAmount: 50,
          votes: 24,
          createdAt: '2023-10-02'
        },
        {
          id: '2',
          artistId: '456',
          artistName: 'DigitalDreamer',
          title: 'Ethereal Passage',
          description: 'Where dreams and reality converge',
          imageUrl: '/images/sample-art-2.jpg',
          stakeAmount: 30,
          votes: 18,
          createdAt: '2023-10-03'
        }
      ]
    };

    setCompetition(mockCompetition);
    setLoading(false);
  }, []);

  const handleSubmissionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubmissionForm(prev => ({
      ...prev,
      [name]: name === 'stakeAmount' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !wallet.connected) {
      setError('You must be logged in and have your wallet connected to submit artwork');
      return;
    }

    if (!submissionForm.title || !submissionForm.description || !submissionForm.imageUrl) {
      setError('Please fill out all fields');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call to submit the artwork
      // and handle the token staking transaction

      // Generate image using the hook
      if (submissionForm.description && submissionForm.imageUrl) {
        try {
          const generatedImage = await generateImage(
            submissionForm.description,
            submissionForm.imageUrl
          );

          if (generatedImage) {
            submissionForm.imageUrl = generatedImage;
          }
        } catch (error) {
          console.error('Error generating image:', error);
          // Continue with submission even if image generation fails
        }
      }

      // Mock successful submission
      const newSubmission: Submission = {
        id: Date.now().toString(),
        artistId: user.id,
        artistName: user.name || 'Anonymous',
        title: submissionForm.title,
        description: submissionForm.description,
        imageUrl: submissionForm.imageUrl,
        stakeAmount: submissionForm.stakeAmount,
        votes: 0,
        createdAt: new Date().toISOString()
      };

      setCompetition(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          totalPrizePool: prev.totalPrizePool + submissionForm.stakeAmount,
          submissions: [...prev.submissions, newSubmission]
        };
      });

      // Reset form
      setSubmissionForm({
        title: '',
        description: '',
        imageUrl: '',
        stakeAmount: 5
      });

      setError('');
    } catch (err) {
      console.error('Error submitting artwork:', err);
      setError('Failed to submit artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (submissionId: string) => {
    if (!user || !wallet.connected) {
      setError('You must be logged in and have your wallet connected to vote');
      return;
    }

    if (competition?.currentPhase !== 'voting') {
      setError('Voting is not currently open');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call to record the vote
      // and potentially handle any token transactions

      setCompetition(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          submissions: prev.submissions.map(sub =>
            sub.id === submissionId ? { ...sub, votes: sub.votes + 1 } : sub
          )
        };
      });

      setError('');
    } catch (err) {
      console.error('Error voting:', err);
      setError('Failed to record vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !competition) {
    return (
      <Container>
        <p>Loading competition details...</p>
      </Container>
    );
  }

  if (!competition) {
    return (
      <Container>
        <ErrorMessage>Failed to load competition details</ErrorMessage>
      </Container>
    );
  }

  return (
    <>
      <NextSeo
        title="Detroit x Movement Weekend Art Competition | Lord Smearington's Absurd NFT Gallery"
        description="Stake tokens and submit your artwork to win prizes in our Detroit x Movement Weekend art competition."
        openGraph={{
          title: "Detroit x Movement Weekend Art Competition | Lord Smearington's Absurd NFT Gallery",
          description: "Stake tokens and submit your artwork to win prizes in our Detroit x Movement Weekend art competition.",
          images: [{ url: "/images/competition-banner.jpg" }],
          url: "https://smearington.theethical.ai/competition",
        }}
      />

      <Container>
        <Header>
          <Title>{competition.title}</Title>
          <Description>{competition.description}</Description>
        </Header>

        <PhaseIndicator>
          <Phase active={competition.currentPhase === 'submission'}>
            <FaImage /> Submission Phase
          </Phase>
          <Phase active={competition.currentPhase === 'voting'}>
            <FaVoteYea /> Voting Phase
          </Phase>
          <Phase active={competition.currentPhase === 'distribution'}>
            <FaCrown /> Prize Distribution
          </Phase>
        </PhaseIndicator>

        <StatsBar>
          <Stat>
            <StatValue>{competition.submissions.length}</StatValue>
            <StatLabel>Submissions</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{competition.totalPrizePool}</StatValue>
            <StatLabel>Total Prize Pool</StatLabel>
          </Stat>
          <Stat>
            <StatValue>
              {competition.currentPhase === 'submission'
                ? new Date(competition.phases[0].endDate).toLocaleDateString()
                : competition.currentPhase === 'voting'
                ? new Date(competition.phases[1].endDate).toLocaleDateString()
                : 'Completed'}
            </StatValue>
            <StatLabel>Phase Ends</StatLabel>
          </Stat>
        </StatsBar>

        <EventDetails>
          <EventTitle>Detroit x Movement Weekend (May 24-26)</EventTitle>
          <p>Join us for a special art competition and gallery activation during Movement Festival Weekend in Detroit! Selected works will be printed and showcased at a high-traffic location.</p>

          <EventSchedule>
            <h3>Event Schedule:</h3>
            <ScheduleItem>
              <ScheduleDay>Friday</ScheduleDay>
              <ScheduleContent>Setup and Gallery Installation</ScheduleContent>
            </ScheduleItem>
            <ScheduleItem>
              <ScheduleDay>Saturday</ScheduleDay>
              <ScheduleContent>Showcase + Voting</ScheduleContent>
            </ScheduleItem>
            <ScheduleItem>
              <ScheduleDay>Sunday</ScheduleDay>
              <ScheduleContent>Showcase + Voting (continued)</ScheduleContent>
            </ScheduleItem>
            <ScheduleItem>
              <ScheduleDay>Monday</ScheduleDay>
              <ScheduleContent>Winner Announcement + Community Celebration</ScheduleContent>
            </ScheduleItem>
          </EventSchedule>

          <div style={{ marginTop: '1.5rem' }}>
            <h3>Exhibition Details:</h3>
            <p>• High-quality prints by Luxson One</p>
            <p>• Selected works displayed on canvas, lightbox, or LED panels</p>
            <p>• Limited-run editions of finalist pieces available as collectible prints tied to NFTs</p>
            <p>• Open to artists from Detroit, Chicago, Ohio, and beyond</p>
          </div>
        </EventDetails>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {competition.currentPhase === 'submission' && (
          <SubmissionForm onSubmit={handleSubmit}>
            <h2>Submit Your Artwork</h2>
            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={submissionForm.title}
                onChange={handleSubmissionChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                name="description"
                value={submissionForm.description}
                onChange={handleSubmissionChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={submissionForm.imageUrl}
                onChange={handleSubmissionChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="stakeAmount">Stake Amount (tokens)</Label>
              <Input
                type="number"
                id="stakeAmount"
                name="stakeAmount"
                min="5"
                value={submissionForm.stakeAmount}
                onChange={handleSubmissionChange}
                required
              />
            </FormGroup>
            <Button type="submit" disabled={loading || !user || !wallet.connected}>
              {loading ? 'Submitting...' : 'Submit Artwork'}
            </Button>
            {!user && <p>Please log in to submit artwork</p>}
            {!wallet.connected && <p>Please connect your wallet to submit artwork</p>}
          </SubmissionForm>
        )}

        <h2>Current Submissions</h2>
        <SubmissionGrid>
          {competition.submissions.map(submission => (
            <SubmissionCard key={submission.id}>
              <SubmissionImage style={{ backgroundImage: `url(${submission.imageUrl})` }} />
              <SubmissionContent>
                <SubmissionTitle>{submission.title}</SubmissionTitle>
                <SubmissionArtist>by {submission.artistName}</SubmissionArtist>
                <p>{submission.description}</p>
                <SubmissionStats>
                  <StakeAmount>
                    <FaCoins /> {submission.stakeAmount}
                  </StakeAmount>
                  <VoteCount>
                    <FaVoteYea /> {submission.votes}
                  </VoteCount>
                </SubmissionStats>
                {competition.currentPhase === 'voting' && (
                  <Button
                    onClick={() => handleVote(submission.id)}
                    disabled={loading || !user || !wallet.connected}
                  >
                    Vote
                  </Button>
                )}
              </SubmissionContent>
            </SubmissionCard>
          ))}
        </SubmissionGrid>
      </Container>
    </>
  );
};

export default CompetitionPage;
