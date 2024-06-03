import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { RechercheStyles } from '../screens/Recherche';

// Preload images
const images = {
  1: require("../assets/No data-cuate.png"),
  2: require("../assets/Tablet login-bro.png"),
  3: require("../assets/Locationph.png"),
  4: require("../assets/Live collaboration-amico.png"),
};

const NotAuth = ({ title, photo }) => {
  const [dir, setDir] = useState(images[photo]);

  if (!dir) {
    return (
      <View style={styles.photoMain}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.photoMain}>
      <Image
        style={styles.photo}
        resizeMode="cover"
        source={dir}
      />
      <Text style={[RechercheStyles.sharewheels, {fontSize: 20, fontWeight: "600"}]}>{title}</Text>
    </View>
  );
};

const styles = {
  photoMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  photo: {
    width: 290,
    height: 290,
  }
};

export default NotAuth;
