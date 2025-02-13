import React, { useEffect } from 'react';
import { get, useApi } from '../hooks/apiHooks';

function CollectionsStory({ setSelectedCollectionId }) {
  const [stories, setStories] = React.useState([]);
  const apiFetch = useApi();

  // ✅ Get all collections
  const fetchCollections = async () => {
    const data = await get(apiFetch, '/api/collections', {});
    setStories(data);
  };

  const handleCreateStory = () => {
    setSelectedCollectionId(-1);
  };

  // Load collections when the component mounts.
  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="collections-story collections-story-containter">
      <div className="story" onClick={() => handleCreateStory()}>
        <span className='story-image'>➕</span>
        <p className='story-label'>{'Create Collection'}</p>
      </div>
      {
        stories && stories.map((story) => (
          <div className="story" key={story.id} onClick={() => setSelectedCollectionId(story.id)}>
            <img className='story-image' src={story.image} alt={story.name} />
            <p className='story-label'>{story.name}</p>
          </div>
        ))
      }
    </div>
  );
}

export default CollectionsStory