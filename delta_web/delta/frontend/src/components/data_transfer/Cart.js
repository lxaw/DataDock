import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux';
import { getCartItems } from '../../actions/file';

const Cart = (props) =>{
    const [arrCartItems,setArrCartItems] = useState([])

    useEffect(()=>{
        props.getCartItems()
    },[])

    return(
        <div className = "container">
            <h1>Your Cart</h1>
            <div>
                {arrCartItems.map((data)=>{
                    console.log(data)
                })}
            </div>
        </div>
    )
}
const mapStateToProps = state =>({
    auth:state.auth
})

export default connect(mapStateToProps,{getCartItems})(Cart)