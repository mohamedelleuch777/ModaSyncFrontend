import React, { useEffect } from 'react';
import { get, useApi } from '../hooks/apiHooks';
import { BinocularsFill } from 'react-bootstrap-icons'
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';

function SubCollections({ selectedCollectionId }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [subCollections, setSubCollections] = React.useState([]);
  const apiFetch = useApi();
  const navigate = useNavigate();

  // ✅ Get all collections
  const fetchCollections = async () => {
    const data = await get(apiFetch, '/api/subCollections/' + selectedCollectionId, {});
    setSubCollections(data);
  };

  const handleCreateSubcollection = (e) => {
    navigate('/create-sub-collection');
  };

  useEffect(() => {
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
              <div className="sub-collection">
                Add New Sub Collection
                <span className='sub-collection-image' onClick={handleCreateSubcollection}>➕</span>
              </div>
            <div style={{ overflowY: 'scroll' }}>
            {
              subCollections && subCollections.map((subCollection) => (
                <div className="sub-collection" key={subCollection.id}>
                  <img className='sub-collection-image' src={subCollection.image} alt={subCollection.name} />
                  <div>
                    <p className='sub-collection-label'>Name: {subCollection.name}</p>
                    <p className='sub-collection-description'>{subCollection.description}</p>
                    <p className='samples-count-label'>Samples Count: {subCollection.count}</p>
                  </div>
                </div>
              ))
            }
            </div>
            {
              (subCollections && subCollections.length === 0) && (
                <div className="sub-collections-empty">
                  <h3>Empty sub collections</h3>
                  <BinocularsFill size={35} color='#6da49c'/>
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