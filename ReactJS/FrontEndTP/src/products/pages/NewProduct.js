import React, { useContext,useState } from "react";
import { useHistory } from "react-router-dom";
import {MenuItem, FormControl, Select,InputLabel} from "@material-ui/core"
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./ProductForm.css";
import { red } from "@material-ui/core/colors";

const NewProduct = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
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
      image: {
        value: null,
        isValid: false,
      },
      category: {
        value: null,
        isValid: false,
      },
      currency: {
        value: null,
        isValid: false,
      },
    },
    false
  );


  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("currency", formState.inputs.currency.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);
      await sendRequest("http://localhost:5000/api/products", "POST", formData);
      history.push("/");
    } catch (err) {}
  };



  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="product-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="price"
          element="input"
          label="Price"
          validators={[VALIDATOR_REQUIRE("123456789")]}
          errorText="Please enter a valid price."
          onInput={inputHandler}
        /> 
      
        <Input
          id="category"
          element="input"
          label="Category"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid Category name."
          onInput={inputHandler}
        />
       { <Input
          id="currency"
          element="input"
          label="Currency"
          validators={[VALIDATOR_MAXLENGTH(3)]}
          errorText="Please enter a valid Currency Type, not longer than 3 words!"
          Placeholder="Eg:USD,TL"
          onInput={inputHandler}        
        /> 
        /* <FormControl styles={{ minWidth:100}}>
        <InputLabel>Currency</InputLabel>
          <Select variant='outlined'
          onChange={onCurrencyChange}
          >
            {currencies.map((currency) => (
                 <MenuItem value={currency}>
                   {currency}
                 </MenuItem>
            
            ))}
          </Select> */}
        {/* </FormControl> */}
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewProduct;
