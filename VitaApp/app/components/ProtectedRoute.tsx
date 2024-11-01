import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../../context/authContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href='/login' />;
    }

    return children;
};

export default ProtectedRoute;