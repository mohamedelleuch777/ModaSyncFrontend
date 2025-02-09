import React from 'react';
import { List, PersonFill, BellFill } from 'react-bootstrap-icons';

const stories = [
  { id: 1, name: 'Collection Eté 2024', image: 'https://i.pinimg.com/736x/8b/84/2d/8b842da000f098e8d6711d215679e51f.jpg' },
  { id: 2, name: 'Collection Hiver 2025', image: 'https://i.pinimg.com/736x/32/0a/5e/320a5eb3ffc4af1b500df89e798d1810.jpg' },
  { id: 3, name: 'Collection Aid S 2025', image: 'https://i.pinimg.com/736x/8b/84/2d/8b842da000f098e8d6711d215679e51f.jpg' },
  { id: 4, name: 'Collection Printemps 2025', image: 'https://i.pinimg.com/736x/73/89/f2/7389f2ba86f53d464fe67381daf6dead.jpg' },
  { id: 5, name: 'Collection Aid G 2025', image: 'https://i.pinimg.com/736x/8b/84/2d/8b842da000f098e8d6711d215679e51f.jpg' },
  { id: 6, name: 'Collection summerß 2025', image: 'https://i.pinimg.com/736x/73/89/f2/7389f2ba86f53d464fe67381daf6dead.jpg' },
];

function SubCollections() {
  return (
    <div className="sub-collections sub-collections-containter">
      {
        stories && stories.map((story) => (
          <div className="sub-collection" key={story.id}>
            <img className='sub-collection-image' src={story.image} alt={story.name} />
            <p className='sub-collection-label'>{story.name}</p>
          </div>
        ))
      }
    </div>
  );
}

export default SubCollections