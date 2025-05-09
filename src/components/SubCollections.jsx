import React, { useEffect, useRef } from 'react';
import { get, del, useApi } from '../hooks/apiHooks';
import { BinocularsFill, TrashFill, BuildingFillAdd, XCircleFill, Collection } from 'react-bootstrap-icons'
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import ButtonSliderWrapper from './ButtonSliderWrapper';
import { formatUrl } from '../constants';

function SubCollections({ selectedCollectionId, collectionName, updateCollectionView, setSelectedSubCollectionId, setSelectedSubCollectionName }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [subCollections, setSubCollections] = React.useState([]);
  const apiFetch = useApi();
  const navigate = useNavigate();

  // ✅ Get all collections
  const fetchCollections = async () => {
    setIsLoading(true);
    const data = await get(apiFetch, '/subCollections/' + selectedCollectionId, {});
    setSubCollections(data);
    setIsLoading(false);
  };

  // ✅ Delete collections
  const deleteCollection = async () => {
    setIsLoading(true);
    const data = await del(apiFetch, '/collections/' + selectedCollectionId, {});
    if (!data.error) {
      setSubCollections([]);
      updateCollectionView();
    }
    setIsLoading(false);
  };

  // ✅ Delete sub-collections
  const deleteSubCollection = async (subCollection_ID) => {
    setIsLoading(true);
    const data = await del(apiFetch, '/subCollections/' + subCollection_ID, {});
    if (!data.error) {
      setSubCollections([]);
      updateCollectionView();
    }
    setIsLoading(false);
  };

  const handleCreateSubcollection = (e) => {
    navigate('/create-sub-collection');
  };

  const handleDeleteSubcollection = (e, subCollection) => {
    console.log(subCollection);
    if (window.confirm("Are you sure that you want to delete <" +  subCollection.name + "> sub collection?")) {
      deleteSubCollection(subCollection.id);
    } else {
      console.log("User clicked No");
    }
  };

  const handleDeleteCollection = (e) => {
    if (window.confirm("Are you sure that you want to delete <" +  collectionName + "> collection?")) {
      deleteCollection();
    } else {
      console.log("User clicked No");
    }
    
  };

  const handleCreateSample = ( action ) => {
    switch(action) {
      case 'create':
        navigate('create-sample');
      break;
    }
  }

  const handleSubCollectionSelection = (subCollection) => {
    setSelectedSubCollectionId(subCollection.id);
    setSelectedSubCollectionName(subCollection.name);
    navigate('/list-samples')
  }

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
                    <span className='sub-collection-image' onClick={handleDeleteCollection}>🗑️</span>
                    <span className='sub-collection-image' onClick={handleCreateSubcollection}>➕</span>
                  </section>
              </div>)
              }
            <div style={{ overflowY: 'scroll', overflowX: 'hidden', paddingTop: 47 }}>
            {
              subCollections && subCollections.map((subCollection) => (
                <ButtonSliderWrapper key={subCollection.id}>
                  <div className="sub-collection" onClick={() => handleSubCollectionSelection(subCollection)}>
                    {console.log(subCollection)}
                    <img className='sub-collection-image' src={formatUrl(subCollection.image)} alt={subCollection.name} />
                    <div>
                      <p className='sub-collection-label'>{subCollection.name}</p>
                      <p className='sub-collection-description'>{subCollection.description}</p>
                      <p className='samples-count-label'>Samples Count: {subCollection.count}</p>
                    </div>
                  </div>
                  {/* extra buttons */}
                  <button className='cta-button success'><BuildingFillAdd size={35} color='#fff' onClick={() => handleCreateSample('create')}/></button>
                  <button className='cta-button danger'><TrashFill size={35} color='#fff' onClick={(e) => handleDeleteSubcollection(e,subCollection)}/></button>
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