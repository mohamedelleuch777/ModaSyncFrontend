import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { useApi, get, del, put, post } from '../../hooks/apiHooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import DynamicIcon from '../../components/DynamicIcon';
import { SAMPLE_STATUS } from '../../constants';



const TaskList = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const apiFetch = useApi();
  
  useEffect(() => {
    console.log('fetching user');
    setIsLoading(false);
  }, []);
  


  return (
    <div className="conversation-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="conversation-card">
        {
          isLoading ? <LoadingSpinner /> : (
            <>
              task
            </>
          )
        }
      </div>
    </div>
  );
};

export default TaskList;
