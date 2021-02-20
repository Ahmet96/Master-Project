import React, { useState, useContext } from "react";

import User from "../../user/pages/Users"
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./ProductItem.css";


const ProductItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showmModal, setShowmModal] = useState(false);

  const showWarningHandler = () => {
    setShowmModal(true);
  };

  const cancelHandler = () => {
    setShowmModal(false);
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/products/${props.id}`,
        "DELETE"
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      
  
      
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="product-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>

          
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
 

       <Modal
        show={showmModal}
        onCancel={cancelHandler}
        header="Seller Information"
        footerClass="product-item__modal-actions"
        footer={
          <React.Fragment>
            <User />       
            <Button inverse onClick={cancelHandler}>
              CANCEL
            </Button>
          
          </React.Fragment>
        }
      >
      </Modal>
  
      <li className="product-item">
        <Card className="product-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="product-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="product-item__info">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <h3>{props.price}</h3>
            <h3>{props.category}</h3>
            <h3>{props.currency}</h3>
          </div>
          <div className="product-item__actions">
            {auth.userId === props.creatorId && (
              <Button to={`/products/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button  danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            
            )}

             
             <Button onClick={showWarningHandler}>Contact with the Seller</Button>
          
            
             
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ProductItem;
