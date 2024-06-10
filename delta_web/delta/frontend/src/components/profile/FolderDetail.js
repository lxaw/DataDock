import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getFolderById } from "../../actions/file";

const FolderDetail = (props) => {
    const { id } = useParams();

    useEffect(()=>{
        props.getFolderById(id).then((res)=>{
            console.log(res)
        })
    })

    return (
        <div>
            Folder ID: {id}
        </div>
    );
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {getFolderById})(FolderDetail);