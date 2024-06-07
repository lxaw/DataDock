import React from "react"
import {connect} from 'react-redux'

const FolderDetail = (props) => {
    return (
        <div>
            Folder
        </div>
    )
}

const mapStateToProps = state =>({
    auth:state.auth
})

export default connect(mapStateToProps,{})(FolderDetail)