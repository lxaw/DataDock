import React, { useState } from 'react';
import { connect } from 'react-redux';
import { downloadCsvFile } from '../../actions/file';
import DataCard from './DataCard';

const DataSetTable = (props) => {
  const [dataSets, setCsvFiles] = useState(props.dataSets);
  const [searchText, setSearchText] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [tableCsvs, setTableCsvs] = useState(props.dataSets);
  const [arrFilesToDownload, setArrFilesToDownload] = useState([]);
  const [numfilesSelected, setNumFilesSelected] = useState(0);
  const textMinLength = props.textMinLength ?? 3;

  const onCheckChange = (csvFileData) => {
    const newFiles = [...arrFilesToDownload];
    const index = newFiles.findIndex((item) => item.id === csvFileData.id);

    if (index === -1) {
      newFiles.push(csvFileData);
      setNumFilesSelected((prev) => prev + 1);
    } else {
      newFiles.splice(index, 1);
      setNumFilesSelected((prev) => prev - 1);
    }

    setArrFilesToDownload(newFiles);
  };

  const onSearchChange = () => {
    const strFileNameSearch = $('#inputSearchFileName').val().toLowerCase();
    const arrStrTagSearch = $('#inputSearchTags')
      .val()
      .split(' ')
      .filter((e) => e !== '')
      .map((e) => e.toLowerCase());

    setSearchText(strFileNameSearch);
    setSearchTags(arrStrTagSearch);

    let filteredCsvs = props.dataSets;

    filteredCsvs = filteredCsvs.filter((csvFile) => {
      const arrStrFileTags = csvFile.tags.map((strObj) => strObj.text);

      const allTagsMatch = arrStrTagSearch.every((searchTag) =>
        arrStrFileTags.some((fileTag) => fileTag.includes(searchTag))
      );

      const nameMatches =
        strFileNameSearch.length < textMinLength ||
        csvFile.name.toLowerCase().includes(strFileNameSearch);

      return allTagsMatch && nameMatches;
    });

    setTableCsvs(filteredCsvs);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    arrFilesToDownload.forEach((csvFileData) => {
      props.downloadCsvFile(csvFileData.id);
    });
  };

  if (!dataSets) {
    return null;
  }

return (
  <div data-testid="public_csv_file_table-1">
    <form onSubmit={onSubmit}>
      <div className="mb-4">
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
      <div className="mb-4">
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
      </div>
      <div>
        <div>
          <div
            style={{
              height: '80vh',
              overflowY: 'scroll',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500, 1fr))',
              gap: '2rem',
            }}
          >
            {tableCsvs.map((item) => (
              <div key={item.id}>
                <DataCard
                  data={item}
                  link={`/csvs/${item.id}`}
                  linkText="View Dataset"
                  parentOnCheckChange={onCheckChange}
                  isDownload={arrFilesToDownload.some(
                    (csv) => csv.id === item.id
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  </div>
);
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { downloadCsvFile })(DataSetTable);