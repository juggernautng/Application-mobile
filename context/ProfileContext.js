import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);
export const useCars = () => useContext(ProfileContext);


export const ProfileProvider = ({ children }) => {
    const [profileData, setProfileData] = useState(null);
    const [cars, setCars] = useState(null);
  
    const updateProfileData = (data) => {
      setProfileData(data);
    };
  
    const updateCars = (data) => {
      setCars(data);
    };
  
    return (
      <ProfileContext.Provider value={{ profileData, updateProfileData, cars, updateCars }}>
        {children}
      </ProfileContext.Provider>
    );
  };