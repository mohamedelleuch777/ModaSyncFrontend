import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, useApi } from '../hooks/apiHooks';

function CollectionsStory({ setLoading, setSelectedCollectionId, setCollectionName, setUpdateCollectionView }) {
  const [stories, setStories] = React.useState([]);
  const navigate = useNavigate();
  const apiFetch = useApi();

  // ✅ Get all collections
  const fetchCollections = async (e) => {
    console.log('fetching collections');
    const data = await get(apiFetch, '/api/collections', {});
    setStories(data);
    console.log('done');
    setLoading(false);
  };

  const handleCreateStory = () => {
    setSelectedCollectionId(-1);
    navigate('/create-collection');
  };
  
  const selectStory = (story, e) => {
    e.stopPropagation();
    setSelectedCollectionId(story.id);
    setCollectionName(story.name);
    let selectedHtmlElement = e.target;
    while (selectedHtmlElement.tagName !== 'DIV') {
      selectedHtmlElement = selectedHtmlElement.parentElement;
    }
    const listOfAllStories = document.querySelectorAll('.collections-story.collections-story-containter .story');
    listOfAllStories.forEach(story => {
      story.classList.remove('active');
    });
    selectedHtmlElement.classList.add('active');
  };

  // Load collections when the component mounts.
  useEffect(() => {
    fetchCollections();
    setUpdateCollectionView(() => fetchCollections);
  }, []);

  return (
    <div className="collections-story collections-story-containter">
      <div className="story" onClick={() => handleCreateStory()}>
        <span className='story-image'>➕</span>
        <p className='story-label'>{'Create Collection'}</p>
      </div>
      {
        stories && stories.map((story) => (
          <div className="story" key={story.id} onClick={(e) => selectStory(story,e)}>
            <img className='story-image' src={story.image} alt={story.name} />
            <p className='story-label'>{story.name}</p>
          </div>
        ))
      }
    </div>
  );
}

export default CollectionsStory