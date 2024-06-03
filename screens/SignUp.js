import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity, ScrollView
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import TextBox from "react-native-password-eye";
import { Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import env from "../env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Select, Box, CheckIcon , NativeBaseProvider } from "native-base";

const SignUp = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Homme", value: "Homme" },
    { label: "Femme", value: "Femme" },
  ]);
  const { user, login } = useAuth();
  const navigation = useNavigation();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setMail] = useState("");
  const [num_tel, setPhoneNumber] = useState("");
  const [genre, setGenre] = useState("");
  const [mdp, setPassword] = useState("");
  const [naissance, setNaissance] = useState("");

  const [error, setError] = useState(null);
  const [isLoading, setIsloading] = useState(null);
  const { dispatch } = useAuth();
  const setBirthYear = (inputYear) => {
    const year = parseInt(inputYear);

    if (isNaN(year)) {
      return; 
    }

    const currentYear = new Date().getFullYear();
    const minYear = 1900;
    const maxYear = currentYear - 18;

    if (year < minYear || year > maxYear) {
      setError("Invalid Year");
      setNaissance("");
    } else {
      setNaissance(year.toString());
    }
  };
  const handleSignUp = async () => {
    setIsloading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://" + env.API_IP_ADDRESS + ":3000/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom,
            prenom,
            mdp,
            num_tel,
            photo: "photo.png",
            email,
            est_certifie: false,
            certificat: "123",
            genre,
            naissance: naissance,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setIsloading(false);
        setError(json.error);
        return; 
      }

      // Sign up successful
      AsyncStorage.setItem("user", JSON.stringify(json))
        .then(() => {
          dispatch({ type: "LOGIN", payload: json });
          navigation.navigate("TabNavigator", {
            screen: "Profile",
            params: { screen: "MonProfil" },
          });
        })
        .catch((error) => {
          console.error("Error saving user to AsyncStorage:", error);
          Alert.alert("Sign Up Failed", "Please try again later");
        });

      setIsloading(false);
    } catch (error) {
      console.error("Error signing up:", error);
      Alert.alert("Sign Up Failed", "Please try again later");
      setIsloading(false);
    }
  };

  return (
    <View style={[styles.signUp]}>
      <Text style={styles.createAccount}>Créer un compte</Text>
      <ScrollView
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image
            style={[styles.icon]}
            contentFit="cover"
            source={require("../assets/user.png")}
          />
          <TextInput
            style={styles.numberTypo}
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={[styles.icon]}
            contentFit="cover"
            source={require("../assets/user.png")}
          />
          <TextInput
            style={[styles.numberTypo]}
            placeholder="Prenom"
            value={prenom}
            onChangeText={setPrenom}
          />
        </View>
        <View style={[styles.container]}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/stylestroke.png")}
          />
          <TextInput
            style={[styles.number, styles.numberTypo]}
            placeholder="Mail"
            value={email}
            onChangeText={setMail}
          />
        </View>
        <View style={[styles.container]}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/flagforflagalgeria-svgrepocom2.png")}
          />
          <Text style={[]}>+213</Text>
          <TextInput
            style={[styles.number2, styles.numberTypo]}
            placeholder="Numero de Telephone"
            keyboardType="numeric" 
            value={num_tel}
            onChangeText={setPhoneNumber}
          />
        </View>
        <Pressable style={styles.container}>
          <Image
            style={[styles.icon, { marginBottom: 5 }]}
            contentFit="cover"
            source={require("../assets/birthday-cake.png")}
          />
          <TextInput
            style={[styles.numberTypo]}
            placeholder="Année de naissance"
            keyboardType="numeric" 
            value={naissance}
            onChangeText={setNaissance} 
            onBlur={() => setBirthYear(naissance)} 
          />
        </Pressable>
          <View style={[styles.container, { zIndex: 1000 }]}>
          <Image style={styles.icon} contentFit="cover" source={require("../assets/group1.png")} />
          <NativeBaseProvider>
          <Box w="100%" >
            <Select
              selectedValue={genre}
              minWidth="200"
              accessibilityLabel="Genre"
              placeholder="Genre"
              color= '#7c7c7c'            
              fontFamily= "Nunito-Regular"
              fontSize= {15}
              _selectedItem={{
                bg: "#0075fd",
                borderRadius: 20,
                endIcon: <CheckIcon size="5" color= 'white'/>,
                _text: {
                  color: 'white'
                }
              }}
              _item={{
                borderRadius: 20,
                _pressed: {
                  bg: '#e3ecfa',
                },
              }}
              mt={1}
              onValueChange={(itemValue) => setGenre(itemValue)}
              borderWidth={0}
              marginTop= "0"
            >
              <Select.Item label="Homme" value="Homme" />
              <Select.Item label="Femme" value="Femme" />
            </Select>
          </Box></NativeBaseProvider>
        </View>

        <View style={[styles.container]}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/password.png")}
          />
          <TextBox
            onChangeText={setPassword}
            containerStyles={{ width: "90%", marginLeft: 10 }}
            secureTextEntry={true}
            eyeColor="#7c7c7c"
            placeholder="Password"
            placeholderTextColor="#7c7c7c"
            value={mdp}
          />
        </View>
        <View style={[styles.error]}>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
        <TouchableOpacity style={[styles.buttonfirst]} onPress={handleSignUp}>
          <Text style={[styles.textTypo]}>S'inscrire</Text>
        </TouchableOpacity>
        <Pressable
          style={styles.alreadyHaveAnContainer}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.text1}>
            <Text style={styles.alreadyHaveAn}>Vous avez déjà un compte? </Text>
            <Text style={styles.signIn}>Se connecter</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
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
  numberTypo: {
    marginLeft: 12,
    width: "100%",
    fontFamily: "Nunito-Regular",
    fontSize: 15,
    color: "#7c7c7c",
  },
  container: {
    marginTop: "3%",
    paddingHorizontal: 15,
    height: 57,
    width: "73%",
    borderWidth: 1,
    borderColor: "rgba(124, 124, 124, 0.2)",
    borderStyle: "solid",
    elevation: 30,
    shadowRadius: 30,
    shadowColor: "rgba(80, 85, 136, 0.1)",
    borderRadius: 16,
    flexDirection: "row",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textTypo: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  createAccount: {
    marginTop: "11%",
    fontSize: 32,
    fontWeight: "600",
    fontFamily: "Nunito-Bold",
    color: "#2d2d2d",
    textAlign: "center",
  },
  icon: {
    width: 21,
    height: 22,
  },

  buttonfirst: {
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#0075fd",
    shadowColor: "rgba(236, 95, 95, 0.25)",
    shadowRadius: 14,
    elevation: 14,
    width: "75%",
    height: 58,
    marginTop: "5%",
    justifyContent: "center",
  },

  alreadyHaveAn: {
    color: "#7c7c7c",
  },

  signIn: {
    color: "#0075fd",
    textDecorationLine: "underline",
  },
  text1: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    textAlign: "center",
  },
  alreadyHaveAnContainer: {
    marginTop: "2%",
    marginBottom: "3%",
  },
  main: {
    marginTop: "3%",
    alignItems: "center",
    Width: "100%",
  },

  signUp: {
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default SignUp;
