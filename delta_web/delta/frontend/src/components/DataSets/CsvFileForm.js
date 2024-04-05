import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateCsvFile } from "../../actions/file";
import TagsInput from "../data_transfer/TagsInput";
import Select from "react-select";
import { Link } from "react-router-dom";

const CsvFileForm = (props) => {
  const [csvFileState, setCsvFileState] = useState({
    name: props.csvFile.name,
    id: props.csvFile.id,
    description: props.csvFile.description,
    is_public: props.csvFile.is_public,
    is_public_orgs: props.csvFile.is_public_orgs,
    registered_organizations: props.csvFile.registered_organizations,
    tags: undefined,
  });

  const [selectOptions, setSelectOptions] = useState([]);

  const defaultSelectValues = props.csvFile.org_objs.map((org) => ({
    label: org.name,
    value: org.id,
  }));

  useEffect(() => {
    const select = props.auth.user.followed_organizations.map((org) => ({
      value: org.id,
      label: org.name,
    }));
    setSelectOptions(select);

    const tags = props.csvFile.tags.map((tagObj) => tagObj.text);
    setCsvFileState({ ...csvFileState, tags: tags });
  }, []);

  if (!csvFileState.tags) return null;

  const onSelectChange = (arrSelects) => {
    const arrOrgs = arrSelects.map((obj) => obj.value);
    setCsvFileState({ ...csvFileState, registered_organizations: arrOrgs });
  };

  const onChange = (e) => {
    setCsvFileState({ ...csvFileState, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    props.updateCsvFile(csvFileState);
  };

  const onRadioChange = (e) => {
    let isPublic = false;
    let publicOrgs = false;

    if (e.target.id === "publicRadio" && e.target.checked) {
      isPublic = true;
    } else if (e.target.id === "publicOrgRadio" && e.target.checked) {
      publicOrgs = true;
    }

    setCsvFileState({
      ...csvFileState,
      is_public: isPublic,
      is_public_orgs: publicOrgs,
    });
  };

  return (
    <form onSubmit={onSubmit} data-testid="csv_file_form-1" onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Dataset Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={csvFileState.name}
          onChange={onChange}
          placeholder={csvFileState.name}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={csvFileState.description}
          onChange={onChange}
          placeholder={csvFileState.description}
          rows="3"
        ></textarea>
      </div>

      <div className="mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="visibility"
            id="publicRadio"
            checked={csvFileState.is_public}
            onChange={onRadioChange}
          />
          <label className="form-check-label" htmlFor="publicRadio">Public</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="visibility"
            id="publicOrgRadio"
            checked={csvFileState.is_public_orgs}
            onChange={onRadioChange}
          />
          <label className="form-check-label" htmlFor="publicOrgRadio">Public To Orgs</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="visibility"
            id="privateRadio"
            checked={!csvFileState.is_public && !csvFileState.is_public_orgs}
            onChange={onRadioChange}
          />
          <label className="form-check-label" htmlFor="privateRadio">Private</label>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="organizations" className="form-label">Registered Organizations</label>
        <Select
          id="organizations"
          defaultValue={defaultSelectValues}
          options={selectOptions}
          onChange={onSelectChange}
          isMulti
        />
      </div>

      <div className="mb-3">
        <label htmlFor="tags" className="form-label">Tags</label>
        <TagsInput
          id="tags"
          priorTags={csvFileState.tags}
          updateParentTags={(tags) => setCsvFileState({ ...csvFileState, tags: tags })}
        />
      </div>

    <div className="row">
      <div>
        <Link to={`/csvs/${csvFileState.id}`}>
          <button className="btn btn-danger">Back</button>
        </Link>
      </div>
      <div>
        <button type="submit" className="btn btn-primary">Update Information</button>
      </div>
    </div>

    </form>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateCsvFile })(CsvFileForm);