import { View, Text, StyleSheet, Image, ImageBackground, Dimensions, StatusBar } from 'react-native'
import React, { useEffect, useReducer, useState } from 'react'
import * as Progress from 'react-native-progress';
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { DB_NAME } from "@env"
import { logo, bg9 } from "../constant/constant"

const { width, height } = Dimensions.get("window")


export default function index() {

    const [db, setDb] = useState(SQLite.openDatabase(DB_NAME));

    const router = useRouter();
    const [progress, setProgress] = useState(0);

    function goTo() {
        if (progress < 1) {
            // setProgress(progress + 0.01) ;
            setProgress(progress + 0.012);
        }
        else {

            router.replace('screen/home/Home');
        }
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            goTo()

        }, 5);

    }, [progress]);

    useEffect(() => {
        // create table names IF NOT EXISTS
        // transaction make opretaor
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Diwans (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
        });


        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Poetries (id INTEGER PRIMARY KEY AUTOINCREMENT,  diwan_id INTEGER NOT NULL , authorName TEXT NOT NULL , satir TEXT NOT NULL )'
            )
        });

        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Poetry (id INTEGER PRIMARY KEY AUTOINCREMENT, peotry_id INTEGER NOT NULL , satir1 TEXT  , satir2 TEXT  )')
        });

    }, [db]);




    return (

        <ImageBackground
            source={bg9} // use image
            resizeMode="cover"
            style={styles.page}>

            <StatusBar
                barStyle='dark-content' //'dark-content'
                hidden={true}
            />

            <View style={styles.logo}>
                <Image
                    source={logo}
                    resizeMode='cover'
                    style={{ width: 90, height: 90, transform: [{ translateX: 10 }] }}
                    blurRadius={0}
                />
                <Text style={styles.name}> أشعاري </Text>
            </View>

            <View style={styles.progress}>
                <Progress.Bar color='#fff' progress={progress} width={200} height={13} />
            </View>


        </ImageBackground>
    )
}


const styles = StyleSheet.create({

    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#8080ff",



    },

    progress: {
        position: 'absolute',
        bottom: 150,

        color: 'red'
    },

    logo: {

        flex: 1,
        top: height * 0.2,
        alignItems: "center",


    },

    name: {
        color: "#fff",
        marginTop: 10

    }





})