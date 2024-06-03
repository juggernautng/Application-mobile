import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { pstyles } from "./MonProfil";
import { TouchableOpacity } from "react-native";
import TextBox from 'react-native-password-eye';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import env from '../env';


const Mdp = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [password, setPasswrod] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleEditPassword = async () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setError(null);
    try {
      console.log(user.user.id_uti);
      const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/EditPassword/${user.user.id_uti}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          password,
          oldPassword
        })
      });
      console.log(response);

      // Handle response
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        setSuccess(false)
        return;
      }

      if (response.ok) {
        setSuccess(true);
        Alert.alert("Password changed")
        navigation.navigate('MonProfil')
        return;
      }
    } catch (error) {
      console.error("Error modifying up:", error);
    }
  };

  return (
    <View style={[pstyles.main, { paddingTop: "20%" }]}>
      <Text style={styles.number}>Ancien mot de passe</Text>
      <TextBox onChangeText={(text) => setOldPassword(text)}
        containerStyles={styles.input}
        secureTextEntry={true}
        eyeColor="rgba(124, 124, 124, 0.7)"
        placeholder="Old password" />

      <Text style={styles.number}>Nouveau mot de passe</Text>
      <TextBox onChangeText={(text) => setPasswrod(text)}
        containerStyles={styles.input}
        secureTextEntry={true}
        eyeColor="rgba(124, 124, 124, 0.7)"
        placeholder="New password" />
      <Text style={styles.number}>Confirmation</Text>
      <TextBox onChangeText={(text) => setConfirmPassword(text)}
        containerStyles={styles.input}
        secureTextEntry={true}
        eyeColor="rgba(124, 124, 124, 0.7)"
        placeholder="Confirm password" />

      <View style={[styles.error]}>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <TouchableOpacity
        onPress={handleEditPassword}
        style={[pstyles.buttons, { backgroundColor: "#0075fd" }]}>
        <Text style={[pstyles.signTypo, { color: "#ffffff" }]}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  error: {
    margin: 5
  },
  errorText: {
    color: 'red',
    marginTop: 0,
    textAlign: 'center',
    fontFamily: "Poppins-Medium",
  },
  number: {
    marginBottom: 8,
    fontSize: 17,
    alignSelf: "baseline",
    fontFamily: "Nunito-Regular",
    marginLeft: 50,
  },

  input: {
    paddingRight: 10,
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

export default Mdp;
