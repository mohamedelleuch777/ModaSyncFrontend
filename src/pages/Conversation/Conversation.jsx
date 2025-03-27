import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { useApi, get, del, put } from '../../hooks/apiHooks';
// import { Comments } from 'react-comments-section'
// import 'react-comments-section/dist/index.css'
import LoadingSpinner from '../../components/LoadingSpinner';
import DynamicIcon from '../../components/DynamicIcon';



const Conversation = () => {
  const navigate = useNavigate();
  const { state: { sample } } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [user, setUser] = useState(null);
  // const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiFetch = useApi();
  const conversations = 
  [
    {
      "id": 1,
      "sample_id": 24,
      "comment_owner": 1,
      "comment_text": "this time it will work v1 fnsajf bafghdb hjaskbhvb dsafsadkvgggggggggadgb jask",
      "createdAt": "2025-03-26 03:10:05"
    },
    {
      "id": 2,
      "sample_id": 24,
      "comment_owner": 2,
      "comment_text": "this time it will work v2",
      "createdAt": "2025-03-26 03:10:05"
    },{
      "id": 1,
      "sample_id": 24,
      "comment_owner": 1,
      "comment_text": "this time it will work v1 fnsajf bafghdb hjaskbhvb dsafsadkvgggggggggadgb jask",
      "createdAt": "2025-03-26 03:10:05"
    },
    {
      "id": 3,
      "sample_id": 24,
      "comment_owner": 2,
      "comment_text": "this time it will work v3",
      "createdAt": "2025-03-26 03:10:05"
    },
    {
      "id": 3,
      "sample_id": 24,
      "comment_owner": 2,
      "comment_text": "this time it will work v3",
      "createdAt": "2025-03-26 03:10:05"
    },
    {
      "id": 3,
      "sample_id": 24,
      "comment_owner": 2,
      "comment_text": "this time it will work v3",
      "createdAt": "2025-03-26 03:10:05"
    },
    {
      "id": 3,
      "sample_id": 24,
      "comment_owner": 2,
      "comment_text": "this time it will work v3",
      "createdAt": "2025-03-26 03:10:05"
    },
    {
      "id": 3,
      "sample_id": 24,
      "comment_owner": 2,
      "comment_text": "this time it will work v3",
      "createdAt": "2025-03-26 03:10:05"
    },
    {
      "id": 3,
      "sample_id": 24,
      "comment_owner": 2,
      "comment_text": "this time it will work v3",
      "createdAt": "2025-03-26 03:10:05"
    },
    {
      "id": 3,
      "sample_id": 24,
      "comment_owner": 2,
      "comment_text": "this time it will work v3",
      "createdAt": "2025-03-26 03:10:05"
    }
  ]

  const fetchConversation = async () => {
    try {
      const data = await get(apiFetch, `/api/comments/${sample.id}`, {});
      if (data.error) {
        setError(data.error);
      } else {
        // setConversations(data);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to fetch conversations.');
    }
    setIsLoading(false);
  };
  
  const handleTextOverflow = (evt) => {
    const textarea = evt.target
    textarea.style.height = "auto";
    if(textarea.value.length !== 0) {
      textarea.style.height = textarea.scrollHeight + "px";
    }
  } 

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log(token);
    setUser(jwtDecode(token).user)
    fetchConversation();
  }, []);
  

  if(!user) {
    return (<></>)
  }
  return (
    <div className="conversation-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="conversation-card">
        {
          isLoading ? <LoadingSpinner /> : (
            <>
            <div className='comments-container'>
              {
                conversations.map((conversation) => (
                  conversation.comment_owner === user.id ? (
                    <div key={conversation.id} className="conversation-card-comment-container owner">
                      <div className="conversation-card-comment">
                        {conversation.comment_text}
                      </div>
                    </div>
                  ) : (
                    <div key={conversation.id} className="conversation-card-comment-container">
                      <div className="conversation-card-comment">
                        {conversation.comment_text}
                      </div>
                    </div>
                  )
                ))
              }
            </div>
            <div className='conversation-card-comment-input'>
              <textarea onInput={handleTextOverflow} rows="1" placeholder="Type a message..."></textarea>
              <button>
                <DynamicIcon iconName="ChatTextFill" color='white' />
              </button>
            </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default Conversation;
