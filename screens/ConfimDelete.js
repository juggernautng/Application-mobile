import React, { useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_IP_ADDRESS } from "../env";
import { Image } from "react-native";
import { useRefresh } from "../context/refresh";
import { YourRidesStyles } from "./YourRides";
import { pstyles } from "./MonProfil";
import { RechercheStyles } from "./Recherche";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmDelete = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useAuth()
  
    const handleDeleteUser = async () => {
      setIsLoading(true);
      AsyncStorage.removeItem('user')
      dispatch({ type: 'LOGOUT' })
      navigation.navigate('TabNavigator', {screen: 'Profil',params: {screen: 'WelcomeScreen', }})
      try {
        const email = user.user.email; 
        const response = await axios.delete(`http://${API_IP_ADDRESS}:3000/api/deleteUser//${email}`);
        
        if (response.status === 200) {
          Alert.alert('Success', 'User deleted successfully');
        } else {
          Alert.alert('Error', 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        Alert.alert('Error', 'Failed to delete user');
      }
      setIsLoading(false);
    };
  return (
    <View style={styles.main}>
      <Text style={[YourRidesStyles.title, {marginTop: 50, height: 40}]}>Suppression du compte</Text>
      <Image
        style={[{width: 290, height: 290}]}
        resizeMode="cover"
        source={require('../assets/Bad idea-rafiki.png')}
      />
      <View style={styles.MessageDiv}>
        <Text style={styles.TextMessage}>
          Veuillez noter que la suppression de votre compte entraînera la perte
          de toutes les données enregistrées. De plus, vous ne pourrez pas vous
          reconnecter ultérieurement. Êtes-vous sûr de vouloir continuer ?
        </Text>
      </View>
      <TouchableOpacity style={[pstyles.buttons, pstyles.red, {marginBottom: -20}]} onPress={handleDeleteUser}>
        <Text style={[pstyles.signTypo, pstyles.red]}>
          supprimer quand même
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[RechercheStyles.buttonfirst, {marginBottom: 20, width: 300}]} onPress={() => navigation.goBack()}>
        <Text style={[RechercheStyles.buttonText, {color: 'white'}]}>
        Reconsidérer
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'white'
  },
  TextMessage: {
    color: "red",
    marginTop: 0,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    fontSize : 16
  },

  MessageDiv: {
    width: 320,
    height: 150
  },
});

export default ConfirmDelete;
