import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchProduct, deleteProduct } from '../store/slices/productSlice';
import { setCurrentChat } from '../store/slices/chatSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!currentProduct) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;
    const result = await dispatch(deleteProduct(currentProduct.id));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/my-products');
    }
  };

  const handleMessageSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (currentProduct) {
      dispatch(setCurrentChat({
        other_user_id: currentProduct.seller_id,
        other_username: currentProduct.seller_name,
        last_message_time: new Date().toISOString(),
      }));
      navigate('/chat');
    }
  };

  if (loading || !currentProduct) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  const isOwner = user && currentProduct.seller_id === user.id;

  return (
    <div className="container">
      <div className="product-detail">
        {currentProduct.image_url && (
          <img 
            src={currentProduct.image_url} 
            alt={currentProduct.title} 
            className="product-detail-image" 
            onError={(e) => { e.target.src = '/placeholder-image.svg'; e.target.onerror = null; }}
          />
        )}
        <div className="product-detail-content">
          <div className="product-detail-header">
            <div>
              <h1 className="product-detail-title">{currentProduct.title}</h1>
              <div className="product-detail-meta">
                <span className="badge badge-info">{currentProduct.category}</span>
                <span className="badge badge-success">{currentProduct.condition}</span>
                <span className="badge badge-info">Seller: {currentProduct.seller_name}</span>
              </div>
            </div>
            <div className="product-detail-price">₹{parseInt(currentProduct.price).toLocaleString('en-IN')}</div>
          </div>

          <p className="product-detail-description">{currentProduct.description}</p>

          <div className="product-detail-actions">
            {!isOwner && (
              <button className="btn btn-primary" onClick={handleMessageSeller}>Message Seller</button>
            )}
            {isOwner && (
              <>
                <Link to={`/edit-product/${currentProduct.id}`} className="btn btn-outline">Edit Listing</Link>
                <button className="btn btn-danger" onClick={handleDelete}>Delete Listing</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
