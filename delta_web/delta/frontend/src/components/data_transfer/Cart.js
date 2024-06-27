// Modified Cart component
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { downloadDataset,getCartItems,deleteCartItem} from '../../actions/datasets';
import tag_styles from "../data_transfer/tags.module.css";

const Cart = (props) => {
  const [arrCartItems, setArrCartItems] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true)

  useEffect(() => {
    // Simulating the API call with the mock dataset
    // setArrCartItems(cartItems);
    const fetchCartItems = async () =>{
      try{
        const cartItems = (await props.getCartItems())[0].cart_items;
        setArrCartItems(cartItems)
        console.log(cartItems)
      }catch (error){
        console.log(error)
      }
      finally{
        setIsLoadingCart(false)
      }
    }
    fetchCartItems();
  }, []);

  const handleDownload = async () => {
    for(const cartItem of arrCartItems){
      const dataSet = cartItem.dataset
      const dataSetId = dataSet.id
      // call download
      try{
        const result = (await props.downloadDataset(dataSetId))
      }catch(error){
        console.log(error)
      }
      finally{
        // do something here if needed
      }
    }
  };

  const handleRemove = async (itemId) => {
    // Remove the item from the cart
    const updatedCartItems = arrCartItems.filter((item) => item.id !== itemId);
    setArrCartItems(updatedCartItems);
    // delete cart item
    try{
      const result = (await props.deleteCartItem(itemId))
    }catch(error){
      console.log(error)
    }
    finally{
      // to something here if needed
    }
  };

  if(isLoadingCart){
    return <div>Loading cart...</div>
  }

  return (
    <div className="container">
      <h1>Your Cart</h1>
      <div className="row">
        <div className="col-md-3">
          <div className="card p-3">
            <h4>Download Summary</h4>
            <p>Number of files: {arrCartItems.length}</p>
            <button className="btn btn-primary" onClick={handleDownload}>
              Download Selected Items
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <div style={{overflowY: 'auto' }}>
            {arrCartItems.map((item) => (
              <div key={item.dataset.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">{item.dataset.name}</h5>
                      <p className="card-text">{item.dataset.author_username} - {item.dataset.formatted_date}</p>
                    </div>
                    <button
                      className="btn btn-link text-danger p-0"
                      style={{ background: 'none', border: 'none' }}
                      onClick={() => handleRemove(item.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <div>
                    <p className="card-text">{item.dataset.description}</p>
                    <small>Download count: {item.dataset.download_count}</small>
                  </div>
                  <div className="mt-2">
                    {item.dataset.tags.map((tag, index) => (
                      <span key={index} className={`${tag_styles.tag_item} me-1`}>
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getCartItems,downloadDataset,deleteCartItem})(Cart);