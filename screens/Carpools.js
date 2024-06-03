import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, Padding, Border, FontSize } from "../GlobalStyles";
import Evaluer from "../components/Evaluer";
import TopBar from "../components/TopBar";
import Annonce from "../components/Annonce";
import { RechercheStyles } from "./Recherche";
import NotAuth from "../components/notAuth";
import { useAuth } from "../context/AuthContext";
import { YourRidesStyles } from "./YourRides";
import { timestampToDateTime } from "./ResultatRecherche";
import axios from "axios";
import env from "../env";
import { useRefresh } from "../context/refresh";
import { ResultatRechercheStyles } from "./ResultatRecherche";
import { ActivityIndicator, RefreshControl } from "react-native";
import * as FileSystem from 'expo-file-system';

const Carpools = () => {
  const [activeButton, setActiveButton] = useState(0); // "venir" or "passes"

  const refresh = useRefresh();
  const [dataVenir, setDataVenir] = useState([]);
  const [dataPasses, setDataPasses] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false); 

  const loadImage = async (path) => {
    const fileExists = await FileSystem.getInfoAsync(path);
    if (fileExists.exists) {
      return { uri: path };
    } else {
      return require("../assets/image1.png");
    }
  };

  const fetchDataFromDatabasePasses = async () => {
    try {
      const response = await axios.get(
        `http://${env.API_IP_ADDRESS}:3000/api/getPassedRides`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            email: user.user.email,
          },
        }
      );

      if(response.data){for (const item of response.data) {
        const loadedPhoto = await loadImage(item.photo);
        item.photo = loadedPhoto;
      }}

      setDataPasses(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataFromDatabaseVenir = async () => {
    try {
      const response = await axios.get(
        `http://${env.API_IP_ADDRESS}:3000/api/getIncomingRides`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            email: user.user.email,
          },
        }
      );
      if(response.data){for (const item of response.data) {
        const loadedPhoto = await loadImage(item.photo);
        item.photo = loadedPhoto;
      }}
      setDataVenir(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDataFromDatabasePasses();
      fetchDataFromDatabaseVenir();
    }
  }, [refresh, user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDataFromDatabaseVenir(); 
    fetchDataFromDatabasePasses();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderItemVenir = ({ item }) => {
    const { date, time } = timestampToDateTime(item.timestamp);

    return (
      <Annonce
        trajetId={item.id_trajet}
        name={`${item.nom} ${item.prenom}`}
        rating={item.total_rating}
        nbrRatings={item.num_ratings}
        startLocation={item.depart}
        endLocation={item.arrivee}
        price={item.prix}
        modele={item.modele}
        time={time}
        date={date}
        availableSeats={item.nbr_place}
        photo = {item.photo}
        details = {item.details}
        genre = {item.genre}
        couleur = {item.couleur}
        matricule = {item.matricule}
        email = {item.email}
        num_tel = {item.num_tel}
        id_reservation = {item.id_reservation}
        naissance= {item.naissance}
        est_certifie={item.est_certifie}
        voiture_est_certifie = {item.voiture_est_certifie}
        btnText="Annuler"
        canDelete = "f"
      />
    );
  };

  const renderItemPasses = ({ item }) => {
    const { date, time } = timestampToDateTime(item.timestamp);

    return (
      <Evaluer
        trajetId={item.id_trajet}
        name={`${item.nom} ${item.prenom}`}
        rating={item.total_rating}
        nbrRatings={item.num_ratings}
        startLocation={item.depart}
        endLocation={item.arrivee}
        price={item.prix}
        modele={item.modele}
        time={time}
        date={date}
        availableSeats={item.nbr_place}
        id_reservation = {item.id_reservation}
        id_conducteur = {item.id_conducteur}
        photo = {item.photo}
      />
    );
  };

  if (!user) {
    return (
      <View style={YourRidesStyles.container}>
        <TopBar />
        <Text
          style={[YourRidesStyles.title]}
        >
          Carpools
        </Text>
        <NotAuth title="Besoin de se connecter/s'inscrire" photo={2} />
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('TabNavigator', {
              screen: 'Profil',
              params: {
                screen: 'WelcomeScreen', 
              }
            })}
          >
            <Image
              style={[{ width: 50, height: 50, marginTop: -150 }]}
              contentFit="cover"
              source={require("../assets/next.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }else{

  return (
    <View style={[styles.container, styles.rectangleLayout]}>
      <TopBar />
      <Text style={[styles.carpools, styles.carpoolsTypo]}>Carpools</Text>
      <View style={[styles.buttonContainer, styles.trajetFlexBox]}>
        <TouchableOpacity
          style={[
            styles.button,
            activeButton === 0 ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setActiveButton(0)}
        >
          <Text
            style={[
              styles.buttonText,
              activeButton === 0
                ? styles.buttonTextActive
                : styles.buttonTextInactive,
            ]}
          >
            A venir
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            activeButton === 1 ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setActiveButton(1)}
        >
          <Text
            style={[
              styles.buttonText,
              activeButton === 1
                ? styles.buttonTextActive
                : styles.buttonTextInactive,
            ]}
          >
            Passés
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        {activeButton === 0 ? (
          isLoading ? (
            <ActivityIndicator
              size="large"
              color="#0075fd"
              style={ResultatRechercheStyles.loadingIndicator}

            />
          ) : (
            <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0075fd']}
            progressBackgroundColor='white'
          >
            <FlatList
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
              data={dataVenir}
              renderItem={renderItemVenir}
              keyExtractor={(item) => item.id_trajet.toString()}
              ListEmptyComponent={
                <View style={[{ marginTop: "40%" }]}>
                  <NotAuth
                    title={"Vos trajets à venir apparaîtront ici"}
                    photo={3}
                  />
                </View>
              }
            /></RefreshControl>
          )
        ) : isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0075fd"
            style={ResultatRechercheStyles.loadingIndicator}
          />
        ) : (
          <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#0075fd']}
          progressBackgroundColor='white'
        >
          <FlatList
          style={{ width: "100%" }} 
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
            data={dataPasses}
            renderItem={renderItemPasses}
            keyExtractor={(item) => item.id_trajet.toString()}
            ListEmptyComponent={
              <View style={[{ marginTop: "40%" }]}>
                <NotAuth
                  title={"Votre historique de trajets ici"}
                  photo={3}
                />
              </View>
            }
          /></RefreshControl>
        )}
      </View>
    </View>
  );};
};
const styles = StyleSheet.create({
  needLogin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authenticateButton: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    margin: 15, 
  },

  container: {
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
  },


  button: {
    width: 100,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Border.br_3xs,
    borderColor: Color.colorRoyalblue_100,
    borderWidth: 0.9,
    marginHorizontal: 5,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTextActive: {
    fontWeight: "800",
    textAlign: "center",
    fontSize: FontSize.size_mini,
    color: Color.neutralWhite,
    fontFamily: FontFamily.nunitoExtraBold,
    fontWeight: "800",
  },
  buttonTextInactive: {
    fontWeight: "800",
    textAlign: "center",
    fontSize: FontSize.size_mini,
    color: Color.colorRoyalblue_100,
    fontFamily: FontFamily.nunitoExtraBold,
    fontWeight: "800",
  },
  activeButton: {
    backgroundColor: Color.colorRoyalblue_100,
  },
  inactiveButton: {
    backgroundColor: Color.neutralWhite,
  },

  rectangleLayout: {
    width: "100%",
    backgroundColor: Color.neutralWhite,
  },
  carpoolsTypo: {
    fontFamily: FontFamily.nunitoBold,
    fontWeight: "700",
    textAlign: "left",
    color: Color.colorDarkslategray_100,
  },

  carpools: {
    fontSize: FontSize.size_5xl,
    textAlign: "left",
    color: Color.colorDarkslategray_100,
    marginTop: 15,
  },

  Carpools: {
    flex: 1,
    height: 834,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },

  trajetFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  main: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});
export default Carpools;
