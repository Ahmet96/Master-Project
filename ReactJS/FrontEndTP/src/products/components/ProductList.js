import React from "react";

import Card from "../../shared/components/UIElements/Card";
import ProductItem from "./ProductItem";
import Button from "../../shared/components/FormElements/Button";
import "./ProductList.css";

const ProductList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="product-list center">
        <Card>
          <h2>No products found. Maybe create one?</h2>
          <Button to="/product/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="product-list">
      {props.items.map((product) => (
        <ProductItem
          key={product.id}
          id={product.id}
          image={product.image}
          title={product.title}
          description={product.description}
          price={product.price}
          category={product.category}
          currency={product.currency}
          creatorId={product.creator}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default ProductList;
