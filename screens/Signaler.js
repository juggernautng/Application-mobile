import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation , useRoute} from "@react-navigation/native";
import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";
import TopBar from "../components/TopBar";
import { RechercheStyles } from "./Recherche";
import { Checkbox } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import env from '../env';

const fetchDataFromDatabase = async () => {
  return [
    { id: 1, text: "irrespectueux" },
    { id: 2, text: "fausse informations personnels" },
    { id: 3, text: "Utilisation du téléphone" },
    { id: 4, text: "conduite dangereuse" },
    { id: 5, text: "Véhicule en mauvais état" }, 
  ];
};

const Signaler = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [newItemText, setNewItemText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const { user } = useAuth();

  const route = useRoute();
  const TargetUserID = route.params?.TargetUserID;

  const handleconfirm = async () => {
    const selectedData = data.filter((item) => selectedItems.includes(item.id));
    const selectedTexts = selectedData.map((item) => item.text);
    console.log(selectedTexts);
        try {
          const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/signaler`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({SignalerUserID: user.user.id_uti,TargetUserID:TargetUserID,  Description: selectedTexts }),
          });
          if (!response.ok) {
            throw new Error('Failed to add new item');
          }
          Alert.alert("Merci", "Merci.");
        } catch (error) {
          console.error('Error adding new item:', error);
          Alert.alert("Alert", "Failed to add new item.");
        }

    navigation.goBack();
  };

  useEffect(() => {
    fetchDataFromDatabase().then((result) => setData(result));
  }, []);

  const toggleItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id)); 
    } else {
      setSelectedItems([...selectedItems, id]); 
    }
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => toggleItem(item.id)}>
      <View
        style={[
          RechercheStyles.Inputs,
          { width: 284, height: 55, marginBottom: 10 },
        ]}
      >
        <Checkbox.Android
          color={
            selectedItems.includes(item.id)
              ? Color.colorRoyalblue_100
              : Color.colorGray
          }
          status={selectedItems.includes(item.id) ? "checked" : "unchecked"} // Check if item is selected
          onPress={() => toggleItem(item.id)}
        />
        <Text style={RechercheStyles.inputText}>{item.text}</Text>
      </View>
    </Pressable>
  );

  const addNewItem = () => {
    if (newItemText !== "") {
      const newItem = { id: data.length + 1, text: newItemText }; 
      setData([...data, newItem]); // Add new item to the list
      setNewItemText("");
    } else {
      Alert.alert("Alert", "élément Vide!.");
    }
  };

  return (
    <View style={[DetailsScreenStyles.datailsajouter]}>
      <TopBar />
      <Text style={DetailsScreenStyles.detailsAAjouter}>Signaler</Text>
      <View style={DetailsScreenStyles.main}>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <View style={DetailsScreenStyles.AddItem}>
        <TextInput
          style={[RechercheStyles.Inputs, { width: 230, height: 50 }]}
          value={newItemText}
          onChangeText={setNewItemText}
          placeholder="Saisir le texte de l'élément"
        />
        <TouchableOpacity onPress={addNewItem}>
          <Image
            style={[{ width: 50, height: 50 }]}
            contentFit="cover"
            source={require("../assets/addcircle-svgrepocom.png")}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          RechercheStyles.buttonfirst,
          { alignItems: "center", marginBottom: 5 },
        ]}
        onPress={handleconfirm}
      >
        <Text style={[RechercheStyles.buttonText, { color: "white" }]}>
          Confirmer
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const DetailsScreenStyles = StyleSheet.create({
  detailsAAjouter: {
    fontSize: FontSize.size_13xl,
    fontWeight: "700",
    fontFamily: FontFamily.nunitoBold,
    color: Color.colorDarkslategray_100,
    width: 359,
    marginVertical: "5%",
    textAlign: "center",
  },

  AddItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 70,
  },

  main: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  datailsajouter: {
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    width: "100%",
    backgroundColor: Color.neutralWhite,
  },
});

export default Signaler;
