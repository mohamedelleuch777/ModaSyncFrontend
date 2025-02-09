import React, { useEffect } from 'react';
import { get, useApi } from '../hooks/apiHooks';

// const stories = [
//   { id: 1, name: 'Collection Eté 2024', image: 'https://i.pinimg.com/736x/8b/84/2d/8b842da000f098e8d6711d215679e51f.jpg' },
//   { id: 2, name: 'Collection Hiver 2025', image: 'https://i.pinimg.com/736x/32/0a/5e/320a5eb3ffc4af1b500df89e798d1810.jpg' },
//   { id: 3, name: 'Collection Aid S 2025', image: 'https://i.pinimg.com/736x/8b/84/2d/8b842da000f098e8d6711d215679e51f.jpg' },
//   { id: 4, name: 'Collection Printemps 2025', image: 'https://i.pinimg.com/736x/73/89/f2/7389f2ba86f53d464fe67381daf6dead.jpg' },
//   { id: 5, name: 'Collection Aid G 2025', image: 'https://i.pinimg.com/736x/8b/84/2d/8b842da000f098e8d6711d215679e51f.jpg' },
//   { id: 6, name: 'Collection summerß 2025', image: 'https://i.pinimg.com/736x/73/89/f2/7389f2ba86f53d464fe67381daf6dead.jpg' },
// ];

function CollectionsStory({ setSelectedCollectionId }) {
  const [stories, setStories] = React.useState([]);
  const apiFetch = useApi();

  // ✅ Get all collections
  const fetchCollections = async () => {
    const data = await get(apiFetch, '/api/collections', {});
    setStories(data);
  };

  // Load collections when the component mounts.
  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="collections-story collections-story-containter">
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