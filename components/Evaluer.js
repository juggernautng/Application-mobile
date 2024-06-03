import * as React from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Border, FontFamily, Color, FontSize, Padding } from "../GlobalStyles";
import { useState } from "react";
import { API_IP_ADDRESS } from "../env";
import { useAuth } from "../context/AuthContext";
import { AnnonceStyles } from "./Annonce";
import { useRefresh } from "../context/refresh";
import { RechercheStyles } from "../screens/Recherche";
import env from '../env';

const Evaluer = (Props) => {
  const { refreshPage } = useRefresh();
  const user = useAuth();
  const navigation = useNavigation();
  const [stars, setStars] = useState(1);
  const [isSent, setIsSent] = useState(false);
  const [rated, setRated] = useState(false);
  const [error, setError] = useState(null);


  const add = () => {
    if (stars < 5) {
      setStars(stars + 1);
    }
  };

  const sub = () => {
    if (stars > 1) {
      setStars(stars - 1);
    }
  };
  const setRating = async (stars) => {
    try {
      const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/Rate/${Props.id_conducteur}/${user.user.user.email}/${Props.id_reservation}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ newRating: stars }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.error)
        return;
      }
      if (responseData.rated) {
        setRated(true);
      }
      setIsSent(true);
      Alert.alert(`${stars} star sent`);
    } catch (error) {
      console.error('Error adding new item:', error);
      // Alert.alert("Alert", "Failed to add new item.");
    }


  };

  const cancelReservation = async () => {

    try {
      const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/annulerTrajet/${Props.id_reservation}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          key: 'req',
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }
      refreshPage();
    } catch (error) {
      console.error("Error canceling reservation:", error);
      // Handle error here
    }
  };

  return (
    <View style={[AnnonceStyles.annonce]}>
      <View style={[{ height: 46, width: 318 }]}>
        <Image
          style={AnnonceStyles.profilepictureIcon}
          contentFit="cover"
          source={Props.photo}
        />
        <View style={[AnnonceStyles.infosprofil]}>
          <Text style={[AnnonceStyles.titre, { textAlign: "left" }]}>
            {Props.name}
          </Text>
          <View style={[AnnonceStyles.trajetFlexBox, { marginTop: 6 }]}>
            <Image
              style={[{ width: 8, height: 8, marginRight: 5 }]}
              contentFit="cover"
              source={require("../assets/vector4.png")}
            />
            <Text
              style={[
                AnnonceStyles.titre,
                {
                  textAlign: "left",
                  fontSize: FontSize.size_xs + 0.5,
                  width: 55,
                },
              ]}
            >
              {Props.rating + " (" + Props.nbrRatings + ")"}
            </Text>
          </View>
        </View>
        <View style={[AnnonceStyles.trajet, AnnonceStyles.trajetFlexBox]}>
          <Image
            style={[{ width: 12, height: 36 }]}
            contentFit="cover"
            source={require("../assets/group2.png")}
          />
          <View style={AnnonceStyles.LocationsBox}>
            <Text style={[AnnonceStyles.LocationTextStyle]}>
              {Props.startLocation}
            </Text>
            <Text style={[AnnonceStyles.LocationTextStyle, { top: 23 }]}>
              {Props.endLocation}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={cancelReservation}>
              <Image
                style={styles.deleteAnnonce}
                contentFit="cover"
                source={require("../assets/delete.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={[
          AnnonceStyles.trajetFlexBox,
          { justifyContent: "space-between", height: 32 },
        ]}
      >
        <View style={[AnnonceStyles.infoBox]}>
          <Text style={[AnnonceStyles.titre]}>Prix</Text>
          <Text style={AnnonceStyles.infoTypo}>{Props.price} DA</Text>
        </View>

        <View style={[AnnonceStyles.infoBox]}>
          <Text style={[AnnonceStyles.titre]}>Véhicule</Text>
          <Text style={[AnnonceStyles.infoTypo]}>{Props.modele}</Text>
        </View>

        <View style={[AnnonceStyles.infoBox]}>
          <Text style={[AnnonceStyles.titre]}>Heure</Text>
          <Text
            style={[AnnonceStyles.infoTypo, { fontSize: FontSize.size_xs + 1.5 }]}
          >
            {Props.time}
          </Text>
        </View>

        <View style={[AnnonceStyles.infoBox]}>
          <Text style={[AnnonceStyles.titre]}>Date</Text>
          <Text style={[AnnonceStyles.infoTypo]}>{Props.date}</Text>
        </View>

        <View style={[AnnonceStyles.infoBox]}>
          <Text style={[AnnonceStyles.titre]}>Places</Text>
          <Text style={[AnnonceStyles.infoTypo]}>{Props.availableSeats}</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <View style={[RechercheStyles.nmbrplaces, { marginTop: 0, width: 90 }]}>
          {!isSent && (
            <TouchableOpacity onPress={sub}>
              <Image
                style={[RechercheStyles.iconLayout, { width: 23, height: 23 }]}
                contentFit="cover"
                source={require("../assets/moins.png")}
              />
            </TouchableOpacity>
          )}

          <Text
            style={[
              RechercheStyles.heading,
              {
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 14,
              },
            ]}
          >
            {stars}
          </Text>
          <Image
            style={[styles.vectorIcon1]}
            contentFit="cover"
            source={require("../assets/vector5.png")}
          />

          {!isSent && (
            <TouchableOpacity onPress={add}>
              <Image
                style={[
                  RechercheStyles.iconLayout,
                  { width: 21, height: 22, marginLeft: 10 },
                ]}
                contentFit="cover"
                source={require("../assets/plus.png")}
              />
            </TouchableOpacity>
          )}
        </View>

        {!isSent && (

          <TouchableOpacity
            style={[styles.participer, styles.participerLayout]}
            onPress={() => setRating(stars)}
            disabled={isSent}
          >
            <Text style={[styles.supprimer, styles.signalerTypo]}>
              {isSent ? <Text>{stars}</Text> : "Evaluer"}
            </Text>

            
           
          </TouchableOpacity>

        )}

        <TouchableOpacity
          style={[styles.participer1, styles.participerLayout]}
          onPress={() => navigation.navigate("Signaler", {
            TargetUserID: Props.id_conducteur
          })}
        >
          <Text style={[styles.signaler, styles.signalerTypo]}>Signaler</Text>
        </TouchableOpacity>
        
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    margin: 1,
  },
  errorText: {
    color: "red",
    marginTop: 0,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  deleteAnnonce: {
    position: "absolute",
    top: -17,
    right: 10,
    height: 20,
    width: 20,
  },

  participerLayout: {
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: Padding.p_8xl,
    width: 89,
    backgroundColor: Color.colorGainsboro_100,
    height: 35,
    flexDirection: "row",
    justifyContent: "center",
    top: 0,
    position: "absolute",
    alignItems: "center",
    borderRadius: Border.br_mini,
  },
  signalerTypo: {
    height: 19,
    width: 73,
    fontSize: FontSize.size_sm,
    textAlign: "center",
    fontFamily: FontFamily.nunitoBold,
    fontWeight: "700",
  },

  vectorIcon1: {
    width: 17,
    height: 17,
    marginLeft: 8,
    marginBottom: 2,
  },

  supprimer: {
    color: Color.colorRoyalblue_100,
  },
  participer: {
    left: 230,
    zIndex: 1,
  },
  signaler: {
    color: Color.colorTomato,
  },
  participer1: {
    left: 131,
    zIndex: 2,
  },
  buttons: {
    alignContent: "center",
    width: 310,
    padding: Padding.p_3xs,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Evaluer;
