import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, del, useApi } from '../../hooks/apiHooks';
import { TrashFill } from 'react-bootstrap-icons';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import ButtonSliderWrapper from '../../components/ButtonSliderWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import './ListSamples';
import DynamicIcon from '../../components/DynamicIcon';
import { formatUrl, getIconNameFromStatus, isNextTaskMine } from '../../constants';
import { messageBox } from '../../constants';

const ListSamples = ({ selectedSubCollectionId, selectedSubCollectionName }) => {
  const navigate = useNavigate();
  const apiFetch = useApi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [samples, setSamples] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSamples();
  }, [selectedSubCollectionId]);

  const fetchSamples = async () => {
    if (!selectedSubCollectionId) return;

    try {
      // const data = await get(apiFetch, `/samples/${selectedSubCollectionId}`, {});
      const data = await get(apiFetch, `/samples/${selectedSubCollectionId}`, {});
      if (data.error) {
        setError(data.error);
      } else {
        setSamples(data);
      }
    } catch (err) {
      console.error('Error fetching samples:', err);
      setError('Failed to fetch samples.');
    }
    setIsLoading(false);
  };

  const handleDelete = async (sampleId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sample?");
    if (!confirmDelete) return;

    try {
      const response = await del(apiFetch, `/samples/${sampleId}`);
      if (response.error) {
        setError(response.error);
      } else {
        setSamples(samples.filter(sample => sample.id !== sampleId));
        messageBox('Sample deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting sample:', err);
      setError('Failed to delete sample.');
    }
  };

  const handleSampleSelection = (sample) => {
    navigate(`/samples-details`, { state: { sample } });
  };

  return (
    <div className="list-samples-container">
      <Topbar setIsMenuOpen={setIsMenuOpen} />
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div className="list-samples-card">
        {
            (samples && selectedSubCollectionName !== '') && (
            <div className="samples-header-collection-name">
            {selectedSubCollectionName}
            <section>
                <span className='cta-buttons' onClick={() => navigate('/create-sample')}>➕</span>
            </section>
            </div>)
        }
        {error && <p className="error-text">{error}</p>}

        {
          isLoading ? <LoadingSpinner /> :
          <div className="samples-list">
            {samples.length > 0 ? (
              console.log(samples),
              samples.map((sample) => (
                <ButtonSliderWrapper key={sample.id}>
                  <div className="sample-item" onClick={() => handleSampleSelection(sample)}>
                    <img className="sample-image" src={formatUrl(sample.image)} alt={sample.name} />
                    <div className="sample-info">
                      <p className="sample-name">
                        <span>{sample.name}</span>
                        {isNextTaskMine(sample.timeline[0]) && <span className='red-dot'></span>}
                      </p>
                      <p className="sample-description">{sample.description}</p>
                      <div className="sample-status">
                        Status: <span>{getIconNameFromStatus(sample.timeline[0]).status}</span>
                        <DynamicIcon iconName={getIconNameFromStatus(sample.timeline[0]).iconName} color="var(--primary-color)" />
                      </div>
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
        }
      </div>
    </div>
  );
};

export default ListSamples;
