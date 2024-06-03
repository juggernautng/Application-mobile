import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";
import DropDownPicker from "react-native-dropdown-picker";
import TopBar from "../components/TopBar";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RechercheStyles } from "./Recherche";
import { Alert } from "react-native";
import env from "../env";
import { useAuth } from "../context/AuthContext";
import { YourRidesStyles } from "./YourRides";
import NotAuth from "../components/notAuth";
import { useRefresh } from "../context/refresh";
import { NativeBaseProvider, Box, Select, CheckIcon } from "native-base";

const AjouterAnnonce = () => {
  const navigation = useNavigation();
  const { refreshPage, refresh } = useRefresh();
  const { user } = useAuth();

  const [departLocation, setDepartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [prix, setPrix] = useState(null);

  const route = useRoute();
  const id = route.params?.type;

  const selectedData = route.params?.selectedData;

  useEffect(() => {
    if (user) {
      const fetchCars = async () => {
        try {
          const carsResponse = await fetch(
            `http://${env.API_IP_ADDRESS}:3000/api/getCars/${user.user.id_uti}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          if (!carsResponse.ok) {
            throw new Error("Network response was not ok");
          }

          const carsData = await carsResponse.json();
          const carItems =
            carsData.length > 0
              ? carsData.map((car) => ({
                  label: car.modele,
                  value: car.matricule,
                }))
              : [{ label: "no car", value: null }];
          setItems(carItems);
        } catch (error) {
          console.error("Error fetching cars:", error);
        }
      };

      fetchCars();
    }
  }, []);

  useEffect(() => {
    if (id === "Destination") {
      setDestinationLocation(route.params?.location);
    } else if (id === "Depart") {
      setDepartLocation(route.params?.location);
    }
  }, [id, route.params?.location, user]);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  // date 1

  const scrollViewRef = useRef(null);

  const [extend, setExtend] = useState(false);
  const handleExtend = () => {
    setExtend(!extend);
    setDatePicker2(false);
  };
  useEffect(() => {
    if (!extend && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [extend]);
  const handleInputBlur = () => {
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePicked, setDatePicked] = useState(false);
  const [pickedDate, setPickedDate] = useState(new Date());

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isTimePicked, setTimePicked] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    setTimePickerVisibility(false); 
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
    setDatePickerVisibility(false); 
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    const currentDate = new Date();

    const currentDateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const pickedDateWithoutTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (pickedDateWithoutTime >= currentDateWithoutTime) {
      hideDatePicker();
      setPickedDate(date);
      console.log("A date has been picked: ", date);
      setDatePicked(true);
    } else {
      Alert.alert("Alert", "Vous ne pouvez pas choisir une date passée.", [
        {
          text: "OK",
          onPress: () => {
            hideDatePicker();
            setDatePickerVisibility(false);
          },
        },
      ]);
    }
  };

  const handleTimeConfirm = (time) => {
    hideTimePicker();
    setPickedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      return newDate;
    });
    setDate2((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      return newDate;
    });
    console.log("A time has been picked: ", time);
    setTimePicked(true);
  };

  // date2 ----------------------------------------------------------------------------------------------------------------------------
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [isDatePicked2, setDatePicker2] = useState(false);
  const [date2, setDate2] = useState(new Date());

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const handleDateConfirm2 = (selectedDate) => {
    hideDatePicker2();
    setDate2(selectedDate);
    console.log("A date has been picked: ", selectedDate);
    setDatePicker2(true);
  };

  function getDateDisplay(date, isDatePicked) {
    const displayDate = isDatePicked ? date.toLocaleDateString() : "Date";
    return displayDate;
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------

  const [nbPlaces, click] = React.useState(3);

  const add = () => {
    if (nbPlaces < 4) {
      click(nbPlaces + 1);
    }
  };

  const sub = () => {
    if (nbPlaces > 1) {
      click(nbPlaces - 1);
    }
  };

  const handleAjouterPress = async () => {
    const timestamp = pickedDate.getTime();
    const formattedDateTime = new Date(timestamp)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    let formattedDateTime2 = null;
    if (isDatePicked2) {
      const timestamp2 = date2.getTime();
      formattedDateTime2 = new Date(timestamp2)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }

    const prixFloat = parseFloat(prix);
    try {
      console.log(isDatePicked,isTimePicked,departLocation,destinationLocation,prix,selectedValue);
      if (
        isDatePicked &&
        isTimePicked &&
        departLocation &&
        destinationLocation &&
        prix &&
        selectedValue // id car is null
        
      ) {
        
        const response = await fetch(
          "http://" + env.API_IP_ADDRESS + ":3000/api/publish",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              depart: departLocation,
              arrivee: destinationLocation,
              timestamp: formattedDateTime,
              nbr_place: nbPlaces,
              prix: prixFloat,
              id_conducteur: user.user.id_uti,
              id_voiture: selectedValue,
              details: selectedData === undefined ? [] : selectedData,
              timestamp2: formattedDateTime2,
            }),
          }
        );
        if (response.ok) {
          refreshPage();
          Alert.alert("Success", "Announcement published successfully");
          navigation.navigate("TabNavigator", {
            screen: "Vos Trajets",
            params: {
              screen: "Vos Trajets",
            },
          });
          navigation.replace("AjouterAnnonce", {
            type: id,
            selectedData: selectedData,
          });
        } else {
          Alert.alert("Error", "Failed to publish announcement");
        }
      } else {
        Alert.alert("alert", "something is missing");
      }
    } catch (error) {
      console.error("Error publishing announcement:", error);
      Alert.alert("Error", "Internal server error");
    }
  };

  if (!user) {
    return (
      <View style={YourRidesStyles.container}>
        <TopBar />
        <Text style={[YourRidesStyles.title]}>Publish</Text>
        <NotAuth title="Besoin de se connecter/s'inscrire" photo={2} />
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TabNavigator", {
                screen: "Profil",
                params: { screen: "WelcomeScreen" },
              })
            }
          >
            <Image
              style={[{ width: 50, height: 50, marginTop: -150 }]}
              contentFit="cover"
              source={require("../assets/next.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <KeyboardAvoidingView
        behavior="position"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <TopBar />
        <View style={[styles.AddRideTop]}>
          <Text style={styles.ajouterAnnonce}>Ajouter Annonce</Text>
        </View>

        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.ajouterannonce,
              styles.footerpublishFlexBox,
              extend ? { height: 750 } : { height: 600 },
            ]}
          >
            <View style={[styles.main]}>
              <View style={styles.inputs}>
                <Pressable
                  style={styles.input}
                  onPress={() =>
                    navigation.navigate("SearchBar", {
                      type: "Depart",
                      screen: "AjouterAnnonce",
                    })
                  }
                >
                  <Image
                    style={styles.mapPinIcon}
                    contentFit="cover"
                    source={require("../assets/mappin3.png")}
                  />
                  <Text
                    style={{
                      textAlign: "left",
                      width: "100%",
                      marginLeft: 5,
                      color: Color.colorGray_100,
                    }}
                  >
                    {departLocation ? departLocation : "Depart"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.input1, styles.inputShadowBox1]}
                  onPress={() =>
                    navigation.navigate("SearchBar", {
                      type: "Destination",
                      screen: "AjouterAnnonce",
                    })
                  }
                >
                  <Image
                    style={styles.mapPinIcon}
                    contentFit="cover"
                    source={require("../assets/mappin3.png")}
                  />
                  <Text
                    style={{
                      textAlign: "left",
                      width: "100%",
                      marginLeft: 5,
                      color: Color.colorGray_100,
                    }}
                  >
                    {destinationLocation ? destinationLocation : "Destination"}
                  </Text>
                </Pressable>
                <View>
                  <View style={extend ? styles.styleWhenTrue : false}>
                    {extend && (
                      <Text
                        style={[
                          styles.number,
                          styles.numberTypo,
                          styles.extend,
                          styles.text,
                        ]}
                      >
                        Debut Date
                      </Text>
                    )}
                    <Pressable 
                      style={styles.inputShadowBox}
                      onPress={showDatePicker}
                    >
                      <Image
                        style={[styles.mapPinIcon2, styles.iconLayout]}
                        contentFit="cover"
                        source={require("../assets/mappin4.png")}
                      />
                      <Text style={[styles.number2, styles.numberTypo]}>
                        {getDateDisplay(pickedDate, isDatePicked)}
                      </Text>

                      <Pressable onPress={handleExtend}>
                        <Image
                          style={styles.addCircleSvgrepocomIcon}
                          contentFit="cover"
                          source={
                            extend
                              ? require("../assets/UpArrow.png")
                              : require("../assets/down-arrow.png")
                          }
                        />
                      </Pressable>
                    </Pressable>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleDateConfirm}
                      onCancel={hideDatePicker}
                      date={new Date(pickedDate)} 
                    />
                    {extend && (
                      <Text
                        style={[
                          styles.number,
                          styles.numberTypo,
                          styles.extend,
                          styles.text,
                        ]}
                      >
                        Fin Date
                      </Text>
                    )}
                    {extend && (
                      <View style={styles.frameFlexBox}>
                        <Pressable //Date
                          style={styles.inputShadowBox}
                          onPress={showDatePicker2}
                        >
                          <Image
                            style={[styles.mapPinIcon, styles.iconLayout]}
                            contentFit="cover"
                            source={require("../assets/mappin2.png")}
                          />
                          <Text style={[styles.number, styles.numberTypo]}>
                            {getDateDisplay(date2, isDatePicked2)}
                          </Text>
                        </Pressable>
                        <DateTimePickerModal
                          isVisible={isDatePickerVisible2}
                          mode="date"
                          onConfirm={handleDateConfirm2}
                          onCancel={hideDatePicker2}
                          date={new Date(date2)} 
                        />
                      </View>
                    )}
                  </View>
                </View>

                <Pressable // Heure
                  style={styles.inputShadowBox}
                  onPress={showTimePicker}
                >
                  <Image
                    style={[styles.mapPinIcon2, styles.iconLayout]}
                    contentFit="cover"
                    source={require("../assets/clock3.png")}
                  />
                  <Text style={[styles.number2, styles.numberTypo]}>
                    {isTimePicked
                      ? pickedDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "Heure"}
                  </Text>
                </Pressable>
                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  mode="time"
                  onConfirm={handleTimeConfirm}
                  onCancel={hideTimePicker}
                  date={new Date(pickedDate)} 
                />

                <View style={[styles.inputShadowBox]}>
                  <Image
                    style={[styles.mapPinIcon2, styles.iconLayout]}
                    contentFit="cover"
                    source={require("../assets/mappin5.png")}
                  />

                  <Select
                    selectedValue={selectedValue}
                    minWidth="250"
                    accessibilityLabel="Choose Car"
                    placeholder="Choisir voiture"
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
                    onValueChange={(value) => {
                      setSelectedValue(value);
                      if (value === null){
                      setSelectedValue(null);
                      navigation.navigate("Voiture", { car: 'no_car_ad' });}}}
                    borderWidth={0}
                    marginTop= "0"
                    marginLeft={0}
                  >
                    {items.map((item) => (
                      <Select.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Select>
                </View>

                <View style={[styles.inputShadowBox, { alignItems: "center" }]}>
                  <Image
                    style={[styles.mapPinIcon2, styles.iconLayout]}
                    contentFit="cover"
                    source={require("../assets/clock32.png")}
                  />
                  <Text
                    style={[
                      {
                        textAlign: "left",
                        marginLeft: -60,
                        color: Color.colorGray_100,
                      },
                    ]}
                  >
                    Places
                  </Text>
                  <View style={[RechercheStyles.nmbrplaces, { marginTop: 0 }]}>
                    <TouchableOpacity onPress={sub}>
                      <Image
                        style={RechercheStyles.iconLayout}
                        contentFit="cover"
                        source={require("../assets/moins.png")}
                      />
                    </TouchableOpacity>
                    <Text style={[RechercheStyles.heading]}>{nbPlaces}</Text>
                    <TouchableOpacity onPress={add}>
                      <Image
                        style={[RechercheStyles.iconLayout]}
                        contentFit="cover"
                        source={require("../assets/plus.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ zIndex: -1 }}>
                  <View // Price
                    style={styles.inputShadowBox}
                  >
                    <Image
                      style={[styles.mapPinIcon2, styles.iconLayout]}
                      contentFit="cover"
                      source={require("../assets/money-icon1.png")}
                    />
                    <TextInput
                      style={[styles.number2, styles.numberTypo]}
                      placeholder="Prix (DA)"
                      keyboardType="numeric"
                      onBlur={handleInputBlur}
                      onChangeText={(text) => setPrix(text)}
                      value={prix}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.inputShadowBox}
                  onPress={() => {
                    navigation.navigate("DatailsAjouter");
                  }}
                >
                  <Image
                    style={[styles.mapPinIcon2, styles.iconLayout]}
                    contentFit="cover"
                    source={require("../assets/add-circle-outline.png")}
                  />
                  <Text style={[styles.number2, styles.numberTypo]}>
                    Details a ajouter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.ajouter}>
          <TouchableOpacity
            style={[
              styles.buttonfirst,
              styles.input1FlexBox,
              styles.btnAjouter,
            ]}
            onPress={handleAjouterPress}
          >
            <Text style={styles.signUp}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
  needLogin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authenticateButton: {
    backgroundColor: "blue", 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  AddRideTop: {
    height: 100,
    backgroundColor: "white",
    justifyContent: "center",
    borderBottomColor: Color.colorGray_300,
    borderBottomWidth: 2,
    borderRadius: 5,
  },

  styleWhenTrue: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  text: {
    color: "black",
    marginTop: 10,
    height: 20,
  },
  addCircleSvgrepocomIcon: {
    width: 22,
    height: 22,
    marginLeft: -15,
  },
  btnAjouter: {
    marginTop: 10,
    marginBottom: 10,
  },
  ajouter: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonUncheckedSvgrepoIcon: {
    width: 24,
    height: 24,
    overflow: "hidden",
  },
  footerpublishFlexBox: {
    justifyContent: "space-between",
    backgroundColor: Color.neutralWhite,
  },
  numberTypo: {
    height: 19,
    textAlign: "left",
    color: Color.colorGray_100,
    fontFamily: FontFamily.nunitoRegular,
    lineHeight: 22,
    fontSize: FontSize.size_mini,
  },
  inputShadowBox1: {
    marginTop: 15,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_mini,
    borderWidth: 1,
    borderColor: Color.colorGray_300,
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 30,
    shadowRadius: 30,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowColor: "rgba(80, 85, 136, 0.1)",
    borderRadius: Border.br_base,
    backgroundColor: Color.neutralWhite,
  },
  iconLayout: {
    height: 22,
    width: 22,
  },
  input1FlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  ajouterAnnonce: {
    fontSize: FontSize.size_13xl,
    fontWeight: "700",
    fontFamily: FontFamily.nunitoBold,
    color: Color.colorDarkslategray_100,
    width: 359,
    textAlign: "center",
    marginBottom: 0,
  },
  mapPinIcon: {
    width: 24,
    height: 24,
    overflow: "hidden",
  },
  number: {
    width: 227,
  },
  input: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_mini,
    borderWidth: 1,
    borderColor: Color.colorGray_300,
    borderStyle: "solid",
    elevation: 30,
    shadowRadius: 30,
    shadowColor: "rgba(80, 85, 136, 0.1)",
    borderRadius: Border.br_base,
    flexDirection: "row",
    width: 292,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Color.neutralWhite,
  },
  input1: {
    flexDirection: "row",
    alignItems: "center",
    width: 292,
    marginTop: 15,
    justifyContent: "space-between",
  },
  mapPinIcon2: {
    overflow: "hidden",
  },
  number2: {
    width: 220,
    marginLeft: 12,
  },
  inputShadowBox: {
    height: 57,
    marginTop: 15,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_mini,
    flexDirection: "row",
    width: 292,
    borderWidth: 1,
    borderColor: Color.colorGray_300,
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 30,
    shadowRadius: 30,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowColor: "rgba(80, 85, 136, 0.1)",
    borderRadius: Border.br_base,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Color.neutralWhite,
  },

  inputs: {
    height: 544,
    marginTop: 20,
    alignItems: "center",
  },
  signUp: {
    fontSize: FontSize.subheadLgSHLgMedium_size,
    lineHeight: 24,
    fontWeight: "500",
    fontFamily: FontFamily.subheadLgSHLgMedium,
    color: Color.neutralWhite,
    width: 235,
    textAlign: "center",
  },
  buttonfirst: {
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorRoyalblue_100,
    shadowColor: "rgba(236, 95, 95, 0.25)",
    shadowRadius: 14,
    elevation: 14,
    width: 317,
    height: 58,
    flexDirection: "row",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    marginTop: 0,
    justifyContent: "center",
  },
  main: {
    flex: 1,
    alignItems: "center",
  },

  ajouterannonce: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
    width: "100%",
  },
});

export default AjouterAnnonce;
