import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { pstyles } from "./MonProfil.js";
import { launchImageLibraryAsync } from 'expo-image-picker';
import { requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { useProfile } from '../context/ProfileContext.js';
import { useAuth } from "../context/AuthContext";
import * as FileSystem from 'expo-file-system';

import env from '../env';

const Modifier = () => {
  const navigation = useNavigation();
  const { profileData } = useProfile();
  const { user, logout, token } = useAuth();
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [photo, setImgUrl] = useState(null);
  const [data, setData] = useState('')

  //user data
  const [name, setName] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [num_tel, setPhone] = useState("");

  const loadImage = async (path) => {
    const fileExists = await FileSystem.getInfoAsync(path);
    if (fileExists.exists) {
      setImgUrl({ uri: path });
    } else {
      setImgUrl(require("../assets/image1.png"));
    }
  };


  const openGallery = async () => {
    try {
      const { status } = await requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access media library was denied');
        return;
      }
      const result = await launchImageLibraryAsync({
        mediaTypes: 'Images',
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri.toString();
        setImgUrl(selectedUri);
      }
    } catch (error) {
      console.log('Error while opening gallery:', error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {

      try {
        const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/getUserData/${user.user.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        setData(data);

        setEmail(data.user.email);
        setPhone(data.user.num_tel);
        setName(data.user.nom);
        setPrenom(data.user.prenom);
        loadImage(data.user.photo)
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
      
    };

    fetchProfileData();
  }, []);

  const handleEditProfile = async () => {

    setError(null);
    try {
      const updatedFields = {};

    if (name !== user.user.nom) {
      updatedFields.name = name;
    }

    if (prenom !== user.user.prenom) {
      updatedFields.prenom = prenom;
    }

    if (email !== user.user.email) {
      updatedFields.email = email;
    }

    if (num_tel !== user.user.num_tel) {
      updatedFields.num_tel = num_tel;
    }

    if (Object.keys(updatedFields).length === 0) {
      setError("No fields are modified");
      return;
    }

    let photoUri = photo;
    if (photo && photo.uri !== undefined) {
      photoUri = photo.uri;
    }
      
      const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/EditUser/${user.user.id_uti}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name, prenom, email, photo: photoUri, num_tel
        }),
      });

      const json = await response.json();
      console.log(ph)

      if (!response.ok) {
        setSuccess(false);
        setError(json.error);
        return; 
      }

      if (response.ok) {
        setSuccess(true);
        return;
      }


    } catch (error) {
      console.error("Error modifying up:", error);

    }
  };

  return (
    <View style={pstyles.main}>
      <View >
        <Image
          style={pstyles.imageIcon}
          resizeMode="cover"
          source={photo}
        />
        <TouchableOpacity style={styles.edtbtn} onPress={openGallery}>
          <Image
            style={{ height: 20, width: 20 }}
            contentFit="contain"
            source={require("../assets/edit.png")}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titres}>Modifier Nom</Text>
        <TextInput style={[pstyles.font, pstyles.rectangle]}

          value={name}
          onChangeText={setName}
        />

        <Text style={styles.titres}>Modifier Prenom</Text>
        <TextInput style={[pstyles.font, pstyles.rectangle]}

          value={prenom}
          onChangeText={setPrenom}
        />

        <Text style={[styles.titres]}>Modifier mail</Text>
        <TextInput
          style={[pstyles.font, pstyles.rectangle]}

          value={email}
          onChangeText={setEmail}
        />
        <Text style={[styles.titres]}>Modifier numéro de téléphone</Text>
        <View style={[pstyles.rectangle, { alignItems: "center" }]}>
          <Image
            style={[pstyles.alg]}
            contentFit="cover"
            source={require("../assets/flagforflagalgeria-svgrepocom1.png")}
          />
          <Text style={[pstyles.signTypo]}>+213</Text>
          <TextInput
            style={[pstyles.font, { width: "60%" }]}

            keyboardType="numeric"
            value={num_tel}
            onChangeText={setPhone}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Mdp")}
          style={[pstyles.buttons]}>
          <Text style={[pstyles.signTypo, { textDecorationLine: "underline" }]}>Modifier Mot de passe</Text>
        </TouchableOpacity>
        <View style={[styles.error]}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {success && <Text style={styles.succesText}>modified with success</Text>}
        </View>
        
        <TouchableOpacity
          onPress={handleEditProfile}
          style={[pstyles.buttons, { backgroundColor: "#0075fd" }]}
        >
          <Text style={[pstyles.signTypo, { color: "white" }]}>Confirmer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  error:{
    margin:5
  },
  succesText:{
    color: 'green',
    marginTop: 0,
    textAlign: 'center',
    fontFamily: "Poppins-Medium",
  },
  errorText: {
    color: 'red',
    marginTop: 0,
    textAlign: 'center',
    fontFamily: "Poppins-Medium",
  },
  edtbtn: {
    height: 25,
    width: 25,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 8,
    bottom: 8,
    backgroundColor: "lightgrey",
    borderRadius: 10
  },
  titres: {
    marginLeft: "11%",
    marginTop: "5%",
    marginBottom: -12,
    alignSelf: "baseline",
    color: "#5a5a5a",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
});

export default Modifier;

