import React, { useEffect } from 'react';
import { get, useApi } from '../hooks/apiHooks';
import { BinocularsFill } from 'react-bootstrap-icons'
import LoadingSpinner from './LoadingSpinner';

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
              subCollections && subCollections.map((subCollection) => (
                <div className="sub-collection" key={subCollection.id}>
                  <img className='sub-collection-image' src={subCollection.image} alt={subCollection.name} />
                  <div>
                    <p className='sub-collection-label'>Name: {subCollection.name}</p>
                    <p className='samples-count-label'>Samples Count: {subCollection.count}</p>
                  </div>
                </div>
              ))
            }
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