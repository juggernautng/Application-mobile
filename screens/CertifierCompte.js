import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import env from "../env";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const CertifierCompte = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScanIDCard = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please enable camera permissions to scan ID card.');
      return;
    }

    const { uri } = await cameraRef.current.takePictureAsync();
    setImageUri(uri);
  };

  const handleSendImage = () => {
    if (!imageUri) {
      Alert.alert('Error', 'No image captured.');
      return;
    }

    fetch(`http://${env.API_IP_ADDRESS}:3000/api/AjouterID/${user.user.id_uti}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({ uri: imageUri }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Image uploaded successfully:', data);
        Alert.alert('Card Added', 'We will verify the informations, this may take days');
        navigation.navigate('MonProfil');
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  const handleRetakeImage = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <>
          {imageUri ? (
            <>
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.button]} onPress={handleSendImage}>
                <Image source={require('../assets/SendButton.png')} style={styles.cameraIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={handleRetakeImage}>
                <Image source={require('../assets/RetakeButton.png')} style={styles.cameraIcon} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef} />
              <TouchableOpacity style={styles.scanButton} onPress={handleScanIDCard}>
                <Image source={require('../assets/CameraButton.png')} style={styles.cameraIcon} />
              </TouchableOpacity>

            </>
          )}
        </>
      ) : (
        <Text>No access to camera</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cameraIcon: {
    width: 60,
    height: 60,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '80%',
  },
  scanButton: {
    marginTop: 25,
    padding: 10,
   
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: 'green',
  },

});

export default CertifierCompte;
