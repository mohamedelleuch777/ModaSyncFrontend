import React, { useEffect, useRef } from 'react';
import { get, useApi } from '../hooks/apiHooks';
import { BinocularsFill, TrashFill, BuildingFillAdd, XCircleFill } from 'react-bootstrap-icons'
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import ButtonSliderWrapper from './ButtonSliderWrapper';

function SubCollections({ selectedCollectionId, collectionName }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [subCollections, setSubCollections] = React.useState([]);
  const apiFetch = useApi();
  const navigate = useNavigate();

  // ✅ Get all collections
  const fetchCollections = async () => {
    setIsLoading(true);
    const data = await get(apiFetch, '/api/subCollections/' + selectedCollectionId, {});
    setSubCollections(data);
    setIsLoading(false);
  };

  const handleCreateSubcollection = (e) => {
    navigate('/create-sub-collection');
  };

  const handleDeleteSubcollection = (e) => {
    if (window.confirm("Are you sure that you want to delete <" +  collectionName + "> collection?")) {
      console.log("User clicked Yes");
    } else {
      console.log("User clicked No");
    }
    
  };

  useEffect(() => {
    fetchCollections();
  }, [selectedCollectionId]);

  return (
    <div className="sub-collections sub-collections-containter">
      {
        isLoading ? <LoadingSpinner /> : (
          <>
              {
              (subCollections && collectionName !== '') && (
              <div className="sub-collection">
                {collectionName}
                  <section>
                    <span className='sub-collection-image' onClick={handleDeleteSubcollection}>🗑️</span>
                    <span className='sub-collection-image' onClick={handleCreateSubcollection}>➕</span>
                  </section>
              </div>)
              }
            <div style={{ overflowY: 'scroll', overflowX: 'hidden', paddingTop: 47 }}>
            {
              subCollections && subCollections.map((subCollection) => (
                <ButtonSliderWrapper key={subCollection.id}>
                  <div className="sub-collection">
                    <img className='sub-collection-image' src={subCollection.image} alt={subCollection.name} />
                    <div>
                      <p className='sub-collection-label'>{subCollection.name}</p>
                      <p className='sub-collection-description'>{subCollection.description}</p>
                      <p className='samples-count-label'>Samples Count: {subCollection.count}</p>
                    </div>
                  </div>
                  {/* extra buttons */}
                  <button className='cta-button success'><BuildingFillAdd size={35} color='#fff'/></button>
                  <button className='cta-button danger'><TrashFill size={35} color='#fff'/></button>
                </ButtonSliderWrapper>
              ))
            }
            </div>
            {
              (subCollections && subCollections.length === 0) && (
                <div className="sub-collections-empty">
                {
                  collectionName === '' ? 
                    <div style={{textAlign: 'center'}}>
                      <h3>No sub collection was selected</h3> 
                      <XCircleFill size={35} color='#6da49c'/>
                    </div> : 
                    <div style={{textAlign: 'center'}}>
                      <h3>Empty sub collections</h3>
                      <BinocularsFill size={35} color='#6da49c'/>
                    </div>
                }
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