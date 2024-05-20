import React, { useState } from 'react';
import { connect } from 'react-redux';
import { downloadCsvFile } from '../../actions/file';
import DataCard from './DataCard';
import styles from './tags.module.css'

const DataSetTable = (props) => {

  // dataset items
  const [dataSets, setCsvFiles] = useState(props.dataSets);
  // search text for file name
  const [searchText, setSearchFileName] = useState('');
  // tag search
  const [searchTags, setSearchTags] = useState([]);
  // author search
  const [searchAuthor,setSearchAuthor] = useState('')
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

    setSearchFileName(strFileNameSearch);
    setSearchTags(arrStrTagSearch);
    setSearchAuthor(strAuthorSearch)

    let filteredCsvs = props.dataSets;

    // does not need to be repeated across datasets
    const filteredTags = Array.from(allTags).filter((tag)=>
      tag.toLowerCase().includes(arrStrTagSearch[arrStrTagSearch.length - 1])
    );
    setTagSuggestions(filteredTags)

    filteredCsvs = filteredCsvs.filter((csvFile) => {
      const arrStrFileTags = csvFile.tags.map((strObj) => strObj.text);

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

      return allTagsMatch && nameMatches && authorMatches;
    });

    setTableCsvs(filteredCsvs);
  };

  if (!dataSets) {
    return null;
  }

  // render table items
  const renderItems = () => {
    let items = tableCsvs.map((item,index) =>{
        return (
         <div class="col-4" key={item.id}>
          <DataCard
            data={item}
          />
        </div>
        )
    });
    return items
  }

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
      <div className="row">
          {renderItems()}
      </div>
  </div>
);
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps,)(DataSetTable);