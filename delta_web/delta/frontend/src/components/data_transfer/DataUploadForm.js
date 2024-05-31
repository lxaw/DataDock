import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { addCsvFile } from '../../actions/file';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import TagsInput from './TagsInput';
import Select from 'react-select';

const Container = styled.div`
  border: 2px dashed ${(props) => (props.isDragActive ? '#00e676' : props.isDragReject ? '#ff1744' : '#000000')};
  border-radius: 4px;
  padding: 20px;
  background-color: #f8f9fa;
  height: 80%;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.24s ease-in-out;
`;

const DataUploadForm = (props) => {
  if (props.auth.user.username === undefined) return;

  const navigate = useNavigate();
  const maxNumMb = 100000;
  const maxSize = maxNumMb * 1048576;

  const [selectOptions, setSelectOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState('');
  const [arrOrgs, setArrOrgs] = useState([]);

  useEffect(() => {
    const select = props.availableOrgs.map((org) => ({
      value: org.id,
      label: org.name,
    }));
    setSelectOptions(select);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles } = useDropzone({
    accept: {},
    onDrop: (acceptedFiles, fileRejections) => {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          setErrors(`Error: ${err.message}`);
        });
      });
    },
    minSize: 0,
    maxSize: maxSize,
    multiple: true,
  });

  const onSelectChange = (arrSelects) => {
    const orgIds = arrSelects.map((obj) => obj.value);
    setArrOrgs(orgIds);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  
    const isPublic = $('#flexCheckPublic').is(':checked');
    const isPublicOrgs = $('#flexCheckPublicToOrg').is(':checked');
    const description = $('#DataSetDescription').val();
    const DataSetName = $('#DataSetName').val();
  
    if (isPublicOrgs && arrOrgs.length === 0) {
      alert(
        'For a file to be public under organizations, you must select an organization. Please either select an organization, or if there are none switch to a different visibility.'
      );
      return;
    }
  
    const dictData = new FormData();
    dictData.append('is_public', isPublic);
    dictData.append('is_public_orgs', isPublicOrgs);
    dictData.append('description', description);
    dictData.append('name', DataSetName);
    dictData.append('author', props.auth.user.id);
  
    // Append registered organizations
    arrOrgs.forEach((orgId, index) => {
      dictData.append(`registered_organizations.${index}`, orgId);
    });
  
    // Append tags
    tags.forEach((tag, index) => {
      dictData.append(`tag.${index}`, tag);
    });
  
    // Append file data and relative paths
    acceptedFiles.forEach((file, index) => {
      dictData.append(`file.${index}`, file);
      const relativePath = file.webkitRelativePath || file.path || '';
      dictData.append(`file.${index}.relativePath`, relativePath);
    });
  
    props.addCsvFile(dictData).then((res) => {
      if (res.status === 200) {
        navigate('/data/download');
      }
    });
  };


  const updateTags = (tags) => {
    setTags(tags);
  };

  return (
    <form onSubmit={onSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <Container {...getRootProps({ isDragActive, isDragReject })}>
              <input {...getInputProps()} />
              {!isDragActive && 'Click here or drop files to upload.'}
              {isDragActive && !isDragReject && 'Drop Files'}
              {isDragReject && 'File type not accepted.'}
            </Container>
            {errors && <p className="text-danger mt-2">{errors}</p>}
            {acceptedFiles.length > 0 && (
              <ul className="list-group mt-3">
                {acceptedFiles.map((file, index) => (
                  <li key={index} className="list-group-item">
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Upload
            </button>
          </div>
          <div className="col-md-7">
            <div className="form-group">
              <label htmlFor="DataSetName">Data Set Name</label>
              <input
                type="text"
                className="form-control"
                id="DataSetName"
                placeholder="Enter name of file"
                required
              />
              <small className="form-text text-muted">
                Data set names should be descriptive of the file being uploaded. Don't worry about
                appending `.csv` to your files.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="DataSetDescription">Data Set Description</label>
              <textarea
                className="form-control"
                id="DataSetDescription"
                rows="3"
                placeholder="Enter a description of the data set"
                required
              ></textarea>
              <small className="form-text text-muted">
                Data set descriptions should indicate important information about the file contents,
                the methods of collecting the data, and any other important information such as
                rights of use.
              </small>
            </div>
            <div className="form-group">
              <label>Visibility</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="visibility"
                  id="flexCheckPublic"
                />
                <label className="form-check-label" htmlFor="flexCheckPublic">
                  Publicly Visible
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="visibility"
                  id="flexCheckPublicToOrg"
                />
                <label className="form-check-label" htmlFor="flexCheckPublicToOrg">
                  Public to Orgs
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="visibility"
                  id="flexCheckPrivate"
                />
                <label className="form-check-label" htmlFor="flexCheckPrivate">
                  Private
                </label>
              </div>
              <small className="form-text text-muted">
                File "visibility" is what allows you to control who sees your files. "Private" means
                that only you can see the file; go to <Link to="/profile/glance">this link</Link> to
                see your private files. "Public" means anyone logged in can see the file. "Public to
                Orgs" means that all users registered under organizations that you select can see
                the file.
              </small>
            </div>
            <div className="form-group">
              <label>Available Organizations</label>
              <Select options={selectOptions} onChange={onSelectChange} isMulti />
              <small className="form-text text-muted">
                When you select an organization, the file will be visible to all members of the
                organization when you make it publicly visible.
              </small>
            </div>
            <div className="form-group">
              <label>Tags</label>
              <TagsInput updateParentTags={updateTags} />
              <small className="form-text text-muted">
                To add tags, please type the tag text and then hit enter to save the tag.
              </small>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addCsvFile })(DataUploadForm);