import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import DataCard from './DataCard';
import tag_styles from './tags.module.css'
import { useNavigate } from 'react-router-dom';
import { addToCart,createFolder } from '../../actions/file';
import { FaFolderPlus, FaCartPlus } from 'react-icons/fa';
import popup_styles from "./popup.module.css"

// popup used for dataset
const FolderCreatePopup = ({ isVisible, onClose, selectedDataSets, auth, createFolder }) => {
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [error, setError] = useState('');

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName) {
      setError('Folder name is required.');
      return;
    }

    try {
      await createFolder({
        name: folderName,
        description: folderDescription,
        author: auth.user.id  // Assuming the user id is available in the auth state
      });

      // Reset form and close popup
      setFolderName('');
      setFolderDescription('');
      setError('');
      onClose();
    } catch (err) {
      console.log(err)
      setError('Failed to create folder. Please try again.');
    }
  };

  return (
    <div className={popup_styles.popupOverlay}>
      <div className={popup_styles.popupContent}>
        <h3>Selected Datasets</h3>
        {selectedDataSets.map(dataset => (
          <div key={dataset.id} className={popup_styles.datasetInfo}>
            <h4>{dataset.name}</h4>
            <p>Author: {dataset.author_username}</p>
            <p>Tags: {dataset.tags.map(tag => tag.text).join(', ')}</p>
            <p>Files: {dataset.files.map(file => file.file_name).join(', ')}</p>
          </div>
        ))}

        <h3>Create New Folder</h3>
        <form onSubmit={handleSubmit}>
          <div className={popup_styles.formGroup}>
            <label htmlFor="folderName" className={popup_styles.formLabel}>Folder Name</label>
            <input 
              type="text" 
              id="folderName" 
              className={popup_styles.formInput}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              maxLength={128}
              required
            />
          </div>
          <div className={popup_styles.formGroup}>
            <label htmlFor="folderDescription" className={popup_styles.formLabel}>Description</label>
            <textarea 
              id="folderDescription" 
              className={popup_styles.formTextarea}
              value={folderDescription}
              onChange={(e) => setFolderDescription(e.target.value)}
            ></textarea>
          </div>
          {error && <p className={popup_styles.formError}>{error}</p>}
          <button type="submit" className={popup_styles.formSubmit}>Create Folder</button>
        </form>

        <button className={popup_styles.closeButton} onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) =>({
    auth:state.auth
})
export default connect(mapStateToProps,{createFolder})(FolderCreatePopup)