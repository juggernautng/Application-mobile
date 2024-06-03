import * as React from "react";
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
import { AnnonceStyles } from "./Annonce";
import { API_IP_ADDRESS } from "../env";
import { useRefresh } from "../context/refresh";
import { useAuth } from "../context/AuthContext";


const Participants = (Props) => {
  const navigation = useNavigation();
  const { refreshPage } = useRefresh();
  const user = useAuth();


  const cancelReservation = async () => {
    try {
      const response = await fetch(`http://${API_IP_ADDRESS}:3000/api/annulerTrajet/${Props.id_reservation}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          key: 'sup',
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }
      refreshPage();
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };

  return (
    <View style={[styles.annonce]}>
      <View
        style={[
          styles.horizStyle,
          {
            paddingBottom: 6,
            borderBottomWidth: 0.3,
            borderBottomColor: "rgba(0, 0, 0, 0.15)",
          },
        ]}
      >
        <Image
          style={[{ width: 35, height: 35, borderRadius: Border.br_9980xl }]}
          contentFit="cover"
          source={Props.photo}
        />
        <Text
          style={[
            AnnonceStyles.titre,
            styles.TextStyle,
            { fontSize: FontSize.size_xs + 4, width: 210 },
          ]}
        >
          {Props.name}
        </Text>
        <View style={styles.horizStyle}>
        <Image
          style={[{ width: 15, height: 18 }]}
          contentFit="cover"
          source={require("../assets/clock33.png")}
        />
        <Text style={[styles.TextStyle, { color: Color.colorDarkslategray_100, marginLeft: 8}]}
           >
            {Props.nbr_place}
          </Text>
        </View>
      </View>

      <View style={[styles.horizStyle, { marginTop: 8 }]}>
        <Image
          style={[{ width: 18, height: 18 }]}
          contentFit="cover"
          source={require("../assets/stylestroke.png")}
        />
        <Text
          style={[styles.TextStyle, { color: Color.colorDarkslategray_100 }]}
        >
          {Props.email}
        </Text>
      </View>

      <View style={[styles.horizStyle, { marginTop: 5 }]}>
        <Image
          style={[{ width: 20, height: 20 }]}
          contentFit="cover"
          source={require("../assets/telephone.png")}
        />
        <Text
          style={[styles.TextStyle, { color: Color.colorDarkslategray_100}]}
        >
          {Props.phone}
        </Text>
      </View>

      <View style={[styles.horizStyle]}>
        <Image
          style={[{ width: 18, height: 19 }]}
          contentFit="cover"
          source={require("../assets/birthday-cake.png")}
        />
        <Text
          style={[styles.TextStyle, { color: Color.colorDarkslategray_100, marginTop: 7 }]}
        >
          {Props.naissance} ans
        </Text>
      </View>

      <View style={[styles.horizStyle, { marginTop: 5, marginBottom: 5 }]}>
        <Image
          style={[{ width: 20, height: 23 }]}
          contentFit="cover"
          source={require("../assets/group1.png")}
        />
        <Text
          style={[styles.TextStyle, { color: Color.colorDarkslategray_100}]}
        >
          {Props.gender}
        </Text>
      </View>
      {Props.canDelete === "t" ? (
      <View style={styles.Button}>
        <TouchableOpacity
          style={[
            styles.detailsFlexBox,
            {
              backgroundColor: Color.colorTomato,
              left: 205,
              width: 107,
              marginTop: -40,
            },
          ]}
          onPress={cancelReservation}
        >
          <Text
            style={[
              AnnonceStyles.ButtonText,
              { color: Color.neutralWhite, width: 67 },
            ]}
          >
            Supprimer
          </Text>
        </TouchableOpacity>
      </View>
    ) : (<View></View>)}
    </View>
  );
};
export const styles = StyleSheet.create({
  annonce: {
    borderColor: "rgba(0, 0, 0, 0.15)",
    borderWidth: 1,
    backgroundColor: Color.neutralWhite,
    height: 200,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Border.br_mini,
    alignItems: "center",
    marginBottom: 13,
    justifyContent: "space-between",
    alignItems: "center",
    width: 345,
    shadowColor: "#585858",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 6,
  },

  horizStyle: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  TextStyle: {
    marginTop: 4,
    width: "100%",
    textAlign: "left",
    marginLeft: 15,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },
  Button: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsFlexBox: {
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: Padding.p_8xl,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_mini,
  },
});
export default Participants;
