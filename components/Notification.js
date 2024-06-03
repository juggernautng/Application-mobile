import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Border, FontFamily, Color, FontSize, Padding } from "../GlobalStyles";
import env from "../env";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/refresh";


const Notification = (Props) => {
    const { refreshPage, refresh } = useRefresh();
    const { user } = useAuth();
    const navigation = useNavigation();
    const base64Image = `../assets/vector3.png`;
    const [time, setTime] = useState(Props.time);
    const [timeString, setTimeString] = useState('');

    useEffect(() => {
        const dateObj = new Date(time);
        const fullDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeOfDay = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        setTimeString(`${timeOfDay}, ${fullDate}`);
    }, [time]);
    return (
        <View style={[styles.notificationContainer, Props.isNew && styles.newNotification ]}>
            <Image source={Props.photo} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title2}>{Props.titre}</Text>
                <Text style={styles.sender}>{Props.sender_name} {Props.sender_prenom}</Text>
                <Text style={styles.body}>{Props.body}</Text>

                <Text style= {styles.time}>Time: {timeString}</Text>
            </View>
        </View>
    );
};

export const styles = StyleSheet.create({
    newNotification: {
        backgroundColor: '#e0f7fa', 
    },
    notificationContainer: {
        flexDirection: "row",
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginHorizontal: '6%',
        marginVertical: '2%',
        borderRadius: 10
      },
    image: {
        width: 50,
        height: 50,
        marginRight:14,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: "#0075fd",
        marginTop:15
    },
    title2: {
        fontFamily: "Poppins-Medium",
        fontSize : 15,
        fontWeight: "bold"
    },
    body: {
        marginTop: 0,
        fontFamily: "Poppins-Medium",
        fontSize : 12,
        maxWidth: "98%",
        paddingRight:50
    },
    sender: {
        fontFamily: "Poppins-Medium",
        fontSize : 13,
        color: '#0075fd'
    },
    time:{
        marginBottom: 5,
        fontSize : 12,
    }

});
export default Notification;
