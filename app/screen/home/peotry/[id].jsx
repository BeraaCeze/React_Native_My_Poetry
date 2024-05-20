import { View, Text, StyleSheet, Dimensions, Pressable, Alert, Modal, ScrollView, TextInput, RefreshControl, ImageBackground , StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { DB_NAME } from "@env"

import { bg9 } from "../../../../constant/constant"


const { width, height } = Dimensions.get("window")

export default function peo() {

  // SQLite database connection

  const [db, setDb] = useState(SQLite.openDatabase(DB_NAME));

  //  refresh variable
  const [refreshing, setRefreshing] = React.useState(false);


  //  router and parameters
  const router = useRouter();
  const params = useLocalSearchParams(); // get parameters

  //  show modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  const [deleteId, setDeleteId] = useState(0)

  // input data

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [text4, setText4] = useState("");
  const [text5, setText5] = useState("");
  const [text6, setText6] = useState("");
  const [author, setAuthor] = useState("");

  const [peotryId, setPeotryId] = useState(0);


  //  waiting variable
  const [isLoading, setIsLoading] = useState(true); // appeare when data is loading

  //  array for store data
  const [poetriesData, setPoetriesData] = useState([]); // names array for get all Peotries from database to display it

  //  waiting function
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

  const showData = () => {
    return (
      <>
        {poetriesData.map((item) => {

          return (
            <Pressable key={item.id} onLongPress={() => { setModalDeleteVisible(true); dlId(item.id) }}
              onPress={() => {
                router.push({
                  pathname: `/screen/home/peotry/peoText/[id]`,
                  params: { id: item.id, name: item.authorName }
                })
              }} style={styles.card}>
              <Text style={styles.author}> {item.authorName}</Text>
              <View style={styles.peoCard} >
                <Text style={styles.peoText1} >  {item.satir} .... </Text>
              </View>
            </Pressable>
          )
        })}
      </>
    )
  }
  const addPoetry = () => {
    if (author.length == 0 || text1.length == 0) {
      Alert.alert('Warning!', 'Please write your data.')
    } else {

      try {
        // console.warn(text1) ;

        db.transaction((tx) => {
          tx.executeSql("INSERT INTO Poetries (diwan_id,authorName,satir) values (?,?,?);", [params.id, author, text1],
            (txObj, resultSet) => {

              let resId = resultSet.insertId;

              let existingNames = [...poetriesData]; existingNames.push({
                id: resultSet.insertId,
                diwan_id: params.id,
                authorName: author,
                satir: text1
              });
              setPoetriesData(existingNames);


              try {
                db.transaction(tx => {
                  tx.executeSql('INSERT INTO Poetry ( peotry_id , satir1 , satir2) values (? , ? , ? )',
                    [resId, text1, text2],
                    (txObj, resultSet) => {

                    },
                    (txObj, error) => console.log(error));
                });
              }
              catch (error) { console.log(error); }

              try {
                db.transaction(tx => {
                  tx.executeSql('INSERT INTO Poetry ( peotry_id , satir1 , satir2) values (? , ? , ? )',
                    [resId, text3, text4],
                    (txObj, resultSet) => {

                    },
                    (txObj, error) => console.log(error));
                });
              }
              catch (error) { console.log(error); }

              try {
                db.transaction(tx => {
                  tx.executeSql('INSERT INTO Poetry ( peotry_id , satir1 , satir2) values (? , ? , ? )',
                    [resId, text5, text6],
                    (txObj, resultSet) => {
                      Alert.alert("Successfuly!", "Added Successfuly");

                    },
                    (txObj, error) => console.log(error));
                });
              }
              catch (error) { console.log(error); }

              setModalVisible(false);
              setAuthor("")
              setText1("")
              setText2("")
              setText3("")
              setText4("")
              setText5("")
              setText6("")


            },
            (txObj, error) => console.warn(error)
          );
        });


      } catch (error) {
        console.log(error);
      }
    }
  }


  const deletePoerty = (id) => {

    try {
      db.transaction(tx => {
        tx.executeSql('DELETE FROM Poetries WHERE id = ?', [id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {

              let existingNames = [...poetriesData].filter((name) => name.id !== id);
              setPoetriesData(existingNames);

              Alert.alert("Successfuly!", "Poetry Deleted Successfuly");
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



  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Poetries (id INTEGER PRIMARY KEY AUTOINCREMENT,  diwan_id INTEGER NOT NULL , authorName TEXT NOT NULL , satir TEXT NOT NULL )'
      )
    });



    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Poetry (id INTEGER PRIMARY KEY AUTOINCREMENT, peotry_id INTEGER NOT NULL , satir1 TEXT  , satir2 TEXT  )')
    });

    db.transaction(tx => {
      // get all data in names table and push it names variable
      tx.executeSql('SELECT * FROM Poetries WHERE diwan_id = ?', [params.id],
        (txObj, resultSet) => setPoetriesData(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
    setIsLoading(false);
  }, [db, params.id, refreshing])


  function dlId(id) {

    setDeleteId(id)
    setModalDeleteVisible(true)
  }

  // refresh page 

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);


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
      <Text style={{ margin: 20, color: "#fff" }}> الاشعار </Text>


      <Pressable onPress={() => { setModalVisible(true) }} style={{ position: "absolute", right: width * 0.05, marginTop: 15, }} >
        <Ionicons name="add-circle-outline" size={30} color="#fff" />
      </Pressable>

      <Pressable onPress={() => { router.back() }} style={{ position: "absolute", top: 20, left: 10 }} >
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
      </Pressable>

      <ScrollView
        style={{}}
        fadingEdgeLength={20}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {showData()}
      </ScrollView>


      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}

      >

        <View style={styles.centeredView}>

          <View style={styles.modalView}>
            <Text style={styles.modalText}> اكتب شعرك</Text>
            <TextInput
              style={styles.input}
              onChangeText={(author) => { setAuthor(author) }}
              value={author}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder='اسم المولف'

            />
            <TextInput
              style={styles.input}

              // (currentDiwan) => {
              // setCurrentDiwan(currentDiwan.trimStart())

              onChangeText={(text1) => { setText1(text1) }}
              value={text1}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الاول'

            />
            <TextInput
              style={styles.input}
              onChangeText={(text2) => { setText2(text2) }}
              value={text2}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الثاني'
            />
            <TextInput
              style={styles.input}
              onChangeText={(text3) => { setText3(text3) }}
              value={text3}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الثالث'
            />
            <TextInput
              style={styles.input}
              onChangeText={(text4) => { setText4(text4) }}
              value={text4}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الرابع'
            />
            <TextInput
              style={styles.input}
              onChangeText={(text5) => { setText5(text5) }}
              value={text5}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر الخامس'
            />
            <TextInput
              style={styles.input}
              onChangeText={(text6) => { setText6(text6) }}
              value={text6}
              textAlign="center"
              autoCapitalize={'none'}
              placeholder=' الشطر السادس'
            />

            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => { addPoetry() }}>
              <Text style={styles.textStyle}>حفظ</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign name="closecircleo" size={30} color="#fff" />
            </Pressable>
          </View>
        </View>

      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDeleteVisible}
      >
        <View style={styles.dltCenteredView}>
          <View style={[styles.dltModalView, { height: width * 0.4, }]}>
            <Text style={styles.dltModalText}>هل انت متأكد من انك تريد حذف هذا الشعر </Text>
            <Pressable
              style={[styles.dltButton, styles.dltButtonClose]}
              onPress={() => setModalDeleteVisible(!modalDeleteVisible)}>
              <AntDesign name="closecircleo" size={25} color="#fff" />
            </Pressable>
            <Pressable
              style={[styles.dltButton, styles.dltButtonOpen]}
              onPress={() => { deletePoerty(deleteId) }}
            >
              <Text style={styles.dltTextStyle}>حذف</Text>
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

    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    margin: 10,
    padding: 15


  },
  peoCard: {
    width: width * 0.9,
    // paddingHorizontal: 10,
    paddingBottom: 10,


  },

  peoText1: {
    textAlign: "center",
    color: "#fff",
  },


  author: {
    color: "#fff",
    padding: 10,
    textAlign: "center",

  },
  // add  modal
  centeredView: {
    flex: 1,
    marginTop: height * 0.05,
    position: "absolute"
  },
  modalView: {
    margin: 20,
    alignItems: 'center',

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
    height: height * 0.7,
    justifyContent: 'center',

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
    top: 0,
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
    position: "absolute",
    top: 0,
    marginTop: height * 0.05,
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

  //  delete modal 

  dltCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dltModalView: {
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
    width: width * 0.7,
    height: width * 0.5,
    justifyContent: 'center',

  },
  dltButton: {
    borderRadius: 20,
    elevation: 2,
  },
  dltButtonOpen: {
    backgroundColor: '#4d79ff',
  },
  dltButtonClose: {
    backgroundColor: '#ff471a',
    position: "absolute",
    right: 0,
    top: 0,

  },
  dltTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: width * 0.3,
    padding: 10,
  },
  dltModalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  dltInput: {
    margin: 10,
    borderWidth: 0.5,
    padding: 1,
    width: width * 0.55,
    borderRadius: 14,
    marginBottom: 20

  },

})