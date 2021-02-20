import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./ProductForm.css";

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProduct, setLoadedProduct] = useState();
  const productId = useParams().productId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
      currency: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/products/${productId}`
        );
        setLoadedProduct(responseData.product);
        setFormData(
          {
            title: {
              value: responseData.product.title,
              isValid: true,
            },
            description: {
              value: responseData.product.description,
              isValid: true,
            },
            price: {
              value: responseData.product.price,
              isValid: true,
            },
            category: {
              value: responseData.product.category,
              isValid: true,
            },
            currency: {
              value: responseData.product.currency,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchProduct();
  }, [sendRequest, productId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/products/${productId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          price: formState.inputs.price.value,
          category: formState.inputs.category.value,
          currency: formState.inputs.currency.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/" + auth.userId + "/products");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedProduct && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find product!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedProduct && (
        <form className="product-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedProduct.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedProduct.description}
            initialValid={true}
          />
          <Input
            id="price"
            element="input"
            label="Price"
            validators={[VALIDATOR_REQUIRE("123456789")]}
            errorText="Please enter a valid price."
            initialValue={loadedProduct.price}
            onInput={inputHandler}
          />
          <Input
            id="category"
            element="input"
            label="Category"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid Category name."
            initialValue={loadedProduct.category}
            onInput={inputHandler}
          />
          <Input
            id="currency"
            element="input"
            label="Currency"
            validators={[VALIDATOR_MAXLENGTH(3)]}
            errorText="Please enter a valid Currency Type, not longer than 3 words!"
            initialValue={loadedProduct.currency}
            Placeholder="Eg:USD,TL"
            onInput={inputHandler}
          />

          <Button type="submit" disabled={formState.isValid}>
            UPDATE PRODUCT
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
