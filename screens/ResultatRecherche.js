import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Color, Border, FontSize, FontFamily, Padding } from "../GlobalStyles";
import Annonce from "../components/Annonce";
import TopBar from "../components/TopBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RechercheStyles } from "./Recherche";
import NotAuth from "../components/notAuth";
import axios from "axios";
import env from "../env";
import { useRefresh } from "../context/refresh";
import { useAuth } from "../context/AuthContext";
import * as FileSystem from 'expo-file-system';

export function timestampToDateTime(timestamp) {
  if (!timestamp) {
    return { date: "", time: "" };
  }

  const date = new Date(Date.parse(timestamp));

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
  const day = date.getDate().toString().padStart(2, "0");

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const dateString = `${day}/${month}/${year.toString().slice(2, 4)}`;
  const timeString = `${hours}:${minutes}`;

  return { date: dateString, time: timeString };
}

const ResultatRecherche = () => {
  const { refreshPage, refresh } = useRefresh();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useAuth();

  const route = useRoute();
  const date = route.params?.Date;
  const depart = route.params?.depart;
  const arrivee = route.params?.destination;
  const passengers = route.params?.nbPlc;
  const isDatePickedBool = route.params?.isDatePicked;
  const isTimePickedBool = route.params?.isTimePicked;
  const timestamp =
    !isDatePickedBool && !isTimePickedBool
      ? null
      : (() => {
          const date = new Date(route.params?.timestampRech);
          date.setSeconds(0);
          date.setMilliseconds(0);
          return date;
        })();
  const isDatePicked = isDatePickedBool ? true : null;
  const isTimePicked = isTimePickedBool ? true : null;

  const loadImage = async (path) => {
    const fileExists = await FileSystem.getInfoAsync(path);
    if (fileExists.exists) {
      return { uri: path };
    } else {
      return require("../assets/image1.png");
    }
  };

  const renderItem = ({ item }) => {
    const { date, time } = timestampToDateTime(item.timestamp);
  
    return (
      <Annonce
        trajetId={item.id_trajet}
        name={item.nom + " " + item.prenom}
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
        naissance= {item.naissance}
        passengers = {passengers}
        btnText="Participer"
        est_certifie={item.est_certifie}
        voiture_est_certifie={item.voiture_est_certifie}

      />
    );
  };

  const fetchDataFromDatabase = async () => {
    let userId;
if (user && user.user && user.user.id_uti) {
  userId = user.user.id_uti;
} else {
  userId = null;
}
    try {
      const response = await axios.get(
        "http://" + env.API_IP_ADDRESS + ":3000/api/recherche",
        {
          params: {
            depart,
            arrivee,
            timestamp: timestamp ? timestamp.toISOString().slice(0, 19) : null,
            passengers,
            isDatePicked,
            isTimePicked,
            userId: userId,
          },
        }
      );

      if (response && response.data) {
        for (const item of response.data) {
          const loadedPhoto = await loadImage(item.photo);
          item.photo = loadedPhoto;
        }
        return response.data;
      } else {
        console.error("Empty response or missing data property.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchDataFromDatabase().then((result) => {
      setData(result);
      setIsLoading(false);
    });
    console.log('cc', timestamp);
  }, [refresh]);

  return (
    <View style={[ResultatRechercheStyles.resultatrecherche]}>
      <TopBar />
      <View style={[ResultatRechercheStyles.frame]}>
        <Text style={ResultatRechercheStyles.heading}>
          {depart} a {arrivee}
        </Text>
        <Text style={ResultatRechercheStyles.heading1}>
          {isDatePickedBool ? date : "n'importe quand"}, {passengers} Places
        </Text>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0075fd"
          style={ResultatRechercheStyles.loadingIndicator}
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_trajet.toString()}
          ListEmptyComponent={
            <NotAuth title="Oups... Aucune donnée trouvée" photo={1} />
          }
        />
      )}
    </View>
  );
};

export const ResultatRechercheStyles = StyleSheet.create({
  rectangleLayout: {
    width: "100%",
    backgroundColor: Color.neutralWhite,
  },

  heading: {
    fontSize: FontSize.subheadLgSHLgMedium_size,
    fontWeight: "500",
    fontFamily: FontFamily.subheadLgSHLgMedium,
    color: Color.neutralGray1,
    width: 325,
    height: 18,
    textAlign: "center",
  },

  heading1: {
    lineHeight: 18,
    color: "#8c8c8c",
    width: 200,
    marginTop: 10,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: FontSize.size_xs,
    height: 18,
    textAlign: "center",
  },

  frame: {
    justifyContent: "center",
    borderRadius: Border.br_mini,
    marginTop: "5%",
    marginBottom: "4%",
    borderStyle: "solid",
    borderColor: "rgba(0, 117, 253, 0.4)",
    borderWidth: 1,
    width: 300,
    height: 54,
    alignItems: "center",
  },

  resultatrecherche: {
    flex: 1,
    overflow: "hidden",
    width: "100%",
    backgroundColor: Color.neutralWhite,
    justifyContent: "space-between",
    alignItems: "center",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ResultatRecherche;
