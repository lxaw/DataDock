import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getFolderById } from "../../actions/file";
import DataCard from "../data_transfer/DataCard";

const FolderDetail = (props) => {
    const { id } = useParams();
    const [folder, setFolder] = useState(null);
    const [datasets, setDatasets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        props.getFolderById(id).then((res) => {
            setFolder(res.data);
            setDatasets(res.data.datasets);
        });
    }, [id, props]);

    const renderItems = () => {
        return datasets.map((item) => {
            const handleClick = () => {
                navigate(`/csvs/${item.id}`);
            };

            return (
                <div className="col-4" key={item.id}>
                    <span onClick={handleClick}>
                        <DataCard data={item} />
                    </span>
                </div>
            );
        });
    };

    return (
        <div>
            {folder && (
                <div>
                    <h2>{folder.name}</h2>
                    <p>{folder.description}</p>
                </div>
            )}
            <div className="row">
                {datasets.length > 0 ? renderItems() : <p>No datasets available</p>}
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { getFolderById })(FolderDetail);
