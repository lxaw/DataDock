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
 * DatasetEdit.js
 *
 * Creates the page that will hold the Csv file editing component.
 * Gives a back button for the user to return to the data page once they are finished or decide not to edit.
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatasetForm from "./DatasetForm";
import { connect } from "react-redux";

const DatasetEdit = (props) => {
  const { id } = useParams();
  const [csvFile, setDataset] = useState(null);

  // get the csv file
  useEffect(() => {
    axios
      .get(`/api/datasets/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${props.auth.token}`,
        },
      })
      .then((res) => {
        setDataset(res.data);
      });
  }, []);

  // should return some spinner
  if (csvFile == null) return <div data-testid="csv_file_edit-1"></div>;

  return (
    <div className="container" data-testid="csv_file_edit-1">
      <div key={csvFile.id}>
        <DatasetForm csvFile={csvFile} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(DatasetEdit);
