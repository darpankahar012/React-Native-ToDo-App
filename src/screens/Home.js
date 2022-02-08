/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';

import {
    Text,
    StyleSheet,
    View,
    Pressable,
    Alert,
    TextInput,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import GlobalStyle from '../utils/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../utils/CustomButton';

import PushNotification from "react-native-push-notification";
import SQLite from 'react-native-sqlite-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setName, setAge, incrementAge, getCities } from '../redux/actions';

const db = SQLite.openDatabase({
    name: 'MainDB',
    location: "default"
},
    () => { },
    error => { console.log(error); }
);



function Home({ navigation, route }) {

    // const [name, setName] = useState("");
    // const [age, setAge] = useState("");

    const { name, age, cities } = useSelector(state => state.userReducer)
    // console.log("first", cities);
    const dispatch = useDispatch()

    useEffect(() => {
        getData()
        dispatch(getCities())
    }, []);

    const handleNotification = (item, index) => {
        // PushNotification.cancelAllLocalNotifications()
        // PushNotification.cancelLocalNotification({ id: 3 })

        PushNotification.localNotification({
            channelId: "test-channel",
            title: "You clicked on " + item.city,
            message: item.city,
            bigText: item.city + " is one oof the largest cities" + item.country,
            color: "red",
            id: index
        })

        PushNotification.localNotificationSchedule({
            channelId: "test-channel",
            title: "Alert",
            message: "You clicked on " + item.country + "20 seconds ago",
            date: new Date(Date.now() + 15 * 1000),
            allowWhileIdle: true
        })

    }

    const getData = () => {
        try {
            // AsyncStorage.getItem("UserName")
            //     .then((value) => {
            //         if (value != null) {
            //             let user = JSON.parse(value)
            //             setName(user.Name)
            //             setAge(user.Age)
            //         }
            //     })
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT Name,Age FROM Users",
                    [],
                    (tx, result) => {
                        var len = result.rows.length;
                        if (len > 0) {
                            let userName = result.rows.item(0).Name;
                            let Age = result.rows.item(0).Age;
                            // setName(userName)
                            // setAge(Age)
                            dispatch(setName(userName));
                            dispatch(setAge(Age));
                        }
                    }
                )
            })
        } catch (error) {
            console.log("error", error);
        }
    }

    const updateData = () => {
        if (name.length === 0) {
            Alert.alert("Warning!", "Please Enter Your Name !")
        } else {
            try {
                let user = {
                    Name: name
                }
                // AsyncStorage.mergeItem("UserName", JSON.stringify(user))
                // AsyncStorage.setItem("UserName", name)
                db.transaction((tx) => {
                    tx.executeSql(
                        "UPDATE Users SET Name=? ",
                        [name],
                        () => { Alert.alert("Success !", "Your Data Updated !") },
                        error => { console.log(error); }
                    )
                })
            } catch (error) {
                console.log("error", error);
            }
        }
    }
    const removeData = () => {
        try {
            // AsyncStorage.removeItem("UserName")
            // AsyncStorage.clear()
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM Users ",
                    [],
                    () => { navigation.navigate('Login') },
                    error => { console.log(error); }
                )
            })
            // Alert.alert("Success !", "Your Data Removed !")
        } catch (error) {
            console.log("error", error);
        }
    }

    return (
        <View style={styles.body}>
            <Text style={[
                GlobalStyle.CustomFont,
                styles.text
            ]}>
                WelCome {name}
            </Text>
            <CustomButton
                title="Open Camera"
                color="#0080ff"
                onPressFunction={() => navigation.navigate("Camera")}
            />
            <FlatList
                data={cities}
                renderItem={({ item, index }) => (
                    // console.log("🚀 ~ file: Home.js ~ line 130 ~ Home ~ item", item)
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Map", {
                                city: item.city,
                                lat: item.lat,
                                lng: item.lng,
                            });
                            // handleNotification(item, index)
                        }}
                    >
                        <View style={styles.item}>
                            <Text style={styles.title}>
                                {item.country}
                            </Text>
                            <Text style={styles.sunTitle}>
                                {item.city}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            {/* <Text style={[
                GlobalStyle.CustomFont,
                styles.text
            ]}>
                Your Age is {age}
            </Text>
            <TextInput
                style={styles.input}
                placeholder='Enter Your Name'
                value={name}
                // onChangeText={(value) => setName(value)}
                onChangeText={(value) => dispatch(setName(value))}
            />
            <CustomButton
                title="Increment"
                color="#ff7f00"
                onPressFunction={() => dispatch(incrementAge())}
            />
            <CustomButton
                title="Update"
                color="#ff7f00"
                onPressFunction={updateData}
            />
            <CustomButton
                title="Remove"
                color="#f40100"
                onPressFunction={removeData}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',

    },
    text: {
        color: "#000",
        fontSize: 40,
        // fontWeight: 'bold',
        margin: 10,
        // fontFamily: "IndieFlower-Regular"
    },
    input: {
        // color: "#000",
        width: 300,
        borderWidth: 1,
        borderColor: "#555",
        borderRadius: 10,
        backgroundColor: "#ffff",
        textAlign: "center",
        fontSize: 20,
        marginTop: 120,
        marginBottom: 10
    },
    item: {
        backgroundColor: "#ffff",
        borderWidth: 2,
        borderColor: "#cccc",
        borderRadius: 5,
        margin: 7,
        width: 350,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: "#9999",
        fontSize: 30,
        margin: 10
    },
    sunTitle: {
        fontSize: 20,
        margin: 10,
        color: "#9999"
    }
})

export default Home;
