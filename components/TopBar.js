import * as React from "react";
import { StyleSheet, View} from "react-native";
import { Platform, StatusBar } from 'react-native';


const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const TopBar = () =>{
    return(
        <View style={[styles.bar]} />
    );
};

const styles = StyleSheet.create({
      bar: {
        height: statusBarHeight,
      },
});
export default TopBar;

