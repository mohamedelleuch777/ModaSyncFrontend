import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { useApi, get } from '../../hooks/apiHooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import DynamicIcon from '../../components/DynamicIcon';
import { 
  formatUrl, 
  getIconNameFromStatus, 
  isNextTaskMine,
  messageBox
} from '../../constants';



const TaskList = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLines, setTimeLines] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);


  const apiFetch = useApi();

  const getSamplePath = (sample) => {
    if (!sample) return '';
    if (sample.path) return sample.path;
    const collection = sample.collection?.name || sample.collection_name || '';
    const sub = sample.subcollection?.name || sample.sub_collection?.name || sample.subcollection_name || '';
    const name = sample.name || '';
    return [collection, sub, name].filter(Boolean).join(' > ');
  };

  const getMyTasks = async () => {
    setIsLoading(true);
    const data = await get(apiFetch, '/tasks');
    const withPaths = await Promise.all((data || []).map(async (t) => {
      try {
        const sample = await get(apiFetch, '/samples/sample/' + t.sample_id);
        return { ...t, samplePath: getSamplePath(sample) };
      } catch {
        return { ...t, samplePath: '' };
      }
    }));
    setTimeLines(withPaths);
    setIsLoading(false);
  };

  const handleSampleSelection = async (sample_id) => {
    const data = await get(apiFetch, '/samples/sample/' + sample_id);
    setSelectedSample(data);
  }

  const renderTimeLines = () => {
    if (timeLines.length == 0) {
      return (
        <div className="sample-item task-item">
          <div className="sample-info">
            <p className="sample-name">
              <span>There are no tasks</span>
            </p>
          </div>
        </div>
      )
    }
    else {
      return timeLines.map((timeLine, key) => {
        // samplePath is already an array: [collection, subcollection, sample]
        const pathParts = Array.isArray(timeLine.samplePath) ? timeLine.samplePath : [];
        const collectionName = pathParts[0] || '';
        const subcollectionName = pathParts[1] || '';
        const sampleName = pathParts[2] || `Sample ${timeLine.sample_id}`;
        
        return (
          <div key={key} className="sample-item task-item" onClick={() => handleSampleSelection(timeLine.sample_id)}>
            <div className="sample-info">
              <p className="sample-name">
                <span>🏷️ {sampleName}</span>
                {isNextTaskMine(timeLine) && <span className='red-dot'></span>}
              </p>
              
              {/* Collection line */}
              {collectionName && (
                <p className="sample-path">
                  <span>🗂️ {collectionName}</span>
                </p>
              )}
              
              {/* Subcollection line */}
              {subcollectionName && (
                <p className="sample-path">
                  <span>📂 {subcollectionName}</span>
                </p>
              )}
              
              <div className="sample-status">
                Status: <span>{getIconNameFromStatus(timeLine).status}</span>
                <DynamicIcon iconName={getIconNameFromStatus(timeLine).iconName} color="var(--primary-color)" />
              </div>
              
              {/* ID at bottom */}
              <p style={{ fontSize: '12px', color: '#adb5bd', margin: '4px 0 0 0' }}>
                ID: {timeLine.sample_id}
              </p>
            </div>
          </div>
        )
      })
    }
  }

  useEffect(() => {
    if (!selectedSample || selectedSample.error) return;
    setIsLoading(true);
    navigate(`/samples-details`, { state: { sample: selectedSample } });
  }, [selectedSample]);
  
  useEffect(() => {
    getMyTasks();
  }, []);
  

  return (
    <div className="task-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="task-card">
        {
          isLoading ? <LoadingSpinner /> : (
            <>
              { renderTimeLines() }
            </>
          )
        }
      </div>
    </div>
  );
};

export default TaskList;
