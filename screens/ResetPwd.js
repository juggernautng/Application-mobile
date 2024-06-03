import * as React from "react";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { pstyles } from "./MonProfil";
import { TouchableOpacity } from "react-native";
import { Alert } from "react-native";
import { Border, Color, Padding, FontSize, FontFamily } from "../GlobalStyles";
import { useState } from "react";
import env from "../env.js"


const ResetPwd = ({ route }) => {
    
    const { email } = route.params;    

    const navigation = useNavigation();
    const [error, setError] = useState(null)
    const [isLoading, setIsloading] = useState(null)
    

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState('');
    
    const handleResetPassword = async () => {
        
        setIsloading(true)
        setError(null)
        if (password !== confirmPassword) {
            setError("Passwords needs to be matched");
            return;
        }

        try {
            const response = await fetch(`http://${env.API_IP_ADDRESS}:3000/api/resetPassword/${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password,
                    verificationCode,

                }),
            });
            const json = await response.json();


            if (!response.ok) {
                setIsloading(false);
                setError(json.error);
                console.log(json.error);
                return; 
            }

            if (response.ok) {
                setIsloading(false); 
                Alert.alert("Le mot de passe a été changé avec succès");
                navigation.navigate('Login')
            }

        } catch (error) {
            console.error("Error resetting password :", error);
            Alert.alert("Erreur", "Une erreur s'est produite lors de la réinitialisation du mot de passe");
        }
    };

    return (
        <View style={[pstyles.main, { paddingTop: "20%" }]}>
            <Text style={styles.title}>Changer de mot de passe</Text>

            <Text style={styles.Soustitre}>Code de verification:</Text>
            <View style={styles.Input}>
                <TextInput placeholder="Code de verification" style={{ width: 277 }} value={verificationCode} onChangeText={(text) => setVerificationCode(text)} />
            </View>

            <Text style={styles.Soustitre}>Nouveau mot de pass :</Text>
            <View style={styles.Input}>
                <TextInput placeholder="Mot de passe" style={{ width: 277 }} value={password} onChangeText={(text) => setPassword(text)} />
            </View>

            <Text style={styles.Soustitre}>Confirmer le mot de pass:</Text>
            <View style={styles.Input}>
                <TextInput placeholder="Confirmer Mot de passe" style={{ width: 277 }} value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} />
            </View>

            <View style={[styles.error]}>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <Pressable
                style={[styles.buttonfirst, { alignItems: "center" }]}
                onPress={handleResetPassword}
            >
                <Text style={[styles.heading, { fontSize: 16, color: "white" }]}>
                    Confirmer
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    error: {
        margin: 5
    },
    errorText: {
        color: 'red',
        marginTop: 0,
        textAlign: 'center',
        fontFamily: "Poppins-Medium",
    },
    main: {
        flex: 1,
        alignContent: "space-between"
    },


    title: {
        fontSize: FontSize.size_5xl,
        height: 35,
        marginTop: 15,
        width: '100%',
        textAlign: "center",
        color: Color.colorDarkslategray_100,
        fontFamily: FontFamily.nunitoBold,
        fontWeight: "700",
    },

    Input: {
        paddingVertical: Padding.p_base,
        paddingHorizontal: Padding.p_mini,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Color.colorGray_300,
        elevation: 30,
        shadowRadius: 30,
        shadowColor: "rgba(80, 85, 136, 0.1)",
        borderRadius: Border.br_base,
        borderStyle: "solid",
        shadowOpacity: 1,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Color.neutralWhite,
        marginBottom: 15


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
        shadowOpacity: 1,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },
    Soustitre: {
        marginLeft: "11%",
        marginTop: "10%",
        marginBottom: 10,
        alignSelf: "baseline",
        color: "#5a5a5a",
        fontSize: 16,
        fontFamily: "Poppins-Medium",
    },
});

export default ResetPwd;
