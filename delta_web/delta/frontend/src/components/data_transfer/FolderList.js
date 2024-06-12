import React from 'react';
import { FaFolder } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FolderList = ({ folders }) => {
  const folderIconContainer = {
    position: 'relative',
    display: 'inline-block',
  };

  const folderIconStyle = {
    fontSize: '10rem',
    color: '#ffd480',
  };

  const folderNameStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const folderListStyle = {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap',
  };

  const folderItemStyle = {
    margin: '10px',
    textAlign: 'center',
  };

  return (
    <div>
      {folders.length === 0 ? (
        <p>You don't have any folders yet.</p>
      ) : (
        <ul style={folderListStyle}>
          {folders.map((folder) => (
            <li key={folder.id} style={folderItemStyle}>
              <Link to={`/folders/detail/${folder.id}`}>
                <div style={folderIconContainer}>
                    <FaFolder style={folderIconStyle} />
                    <span style={folderNameStyle}>{folder.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderList;