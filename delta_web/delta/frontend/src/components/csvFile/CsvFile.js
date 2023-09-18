/**
 * Delta Project
 *
 * Authors:
 * Lexington Whalen (@lxaw)
 * Carter Marlowe (@Cmarlowe123)
 * Vince Kolb-Lugo (@vancevince)
 * Blake Seekings (@j-blake-s)
 * Naveen Chithan (@nchithan)
 *
 * CsvFile.js
 *
 * Defines the page that will show off the details of a single selected csv file.
 * Gives the users several options to download, delete, or view certain details of a file, such as author or download count
 * Easy and understandable for a user to understand the csv file, and to perform actions on it.
 */
import React from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { downloadCsvFile, deleteCsvFile } from "../../actions/file";
import tag_styles from "../data_transfer/tags.module.css";

const CsvFile = (props) => {
  var navigate = useNavigate();

  // with reference to
  // https://stackoverflow.com/questions/50644976/react-button-onclick-redirect-page

  /*UTILITY: Deletes the currently viewed file, ensures the user actually means to delete with a confirmation.
   *INPUTS: Only works with the currently in use file, given by props.
   *OUTPUTS: Outputs confirmation to screen, and returns user to download screen.
   */
  const clickDelete = () => {
    var dialog = confirm(
      "Would you like to delete this file? There is no going back."
    );
    if (dialog) {
      props.deleteCsvFile(props.csvFileData.id);
      navigate("/data/download");
    }
  };

  /*UTILITY: Downloads the csv file currently selected.
   * INPUTS: Makes use of the current csvFile ID.
   * OUTPUTS: Downloads a version of the csv file for the user.
   */
  const clickDownload = () => {
    props.downloadCsvFile(props.csvFileData.id);
  };

  return (
    <div
      className="border border-rounded m-2 p-2 container"
      data-testid="csv_file-1"
    >
      <div className="d-flex justify-content-between">
        <div>
          <h5>
            <Link to={`/profile/${props.csvFileData.author_username}`}>
              Posted by {props.csvFileData.author_username}
            </Link>
          </h5>
        </div>
        <div>
          <h5>{props.csvFileData.formatted_date}</h5>
        </div>
      </div>
      <div>
        <div>
          <h4>File name: {props.csvFileData.file_name}</h4>
          <small>Download count: {props.csvFileData.download_count}</small>
        </div>
        <hr />
        <div>{props.csvFileData.description}</div>
      </div>
      <br />
      <div>
        <h6>Tags</h6>
        <div className="mb-2">
          {props.csvFileData.tags.map((objTag, index) => (
            <div className={tag_styles.tag_item} key={index}>
              <span className={tag_styles.text}>{objTag.text}</span>
            </div>
          ))}
        </div>
      </div>
      {props.auth.user.id == props.csvFileData.author && (
        <div className="d-flex justify-content-between">
          <div>
            <Link to={`/csvs/${props.csvFileData.id}/edit`}>
              <button className="btn btn-primary">Edit</button>
            </Link>
            <button className="btn btn-success" onClick={clickDownload}>
              Download
            </button>
          </div>
          <button onClick={clickDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteCsvFile, downloadCsvFile })(
  CsvFile
);
