import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getFolderById, updateFolder, deleteFolder } from "../../actions/folders";
import DataCard from "../data_transfer/DataCard";
import popup_styles from "./popup.module.css";

const FolderDetail = (props) => {
  const { id } = useParams();
  const [folder, setFolder] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editFolderName, setEditFolderName] = useState('');
  const [editFolderDescription, setEditFolderDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    props.getFolderById(id).then((res) => {
      setFolder(res.data);
      setDatasets(res.data.datasets);
      setEditFolderName(res.data.name);
      setEditFolderDescription(res.data.description);
    });
  }, [id, props]);

  const renderItems = () => {
    return datasets.map((item) => {
      const handleClick = () => {
        navigate(`/datasets/${item.id}`);
      };
      return (
        <div className="col-4" key={item.id}>
          <span onClick={handleClick}>
            <DataCard data={item} />
          </span>
        </div>
      );
    });
  };

  const handleEditFolder = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    try {
      // Update the folder using the updateFolder action
      const updatedFolder = await props.updateFolder(id, {
        name: editFolderName,
        description: editFolderDescription
      });
  
      // Update the folder state with the updated data
      setFolder(updatedFolder);
  
      // Close the edit popup
      setIsEditPopupOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFolder = async () => {
    // Prompt the user with a confirmation popup
    const confirmed = window.confirm("Are you sure you want to delete this folder?");
  
    if (confirmed) {
      try {
        // If the user confirms, delete the folder
        await props.deleteFolder(id);
        navigate('/folders');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="folder-detail">
      {folder && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{folder.name}</h5>
            <p className="card-text">{folder.description}</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary me-2" onClick={() => setIsEditPopupOpen(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDeleteFolder}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="row">
        {datasets.length > 0 ? renderItems() : <p>No datasets available</p>}
      </div>

      {isEditPopupOpen && (
        <div className={popup_styles.popupOverlay}>
          <div className={popup_styles.popupContent} style={{ width: '80%', maxWidth: '800px' }}>
            <h3>Edit Folder</h3>
            <form onSubmit={handleEditFolder}>
              <div className={popup_styles.formGroup}>
                <label htmlFor="folderName" className={popup_styles.formLabel}>Folder Name</label>
                <input
                  type="text"
                  id="folderName"
                  className={popup_styles.formInput}
                  value={editFolderName}
                  onChange={(e) => setEditFolderName(e.target.value)}
                  maxLength={128}
                  required
                />
              </div>
              <div className={popup_styles.formGroup}>
                <label htmlFor="folderDescription" className={popup_styles.formLabel}>Description</label>
                <textarea
                  id="folderDescription"
                  className={popup_styles.formTextarea}
                  value={editFolderDescription}
                  onChange={(e) => setEditFolderDescription(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className={popup_styles.formSubmit}>Update Folder</button>
            </form>
            <button className={popup_styles.closeButton} onClick={() => setIsEditPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>
      {`
        .folder-detail {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .folder-header {
          margin-bottom: 16px;
        }
        .folder-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .folder-title h1 {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }
        .folder-actions {
          display: flex;
          gap: 8px;
        }
        .edit-btn,
        .delete-btn {
          padding: 4px 8px;
          font-size: 14px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }
        .edit-btn {
          background-color: #f0c14b;
          color: #333;
        }
        .delete-btn {
          background-color: #e74c3c;
          color: #fff;
        }
        .folder-description {
          font-size: 16px;
          color: #555;
          line-height: 1.5;
        }
      `}
      </style>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { getFolderById, updateFolder, deleteFolder })(FolderDetail);