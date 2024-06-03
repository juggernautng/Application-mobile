import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation, useRoute } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import {} from "react-native";
import { useAuth } from "../context/AuthContext";
import { Alert } from "react-native";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";
import env from "../env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResultatRechercheStyles } from "./ResultatRecherche";
import Certified from "../components/certifier";
import * as FileSystem from "expo-file-system";
import { NativeBaseProvider, Box, Select, CheckIcon } from "native-base";

const MonProfil = () => {
  const { profileData, updateProfileData } = useProfile();

  const { user, logout, token } = useAuth();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [certifier, setCertifier] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(null);
  const [rating, setRating] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState("");
  const { dispatch } = useAuth();
  const handleLogout = () => {
    AsyncStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigation.navigate("TabNavigator", {
      screen: "Profil",
      params: { screen: "WelcomeScreen" },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userResponse = await fetch(
        `http://${env.API_IP_ADDRESS}:3000/api/getUserData/${user.user.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await userResponse.json();

      setEmail(userData.user.email);
      setPhone(userData.user.num_tel);
      setName(userData.user.nom + " " + userData.user.prenom);
      setAge(userData.user.naissance);
      setRating(
        userData.user.total_rating + " (" + userData.user.num_ratings + ")"
      );
      setCertifier(userData.user.est_certifie);
      await loadImage(userData.user.photo);
      updateProfileData({
        email: email,
        phone: phone,
        name: name,
        photo: photo,
        rating: rating,
        age: age,
      });

      const carsResponse = await fetch(
        `http://${env.API_IP_ADDRESS}:3000/api/getCars/${user.user.id_uti}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!carsResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const carsData = await carsResponse.json();

      const carItems =
        carsData.length > 0
          ? carsData.map((car) => ({
              label: car.modele,
              value: [car.modele, car.couleur, car.matricule],
            }))
          : [{ label: "pas de voiture", value: "no_car" }];
      setItems(carItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const loadImage = async (path) => {
    const fileExists = await FileSystem.getInfoAsync(path);
    if (fileExists.exists) {
      setPhoto({ uri: path });
    } else {
      setPhoto(require("../assets/image1.png"));
    }
  };

  useEffect(() => {
    if (selectedValue !== null) {
      navigation.navigate("Voiture", { car: selectedValue });
    }
  }, [selectedValue, navigation]);

  return (
    <View style={pstyles.main}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0075fd"
          style={ResultatRechercheStyles.loadingIndicator}
        />
      ) : (
        <View style={[pstyles.main, { paddingTop: 0, paddingBottom: 0 }]}>
          <View style={[pstyles.userprofile, pstyles.centrer]}>
            <Image style={pstyles.imageIcon} source={photo} />
            <View style={[pstyles.centrer]}>
              <Text style={[pstyles.titleTypo]}>{name}</Text>
              <View
                style={[pstyles.centrer, { flexDirection: "row", width: "40" }]}
              >
                <Image
                  style={pstyles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector3.png")}
                />
                <Text style={[pstyles.text, { marginRight: 7.5 }]}>
                  {rating}
                  {"   "}|{"   "}
                  {age} ans
                </Text>
              </View>
            </View>
          </View>
          <View style={[pstyles.inputs, pstyles.centrer]}>
            <View style={[pstyles.certifier]}>
              <Certified bool={certifier ?? true} />
            </View>

            <View style={[pstyles.rectangle]}>
              <Text style={[pstyles.font]}>{email}</Text>
            </View>
            <View style={[pstyles.rectangle, { alignItems: "center" }]}>
              <Image
                style={[pstyles.alg]}
                contentFit="cover"
                source={require("../assets/flagforflagalgeria-svgrepocom1.png")}
              />
              <Text style={[pstyles.signTypo]}>+213</Text>
              <Text style={[pstyles.font]}>{phone}</Text>
            </View>


            <View style={{ flexDirection: "row", width: '80%',justifyContent: 'space-between'}}>
              <Box style={[pstyles.rectangle, {width: '80%'}]}>
                <Select
                  style={[pstyles.font]}
                  selectedValue={selectedValue}
                  minWidth={250}
                  placeholder="Voitures"
                  onValueChange={(value) => {
                    setSelectedValue(value);
                  }}
                  color="#7c7c7c"
                  fontFamily="Nunito-Regular"
                  fontSize={15}
                  _item={{
                    borderRadius: 20,
                    _pressed: {
                      bg: "#e3ecfa",
                    },
                  }}
                  mt={1}
                  borderWidth={0}
                >
                  {items.map((item, index) => (
                    <Select.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Select>
              </Box>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Voiture", { car: "no_car" })
                }
                style={[pstyles.rectangle, pstyles.addbtn, pstyles.centrer]}
              >
                <Image
                  style={[pstyles.addicon]}
                  contentFit="cover"
                  source={require("../assets/add.svg")}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={pstyles.btns}>
            <TouchableOpacity
              style={[pstyles.buttons, { backgroundColor: "#0075fd" }]}
              onPress={() => navigation.navigate("Modifier")}
            >
              <Text style={[pstyles.signTypo, { color: "#ffffff" }]}>
                Modifier
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[pstyles.buttons, pstyles.blue]}
              onPress={handleLogout}
            >
              <Text style={[pstyles.blue, pstyles.signTypo]}>Se déconnecter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[pstyles.buttons, pstyles.red]}
              onPress={() => navigation.navigate("ConfirmDelete")}
            >
              <Text style={[pstyles.signTypo, pstyles.red]}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export const pstyles = StyleSheet.create({
  certifier: {
    alignItems: "center",
    justifyContent: "center",
    width: '35%'
  },
  addicon: {
    height: 40,
    width: 40,
  },
  centrer: {
    justifyContent: "center",
    alignItems: "center",
  },
  font: {
    paddingLeft: 15,
    color: "#7d7d7d",
    fontSize: 17,
    fontFamily: "Poppins-Medium",
  },
  titleTypo: {
    fontFamily: "Poppins-Medium",
    fontSize: 23,
    color: "#5a5a5a",
    textAlign: "center",
    marginTop: "4%",
  },
  signTypo: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito-Bold",
    marginLeft: 5,
  },
  userprofile: {
    width: "100%",
    height: "30%",
  },
  buttons: {
    height: 59,
    width: "76%",
    borderRadius: 13,
    borderWidth: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "transparent",
  },
  imageIcon: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#0075fd",
  },
  vectorIcon: {
    width: 12,
    height: 12,
  },

  alg: {
    marginLeft: 15,
    height: 23,
    width: 24,
  },

  rectangle: {
    alignItems: "center",
    height: 60,
    borderWidth: 1,
    borderColor: "#b8b8b8",
    width: "80%",
    marginTop: 15,
    borderRadius: 13,
    flexDirection: "row",
  },
  inputs: {
    height: "40%",
    width: "100%",
  },
  blue: {
    color: "#0075fd",
    borderColor: "#0075fd",
  },
  red: {
    color: "#ff4444",
    borderColor: "#ff4444",
  },
  main: {
    paddingTop: "12%",
    paddingBottom: "5%",
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  drop: {
    backgroundColor: "white",
    width: "60%",
    marginTop: 10,
    borderColor: "#b8b8b8",
  },
  addbtn: {
    height: 55,
    width: 55,
    marginTop: 17,
  },
  btns: {
    height: "27%",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

export default MonProfil;
