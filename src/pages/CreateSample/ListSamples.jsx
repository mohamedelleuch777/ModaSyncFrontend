import React, { useState, useEffect } from 'react';
import { get, del, useApi } from '../../hooks/apiHooks';
import { TrashFill } from 'react-bootstrap-icons';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import ButtonSliderWrapper from '../../components/ButtonSliderWrapper';
import './ListSamples';

const ListSamples = ({ selectedSubCollectionId, selectedSubCollectionName }) => {
  const apiFetch = useApi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [samples, setSamples] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSamples();
  }, [selectedSubCollectionId]);

  const fetchSamples = async () => {
    if (!selectedSubCollectionId) return;

    try {
      const data = await get(apiFetch, `/api/samples/${selectedSubCollectionId}`, {});
      if (data.error) {
        setError(data.error);
      } else {
        setSamples(data);
      }
    } catch (err) {
      console.error('Error fetching samples:', err);
      setError('Failed to fetch samples.');
    }
  };

  const handleDelete = async (sampleId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sample?");
    if (!confirmDelete) return;

    try {
      const response = await del(apiFetch, `/api/samples/${sampleId}`);
      if (response.error) {
        setError(response.error);
      } else {
        setSamples(samples.filter(sample => sample.id !== sampleId));
        alert('Sample deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting sample:', err);
      setError('Failed to delete sample.');
    }
  };

  return (
    <div className="list-samples-container">
      <Topbar setIsMenuOpen={setIsMenuOpen} />
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div className="list-samples-card">
        <h2 className="list-samples-title">{ selectedSubCollectionName }</h2>
        {error && <p className="error-text">{error}</p>}

        <div className="samples-list">
          {samples.length > 0 ? (
            samples.map((sample) => (
              <ButtonSliderWrapper key={sample.id}>
                <div className="sample-item">
                  <img className="sample-image" src={sample.imageUrl} alt={sample.name} />
                  <div className="sample-info">
                    <p className="sample-name">{sample.name}</p>
                    <p className="sample-description">{sample.description}</p>
                  </div>
                </div>
                {/* Slide to Reveal Delete Button */}
                <button className="delete-sample-button" onClick={() => handleDelete(sample.id)}>
                    <TrashFill size={25}/>
                </button>
              </ButtonSliderWrapper>
            ))
          ) : (
            <p className="no-samples-text">No samples found for this sub-collection.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListSamples;
