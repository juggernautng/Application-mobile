import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { pstyles } from "./MonProfil";
import env from "../env";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Voiture = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { car } = route.params;
  const [error, setError] = useState(null);

  const [modele, setModele] = useState(null);
  const [couleur, setCouleur] = useState(null);
  const [matricule, setMatricule] = useState(null);

  const imageUri = route.params?.imageUri;
  const carDes = route.params?.carDes;
  React.useEffect(() => {
    console.log(imageUri, car)
  }, [imageUri]);
  const handleAdd = () => {
    if (matricule && modele && couleur && imageUri) {
      fetch(`http://${env.API_IP_ADDRESS}:3000/api/voitures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          id_prop: user.user.id_uti,
          matricule: matricule,
          modele: modele,
          couleur: couleur,
          voiture_est_certifie: 0,
          voiture_certificat: imageUri,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("Error adding car:", data.error);
            Alert.alert("Error", "Failed to add car");
          } else {
            Alert.alert("Success", "Car added successfully We will certify your car as soon as possible");
            if (carDes == 'no_car_ad'){
              navigation.navigate("TabNavigator", {
                screen: "Search",
                params: {
                  screen: "Recherche",
                },
              });
              navigation.navigate("TabNavigator", {
                screen: "Publier",
                params: {
                  screen: "AjouterAnnonce",
                },
              });
            }else if (carDes == 'no_car'){
              console.log('hh')
              navigation.navigate("TabNavigator", {
                screen: "Search",
                params: {
                  screen: "Recherche",
                },
              });
              navigation.navigate("TabNavigator", {
                screen: "Profil",
                params: {
                  screen: "MonProfil",
                },
              });
            }
          }
        })
        .catch((error) => {
          console.error("Error adding car:", error);
          Alert.alert("Error", "Failed to add car");
        });
    } else {
      setError("something is messing");
    }
  };

  const handleDelete = () => {
    fetch(`http://${env.API_IP_ADDRESS}:3000/api/deleteCars/${car[2]}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error deleting car:", data.error);
          Alert.alert("Error", "Failed to delete car");
        } else {
          navigation.navigate("TabNavigator", {
            screen: "Search",
            params: {
              screen: "Recherche",
            },
          });
          navigation.navigate("TabNavigator", {
            screen: "Profil",
            params: {
              screen: "MonProfil",
            },
          });
          Alert.alert("Success", "Car deleted successfully");
        }
      })
      .catch((error) => {
        console.error("Error deleting car:", error);
        Alert.alert("Error", "Failed to delete car");
      });
  };

  const render = () => {
    if (car == "no_car" || car == undefined || car == 'no_car_ad') {
      return (
        <View style={pstyles.main}>
          <Text style={styles.voiture}>Voiture</Text>
          <Text style={styles.number}>Modéle</Text>
          <TextInput
            style={styles.input}
            placeholder="Modéle"
            onChangeText={(text) => setModele(text)}
            value={modele}
          />
          <Text style={styles.number}>Matricule</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Matricule"
            onChangeText={(text) => setMatricule(text)}
            value={matricule}
          />
          <Text style={styles.number}>Couleur</Text>
          <TextInput
            style={styles.input}
            placeholder="Couleur"
            onChangeText={(text) => setCouleur(text)}
            value={couleur}
          />

          <View style={[styles.error]}>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <TouchableOpacity
            style={[pstyles.buttons, pstyles.blue, {marginBottom: 20}]}
            onPress={() => {navigation.navigate("CertifierCar", {carDes: car})}}
          >
            <Text style={[pstyles.signTypo, { color: "#0075fd" }]}>
              Carte grise
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[pstyles.buttons, { backgroundColor: "#0075fd" }]}
            onPress={handleAdd}
          >
            <Text style={[pstyles.signTypo, { color: "#ffffff" }]}>
              Confirmer
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={pstyles.main}>
          <Text style={styles.voiture}>Voiture</Text>
          <Text style={styles.number}>Modéle</Text>
          <TextInput style={styles.input} editable={false} value={car[0]} />
          <Text style={styles.number}>Matricule</Text>
          <TextInput style={styles.input} editable={false} value={car[2]} />
          <Text style={styles.number}>Couleur</Text>
          <TextInput style={styles.input} editable={false} value={car[1]} />
          <TouchableOpacity
            style={[pstyles.buttons, { backgroundColor: "red" }]}
            onPress={handleDelete}
          >
            <Text style={[pstyles.signTypo, { color: "#ffffff" }]}>
              Supprimer
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return <View style={pstyles.main}>{render()}</View>;
};

const styles = StyleSheet.create({
  error: {
    margin: 5,
  },
  errorText: {
    color: "red",
    marginTop: 0,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  voiture: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Nunito-Bold",
    color: "#2d2d2d",
    marginBottom: 60,
  },
  number: {
    marginBottom: 8,
    fontSize: 17,
    alignSelf: "baseline",
    fontFamily: "Nunito-Regular",
    marginLeft: 50,
  },
  input: {
    paddingLeft: 20,
    color: "#2d2d2d",
    marginBottom: 22,
    width: "75%",
    height: 55,
    borderWidth: 1,
    borderColor: "rgba(124, 124, 124, 0.2)",
    borderRadius: 16,
  },
});

export default Voiture;
