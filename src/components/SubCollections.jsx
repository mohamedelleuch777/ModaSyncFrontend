import React, { useEffect } from 'react';
import { get, useApi } from '../hooks/apiHooks';
import { BinocularsFill } from 'react-bootstrap-icons'
import LoadingSpinner from './LoadingSpinner';



const stories = [
  { id: 1, name: 'Collection Eté 2024', image: 'https://i.pinimg.com/736x/8b/84/2d/8b842da000f098e8d6711d215679e51f.jpg' },
  { id: 2, name: 'Collection Hiver 2025', image: 'https://i.pinimg.com/736x/32/0a/5e/320a5eb3ffc4af1b500df89e798d1810.jpg' },
  { id: 3, name: 'Collection Aid S 2025', image: 'https://i.pinimg.com/736x/8b/84/2d/8b842da000f098e8d6711d215679e51f.jpg' },
  { id: 4, name: 'Collection Printemps 2025', image: 'https://i.pinimg.com/736x/73/89/f2/7389f2ba86f53d464fe67381daf6dead.jpg' },
  { id: 5, name: 'Collection Aid G 2025', image: 'https://i.pinimg.com/736x/8b/84/2d/8b842da000f098e8d6711d215679e51f.jpg' },
  { id: 6, name: 'Collection summerß 2025', image: 'https://i.pinimg.com/736x/73/89/f2/7389f2ba86f53d464fe67381daf6dead.jpg' },
];

function SubCollections({ selectedCollectionId }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [subCollections, setSubCollections] = React.useState([]);
  const apiFetch = useApi();

  // ✅ Get all collections
  const fetchCollections = async () => {
    const data = await get(apiFetch, '/api/subCollections/' + selectedCollectionId, {});
    setSubCollections(data);
  };
89
  useEffect(() => {
    console.log("From subcollections", selectedCollectionId);
    fetchCollections();
    if (subCollections !== -1) {
      setIsLoading(false);
    }
  }, [selectedCollectionId]);

  return (
    <div className="sub-collections sub-collections-containter">
      {
        isLoading ? <LoadingSpinner /> : (
          <>
            {
              subCollections && subCollections.map((story) => (
                <div className="sub-collection" key={story.id}>
                  <img className='sub-collection-image' src={story.image} alt={story.name} />
                  <p className='sub-collection-label'>{story.name}</p>
                </div>
              ))
            }
            {
              (subCollections && subCollections.length === 0) && (
                <div className="sub-collections-empty">
                  <h3>Empty sub collections</h3>
                  <BinocularsFill size={35} />
                </div>
              )
            }
          </>
        )
      }
    </div>
  );
}

export default SubCollections