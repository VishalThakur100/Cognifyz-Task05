/* eslint-disable react/prop-types */
import  { useState } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Provides authentication context to its children components.
 *
 * This component uses React's context API to make the user's authentication state
 * available throughout the component tree. It manages the user state and provides
 * both the user object and a function to update it to any components that consume
 * this context.
 *
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access
 * to the authentication context.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};