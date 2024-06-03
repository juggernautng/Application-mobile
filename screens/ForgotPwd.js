import * as React from "react";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { pstyles } from "./MonProfil";
import { TouchableOpacity } from "react-native";
import { Alert } from "react-native";
import { Border, Color, Padding,FontSize, FontFamily } from "../GlobalStyles";
import { useState } from "react";
import env from "../env";

const ForgotPwd = () => {
  const navigation = useNavigation();
  const [error, setError] = useState(null)
  const [isLoading, setIsloading] = useState(null)

  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    setIsloading(true)
    setError(null)
    try {
      const response = await fetch("http://"+env.API_IP_ADDRESS+":3000/api/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const json = await response.json();
  
      if (!response.ok) {
        setIsloading(false);
        setError(json.error);
        return; 
      }

      if (response.ok) {
        setIsloading(false)

        navigation.navigate('ResetPwd', {email})
      }
      
    } catch (error) {
      console.error("Error Sending email :", error);
      Alert.alert("Error", "An error occurred while sending email");
    }
  };
  

  return (
    <View style={[pstyles.main, { paddingTop: "20%" }]}>
      <Text style={styles.title}>Changer de mot de passe</Text>
      <Text style={styles.Soustitre}>votre gmail:</Text>

      <View style={styles.Input}>
        <TextInput placeholder="Gmail" style = {{width: 277}} value={email} onChangeText={(text) => setEmail(text)} />
      </View>
      <View style={[styles.error]}>
       {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <Pressable
        style={[styles.buttonfirst, { alignItems: "center" }]}
        onPress={handleSubmit}
      >
        <Text style={[styles.heading, { fontSize: 16, color: "white" }]}>
          Confirmer
        </Text>
      </Pressable>
    </View>
  );
};
 
const styles = StyleSheet.create({

  error:{
    margin:5
  },
  errorText: {
    color: 'red',
    marginTop: 0,
    textAlign: 'center',
    fontFamily: "Poppins-Medium",
  },
  main: {
    flex: 1,
    alignContent: "space-between"
  },


   title: {  
    fontSize: FontSize.size_5xl,
    height: 35,
    marginTop: 15,
    width: '100%',
    textAlign: "center",
    color: Color.colorDarkslategray_100,
    fontFamily: FontFamily.nunitoBold,
    fontWeight: "700",
  },

  Input: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_mini,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Color.colorGray_300,
    elevation: 30,
    shadowRadius: 30,
    shadowColor: "rgba(80, 85, 136, 0.1)",
    borderRadius: Border.br_base,
    borderStyle: "solid",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Color.neutralWhite,
    marginBottom: 15


  },
  buttonfirst: {
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorRoyalblue_100,
    shadowColor: "rgba(236, 95, 95, 0.25)",
    shadowRadius: 14,
    elevation: 14,
    width: 317,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  Soustitre: {
    marginLeft:"11%",
    marginTop: "10%",
    marginBottom:10,
    alignSelf:"baseline",
    color: "#5a5a5a",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
});

export default ForgotPwd;
