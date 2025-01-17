import React, { useState } from "react";
import classes from "./ProductList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../Store/CartSlice";

const ProductsList = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const cartQuantity = useSelector((state) => state.cart.products);

  const cartItem = cartQuantity.find((cartItem) => cartItem.id === item.id);

  const itemQuantity = cartItem ? cartItem.quantity : 0;

  const handleQuantity = (event) => {
    const value = parseInt(event.target.value);
    setQuantity(value);
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    dispatch(cartActions.addToCart({ ...item, quantity }));
    setQuantity(1);
  };

  // Function to truncate title to 5 characters
  const truncateTitle = (title, limit) => {
    return title.length > limit ? title.substring(0, limit) + "..." : title;
  };

  return (
    <div className={classes.card}>
      <article className={classes.article}>
        <div>
          <img src={item.images[0]} alt={item.title} />
        </div>
        <div>
          <p className={classes.title}>{truncateTitle(item.title, 20)}</p>
          <p className={classes.description}>
            {item.description.length > 50
              ? item.description.substring(0, 50) + "..."
              : item.description}
          </p>
          <p className={classes.price}>${item.price}</p>
        </div>
        <div className={classes.form}>
          <form onSubmit={handleAddToCart}>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={handleQuantity}
            />
            <button type="submit">Add to cart</button>
          </form>
        </div>
        <p className={classes.itemQuantity}>
          Added Item Quantity: {itemQuantity}
        </p>
      </article>
    </div>
  );
};

export default ProductsList;
