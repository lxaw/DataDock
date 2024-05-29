import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import DataCard from './DataCard';
import styles from './tags.module.css'
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../actions/file';

const DataSetTable = (props) => {
  const [highlightedDataSetIds,setHighlightedDataSetIds] = useState([])
  // for handle double click
  const doubleClickTimeout = useRef(null);

  // web browser history
  const navigate = useNavigate();

  // dataset items
  const [dataSets, setDataSets] = useState(props.dataSets);
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
  const handleSingleClickDataSet = (item) => {
    setHighlightedDataSetIds((prevIds) => {
      if (prevIds.includes(item.id)) {
        // Remove the item.id from the list
        return prevIds.filter((id) => id !== item.id);
      } else {
        // Add the item.id to the list
        return [...prevIds, item.id];
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
    highlightedDataSetIds.map((id)=>{props.addToCart({'file_id':id})})
  }


  // render table items
const renderItems = () => {
  return tableCsvs.map((item) => {
    const isHighlighted = highlightedDataSetIds.includes(item.id);
    const backgroundColor = isHighlighted ? 'red' : 'white';
    console.log(backgroundColor)

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
      <div className="col-4" key={`${item.id}-${isHighlighted}`}>
        <span onClick={handleClick} style={{ backgroundColor }}>
          <DataCard data={item} />
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
                style={{ ...styles.tagSuggestionItem, display: 'flex' }}
              >
                <span className={styles.tag_item}>{tag}</span>
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
      <div>
        <div>
          Num files selected: {highlightedDataSetIds.length}
        </div>
        <button className="btn btn-primary"
          onClick={massAddToCart}
        >
          Add to cart
          </button>
      </div>
      <div className="row">
          {renderItems()}
      </div>
  </div>
);
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps,{addToCart})(DataSetTable);