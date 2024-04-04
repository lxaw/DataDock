/*
###############################################################################

Delta project

Brief description: 
    This file defines the layout for the upload form. The upload form is
  how users can upload data. It allows them to change the file name, add tags,
  registered organizations, and descriptions.

###############################################################################
*/




import React, {useCallback, useEffect,useState} from 'react';
import {useDropzone} from "react-dropzone";
import {addCsvFile} from '../../actions/file';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Link, useNavigate} from 'react-router-dom';

import TagsInput from './TagsInput';


// select
import Select from 'react-select';


// UTILITY: Determines the color of the DropZone depending on whether isDrag is 
//          active or not.
// RETURNS: A hex code describing a particular color.
const getColor = (props) => {
  if (props.isDragActive) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }

  return '#000000';
}

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 0.2em;
    text-align:center;
    border-radius: 0.2em;
    border-color: ${props => getColor(props)};
    border-style: dashed;
    background-color: #d2d2d2;
    height:80%;
    color: #000000;
    outline: none;
    transition: border .24s ease-in-out;
`;

const DataUploadForm = (props) =>{
  if(props.auth.user.username == undefined) return;
  var navigate = useNavigate();

  // max size of file
  // MB times 1048576
  const maxNumMb = 500
  const maxSize = maxNumMb*1048576;

  // available organizations
  const [selectOptions, setSelectOptions] = useState([]);
  // tags
  const [tags,setTags] = useState([]);
  const [errors,setErrors] = useState('');

  const [arrOrgs,setArrOrgs] = useState([]);

  // UTILITY: Users can add registered organizations to a file on upload.
  //          To do this, the user must have already joined said org.
  //          This method assembles all of the users organizations and
  //          adds them to the list of select options on the upload form.
  useEffect(()=>{
    var select = []
    props.availableOrgs.map((org)=>{
      select.push({
        'value':org.id,'label':org.name
      })
    })
    setSelectOptions(select);
  },[])

  const { isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles } = useDropzone({
    accept:{

      // TO DO: only allow specific file types
      // for now, just accept anything
    },

    // UTILITY: When a user drops selected file(s), display error messages 
    // for any rejections.
    onDrop:(acceptedFiles,fileRejections) =>{
      fileRejections.forEach((file)=>{
        file.errors.forEach((err) =>{
          if(err.code === "file-too-large"){
            setErrors(`Error: ${err.message}`);
          }
          if(err.code === "file-invalid-type"){
            setErrors(`Error: ${err.message}`);
          }
          else{
            setErrors(`Error: ${err.message}`)
          }
        })
      })
      // acceptedFiles.forEach((file)=>{
      //   setErrors('')
      // })
    },
    minSize: 0,
    maxSize:maxSize,
    multiple:true,
  });


  const onSelectChange = (arrSelects) =>{
    // reset
    let orgIds = []
    arrSelects.map((obj)=>{
      orgIds.push(obj.value)
    }) 
    setArrOrgs(orgIds);
  }

  // UTILITY: This function determines what happens when a user submits the
  //          data upload form.
  const onSubmit = (e) =>{
    e.preventDefault(); // Prevent empty uploads
      // note: the backend will check if there was a folder.
      // we just need to send the right path.

      var isPublic= $("#flexCheckPublic").is(":checked");
      var isPublicOrgs = $("#flexCheckPublicToOrg").is(":checked");
      var description = $("#DataSetDescription").val();
      var DataSetName = $("#DataSetName").val();

      if(isPublicOrgs && arrOrgs.length == 0){
        // show error
        alert("For a file to be public under organizations, you must select an organization. Please either select an organization, or if there are none switch to a different visibility.");
        return;
      }

      // Take all of the data from the upload form and create a dictionary
      // files are uploaded one by one
      const dictData= {
        'is_public':isPublic,
        'is_public_orgs':isPublicOrgs,
        'description':description,
        'name':DataSetName,
        'registered_organizations':arrOrgs,
        'tags':tags,
        'file':acceptedFiles,
        'author':props.auth.user.id,
      }

      // Use the dictionary to create a csvFile object and upload it. 
      props.addCsvFile(dictData)
        .then((res)=>{
            // good response
            console.log('here we are!')
            console.log(res)
            if(res.status == 200){
              navigate('/data/download');
            }
          }
        );
  }

  const updateTags = (tags) =>{
    setTags(tags);
  }

    return (
    <form onSubmit={onSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <Container {...getRootProps(isDragActive, isDragReject)}>
              <input {...getInputProps()} />
              {!isDragActive && 'Click here or drop files to upload.'}
              {isDragActive && !isDragReject && 'Drop Files'}
              {isDragReject && 'File type not accepted.'}
            </Container>
            <p className="text-danger">{errors}</p>
            <ul className="list-group mt-2">
              {acceptedFiles.length > 0 &&
                acceptedFiles.map((acceptedFile, index) => (
                  <li className="list-group-item list-group-item-info" key={index}>
                    {acceptedFile.name}
                  </li>
                ))}
            </ul>
            <div>
              <button className="btn btn-primary btn-lg">Upload</button>
            </div>
          </div>
          <div className="col-md-7">
            <div className="form-group">
              <label htmlFor="DataSetName" className="text-secondary">
                Data Set Name
              </label>
              <input
                required
                type="text"
                className="form-control"
                placeholder="Enter name of file"
                id="DataSetName"
              />
              <small className="text-muted">
                Data set names should be descriptive of the file being uploaded. Don't worry about
                appending `.csv` to your files.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="DataSetDescription" className="text-secondary">
                Data Set Description
              </label>
              <textarea
                required
                className="form-control"
                placeholder="Enter a description of the data set"
                id="DataSetDescription"
              />
              <small className="text-muted">
                Data set descriptions should indicate important information about the file contents,
                the methods of collecting the data, and any other important information such as
                rights of use.
              </small>
            </div>

            <div className="form-group">
              <label className="text-secondary">Visibility</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  name="flexCheck"
                  type="radio"
                  value="isPublic"
                  id="flexCheckPublic"
                />
                <label className="form-check-label" htmlFor="flexCheckPublic">
                  Publically Visible
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  name="flexCheck"
                  type="radio"
                  value="isPublic"
                  id="flexCheckPublicToOrg"
                />
                <label className="form-check-label" htmlFor="flexCheckPublicToOrg">
                  Public to Orgs
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  name="flexCheck"
                  type="radio"
                  value="isPublic"
                  id="flexCheckPrivate"
                />
                <label className="form-check-label" htmlFor="flexCheckPrivate">
                  Private
                </label>
              </div>
              <small className="text-muted">
                File "visibility" is what allows you to control who sees your files. "Private" means
                that only you can see the file; go to <Link to="/profile/glance">this link</Link> to
                see your private files. "Public" means anyone logged in can see the file. "Public to
                Orgs" means that all users registered under organizations that you select can see
                the file.
              </small>
            </div>

            <div className="form-group">
              <label className="text-secondary">Available Organizations</label>
              <Select options={selectOptions} onChange={onSelectChange} isMulti />
              <small className="text-muted">
                When you select an organization, the file will be visible to all members of the
                organization when you make it publically visible.
              </small>
            </div>

            <div className="form-group">
              <label className="text-secondary">Tags</label>
              <TagsInput updateParentTags={updateTags} />
              <small className="text-muted">
                To add tags, please type the tag text and then hit enter to save the tag.
              </small>
            </div>

          </div>
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = state =>({
  auth:state.auth
})

export default connect(mapStateToProps,{addCsvFile})(DataUploadForm);