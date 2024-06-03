import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import TopBar from "../components/TopBar";
import algeria_cities from "../assets/algeria_cities.json";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RechercheStyles } from "./Recherche";

const SearchBar = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const id = route.params?.type;
  const screen = route.params?.screen;

  const textInputRef = useRef(null);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    const filtered = algeria_cities.filter((city) =>
      `${city.commune_name_ascii}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchQuery]);

  const handleCitySelection = (city) => {
    navigation.navigate(screen, {
      location: city.commune_name_ascii.toString(),
      type: id,
    });
  };

  return (
    <View style={[styles.main]}>
      <TopBar />
      <View
        style={[
          RechercheStyles.Inputs,
          { marginTop: "10%", width: 292, marginBottom: 6 },
        ]}
      >
        <Image
          style={RechercheStyles.Icon}
          contentFit="cover"
          source={require("../assets/mappin.png")}
        />
        <TextInput
          ref={textInputRef}
          style={[RechercheStyles.TextInput, { width: 227 }]}
          placeholder={id}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCompleteType="off"
          onSubmitEditing={() => {
            if (searchQuery.trim() !== "") {
              navigation.navigate(screen, {
                location: searchQuery.trim(),
                type: id,
              });
            }
          }}
          blurOnSubmit={false}
        />
      </View>
      {searchQuery.length > 0 && (
        <View style={styles.suggestionContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.suggestionList}
            data={filteredCities}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleCitySelection(item)}
                style={styles.suggestionItem}
              >
                <Image
                  style={[{ width: 18, height: 18, marginLeft: -10 }]}
                  contentFit="cover"
                  source={require("../assets/mappin.png")}
                />
                <Text style={styles.text}>
                  {`${item.commune_name_ascii}, ${item.daira_name_ascii}, ${item.wilaya_name_ascii}`}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps='"always"' 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F7F7F7",
  },

  suggestionList: {
    paddingTop: 5,
    alignItems: "center",
    justifyContent: "flex-start",
    fontSize: 16,
  },
  suggestionItem: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 350,
    borderRadius: 10,
    backgroundColor: "#ECECEC",
    shadowColor: "#bababa",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 4,
    marginHorizontal: 20,
  },
  text: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    textAlign: "left",
    width: 270,
  },
});

export default SearchBar;
