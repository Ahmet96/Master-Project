import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import AllProducts from "./products/pages/AllProducts"
import Users from "./user/pages/Users";
import NewProducts from "./products/pages/NewProduct";
import UserProducts from "./products/pages/UserProduct";
import UpdateProducts from "./products/pages/UpdateProduct";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/products" exact>
          <UserProducts />
        </Route>
        <Route path="/products/new" exact>
          <NewProducts />
        </Route>
        <Route path="/products/:productId">
          <UpdateProducts />
        </Route>
        <Route path="/shopping">
          <AllProducts />
        </Route>
       
       
        <Redirect to="/" />
      </Switch>
      
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/products" exact>
          <UserProducts />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
       <Route path="/shopping">
          <AllProducts />
        </Route> 
        <Redirect to="/auth" />
        
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
