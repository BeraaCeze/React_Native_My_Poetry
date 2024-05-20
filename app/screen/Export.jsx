import { View, Text, StyleSheet, Pressable, Alert, Dimensions, Image, ActivityIndicator, Platform , StatusBar } from 'react-native'
import React, { useState } from 'react'
import { logo, poetry, backG } from "../../constant/constant"
import { DB_NAME } from "@env"
import * as Sharing from "expo-sharing";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
// import * as DocumentPicker from "expo-document-picker";

const { width, height } = Dimensions.get("window")

export default function Export() {

  const [db, setDb] = useState(SQLite.openDatabase(DB_NAME));
  const [isLoading, setIsLoading] = useState(false);

  const exportDb = async () => {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + "SQLite/poetryDB.db",    // my database name
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          "poetryDB.db",               // what my database will save
          "application/octet-stream"
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));

        Alert.alert("Success ", "Data Exported Successfully ");
      } else {
        console.log("Permission not granted");
        Alert.alert("Warn! ", "Exporting Data Canceled ");
      }
    } else {
      await Sharing.shareAsync(
        FileSystem.documentDirectory + "SQLite/poetryDB.db"  // it's in ios
      );
    }
  };

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
  }

  // const importDB = () => {

  //   Alert.alert("add")
  // }

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
          <Text style={styles.text1} > من أجل تصدير قاعدة البيانات الخاصة بك لأجل استخدامها لاحقا مرة اخرة </Text>
          <Text style={[styles.text1, { marginBottom: 30 }]} > فقط عليك الضغط على الزر أدناه وتحديد المكان المراد حفظ قاعدة البيانات فيه </Text>
        </View>


        <View >
          <Pressable onPress={exportDb} style={styles.btn} >
            <Text style={{ color: "#eee" }} >تصدير قاعدة البيانات الخاصة بك</Text>
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