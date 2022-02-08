/* eslint-disable prettier/prettier */
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

const Header = props => {
    return (
        <View
            style={styles.view}
        >
            <Text style={styles.text}>
                React Native Demo
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        height: 50,
        width: "100%",
        backgroundColor: '#00f',
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#ffff"
    }
});

export default Header;
