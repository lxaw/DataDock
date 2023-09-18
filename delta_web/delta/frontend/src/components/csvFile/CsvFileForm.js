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
 * CsvFileForm.js
 *
 * File form that will take in all of the data that will be displayed with a file.
 * Used for both the initial creation and editing the details of a file
 * User inputs the information into each field which has a matching descriptor.
 * At the end the user presses submit and the form will be submitted
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateCsvFile } from "../../actions/file";

import TagsInput from "../data_transfer/TagsInput";

// select
import Select from "react-select";

const CsvFileForm = (props) => {
  // csvFile properties
  const [csvFileState, setCsvFileState] = useState({
    file_name: props.csvFile.file_name,
    id: props.csvFile.id,
    description: props.csvFile.description,
    is_public: props.csvFile.is_public,
    is_public_orgs: props.csvFile.is_public_orgs,
    registered_organizations: props.csvFile.registered_organizations,
    tags: undefined,
  });

  // available orgs
  const [selectOptions, setSelectOptions] = useState([]);
  // select values
  const [selectedValues, setSelectedValues] = useState([]);

  var defaultSelectValues = [];
  props.csvFile.org_objs.map((org) => {
    defaultSelectValues.push({
      label: org.name,
      value: org.id,
    });
  });

  useEffect(() => {
    // set up the select
    var select = [];
    props.auth.user.followed_organizations.map((org) => {
      select.push({
        value: org.id,
        label: org.name,
      });
    });
    setSelectOptions(select);
    // set up the tags
    var tags = [];
    props.csvFile.tags.map((tagObj) => {
      tags.push(tagObj.text);
    });
    setCsvFileState({ ...csvFileState, tags: tags });
  }, []);

  if (csvFileState.tags == undefined) return;

  /*UTILITY: Used by the organization selection box, pushes the selected orgs onto the csvfilestate.
   *INPUTS: Takes in the array of selected organizations.
   *OUTPUTS: Changes the state of the selected organizations of the file state.
   */
  const onSelectChange = (arrSelects) => {
    // reset
    var arrOrgs = [];
    arrSelects.map((obj) => {
      arrOrgs.push(obj.value);
    });
    setCsvFileState({ ...csvFileState, registered_organizations: arrOrgs });
  };

  /*UTILITY: Changes file state of the target that is passed through.
   *INPUTS: Target to be changed.
   *OUTPUTS: New file state for the csv.
   */
  const onChange = (e) => {
    const newState = { ...csvFileState, [e.target.name]: e.target.value };
    setCsvFileState(newState);
  };

  /*UTILITY: Submits the updates to the csv file information.
   *INPUTS: Will take in the data from the form fields and apply it to the csv file state.
   *OUTPUTS: Updated csvFileState.
   */
  const onSubmit = (e) => {
    e.preventDefault();
    props.updateCsvFile(csvFileState);
  };

  /*UTILITY: Determines the state of the visibility of the file on the visibility radio between public, public to organization, or private.
   *INPUTS: Takes input based on change in the selected visibility level.
   *OUTPUTS: True or false values to general publicity or organization publicity to the csv file state.
   */
  const onRadioChange = (e) => {
    var isPublic = false;
    var publicOrgs = false;

    // Check which radio was clicked
    if (e.target.id == "publicRadio" && e.target.checked) {
      isPublic = true;
      publicOrgs = false;
    } else if (e.target.id == "publicOrgRadio" && e.target.checked) {
      isPublic = false;
      publicOrgs = true;
    } else if (e.target.id == "privateRadio" && e.target.checked) {
      isPublic = false;
      publicOrgs = false;
    }

    const newState = {
      ...csvFileState,
      ["is_public"]: isPublic,
      ["is_public_orgs"]: publicOrgs,
    };
    setCsvFileState(newState);
  };

  return (
    <form
      onSubmit={onSubmit}
      data-testid="csv_file_form-1"
      onKeyDown={(e) => {
        e.key === "Enter" && e.preventDefault();
      }}
    >
      {/* File name input group */}
      <div className="input-group mb-3">
        {/* Pre-fix label */}
        <div className="input-group-prepend">
          <span
            className="input-group-text bg-secondary text-white"
            id="basic-addon1"
          >
            Filename
          </span>
        </div>

        {/* Input Box */}
        <input
          className="form-control"
          value={csvFileState.file_name}
          placeholder={csvFileState.file_name}
          name="file_name"
          type="text"
          onChange={onChange}
          aria-label={csvFileState.file_name}
          aria-describedby="basic-addon1"
        ></input>
      </div>

      {/* Description input group */}
      <div className="input-group mb-3">
        {/* Pre-fix label */}
        <div className="input-group-prepend">
          <span className="input-group-text bg-secondary text-white">
            Description
          </span>
        </div>

        {/* Input Box */}
        <textarea
          className="form-control"
          value={csvFileState.description}
          placeholder={csvFileState.description}
          name="description"
          onChange={onChange}
          aria-label={csvFileState.description}
        ></textarea>
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="is_public"
          id="publicRadio"
          value="is_public"
          checked={csvFileState.is_public}
          onChange={onRadioChange}
        />
        <label className="form-check-label">Public</label>
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="is_public"
          id="publicOrgRadio"
          value="is_public_orgs"
          checked={csvFileState.is_public_orgs}
          onChange={onRadioChange}
        />
        <label className="form-check-label">Public To Orgs</label>
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="is_public"
          id="privateRadio"
          value="private"
          checked={!csvFileState.is_public && !csvFileState.is_public_orgs}
          onChange={onRadioChange}
        />
        <label className="form-check-label">Private</label>
      </div>
      <div>
        <h6>Registered Organizations</h6>
        <Select
          defaultValue={defaultSelectValues}
          options={selectOptions}
          onChange={onSelectChange}
          isMulti
        />
      </div>
      <div>
        <h6>Tags</h6>
        <TagsInput
          priorTags={csvFileState["tags"]}
          updateParentTags={(tags) =>
            setCsvFileState({ ...csvFileState, tags: tags })
          }
        />
      </div>

      <br />
      <br />

      {/* Update Information Button */}
      <button className="btn btn-success mb-2">Update Information</button>
    </form>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateCsvFile })(CsvFileForm);
