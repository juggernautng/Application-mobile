import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Border, FontFamily, Color, FontSize, Padding } from "../GlobalStyles";
import env from "../env";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/refresh";
import * as FileSystem from 'expo-file-system';



const Annonce = (Props) => {
  const { refreshPage, refresh } = useRefresh();
  const {user} = useAuth();
  const navigation = useNavigation();

  const goToDetails = () => {
    if(!user){
      navigation.navigate('TabNavigator', {screen: 'Profil',params: {screen: 'WelcomeScreen', }})
    }else{
    navigation.navigate("Details", {
      depart: Props.startLocation,
      destination: Props.endLocation,
      rating: Props.rating,
      nbr_ratings: Props.nbrRatings,
      name: Props.name,
      photo: Props.photo,
      details: Props.details,
      genre: Props.genre,
      couleur: Props.couleur,
      matricule: Props.matricule,
      email : Props.email,
      modele : Props.modele,
      num_tel : Props.num_tel,
      availableSeats: Props.availableSeats,
      naissance : Props.naissance,
      key : Props.btnText,
      id_trajet : Props.trajetId,
      nbr_place: Props.passengers,
      est_certifie : Props.est_certifie,
      voiture_est_certifie : Props.voiture_est_certifie
    });
  };};

  const renderButtons = () => {
    if (Props.btnText === "Participer") {
      return (
        <View style={AnnonceStyles.buttons}>
          <TouchableOpacity
            style={[AnnonceStyles.details, AnnonceStyles.detailsFlexBox]}
            onPress={goToDetails}
          >
            <Text
              style={[
                AnnonceStyles.ButtonText,
                { color: Color.colorRoyalblue_100, width: 60 },
              ]}
            >
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[AnnonceStyles.participer, AnnonceStyles.detailsFlexBox]}
            onPress={ParticiperFunc}
          >
            <Text
              style={[
                AnnonceStyles.ButtonText,
                { color: Color.neutralWhite, width: 65 },
              ]}
            >
              Participer
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (Props.btnText === "Annuler") {
      return (
        <View style={[AnnonceStyles.buttons, { width: 520 }]}>
          <TouchableOpacity
            style={[
              AnnonceStyles.details,
              AnnonceStyles.detailsFlexBox,
              { marginRight: 110 },
            ]}
            onPress={goToDetails}
          >
            <Text
              style={[
                AnnonceStyles.ButtonText,
                { color: Color.colorRoyalblue_100, width: 60 },
              ]}
            >
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              AnnonceStyles.details,
              AnnonceStyles.detailsFlexBox,
              { width: 97, marginLeft: 100 },
            ]}
            onPress={() => navigation.navigate("ParticipantsScreen", {id_trajet : Props.trajetId, depart:Props.startLocation, destination : Props.endLocation, date : Props.date, canDelete : Props.canDelete})}
          >
            <Text
              style={[
                AnnonceStyles.ButtonText,
                { color: Color.colorRoyalblue_100, width: 77 },
              ]}
            >
              Participants
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              AnnonceStyles.participer,
              AnnonceStyles.detailsFlexBox,
              { backgroundColor: Color.colorTomato, marginLeft: 110 },
            ]}
            onPress={AnnulerSup}
          >
            <Text
              style={[
                AnnonceStyles.ButtonText,
                { color: Color.neutralWhite, width: 67 },
              ]}
            >
              {Props.btnText}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (Props.btnText === "Supprimer") {
      return (
      <View style={AnnonceStyles.buttons}>
      <TouchableOpacity
        style={[AnnonceStyles.details, AnnonceStyles.detailsFlexBox, {width: 97,}]}
        onPress={() => navigation.navigate("ParticipantsScreen", {id_trajet : Props.trajetId, depart:Props.startLocation, destination : Props.endLocation, date : Props.date, canDelete : Props.canDelete})}
      >
        <Text
          style={[
            AnnonceStyles.ButtonText,
            { color: Color.colorRoyalblue_100, width: 77 },
          ]}
        >
          Participants
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[AnnonceStyles.participer, AnnonceStyles.detailsFlexBox, {backgroundColor: Color.colorTomato,left: 209,}]} onPress={AnnulerSup}>
        <Text
          style={[AnnonceStyles.ButtonText, { color: Color.neutralWhite, width: 67 }]}>
          {Props.btnText}
        </Text>
      </TouchableOpacity>
    </View>
    );
  };}

  const AnnulerSup = () => {
    if (Props.btnText === "Supprimer") {
      SupprimerFunc();
    } else if (Props.btnText === "Annuler") {
      cancelReservation();
    }
  };

  //Backedn----------------------------------------------------------------------------------------
  const ParticiperFunc = async () => {
    console.log(user );

    try {
      if (!user) {
        navigation.navigate('TabNavigator', { screen: 'Profil', params: { screen: 'WelcomeScreen' } });
        return;
      }
  
      const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/reserver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          id_trajet: Props.trajetId,
          id_reserveur: user.user.id_uti,
          nbr_place: Props.passengers 
        })
      });
  
      if (response.ok) {
        navigation.navigate('TabNavigator', {
          screen: 'Search',
          params: {
            screen: 'Recherche', 
          }
        });
      navigation.navigate('TabNavigator', {screen: 'Carpools',params: {screen: 'Carpools', }})
        Alert.alert("Success", "Reservation made successfully");
      } else {
        const data = await response.json();
        Alert.alert("Error", data.error || "Failed to make reservation");
      }
    } catch (error) {
      console.error("Error making reservation:", error);
      Alert.alert("Error", "Internal server error");
    }
    refreshPage();
  };

  const SupprimerFunc = async () => {
    try {
      const trajetId = Props.trajetId; 
      const response = await fetch(
        `http://${env.API_IP_ADDRESS}:3000/api/deleteTrajet/${trajetId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Trajet deleted successfully");
      } else {
        Alert.alert("Error", "Failed to delete trajet");
      }
    } catch (error) {
      console.error("Error deleting trajet:", error);
      Alert.alert("Error", "Internal server error");
    }
    refreshPage();
  };

  const cancelReservation = async () => {
    console.log(Props.id_reservation)
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
        throw new Error('Failed to cancel reservation');
      }
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
    refreshPage();
  };

  //Backedn--------------------------------------------------------------------------------------------

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
            style={[AnnonceStyles.infoTypo, { fontSize: FontSize.size_xs+1.5 }]}
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

      <View>{renderButtons()}</View>
    </View>
  );
};

export const AnnonceStyles = StyleSheet.create({
  infoBox: {
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    height: 35,
  },

  trajetFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  LocationTextStyle: {
    color: Color.colorSilver_200,
    fontSize: FontSize.size_4xs+1,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    position: "absolute",
  },

  infoTypo: {
    fontSize: FontSize.size_2xs + 2.5,
    color: Color.colorDarkslategray_100,
  },

  detailsFlexBox: {
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: Padding.p_8xl,
    justifyContent: "center",
    position: "absolute",
    alignItems: "center",
    borderRadius: Border.br_mini,
  },
  ButtonText: {
    fontSize: FontSize.size_sm,
    textAlign: "center",
    fontFamily: FontFamily.nunitoBold,
    fontWeight: "700",
  },
  profilepictureIcon: {
    top: 3,
    borderRadius: Border.br_9980xl,
    width: 41,
    height: 41,
    position: "absolute",
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#0075fd",
  },

  infosprofil: {
    left: 51,
    width: 116,
    justifyContent: "center",
    height: 46,
  },

  LocationsBox: {
    marginLeft: 4,
    height: 37,
    width: 130,
  },
  trajet: {
    left: 174,
    width: 144,
    justifyContent: "center",
    position: "absolute",
    height: 46,
  },
  titre: {
    fontWeight: "800",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    color: Color.colorDarkslategray_100,
    fontSize: FontSize.size_xs + 3,
  },

  details: {
    left: 106,
    backgroundColor: Color.colorGainsboro_100,
    width: 90,
  },

  participer: {
    left: 203,
    backgroundColor: Color.colorRoyalblue_100,
    width: 107,
  },

  buttons: {
    width: 310,
    justifyContent: "flex-end",
    marginTop: 12,
    height: 35,
  },

  annonce: {
    borderColor: "rgba(0, 0, 0, 0.15)",
    borderWidth: 0.9,
    backgroundColor: Color.neutralWhite,
    shadowColor: "#585858",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 6,
    height: 187,
    paddingHorizontal: Padding.p_2xs,
    paddingVertical: Padding.p_sm,
    borderRadius: Border.br_mini,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: 345,
  },
});
export default Annonce;
