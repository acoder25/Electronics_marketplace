import react,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import './Bucketlst.css';
import { Link } from 'react-router-dom';

const List=()=>{
  const user = useSelector((state) => state.user);
  const email=user.email;

  console.log(user);
  const [items,setItems]=useState([]);

  useEffect(()=>{
    const fetchItems=async()=>{
      try{
        const res=await fetch("http://localhost:5000/api/get_items_specific",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({email}),

        });
        if(res.ok){
          const data=await res.json();
          setItems(data);
        }
        else{
          console.error("failed to fetch items");
        }


      }
      catch(error){
          console.log(error);
      }

    };
    fetchItems();
  },[email]);

   return(
    
    <>
    <div className='head'>
      
     {`Hello ${user.username} ,Welcome To Your Catalogue`}   
     &nbsp;&nbsp;<i class="bi bi-cart"></i>

    </div>
    <div className='center'>
      <div className="item-list">
      {items.length === 0 ? (
        <p>Loading items...</p>
      ) : (
        items.map((item) => (
          <div className="item" key={item.id}>
            <img
              src={`http://localhost:5000/images/${item.imagepath}`}
              alt={item.type}
              className="item-image"
            />
            <div className="item-details">
              <h3 className="item-title">{item.model}</h3>
              <p className="item-description">Type: {item.type}</p>
              <p className="item-description">Storage: {item.storage} GB</p>
              <p className="item-description">RAM: {item.ram} GB</p>
              <p className="item-description">
                Screen Condition: {item.screenCondition}
              </p>
              <p className="item-description">
                Physical Condition: {item.physicalCondition}
              </p>
              <p className="item-price">Price: ${item.price}</p>
            </div>
          </div>
        ))
      )}

      </div>
      <div className='add'>
      <Link to="/Add_items"><i class="bi bi-plus-circle"></i></Link>
      </div>

    </div>
    </>
   )
}
export default List;