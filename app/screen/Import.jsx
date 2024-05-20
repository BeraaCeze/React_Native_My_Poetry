import { View, Text, StyleSheet, Pressable, Alert, Dimensions, Image, ActivityIndicator, BackHandler, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { logo, poetry, backG } from "../../constant/constant"

import * as Sharing from "expo-sharing";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { DB_NAME } from "@env"

const { width, height } = Dimensions.get("window")

export default function Import() {

  const [db, setDb] = useState(SQLite.openDatabase(DB_NAME));

  const [isLoading, setIsLoading] = useState(false); // appeare when data is loading



  const importDb = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });
    // console.warn( );

    if (result.canceled !== true) {


      if (result.assets[0].mimeType == "application/octet-stream" && result.assets[0].name) {

        isLoadingFun(true)
        if (
          !(
            await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")
          ).exists
        ) {
          await FileSystem.makeDirectoryAsync(
            FileSystem.documentDirectory + "SQLite"
          );
        }

        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.writeAsStringAsync(
          FileSystem.documentDirectory + "SQLite/poetryDB.db",
          base64,
          { encoding: FileSystem.EncodingType.Base64 }
        );
        await db.closeAsync();
        setDb(SQLite.openDatabase("poetryDB.db"));
      }
      isLoadingFun(false)

      const timerId = setTimeout(() => {
        Alert.alert("Warn! ", "Please Restart The Application To Load The Data", [
          { text: "OK", onPress: () => { BackHandler.exitApp() } },
        ]);
      }, 1000);

    } else {
      Alert.alert("Warn! ", "Importing Data Canceled ");
    }
  };




  useEffect(() => {

    isLoadingFun(true)
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
    isLoadingFun(false)


  }, [db]);



  const isLoadingFun = (state) => {
    setIsLoading(state);
    if (isLoading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <ActivityIndicator
            size="large"
            hidesWhenStopped={false}
            animating={true}
            color="#00ADEF"
          />
        </View>
      );
    } else {
      return '';
    }
  }




  return (
    <View style={styles.page}>

      <StatusBar
        barStyle='light-content' //'dark-content'
        animated={true}
        backgroundColor='#000'
      />

      <View style={styles.header}>
        <View style={styles.imageBg}>

          <Image source={logo}
            style={styles.image}
          />

        </View>
        <Text style={styles.text1}>مرحبا بكم في تطبيق أشعاري</Text>
      </View>

      <View style={styles.main} >
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.text1} > من أجل إضافة قاعدة البيانات الخاصة بك بشكل ناجح  </Text>
          <Text style={styles.text1} > أولا يجب عليك الضغط على الزر أدناه و اختيار قاعدة البيانات المراد إضافتها  </Text>
          <Text style={[styles.text1, { marginBottom: 30 }]} >ثانيا عليك إغلاق التطبيق وإعادة فتحه</Text>
        </View>


        <View >
          <Pressable onPress={() => importDb()} style={styles.btn} >
            <Text style={{ color: "#eee" }} >اضف قاعدة البيانات الخاصة بك</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.text1}>اتمنى أن ينال تطبيقي اعجابكم</Text>
        <Text style={styles.text1}>دمتم في رعاية الله</Text>

      </View>


    </View>
  )
}


const styles = StyleSheet.create({

  page: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },

  header: {

    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },

  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    textAlign: "center"
  },

  footer: {
    alignItems: "center",
    justifyContent: "center",
  },

  text1: {
    color: "#666",
    marginBottom: 10,
    textAlign: "center"
  },

  btn: {
    backgroundColor: "#66b3ff",
    padding: 10,
    borderRadius: 14,
    bottom: 20,

  },

  imageBg: {

    backgroundColor: '#66b3ff',
    borderRadius: width * 0.5,
    width: width * 0.25,
    height: width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20

  },

  image: {
    width: width * 0.15,
    height: width * 0.15,
  },

})