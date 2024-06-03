import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontSize, Padding, Color, Border, FontFamily } from "../GlobalStyles";
import TopBar from "../components/TopBar";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import env from "../env";


const Recherche = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [nbrNoti, setNbrNoti] = useState()
  const [ifZero, setIfZero] = useState(true)
  const [isLoading, setIsLoading] = useState(true);

  //SearchBar Screen par --------------------------------------------------------------------------------------------------
  const route = useRoute();
  const id = route.params?.type;


  const [departLocation, setDepartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  useEffect(() => {
    if (id === "Destination") {
      setDestinationLocation(route.params?.location);
    } else if (id === "Depart") {
      setDepartLocation(route.params?.location);
    }
  }, [id, route.params?.location]);

  const handleSearch = () => {
    if (!departLocation || !destinationLocation) {
      Alert.alert("Alert", "Veuillez remplir les informations SVP.");
    } else if (
      departLocation.toLowerCase() == destinationLocation.toLowerCase()
    ) {
      Alert.alert(
        "Alert",
        "le lieu de départ et la destination sont les mêmes"
      );
    } else {
      navigation.navigate("ResultatRecherche", {
        timestampRech: pickedDate.getTime(),
        Date: pickedDate.toLocaleDateString(),
        heure: pickedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        depart: departLocation,
        destination: destinationLocation,
        nbPlc: nbPlaces,
        isDatePicked: isDatePicked,
        isTimePicked: isTimePicked,
      });
    }
  };
  //-----------------------------------------------------------------------------------------------------------------

  //nombre places ---------------------------------------------------------------------------------------------------
  const [nbPlaces, click] = React.useState(1);

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
  //-----------------------------------------------------------------------------------------------------------------

  //Date------------------------------------------------------------------------------------------------------------
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePicked, setDatePicked] = useState(false);
  const [pickedDate, setPickedDate] = useState(new Date());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
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

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isTimePicked, setTimePicked] = useState(false);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    hideTimePicker();
    setPickedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      return newDate;
    });
    console.log("A time has been picked: ", time);
    setTimePicked(true);
  };
  const fetchDataFromDatabase = async () => {
    try {
      const read = "false";
      const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/GetNotifications/${user.user.email}/${read}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { nbr_notifications } = await response.json();
      setNbrNoti(nbr_notifications);
      if (nbr_notifications == 0) {
        setIfZero(true)
      }else{
        setIfZero(false)
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDataFromDatabase();
    }
  }, [user]);

  // console.log("nbr not:", nbrNoti);
  // console.log("isZero:", ifZero);

  //----------------------------------------------------------------------------------------------------------------
  
  return (
    <View style={RechercheStyles.recherche}>
      <TopBar />

      <View style={RechercheStyles.carpic}>
        <Image
          style={RechercheStyles.image1Icon}
          contentFit="cover"
          source={require("../assets/image-1.png")}
        />
      </View>
      {/* Notification */}
      <View style={RechercheStyles.notification}>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Image
            style={RechercheStyles.notificationPng}
            contentFit="cover"
            source={require("../assets/notification.png")}
          />
          {!ifZero && user && (
             <View style={RechercheStyles.redDot}>
             <Text style={RechercheStyles.dotText}>2</Text>
           </View>
          )}

        </TouchableOpacity>

      </View>


      <Text style={RechercheStyles.sharewheels}>ShareWheels</Text>

      <View style={RechercheStyles.main}>
        <Text style={[RechercheStyles.heading, { width: 326, marginTop: 10 }]}>
          où vas-tu
        </Text>
        <Pressable
          style={[RechercheStyles.Inputs, { marginTop: "2%", width: 292 }]}
          onPress={() =>
            navigation.navigate("SearchBar", {
              type: "Depart",
              screen: "Recherche",
            })
          }
        >
          <Image
            style={RechercheStyles.Icon}
            contentFit="cover"
            source={require("../assets/mappin.png")}
          />
          <Text style={[RechercheStyles.inputText]}>
            {departLocation ? departLocation : "Depart"}
          </Text>
        </Pressable>

        <Pressable
          style={[RechercheStyles.Inputs, { marginTop: "2%", width: 292 }]}
          onPress={() =>
            navigation.navigate("SearchBar", {
              type: "Destination",
              screen: "Recherche",
            })
          }
        >
          <Image
            style={RechercheStyles.Icon}
            contentFit="cover"
            source={require("../assets/mappin.png")}
          />
          <Text style={[RechercheStyles.inputText]}>
            {destinationLocation ? destinationLocation : "Destination"}
          </Text>
        </Pressable>

        <Text style={[RechercheStyles.heading, { width: 326, marginTop: 10 }]}>
          Quand?
        </Text>
        <View style={[RechercheStyles.DateHeure]}>
          <View>
            <TouchableOpacity
              onPress={showDatePicker}
              style={[RechercheStyles.Inputs, { width: 184 }]}
            >
              <Image
                style={[RechercheStyles.iconLayout]}
                contentFit="cover"
                source={require("../assets/mappin1.png")}
              />
              <Text style={[RechercheStyles.inputText, { marginLeft: 10 }]}>
                {isDatePicked ? pickedDate.toLocaleDateString() : "Date"}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
              date={pickedDate}
            />
          </View>
          <TouchableOpacity
            style={[RechercheStyles.Inputs, { width: 99 }]}
            onPress={showTimePicker}
          >
            <Image
              style={[RechercheStyles.iconLayout]}
              contentFit="cover"
              source={require("../assets/clock3.png")}
            />
            <Text style={[RechercheStyles.inputText, { marginLeft: 5 }]}>
              {isTimePicked
                ? pickedDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                : "Heure"}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
            date={pickedDate}
          />
        </View>

        <View style={RechercheStyles.places}>
          <Text style={[RechercheStyles.heading]}>Combien Places ?</Text>
          <View style={RechercheStyles.nmbrplaces}>
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
      </View>

      <TouchableOpacity
        style={[RechercheStyles.buttonfirst, { alignItems: "center" }]}
        onPress={handleSearch}
      >
        <Text style={[RechercheStyles.buttonText, { color: "white" }]}>
          Rechercher
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const RechercheStyles = StyleSheet.create({
  notification: {
    marginTop: 30,
    position: 'absolute',
    top: 16,
    right: 15,

  },
  notificationPng: {
    height: 40,
    width: 40,
    top: 6,
    right: 5
  },
  buttonText: {
    lineHeight: 24,
    fontSize: FontSize.subheadLgSHLgMedium_size,
    textAlign: "center",
    fontFamily: FontFamily.subheadLgSHLgMedium,
    fontWeight: "500",
  },
  heading: {
    color: Color.gray1,
    fontFamily: FontFamily.headingH2,
    fontWeight: "600",
    lineHeight: 25,
    textAlign: "left",
    fontSize: FontSize.headingH2_size,
  },

  Inputs: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_mini,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Color.colorGray_300,
    borderRadius: Border.br_base,
    borderStyle: "solid",
    shadowColor: '#7C7C7C',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1.5,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Color.neutralWhite,
  },

  inputText: {
    color: Color.colorGray_100,
    fontFamily: FontFamily.nunitoRegular,
    fontSize: FontSize.size_mini,
    textAlign: "left",
    width: "100%",
    marginLeft: 6,
  },

  iconLayout: {
    height: 22,
    width: 22,
  },

  image1Icon: {
    left: 0,
    top: 0,
    height: "100%",
    position: "absolute",
    width: "100%",
    resizeMode: "stretch",
  },
  redDot: {
    position: 'absolute',
    top: 10, 
    right: 25, 
    width: 20, 
    height: 20,
    borderRadius: 12,
    backgroundColor: '#fa5c69',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  dotText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    bottom: 0.5,
    marginBottom:1
  },
  carpic: {
    height: "34%",
    width: "100%",
  },
  sharewheels: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: FontFamily.nunitoExtraBold,
    textAlign: "center",
    color: Color.colorRoyalblue_100,
  },

  Icon: {
    width: 24,
    height: 24,
    overflow: "hidden",
  },

  input: {
    marginTop: "2%",
    width: 292,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_mini,
  },

  DateHeure: {
    width: 291,
    marginTop: "2%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  nmbrplaces: {
    width: 110,
    marginTop: 5,
    height: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  places: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  main: {
    height: "50%",
    paddingHorizontal: Padding.p_9xs,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-5%",
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
    shadowColor: '#585858',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 6,
  },

  recherche: {
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    width: "100%",
    backgroundColor: Color.neutralWhite,
  },
});

export default Recherche;
