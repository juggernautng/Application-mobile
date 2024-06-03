import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Image } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import NotAuth from "../components/notAuth";
import { useAuth } from "../context/AuthContext";
import { timestampToDateTime } from "./ResultatRecherche";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import axios from "axios";
import env from "../env";
import Notification from "../components/Notification";
import * as FileSystem from 'expo-file-system';

const Notifications = ({ }) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [newId, setNewId] = useState()
  const [nbrNoti, setNbrNoti] = useState()
  const [ifZero, setIfZero] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  const loadImage = async (path) => {
    const fileExists = await FileSystem.getInfoAsync(path);
    if (fileExists.exists) {
      return { uri: path };
    } else {
      return require("../assets/image1.png");
    }
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

      const { notifications, notificationIds, nbr_notifications, newNotificationIds } = await response.json();

      if (notifications) {
        for (const item of notifications) {
          const loadedPhoto = await loadImage(item.pdp);
          item.pdp = loadedPhoto;
        }
      }

      console.log('Notifications:', notifications);
      console.log("notifications ids: ", notificationIds);
      console.log('Number of unread notifications:', nbr_notifications);
      console.log("the ids of the new notifications: ", newNotificationIds);

      setNotifications(notifications);
      setNbrNoti(nbr_notifications); 
      setNewId(newNotificationIds);

      if (nbr_notifications == 0) {
        setIfZero(true)
      } else {
        setIfZero(false)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      const read = "true";
      const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/GetNotifications/${user.user.email}/${read}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },

      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { notifications, nbr_notifications } = await response.json();
      if (notifications) {
        for (const item of notifications) {
          const loadedPhoto = await loadImage(item.pdp);
          item.pdp = loadedPhoto;
        }
      }
      setNotifications(notifications)
      setNbrNoti(nbr_notifications);
      setIfZero(true)
      setNewId('')
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

  const renderItem = ({ item }) => {
    const isNew = newId.includes(item.id_notification);

    return (
      <Notification
        id_notification={item.id_notification}
        isNew={isNew}
        titre={item.titre}
        sender_name={item.sender_name}
        sender_prenom={item.sender_prenom}
        body={item.body}
        time={item.time}
        photo={item.pdp}
      />
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDataFromDatabase();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <NotAuth title="Besoin de se connecter/s'inscrire" photo={2} />
        <TouchableOpacity onPress={() => navigation.navigate('TabNavigator', { screen: 'Profil', params: { screen: 'WelcomeScreen' } })} >
          <Image style={styles.image} source={require("../assets/next.png")} />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Notifications </Text>
        <View style={styles.main}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0075fd" />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={notifications}
              renderItem={renderItem}
              keyExtractor={(item) => item.id_notification.toString()}
              ListEmptyComponent={<View style={styles.emptyList}><NotAuth title={'Pas de notifications pour le moment'} photo={3} /></View>}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#0075fd']} progressBackgroundColor='white' />}
            />
          )}
          {/* button */}
          {!ifZero && (
            <TouchableOpacity style={styles.markAsRead} onPress={markAsRead}>
              <Text style={styles.nbr}>Mark as read : {nbrNoti}</Text>
            </TouchableOpacity>
          )}



        </View>

      </View>
    );
  }
};

const styles = StyleSheet.create({

  markAsRead: {
    position: 'absolute', 
    bottom: 16, 
    right: 16, 
    height: 45,
    width: 150,
    backgroundColor: '#0075fd', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  nbr: {
    color: 'white',
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 0,
  },
  title: {
    fontSize: FontSize.size_5xl,
    marginTop: 45,
    fontFamily: FontFamily.nunitoBold,
    fontWeight: "700",
    color: Color.colorDarkslategray_100,
    height: 50,
    width: '100%',
    textAlign: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  main: {
    flex: 1,
    width: '100%',
    marginTop: 0,
    alignItems: "center",
  },
  flatList: {
    width: "100%",
  },
  emptyList: {
    marginTop: '40%',
  },
  notificationContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: "30%"
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: "center"
  },
  title2: {
    fontSize: 16,
    fontWeight: "bold"
  },
  body: {
    fontSize: 14
  },
  sender: {
    fontSize: 12,
    color: "#555"
  },
});

export default Notifications;
