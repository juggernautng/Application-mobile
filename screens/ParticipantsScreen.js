import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image, RefreshControl } from "react-native";
import { Color, Border, FontSize, FontFamily, Padding } from "../GlobalStyles";
import Annonce from "../components/Annonce";
import TopBar from "../components/TopBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import Participants from "../components/Participants";
import { ResultatRechercheStyles } from "./ResultatRecherche";
import NotAuth from "../components/notAuth";
import { useRefresh } from '../context/refresh';
import { API_IP_ADDRESS } from "../env";
import * as FileSystem from 'expo-file-system';

const ParticipantsScreen = () => {
  const navigation = useNavigation();
  const refresh = useRefresh();
  const [refreshing, setRefreshing] = useState(false); 


  const [participants, setParticipants] = useState([]);

  const route = useRoute();
  const date = route.params?.date;
  const depart = route.params?.depart;
  const destination = route.params?.destination;
  const id_trajet = route.params?.id_trajet;
  const canDelete = route.params?.canDelete;
  useEffect(() => {
    fetchParticipants(id_trajet);
  }, [id_trajet, refresh]);

  const loadImage = async (path) => {
    const fileExists = await FileSystem.getInfoAsync(path);
    console.log(fileExists)
    if (fileExists.exists) {
      return { uri: path };
    } else {
      return require("../assets/image1.png");
    }
  };

  const fetchParticipants = async (id_trajet) => {
    try {
      const response = await fetch(`http://${API_IP_ADDRESS}:3000/api/getParticipated?id_trajet=${id_trajet}`);
      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }
      const data = await response.json();
      console.log('rsp ',data)
      if(data){for (const item of data) {
        const loadedPhoto = await loadImage(item.photo);
        item.photo = loadedPhoto;
      }}
      setParticipants(data);
    } catch (error) {
      console.error("Error fetching participants information:", error);
    }
  };

  const renderItem = ({ item }) => (
    <Participants
      name={item.nom + " " + item.prenom}
      email={item.email}
      phone={item.num_tel}
      gender={item.genre}
      nbr_place={item.nbr_place}
      id_reservation= {item.id_reservation}
      naissance= {item.naissance}
      canDelete = {canDelete}
      photo = {item.photo}
    />
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchParticipants(id_trajet);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={[ResultatRechercheStyles.resultatrecherche]}>
      <TopBar />
      <View style={[ResultatRechercheStyles.frame]}>
        <Text style={ResultatRechercheStyles.heading}>
          {depart} a {destination}
        </Text>
        <Text style={ResultatRechercheStyles.heading1}>{date}</Text>
      </View>
      <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0075fd']}
            progressBackgroundColor='white'
          >
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
          data={participants}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_uti.toString()}
          ListEmptyComponent={<NotAuth title="Garde patience !" photo={4} />}
        /></RefreshControl>
     
    </View>
  );
};

const styles = StyleSheet.create({});

export default ParticipantsScreen;
