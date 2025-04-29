import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

  const getMyTasks = async () => {
    setIsLoading(true);
    const data = await get(apiFetch, '/tasks');
    console.log(data);
    setTimeLines(data);
    setIsLoading(false);
  }

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
      timeLines.map((timeLine, key) => (
        <div key={key} className="sample-item task-item" onClick={() => handleSampleSelection(timeLine.sample_id)}>
          {/* <img className="sample-image" src={formatUrl(sample.image)} alt={sample.name} /> */}
          <div className="sample-info">
            <p className="sample-name">
              {/* <span>{sample.name}</span> */}
              <span>Sample ID: {timeLine.sample_id}</span>
              {isNextTaskMine(timeLine) && <span className='red-dot'></span>}
            </p>
            {/* <p className="sample-description">{description}</p> */}
            <div className="sample-status">
              Status: <span>{getIconNameFromStatus(timeLine).status}</span>
              <DynamicIcon iconName={getIconNameFromStatus(timeLine).iconName} color="var(--primary-color)" />
            </div>
          </div>
        </div>
      ))
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
