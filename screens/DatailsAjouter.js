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
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";
import TopBar from "../components/TopBar";
import { RechercheStyles } from "./Recherche";
import { Checkbox } from "react-native-paper";

const fetchDataFromDatabase = async () => {
  // Example data
  return [
    { id: 1, text: "Fumeurs" },
    { id: 2, text: "Bagages" },
    { id: 3, text: "Ouvert à la conversation" },
    { id: 4, text: "Passagers de différents sexes" },
    { id: 5, text: "Arrêts supplémentaires" },
  ];
};

const DatailsAjouter = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [newItemText, setNewItemText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const handleconfirm = () => {
    const selectedData = data.filter((item) => selectedItems.includes(item.id));
    const selectedTexts = selectedData.map((item) => item.text);
    console.log(selectedTexts);
    navigation.navigate("AjouterAnnonce", { selectedData: selectedTexts });
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
          status={selectedItems.includes(item.id) ? "checked" : "unchecked"} 
          onPress={() => toggleItem(item.id)}
        />
        <Text style={RechercheStyles.inputText}>{item.text}</Text>
      </View>
    </Pressable>
  );

  const addNewItem = () => {
    if (newItemText !== "") {
      const newItem = { id: data.length + 1, text: newItemText }; 
      setData([...data, newItem]);
      setNewItemText("");
    } else {
      Alert.alert("Alert", "élément Vide!.");
    }
  };

  return (
    <View style={[DetailsScreenStyles.datailsajouter]}>
      <TopBar />
      <Text style={DetailsScreenStyles.detailsAAjouter}>Details a ajouter</Text>
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

export default DatailsAjouter;
