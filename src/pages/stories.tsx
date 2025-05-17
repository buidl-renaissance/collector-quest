import React, { useState, useEffect } from 'react';
import { FaVideo, FaBookOpen } from 'react-icons/fa';

interface Story {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  videoUrl?: string;
}

const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const storiesData = await fetch("/api/story")
          .then((res) => res.json())
          .then((data) => data);
        setStories(storiesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load stories. Please try again later.');
        setLoading(false);
        console.error('Error fetching stories:', err);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="container">
      <h1>Stories</h1>
      
      {loading ? (
        <div className="loading">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="empty">
          <p>No stories found.</p>
        </div>
      ) : (
        <div className="stories-list">
          <ul>
            {stories.map((story) => (
              <li key={story.id}>
                <a href={`/stories/${story.id}`}>
                  <h3>
                    {story.videoUrl ? <FaVideo className="video-icon" /> : <FaBookOpen />} {story.title}
                  </h3>
                  <p>By {story.author} • {new Date(story.createdAt).toLocaleDateString()}</p>
                  {story.videoUrl && (
                    <div className="video-preview">
                      <video 
                        width="100%" 
                        height="auto" 
                        controls 
                        poster={`/api/video-thumbnail/${story.id}`}
                      >
                        <source src={story.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;
