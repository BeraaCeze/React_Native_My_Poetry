import { View, Text, StyleSheet, Dimensions, Pressable, Alert, TextInput, Modal, ScrollView, ImageBackground , StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, FontAwesome6, AntDesign } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { bg6, bg9 } from "../../../../../constant/constant"
import { DB_NAME } from "@env"


const { width, height } = Dimensions.get("window")

export default function peo() {

  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams(); // get parameters

  //  variable

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [text4, setText4] = useState("");
  const [text5, setText5] = useState("");
  const [text6, setText6] = useState("");

  const [db, setDb] = useState(SQLite.openDatabase(DB_NAME));

  const [isLoading, setIsLoading] = useState(true);

  const [peotries, setPeotries] = useState([]); // 
  const [updateId, setUpdateId] = useState([]); // 


  const [render, setRender] = useState(true); // 




  const isLoadingFun = () => {
    if (isLoading) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text>Loading names...</Text>
        </View>
      );
    } else {
      return '';
    }
  }


  const showModal = () => {
    setModalVisible(true);
    setText1(peotries[0].satir1)
    setText2(peotries[0].satir2)
    setText3(peotries[1].satir1)
    setText4(peotries[1].satir2)
    setText5(peotries[2].satir1)
    setText6(peotries[2].satir2)
  }

  const editData = (id) => {

    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM  Poetry  WHERE peotry_id = ?',
          [id],
          (txObj, resultSet) => {
            let idOne = resultSet.rows._array[0];
            let idTwo = resultSet.rows._array[1];
            let idThree = resultSet.rows._array[2];


            try {
              db.transaction(tx => {
                tx.executeSql('UPDATE Poetries SET satir = ?  WHERE id = ? ',
                  [text1, id],
                  (txObj, resultSet) => {

                  },
                  (txObj, error) => console.log(error));
              });
            }
            catch (error) { console.log(error); }

            //  updating first row
            try {
              db.transaction(tx => {
                tx.executeSql('UPDATE Poetry SET satir1 = ? , satir2 = ? WHERE id = ? ',
                  [text1, text2, idOne.id],
                  (txObj, resultSet) => {


                    let existingNames = [...peotries];
                    const indexToUpdate = existingNames.findIndex(name => name.id === idOne.id);
                    existingNames[indexToUpdate].satir1 = text1;
                    existingNames[indexToUpdate].satir2 = text2;

                    setPeotries(existingNames);

                  },
                  (txObj, error) => console.log(error));
              });
            }
            catch (error) { console.log(error); }


            //  updating second row
            try {
              db.transaction(tx => {
                tx.executeSql('UPDATE Poetry SET satir1 = ? , satir2 = ? WHERE id = ? ',
                  [text3, text4, idTwo.id],
                  (txObj, resultSet) => {


                    let existingNames = [...peotries];
                    const indexToUpdate = existingNames.findIndex(name => name.id === idTwo.id);
                    existingNames[indexToUpdate].satir1 = text3;
                    existingNames[indexToUpdate].satir2 = text4;

                    setPeotries(existingNames);


                  },
                  (txObj, error) => console.log(error));
              });
            }
            catch (error) { console.log(error); }



            //  updating third row
            try {
              db.transaction(tx => {
                tx.executeSql('UPDATE Poetry SET satir1 = ? , satir2 = ? WHERE id = ? ',
                  [text5, text6, idThree.id],
                  (txObj, resultSet) => {


                    let existingNames = [...peotries];
                    const indexToUpdate = existingNames.findIndex(name => name.id === idThree.id);
                    existingNames[indexToUpdate].satir1 = text5;
                    existingNames[indexToUpdate].satir2 = text6;

                    setPeotries(existingNames);

                    Alert.alert("Successfuly!", "Updated Successfuly");
                    setModalVisible(false);

                    setText1("")
                    setText2("")
                    setText3("")
                    setText4("")
                    setText5("")
                    setText6("")

                  },
                  (txObj, error) => console.log(error));
              });
            }
            catch (error) { console.log(error); }




          },
          (txObj, error) => console.log(error));
      });
    }
    catch (error) { console.log(error); }

  }

  const showData = () => {
    return (
      <>
        {peotries.map((item) => {
          return (
            <View key={item.id} style={styles.peoCard} >
              <Text style={styles.peoText1} > {item.satir1} </Text>
              <Text style={styles.peoText2} > {item.satir2} </Text>
            </View>
          )
        })}
      </>
    )
  }

  useEffect(() => {


    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Poetry (id INTEGER PRIMARY KEY AUTOINCREMENT, peotry_id INTEGER NOT NULL , satir1 TEXT  , satir2 TEXT  )')
    });

    db.transaction(tx => {
      // get all data in names table and push it names variable
      tx.executeSql(`SELECT * FROM Poetry WHERE peotry_id = ? ;`, [params.id],
        (txObj, resultSet) => {
          setPeotries(resultSet.rows._array);

        },
        (txObj, error) => console.log(error)
      );
    });
    // if done set IsLoading = false ( finish loading )
    setIsLoading(false);
  }, [db, params.id]);



  return (
    <ImageBackground
      source={bg9} // use image
      resizeMode="cover"
      style={styles.page}>


      <StatusBar
        barStyle='light-content' //'dark-content'
        animated={true}
        backgroundColor='#000'
      />
      <Text style={{ margin: 20, color: "#fff" }}> الشعر </Text>


      <Pressable onPress={() => { showModal() }} style={{ position: "absolute", right: width * 0.05, marginTop: 20, }} >
        <FontAwesome6 name="edit" size={22} color="#fff" />
      </Pressable>

      <Pressable onPress={() => { router.back() }} style={{ position: "absolute", top: 20, left: 10 }} >
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
      </Pressable>

      <ScrollView
        style={{}}
        fadingEdgeLength={20}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.author}> {params.name}  </Text>

          {showData()}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}> تحديث الشعرك</Text>

            <TextInput
              style={styles.input}
              onChangeText={(text1) => setText1(text1)}
              value={text1}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الاول'

            />
            <TextInput
              style={styles.input}
              onChangeText={(text2) => setText2(text2)}

              value={text2}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الثاني'
            />
            <TextInput
              style={styles.input}
              onChangeText={(text3) => setText3(text3)}

              value={text3}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الثالث'
            />
            <TextInput
              style={styles.input}
              onChangeText={(text4) => setText4(text4)}

              value={text4}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الرابع'
            />
            <TextInput
              style={styles.input}
              onChangeText={(text5) => setText5(text5)}

              value={text5}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الخامس'
            />
            <TextInput
              style={styles.input}
              onChangeText={(text6) => setText6(text6)}

              value={text6}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر السادس'
            />

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign name="closecircleo" size={30} color="#fff" />
            </Pressable>


            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => { editData(params.id) }}
            >
              <Text style={styles.textStyle}>تحديث</Text>
            </Pressable>

          </View>
        </View>
      </Modal>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({

  page: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#eee",
  },

  card: {

    // backgroundColor: "#66b3ff",
    borderRadius: 14,
    margin: 10,

  },
  peoCard: {
    width: width * 0.9,
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingBottom: 40,

  },

  peoText1: {

    color: "#fff",
  },

  peoText2: {
    position: "absolute",
    left: 10,
    top: 40,
    color: "#fff",

  },

  author: {
    color: "#fff",
    textAlign: "center",
    paddingTop: 10,

  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9,
    height: height * 0.5
  },
  button: {
    borderRadius: 20,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#4d79ff',
    position: "absolute",
    bottom: 20,
  },
  buttonClose: {
    backgroundColor: '#ff471a',
    position: "absolute",
    right: 0,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: 70,
    padding: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  input: {
    margin: 5,
    borderWidth: 0.5,
    padding: 1,
    width: width * 0.8,
    borderRadius: 14,
    marginBottom: 10

  },



})