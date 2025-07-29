// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import CollectionsStory from '../../components/CollectionsStory';
import SubCollections from '../../components/SubCollections';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useApi, get } from '../../hooks/apiHooks';
import { formatUrl } from '../../constants';

const Dashboard = ({ setSelectedSubCollectionId, setSelectedSubCollectionName }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(-1);
  const [collectionName, setCollectionName] = useState('');
  const [updateCollectionView, setUpdateCollectionView] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [allCollections, setAllCollections] = useState([]);
  const [allSubCollections, setAllSubCollections] = useState([]);
  const [allSamples, setAllSamples] = useState([]);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const apiFetch = useApi();

  useEffect(() => {
    console.log("location.selectedCollectionId", location);
    if (location.state) {
        setSelectedCollectionId(location.state.selectedCollection.id);
        setCollectionName(location.state.selectedCollection.name);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.selectedCollectionId = selectedCollectionId;
  }, [selectedCollectionId]);

  // Fetch all collections, subcollections, and samples for search
  const fetchSearchData = async () => {
    try {
      // Fetch all collections
      const collections = await get(apiFetch, '/collections', {});
      setAllCollections(collections || []);

      // Fetch all subcollections and samples for each collection
      let allSubs = [];
      let allSamplesData = [];
      
      for (const collection of collections || []) {
        const subs = await get(apiFetch, `/subCollections/${collection.id}`, {});
        const enrichedSubs = (subs || []).map(sub => ({
          ...sub,
          parentCollectionName: collection.name,
          parentCollectionId: collection.id
        }));
        allSubs = [...allSubs, ...enrichedSubs];

        // Fetch samples for each subcollection
        for (const sub of enrichedSubs) {
          try {
            const samples = await get(apiFetch, `/samples/${sub.id}`, {});
            const enrichedSamples = (samples || []).map(sample => ({
              ...sample,
              parentSubCollectionName: sub.name,
              parentSubCollectionId: sub.id,
              parentCollectionName: collection.name,
              parentCollectionId: collection.id
            }));
            allSamplesData = [...allSamplesData, ...enrichedSamples];
          } catch (sampleError) {
            console.warn(`Error fetching samples for subcollection ${sub.id}:`, sampleError);
          }
        }
      }
      
      setAllSubCollections(allSubs);
      setAllSamples(allSamplesData);
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };

  // Search function
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const results = [];
    const searchTerm = query.toLowerCase();

    // Search in collections
    allCollections.forEach(collection => {
      if (collection.name.toLowerCase().includes(searchTerm) || 
          (collection.description && collection.description.toLowerCase().includes(searchTerm))) {
        results.push({
          id: `collection-${collection.id}`,
          type: 'collection',
          name: collection.name,
          description: collection.description,
          image: collection.image,
          icon: '🗂️',
          data: collection
        });
      }
    });

    // Search in subcollections
    allSubCollections.forEach(subCollection => {
      if (subCollection.name.toLowerCase().includes(searchTerm) || 
          (subCollection.description && subCollection.description.toLowerCase().includes(searchTerm))) {
        results.push({
          id: `subcollection-${subCollection.id}`,
          type: 'subcollection',
          name: subCollection.name,
          description: subCollection.description,
          image: subCollection.image,
          icon: '📂',
          parentName: subCollection.parentCollectionName,
          data: subCollection
        });
      }
    });

    // Search in samples
    allSamples.forEach(sample => {
      if (sample.name.toLowerCase().includes(searchTerm) || 
          (sample.description && sample.description.toLowerCase().includes(searchTerm))) {
        results.push({
          id: `sample-${sample.id}`,
          type: 'sample',
          name: sample.name,
          description: sample.description,
          image: sample.image,
          icon: '🏷️',
          parentName: `${sample.parentCollectionName} > ${sample.parentSubCollectionName}`,
          data: sample
        });
      }
    });

    // Sort results by type priority (collections first, then subcollections, then samples)
    results.sort((a, b) => {
      const typeOrder = { collection: 0, subcollection: 1, sample: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    });

    setSearchResults(results);
    setShowSearchDropdown(true);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  // Handle search result selection
  const handleSearchResultClick = async (result) => {
    if (result.type === 'collection') {
      setSelectedCollectionId(result.data.id);
      setCollectionName(result.data.name);
    } else if (result.type === 'subcollection') {
      // Navigate to the subcollection's samples
      setSelectedSubCollectionId(result.data.id);
      setSelectedSubCollectionName(result.data.name);
      navigate('/list-samples');
    } else if (result.type === 'sample') {
      try {
        setIsLoadingSample(true);
        // Fetch complete sample data with timeline before navigating
        const completeSample = await get(apiFetch, `/samples/sample/${result.data.id}`, {});
        if (completeSample && !completeSample.error) {
          // Navigate to sample details with complete data
          navigate('/samples-details', { 
            state: { sample: completeSample }
          });
        } else {
          console.error('Failed to fetch complete sample data:', completeSample);
          // Fallback: try with original data
          navigate('/samples-details', { 
            state: { sample: result.data }
          });
        }
      } catch (error) {
        console.error('Error fetching sample details:', error);
        // Fallback: try with original data
        navigate('/samples-details', { 
          state: { sample: result.data }
        });
      } finally {
        setIsLoadingSample(false);
      }
    }
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  // Handle search input focus/blur
  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setShowSearchDropdown(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding dropdown to allow clicking on results
    setTimeout(() => setShowSearchDropdown(false), 200);
  };

  // Initialize search data
  useEffect(() => {
    fetchSearchData();
  }, []);

  return (
    <div className="dashboard-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      { isLoading && <LoadingSpinner /> }
      {
        <section className="dashboard-sub-container" style={{ display: isLoading ? 'none' : 'flex' }}>
          <div className={`search-container ${showSearchDropdown ? 'dropdown-open' : ''}`}>
            <input 
              className='dashboard-search' 
              type="search" 
              placeholder="Search collections and subcollections..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {showSearchDropdown && (
              <div className="search-dropdown">
                {isLoadingSample && (
                  <div className="search-loading">
                    <LoadingSpinner />
                    <span>Loading sample details...</span>
                  </div>
                )}
                {searchResults.length > 0 ? (
                  searchResults.map(result => (
                    <div 
                      key={result.id} 
                      className="search-result-item"
                      data-type={result.type}
                      onClick={() => handleSearchResultClick(result)}
                      style={{opacity: isLoadingSample ? 0.5 : 1, pointerEvents: isLoadingSample ? 'none' : 'auto'}}
                    >
                      <img 
                        src={formatUrl(result.image)} 
                        alt={result.name}
                        className="search-result-image"
                      />
                      <div className="search-result-content">
                        <div className="search-result-name">
                          {result.name} 
                          <span className="search-result-type">
                            {result.icon}
                          </span>
                          <span className="search-result-type-label">
                            {result.type}
                          </span>
                        </div>
                        <div className="search-result-description">
                          {result.description}
                        </div>
                        {(result.type === 'subcollection' || result.type === 'sample') && (
                          <div className="search-result-parent">
                            in: {result.parentName}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
          <CollectionsStory 
            setSelectedCollectionId={setSelectedCollectionId}
            setCollectionName={setCollectionName}
            setUpdateCollectionView={setUpdateCollectionView}
            setLoading={setIsLoading} 
          />
          <SubCollections 
            selectedCollectionId={selectedCollectionId} 
            collectionName={collectionName} 
            updateCollectionView={updateCollectionView} 
            setSelectedSubCollectionId={setSelectedSubCollectionId}
            setSelectedSubCollectionName={setSelectedSubCollectionName}
          />
        </section>
      }
    </div>
  );
};

export default Dashboard;
