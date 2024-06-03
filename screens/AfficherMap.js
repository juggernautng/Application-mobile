  import React, { useEffect, useState } from "react";
  import { StyleSheet, View, Text, Alert, ActivityIndicator,TouchableOpacity,  Linking, Image   } from "react-native";
  import MapView, { Marker } from "react-native-maps";
  import * as Location from "expo-location";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import TopBar from "../components/TopBar";

  const AfficherMap = () => {
    const navigation = useNavigation();
  const route = useRoute();

    const [departCoords, setDepartCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [distance, setDistance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const departStr = route.params?.depart;
    const destinationStr = route.params?.destination;
    console.log(departStr,destinationStr )
    useEffect(() => {
      getLocationPermission();
    }, []);

    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "This app needs location permission to function properly.",
          [{ text: "OK", onPress: () => {} }]
        );
        return;
      }
      fetchCoordinates();
    };

    const fetchCoordinates = async () => {
      setIsLoading(true)
      try {
        const depart = await Location.geocodeAsync(departStr, { timeout: 10000 });
        const destination = await Location.geocodeAsync(destinationStr, { timeout: 10000 });
    
        if (depart.length === 0 || destination.length === 0) {
          throw new Error("No coordinates found");
        }
    
        const departCoordsData = depart[0];
        const destinationCoordsData = destination[0];
    
        if (!departCoordsData || !destinationCoordsData) {
          throw new Error("Coordinates data not available");
        }
    
        setDepartCoords({ latitude: departCoordsData.latitude, longitude: departCoordsData.longitude });
        setDestinationCoords({ latitude: destinationCoordsData.latitude, longitude: destinationCoordsData.longitude });
    
        const dist = getDistance(departCoordsData, destinationCoordsData);
        setDistance(dist);
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting coordinates: ", error);
        Alert.alert(
          "Error",
          "Échec de la récupération des coordonnées. Veuillez réessayer plus tard.",
          [
            {
              text: "Google Maps",
              onPress: () => {
                openGoogleMaps();
              },
            },
            {
              text: "Réessayer",
              onPress: () => {
                fetchCoordinates();
              },
            },
            {
              text: "OK",
              onPress: () => {navigation.goBack();},
            },
          ]
        );
        setIsLoading(false);
      }
    };
    

    const getDistance = (coord1, coord2) => {
      const R = 6371;
      const dLat = deg2rad(coord2.latitude - coord1.latitude);
      const dLon = deg2rad(coord2.longitude - coord1.longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    };

    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };

    const openGoogleMaps = () => {
      const startCoords = `${departCoords.latitude},${departCoords.longitude}`;
      const endCoords = `${destinationCoords.latitude},${destinationCoords.longitude}`;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${startCoords}&destination=${endCoords}`;
      Linking.openURL(url);
    };

    return (
      <View style={styles.container}>
        <TopBar/>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0075fd" style={styles.loadingIndicator} />
        ) : (
          <>
            {departCoords && destinationCoords && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: (departCoords.latitude + destinationCoords.latitude) / 2,
                  longitude: (departCoords.longitude + destinationCoords.longitude) / 2,
                  latitudeDelta: Math.abs(departCoords.latitude - destinationCoords.latitude) * 2,
                  longitudeDelta: Math.abs(departCoords.longitude - destinationCoords.longitude) * 2,
                }}
              >
                {departCoords && <Marker coordinate={departCoords} title={"Depart"} />}
                {destinationCoords && <Marker coordinate={destinationCoords} title={"Destination"} />}
              </MapView>
            )}

            {distance !== null && (
              <View style={[styles.distanceContainer, {left: 16,}]}>
                <Text style={styles.distanceText}>{`Distance: ${distance.toFixed(2)} KM`}</Text>
              </View>
            )}
            <TouchableOpacity style={[styles.distanceContainer, {right: 16,padding: 13}]} onPress={openGoogleMaps}>
            <Image
              style={styles.icon}
              contentFit="cover"
              source={require("../assets/google-maps-2020-icon.png")}
              />
              <Text style={[styles.distanceText, {fontSize: 18,}]}>{"      Voir sur\nGoogle Maps"}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    icon: {
      width: 20,
      height: 23,
      position: 'absolute',
      left: 16,
      top: 8
    },
    GoogleMaps: {
      marginTop: 20,
    },
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    distanceContainer: {
      position: 'absolute',
      bottom: 16,
      backgroundColor: '#fff',
      padding: 8,
      borderRadius: 8,
      borderColor: "#0075fd",
      borderWidth: 0.5,
    },
    distanceText: {
      fontSize: 16,
      color: "#0075fd",
      textAlign: 'center'
    },
    loadingIndicator: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default AfficherMap;
