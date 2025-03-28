import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { useApi, get, del, put, post } from '../../hooks/apiHooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import DynamicIcon from '../../components/DynamicIcon';
import useSSE from '../../hooks/useSSE';
import { SAMPLE_STATUS } from '../../constants';



const Conversation = () => {
  const navigate = useNavigate();
  const { state: { sample } } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isConversationActive, setIsConversationActive] = useState(false);
  

  const apiFetch = useApi();
  const textareaRef = useRef(null);

  const checkConversationStatus = () => {
    const timeLine = sample.timeline[0];
    if (timeLine.status === SAMPLE_STATUS.NEW
      || timeLine.status === SAMPLE_STATUS.IN_REVIEW
    ) {
      setIsConversationActive(true);
    }
  };

  const fetchConversation = async () => {
    try {
      const data = await get(apiFetch, `/api/comments/${sample.id}`, {});
      if (data.error) {
        setError(data.error);
      } else {
        setConversations(data);
        // textareaRef.current.sc
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
    setMessage(textarea.value);
  }

  const sendMessage = async () => {
    if(message.length === 0) return;
    try {
      console.log("send message");
      textareaRef.current.disabled = true
      const data = await post(apiFetch, `/api/comments`, {
        sample_id: sample.id,
        comment_text: message
      });
      if (data.error) {
        setError(data.error);
      } else {
        setMessage('');
        textareaRef.current.value = '';
        const evt = { target: textareaRef.current };
        handleTextOverflow(evt);
        fetchConversation();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message.');
    }
    textareaRef.current.disabled = false
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    checkConversationStatus();
    setUser(jwtDecode(token).user)
    fetchConversation();
  }, []);

  useSSE((data) => {
    console.log('SSE Update:', data);
    if(data.type === 'comment') {
      fetchConversation();
    }
  });
  

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
            {
              isConversationActive && (
                <div className='conversation-card-comment-input'>
                  <textarea ref={textareaRef} onInput={handleTextOverflow} rows="1" placeholder="Type a message..."></textarea>
                  <button disabled={message.length === 0} className='btn-send-msg noselect' onClick={sendMessage}>
                    <DynamicIcon iconName={"ChatTextFill"} color='white' />
                  </button>
                </div>
              )
            }
            </>
          )
        }
      </div>
    </div>
  );
};

export default Conversation;
