// src/components/ProtectedRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "contexts/AuthContext"; // Adjust the path according to your project structure

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        user && allowedRoles.includes(user.role) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/sign-in" />
        )
      }
    />
  );
};

export default ProtectedRoute;
