const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Recherche from "./screens/Recherche";
import Details from "./screens/Details";
import Modifier from "./screens/Modifier";
import Voiture from "./screens/Voiture";
import Signaler from "./screens/Signaler";
import DatailsAjouter from "./screens/DatailsAjouter";
import CarpoolPasses from "./screens/Carpools";
import MonProfil from "./screens/MonProfil";
import AjouterAnnonce from "./screens/AjouterAnnonce";
import YourRides from "./screens/YourRides";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import ResultatRecherche from "./screens/ResultatRecherche";
import SearchBar from "./screens/SearchBar";
import AfficherMap from "./screens/AfficherMap";
import Annonce from "./components/Annonce";
import Evaluer from "./components/Evaluer";
import WelcomeScreen from "./screens/WelcomeScreen";
import Mdp from "./screens/Mdp";
import ForgotPwd from "./screens/ForgotPwd";
import ResetPwd from "./screens/ResetPwd";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Padding } from "./GlobalStyles";
import ParticipantsScreen from "./screens/ParticipantsScreen";
import { AuthContextProvider, AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext';
import { ProfileProvider } from "./context/ProfileContext";
import { RefreshProvider } from "./context/refresh";
import ConfirmDelete from "./screens/ConfimDelete";
import CertifierCompte from "./screens/CertifierCompte";
import Notifications from "./screens/Notifications";
import { NativeBaseProvider } from 'native-base';
import CertifierCar from "./screens/CertifierCar";

const SearchName = "Search";
const YourRidesName = "Vos Trajets";
const PublishName = "Publier";
const CarpoolsName = "Carpools";
const ProfileName = "Profil";

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

  const [fontsLoaded, error] = useFonts({
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "Nunito-ExtraBold": require("./assets/fonts/Nunito-ExtraBold.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
    <NativeBaseProvider>
      <RefreshProvider>
        <ProfileProvider>
          <AuthContextProvider>
            <NavigationContainer>
              {hideSplashScreen ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="TabNavigator" component={TabNavigator} />
                  <Stack.Screen
                    name="Recherche"
                    component={Recherche}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Details"
                    component={Details}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Modifier"
                    component={Modifier}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Voiture"
                    component={Voiture}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Signaler"
                    component={Signaler}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="DatailsAjouter"
                    component={DatailsAjouter}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="CarpoolPasses"
                    component={CarpoolPasses}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="MonProfil"
                    component={MonProfil}
                    options={{ headerShown: false}}
                  />
                  <Stack.Screen
                    name="AjouterAnnonce"
                    component={AjouterAnnonce}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="YourRides"
                    component={YourRides}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="ResultatRecherche"
                    component={ResultatRecherche}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="WelcomeScreen"
                    component={WelcomeScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Mdp"
                    component={Mdp}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="SearchBar"
                    component={SearchBar}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="AfficherMap"
                    component={AfficherMap}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="ForgotPwd"
                    component={ForgotPwd}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="ResetPwd"
                    component={ResetPwd}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="ParticipantsScreen"
                    component={ParticipantsScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="ConfirmDelete"
                    component={ConfirmDelete}
                    options={{ headerShown: false }}
                  />
                    <Stack.Screen
                    name="CertifierCompte"
                    component={CertifierCompte}
                    options={{ headerShown: false }}
                  />
                   <Stack.Screen
                    name="Notifications"
                    component={Notifications}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="CertifierCar"
                    component={CertifierCar}
                    options={{ headerShown: false }}
                  />

                </Stack.Navigator>
              ) : null}
            </NavigationContainer>
          </AuthContextProvider>
        </ProfileProvider>
      </RefreshProvider>
      </NativeBaseProvider>
    </>
  );
};

const TabNavigator = () => {
  const { user } = useAuth();
  return (
    <Tab.Navigator
      initialRouteName={SearchName}
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === SearchName) {
            iconName = focused ? (
              <Image contentFit="cover" source={require("./assets/search.png")} />
            ) : (
              <Image
                contentFit="cover"
                source={require("./assets/search1.png")}
              />
            );
          } else if (rn === YourRidesName) {
            iconName = focused ? (
              <Image
                contentFit="cover"
                source={require("./assets/format-list-bulleted1.png")}
              />
            ) : (
              <Image
                contentFit="cover"
                source={require("./assets/format-list-bulleted.png")}
              />
            );
          } else if (rn === PublishName || rn === CarpoolPasses) {
            iconName = focused ? (
              <Image
                contentFit="cover"
                source={require("./assets/add-circle-outline1.png")}
              />
            ) : (
              <Image
                contentFit="cover"
                source={require("./assets/add-circle-outline.png")}
              />
            );
          } else if (rn === CarpoolsName) {
            iconName = focused ? (
              <Image
                contentFit="cover"
                source={require("./assets/sharecircle-svgrepocom2.png")}
              />
            ) : (
              <Image
                contentFit="cover"
                source={require("./assets/sharecircle-svgrepocom5.png")}
              />
            );
          } else if (rn === ProfileName) {
            iconName = focused ? (
              <Image
                contentFit="cover"
                source={require("./assets/profile1.png")}
              />
            ) : (
              <Image
                contentFit="cover"
                source={require("./assets/profile.png")}
              />
            );
          }

          return iconName;
        },

        tabBarStyle: {
          alignContent: "center",
          justifyContent: "center",
          height: 60,
          flexDirection: "row",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 9,
          marginTop: -8,
        },
      })}
    >
      <Tab.Screen
        name={SearchName}
        component={SearchStackScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Tab.Screen
        name={YourRidesName}
        component={YourRidesStackScreen}
        options={{ headerShown: false}}
      />
      <Tab.Screen
        name={PublishName}
        component={PublishStackScreen}
        options={{ headerShown: false, unmountOnBlur: true}}
      />
      <Tab.Screen
        name={CarpoolsName}
        component={CarpoolsStackScreen}
        options={{ headerShown: false}}
      />

      {user ? (
        <Tab.Screen
          name={ProfileName}
          component={ProfileScreen}
          options={{ headerShown: false, unmountOnBlur: true  }}
        />
      ) : (<Tab.Screen
        name={ProfileName}
        component={WelcomeScreenComp}
        options={{ headerShown: false}}
      />)}
    </Tab.Navigator>
  );
};

const SearchStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Recherche" component={Recherche} />
    <Stack.Screen name="ResultatRecherche" component={ResultatRecherche} />
    <Stack.Screen name="Details" component={Details} />
    <Stack.Screen name="SearchBar" component={SearchBar} />
    <Stack.Screen name="AfficherMap" component={AfficherMap} />
    <Stack.Screen name="Notifications" component={Notifications} />

  </Stack.Navigator>
);

const YourRidesStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="YourRides" component={YourRides} />
    <Stack.Screen name="ParticipantsScreen" component={ParticipantsScreen} />
  </Stack.Navigator>
);

const PublishStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AjouterAnnonce" component={AjouterAnnonce} />
    <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="Voiture" component={Voiture} />
    <Stack.Screen name="SearchBar" component={SearchBar} />
    <Stack.Screen name="DatailsAjouter" component={DatailsAjouter} />
    <Stack.Screen name="CertifierCar" component={CertifierCar} />
  </Stack.Navigator>
);

const CarpoolsStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CarpoolPasses" component={CarpoolPasses} />
    <Stack.Screen name="Signaler" component={Signaler} />
    <Stack.Screen name="ParticipantsScreen" component={ParticipantsScreen} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

const ProfileScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MonProfil" component={MonProfil} />
    <Stack.Screen name="CertifierCompte" component={CertifierCompte} />
    <Stack.Screen name="Modifier" component={Modifier} />
    <Stack.Screen name="Voiture" component={Voiture} />
    <Stack.Screen name="Mdp" component={Mdp} />
    <Stack.Screen name="DatailsAjouter" component={DatailsAjouter} />
    <Stack.Screen name="ConfirmDelete" component={ConfirmDelete} />
    <Stack.Screen name="CertifierCar" component={CertifierCar} />
  </Stack.Navigator>
);

const WelcomeScreenComp = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="ForgotPwd" component={ForgotPwd} />
    <Stack.Screen name="ResetPwd" component={ResetPwd} />
  </Stack.Navigator>
);

export default App;
