import React from 'react'
import {connect} from 'react-redux';

const Cart = (props) =>{
    return(
        <div className = "container">
            <h1>Your Cart</h1>

        </div>
    )
}
const mapStateToProps = state =>({
    auth:state.auth
})

export default connect(mapStateToProps,{})(Cart)