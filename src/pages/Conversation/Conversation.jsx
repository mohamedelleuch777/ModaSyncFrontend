import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { useApi, get, del, put, post } from '../../hooks/apiHooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import DynamicIcon from '../../components/DynamicIcon';
import { SAMPLE_STATUS } from '../../constants';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

const stringToColorPair = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  
  // Ensure background is dark enough (lightness between 25% and 65%)
  // and has good saturation (between 50% and 80%)
  const lightness = 25 + (Math.abs(hash) % 40); // 25% to 65%
  const saturation = 50 + (Math.abs(hash >> 8) % 30); // 50% to 80%
  
  const bg = `hsl(${h}, ${saturation}%, ${lightness}%)`;
  const text = 'white';
  
  return [bg, text];
};

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  try {
    return format(new Date(timestamp), "📅 EEE dd-MM-yyyy ⌚ HH:mm", { locale: enGB });
  } catch {
    return '';
  }
};



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
  const commentsContainerRef = useRef(null);

  const checkConversationStatus = () => {
    const timeLine = sample.timeline[0];
    if (
      timeLine.status !== SAMPLE_STATUS.READY &&
      timeLine.status !== SAMPLE_STATUS.REJECTED
    ) {
      setIsConversationActive(true);
    }
  };

  const scrollTextArea = () => {
    if(!commentsContainerRef.current) return
    commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
  }

  const fetchConversation = async () => {
    try {
      const data = await get(apiFetch, `/comments/${sample.id}`, {});
      if (data.error) {
        setError(data.error);
      } else {
        setConversations(data);
        scrollTextArea()
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
    scrollTextArea()
  }

  const sendMessage = async () => {
    if(message.length === 0) return;
    try {
      console.log("send message");
      textareaRef.current.disabled = true
      const data = await post(apiFetch, `/comments`, {
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
        scrollTextArea()
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
    scrollTextArea()
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
            <div ref={commentsContainerRef} className='comments-container'>
              {
                conversations.map((conversation) => {
                  const isOwner = conversation.comment_owner === user.id;
                  const name = isOwner ? user.name : conversation.user?.name;
                  const phone = isOwner ? user.phone : conversation.user?.phone;
                  const initials = getInitials(name);
                  const [bgColor, textColor] = stringToColorPair(phone || '');
                  return (
                    <div
                      key={conversation.id}
                      className={`conversation-message ${isOwner ? 'owner' : ''}`}
                    >
                      <div className="conversation-avatar" style={{ backgroundColor: bgColor, color: textColor }}>
                        {initials}
                      </div>
                      <div className={`conversation-card-comment-container ${isOwner ? 'owner' : ''}`}
                      >
                        <div className="conversation-card-comment">
                          {conversation.comment_text}
                        </div>
                        <div className="conversation-comment-date">
                          {formatTimestamp(conversation.timestamp || conversation.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
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
