import React, { createContext, useContext, useState } from 'react';

// Create the RefreshContext
const RefreshContext = createContext();

// Create a custom hook to use the RefreshContext
export const useRefresh = () => useContext(RefreshContext);

// Create the RefreshProvider component
export const RefreshProvider = ({ children }) => {
  // State to manage the refresh state
  const [refresh, setRefresh] = useState(false);

  // Function to trigger a refresh
  const refreshPage = () => {
    setRefresh(!refresh);
  };

  // Provide the refresh function to the child components
  return (
    <RefreshContext.Provider value={{ refreshPage }}>
      {children}
    </RefreshContext.Provider>
  );
};
