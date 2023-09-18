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
 * CsvFileTable.js
 *
 * Display of user uploaded files, including names, descriptions, and date uploaded.
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { tokenConfig } from "../../actions/auth";
import { getCsvFiles, deleteCsvFile } from "../../actions/file";
import { Link } from "react-router-dom";

// https://ui.dev/react-router-url-parameters

const CsvFileTable = (props) => {
  var [csvFiles, setCsvFiles] = useState(null);

  useEffect(() => {
    axios
      .get("/api/csv/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${props.auth.token}`,
        },
      })
      .then((res) => {
        setCsvFiles(res.data);
      });
  }, []);

  // probably should return some spinner
  if (csvFiles == null) return <div data-testid="csv_file_table-1"></div>

  return (
    <div data-testid="csv_file_table-1">
      <h2>Your Csv Files</h2>
      <table className="table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Upload Date</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {csvFiles.map((data) => (
            <tr key={data.id}>
              <th>{data.file_name}</th>
              <th>{data.formatted_date}</th>
              <th>
                <Link to={`/csvs/${data.id}`}>View File</Link>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getCsvFiles })(CsvFileTable);
