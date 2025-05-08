export interface Submission {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description: string;
  imageUrl: string;
  stakeAmount: number;
  votes: number;
  createdAt: string;
}
export const mockSubmissions: Submission[] = [
  {
    id: "1",
    artistId: "artist1",
    artistName: "Alex Rivera",
    title: "Digital Dreamscape",
    description:
      "An exploration of surreal digital landscapes that blend nature and technology.",
    imageUrl: "/images/submissions/submission1.jpg",
    stakeAmount: 0.5,
    votes: 24,
    createdAt: "2023-09-15T14:30:00Z",
  },
  {
    id: "2",
    artistId: "artist2",
    artistName: "Maya Johnson",
    title: "Neon Nights",
    description:
      "A cyberpunk-inspired piece capturing the energy of urban nightlife.",
    imageUrl: "/images/submissions/submission2.jpg",
    stakeAmount: 0.75,
    votes: 18,
    createdAt: "2023-09-16T09:45:00Z",
  },
  {
    id: "3",
    artistId: "artist3",
    artistName: "Jamal Williams",
    title: "Ethereal Echoes",
    description:
      "Abstract patterns that visualize sound waves and musical harmony.",
    imageUrl: "/images/submissions/submission3.jpg",
    stakeAmount: 1.2,
    votes: 32,
    createdAt: "2023-09-14T11:20:00Z",
  },
  {
    id: "4",
    artistId: "artist4",
    artistName: "Sofia Chen",
    title: "Quantum Fragments",
    description:
      "A series of fractals representing the complexity of quantum physics.",
    imageUrl: "/images/submissions/submission4.jpg",
    stakeAmount: 0.3,
    votes: 15,
    createdAt: "2023-09-17T16:10:00Z",
  },
  {
    id: "5",
    artistId: "artist5",
    artistName: "Leo Patel",
    title: "Biomorphic Fusion",
    description:
      "Organic forms merging with geometric structures in vibrant colors.",
    imageUrl: "/images/submissions/submission5.jpg",
    stakeAmount: 0.9,
    votes: 27,
    createdAt: "2023-09-13T08:50:00Z",
  },
];
