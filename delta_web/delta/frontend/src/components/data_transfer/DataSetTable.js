import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import DataCard from './DataCard';
import tag_styles from './tags.module.css'
import { useNavigate } from 'react-router-dom';
import { addToCart,createFolder } from '../../actions/datasets';
import { FaFolderPlus, FaCartPlus } from 'react-icons/fa';
import FolderCreatePopup from './FolderCreatePopup';

const DataSetTable = (props) => {
  // popup
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // for handle double click
  const doubleClickTimeout = useRef(null);

  // web browser history
  const navigate = useNavigate();

  // dataset items
  const [dataSets, setDataSets] = useState(props.dataSets);
  // selected datasets
  const [selectedDataSets,setSelectedDataSets] = useState([])
  // search text for file name
  const [searchText, setSearchFileName] = useState('');
  // tag search
  const [searchTags, setSearchTags] = useState([]);
  // author search
  const [searchAuthor,setSearchAuthor] = useState('')
  // file type search
  const [searchFileTypes,setSearchFileTypes] = useState([])

  const [tableCsvs, setTableCsvs] = useState(props.dataSets);
  const [arrFilesToDownload, setArrFilesToDownload] = useState([]);
  const textMinLength = props.textMinLength ?? 3;

  // state for tag suggestions
  const [tagSuggestions,setTagSuggestions] = useState([]);

  // all tags
  const allTags = new Set(
    props.dataSets.flatMap((csvFile)=>csvFile.tags.map((tag)=>tag.text))
  )

  // handle tag clicks
  const handleTagClick = (tag) => {

    // Add the clicked tag to the array if it doesn't already exist
    const updatedTags = [...new Set([...searchTags.slice(0,searchTags.length-1), tag])];

    setSearchTags(updatedTags)
    // update the search field
    $('#inputSearchTags').val(updatedTags.join(' '))
    // remove the tags
    setTagSuggestions([])
  };
  // when add to folder
  const handleAddToFolder = () => {
    if (selectedDataSets.length > 0) {
      setIsPopupVisible(true);
    } else {
      // Optionally, show an alert or toast message if no datasets are selected
      alert("Please select at least one dataset to add to the folder.");
    }
  };

  // when search
  const onSearchChange = () => {

    // note, for now we do case insensitive
    const strFileNameSearch = $('#inputSearchFileName').val().toLowerCase();
    const arrStrTagSearch = $('#inputSearchTags')
      .val()
      .split(' ')
      .map((e) => e.toLowerCase());
    const strAuthorSearch = $('#inputSearchAuthor').val().toLowerCase()
    const arrFileTypeSearch = $("#inputSearchFileTypes")
      .val()
      .split(' ')
      .map((e)=>e.toLowerCase())

    setSearchFileName(strFileNameSearch);
    setSearchTags(arrStrTagSearch);
    setSearchAuthor(strAuthorSearch)

    let filteredCsvs = props.dataSets;

    // does not need to be repeated across datasets
    if($('#inputSearchTags').val()==''){
      // nothing present, remove
      setTagSuggestions([])
    }else{
      // else we have to show tags
      const filteredTags = Array.from(allTags).filter((tag)=>
        tag.toLowerCase().includes(arrStrTagSearch[arrStrTagSearch.length - 1])
      );
      setTagSuggestions(filteredTags)
    }

    filteredCsvs = filteredCsvs.filter((csvFile) => {
      const arrStrFileTags = csvFile.tags.map((strObj) => strObj.text);
      const arrStrFileTypes = csvFile.files.map((obj)=>obj.file_name.split('.').pop())

      // tag search
      const allTagsMatch = arrStrTagSearch.every((searchTag) =>
        arrStrFileTags.some((fileTag) => fileTag.includes(searchTag))
      );

      // name search
      const nameMatches =
        strFileNameSearch.length < textMinLength ||
        csvFile.name.toLowerCase().includes(strFileNameSearch);
      
      // author search
      const authorMatches = 
        strAuthorSearch.length < textMinLength || 
          csvFile.author_username.includes(strAuthorSearch)

      // file type search
      const fileTypeMatchs = arrFileTypeSearch.every((searchType)=>
        arrStrFileTypes.some((fileType)=>fileType.includes(searchType))
      )
      
        

      return allTagsMatch && nameMatches && authorMatches && fileTypeMatchs;
    });

    setTableCsvs(filteredCsvs);
  };

  if (!dataSets) {
    return null;
  }

  // handle what happens when we click the dataset cart
  // on single click highlight
  // on double click enter
  const handleSingleClickDataSet = (e) => {
    setSelectedDataSets((items) => {
      if (items.includes(e)) {
        return items.filter((item) => item !== e);
      } else {
        return [...items, e];
      }
    });
  };
  
  const handleDoubleClickDataSet = (item) => {
    navigate(`/csvs/${item.id}`);
  };
  // for double click
  useEffect(() => {
    return () => {
      clearTimeout(doubleClickTimeout.current);
    };
  }, []);

  const massAddToCart = () =>{
    // add all highlighted items to cart
    selectedDataSets.map((dataset)=>{props.addToCart({'file_id':dataset.id})})
  }


  // render table items
  const renderItems = () => {
    return tableCsvs.map((item) => {
      const isHighlighted = selectedDataSets.includes(item);
      const backgroundColor = isHighlighted ? '#c2e7ff' : 'white';
  
      const handleClick = () => {
        if (doubleClickTimeout.current) {
          clearTimeout(doubleClickTimeout.current);
          handleDoubleClickDataSet(item);
          doubleClickTimeout.current = null;
        } else {
          handleSingleClickDataSet(item);
          doubleClickTimeout.current = setTimeout(() => {
            doubleClickTimeout.current = null;
          }, 200);
        }
      };
  
      return (
        <div className="col-4" key={`${item.id}`}>
          <span onClick={handleClick}>
            <DataCard data={item} style={{ backgroundColor}} />
          </span>
        </div>
      );
    });
  };


return (
  <div data-testid="public_csv_file_table-1">
      <div className="mb-2">
        <label htmlFor="inputSearchFileName" className="form-label">
          File Name
        </label>
        <input
          type="text"
          className="form-control"
          id="inputSearchFileName"
          placeholder={`Enter at least ${textMinLength} characters`}
          onChange={onSearchChange}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="inputSearchFileTypes" className="form-label">
          File Type(s)
        </label>
        <input
          type="text"
          className="form-control"
          id="inputSearchFileTypes"
          placeholder={`Enter at least ${textMinLength} characters`}
          onChange={onSearchChange}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="inputSearchTags" className="form-label">
          Tags
        </label>
        <input
          type="text"
          className="form-control"
          id="inputSearchTags"
          placeholder="Enter tags separated by spaces"
          onChange={onSearchChange}
        />
        <div className="form-text">
          For example, enter "cat dog" to see files with tags of "cat" and
          "dog".
        </div>
        {tagSuggestions.length >0 && (
          <div className="tag-suggestions" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {tagSuggestions.map((tag) => (
              <div
                key={tag}
                onClick={() => handleTagClick(tag)}
                style={{ ...tag_styles.tagSuggestionItem, display: 'flex' }}
              >
                <span className={tag_styles.tag_item}>{tag}</span>
              </div>
            ))}
          </div>

        )}
      </div>
      <div className="mb-2">
        <label htmlFor="inputSearchAuthor" className="form-label">
          Author
        </label>
        <input
          type="text"
          className="form-control"
          id="inputSearchAuthor"
          placeholder="Enter an author associated with the dataset."
          onChange={onSearchChange}
        />
        <div className="form-text">
          For example, enter "user123" to see public files uploaded by "user123".
        </div>
      </div>
      <div className="d-flex flex-row align-items-center mb-3">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-primary d-flex align-items-center me-2"
            onClick={handleAddToFolder}
          >
            <FaFolderPlus className="me-1" />
            Add to Folder
          </button>
        </div>
        <button className="btn btn-success d-flex align-items-center" onClick={massAddToCart}>
          <FaCartPlus className="me-1" />
          Add to Cart
        </button>
      </div>
      <span>
        <strong>{selectedDataSets.length}</strong> file(s) selected.
      </span>
      <div className="row">
          {renderItems()}
      </div>
      <FolderCreatePopup
      isVisible={isPopupVisible} 
      onClose={() => setIsPopupVisible(false)} 
      selectedDataSets={selectedDataSets}
      createFolder={props.createFolder}
    />
  </div>
);
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps,{addToCart,createFolder})(DataSetTable);