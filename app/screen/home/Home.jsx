import { View, Text, StyleSheet, TextInput, Image, ScrollView, Modal, Dimensions, Pressable, Alert, ImageBackground, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Link, router, useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { DB_NAME } from "@env"


import { bg6, icon, bg9 } from "../../../constant/constant"


const { width, height } = Dimensions.get("window")

export default function Home() {
  const [db, setDb] = useState(SQLite.openDatabase(DB_NAME));


  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);


  const [isLoading, setIsLoading] = useState(true); // appeare when data is loading
  const [Diwans, setDiwans] = useState([]); // names array for get all names from database to display it
  const [currentDiwan, setCurrentDiwan] = useState(''); // currentName for input to add it to database

  const [deleteId, setDeleteId] = useState(0)



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


  function dlId(id) {

    setDeleteId(id)
    setModalDeleteVisible(true)
  }

  const addDiwan = () => {
    if (currentDiwan.length == 0) {
      Alert.alert('Warning!', 'Please write your data.')
    } else {
      try {
        db.transaction(tx => {
          tx.executeSql("INSERT INTO Diwans (name) values (?)", [currentDiwan],
            (txObj, resultSet) => {
              let existingNames = [...Diwans];
              existingNames.push({ id: resultSet.insertId, name: currentDiwan });
              setDiwans(existingNames);

              Alert.alert("Successfuly!", "Diwan Added Successfuly");
              setCurrentDiwan('');
              setModalVisible(!modalVisible);

            },
            (txObj, error) => console.log(error)
          );

        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const deleteDiwan = (id) => {
    // console.warn(id)

    try {
      db.transaction(tx => {
        tx.executeSql("DELETE FROM Diwans WHERE id = ?", [id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingNames = [...Diwans].filter(Diwan => Diwan.id != id);
              setDiwans(existingNames);

              Alert.alert("Successfuly!", "Diwan Deleted Successfuly");
              setModalDeleteVisible(false)
            }
          },
          (txObj, error) => console.log(error)
        );
      });


    } catch (error) {
      console.log(error);
    }
  };

  const showData = () => {
    return (
      <>
        {Diwans.map((item) => {
          return (
            <Pressable style={[styles.card,]} key={item.id} onLongPress={() => { dlId(item.id) }}
              onPress={() => { router.push(`/screen/home/peotry/${item.id}`) }} >
              <Image
                style={styles.image}
                source={icon}
              />
              <Text style={{ color: "#fff", transform: [{ translateY: -30 }], }}>
                {item.name}
              </Text>
            </Pressable>
          )
        })}
      </>
    )
  }



  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Diwans (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
    });

    db.transaction(tx => {
      // get all data in Diwans table and push it names variable
      tx.executeSql('SELECT * FROM Diwans', null,
        (txObj, resultSet) => setDiwans(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
    setIsLoading(false);
  }, [db])




  return (

    <>
      <ImageBackground
        source={bg9} // use image
        resizeMode="cover"
        style={styles.page} >

        <StatusBar
          barStyle='light-content' //'dark-content'
          animated={true}
          backgroundColor='#000'
        />
        <Pressable onPress={() => { setModalVisible(true) }} style={{ position: "absolute", right: width * 0.05, marginTop: 15, }} >
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </Pressable>

        <Text style={{ margin: 20, color: "#fff" }}> الدواوين </Text>
        <ScrollView
          style={{}}
          fadingEdgeLength={20}
          showsVerticalScrollIndicator={false}
        >
          <View style={{
            paddingTop: 20, flexDirection: "row",
            flexWrap: "wrap", rowGap: width * 0.05, bottom: 20,

          }}>
            {showData()}
          </View>

        </ScrollView>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>اضف ديوان</Text>
              <TextInput
                style={styles.input}
                value={currentDiwan}
                onChangeText={(currentDiwan) => {
                  setCurrentDiwan(currentDiwan.trimStart())
                }}
                textAlign="center"
                autoCapitalize={'none'}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}

                onPress={() => { setModalVisible(!modalVisible); setCurrentDiwan(''); }}>
                <AntDesign name="closecircleo" size={25} color="#fff" />
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => addDiwan()}>
                <Text style={styles.textStyle}>حفظ</Text>
              </Pressable>

            </View>
          </View>
        </Modal>



        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDeleteVisible}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { height: width * 0.4, }]}>
              <Text style={styles.modalText}>هل انت متأكد من انك تريد حذف هذا الديوان </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalDeleteVisible(!modalDeleteVisible)}>
                <AntDesign name="closecircleo" size={25} color="#fff" />
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => deleteDiwan(deleteId)}
              >
                <Text style={styles.textStyle}>حذف</Text>
              </Pressable>

            </View>
          </View>
        </Modal>

      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({

  page: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#eee",
  },

  card: {
    border: 1,
    backgroundColor: " rgba(255,255,255,0.3)",
    height: width * 0.4,
    width: width * 0.4,

    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },

  image: {
    width: width * 0.4,
    height: width * 0.4,
    margin: "auto"

  },
  //  modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    backgroundColor: 'rgba(255,255,255,1)',
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
    width: width * 0.7,
    height: width * 0.5,
    justifyContent: 'center',

  },
  button: {
    borderRadius: 20,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#4d79ff',
  },
  buttonClose: {
    backgroundColor: '#ff471a',
    position: "absolute",
    right: 0,
    top: 0,

  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: width * 0.3,
    padding: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  input: {
    margin: 10,
    borderWidth: 0.5,
    padding: 1,
    width: width * 0.55,
    borderRadius: 14,
    marginBottom: 20

  },

})