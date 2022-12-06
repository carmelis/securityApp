import React, { useState, useEffect } from "react";
import axios from "axios";
// import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from "expo-location";
import { URLBase } from "../../url/variable";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar } from "@rneui/themed";
import {Alert, Modal, StyleSheet,Text,Pressable, View, Button, Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardTrabajo from "../../Commons/CardTrabajo";
import userEvent from "../../store/event";

const fecha = new Date().toISOString();
const Fichaje = ({ navigation }) => {
  const [text, setText] = useState(fecha);
  const [textSalida, setTextSalida] = useState(fecha);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [botonEntrada, setBotonEntrada] = useState(false);
  const [botonSalida, setBotonSalida] = useState(false);
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const event = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [evento, setEvento] = useState([
    {
      id: "",
      date: "",
      time_in: "",
      position_in_latitude: "",
      position_in_longitude: "",
      time_out: "",
      position_out_latitude: "",
      position_out_longitude: "",
      branchId: 1,
      guardId: 1,
      shiftId: 1,
      branch: {
        fulladdress: "",
        coordinates: "",
        id: "",
        name: "",
        street: "",
        number: "",
        city: "",
        province: "",
        postalcode: "",
        latitude: "",
        longitude: "",
        active: "",
        createdAt: "",
        updatedAt: "",
        clientId: "",
      },
      shift: {
        id: "",
        type: "",
        start: "",
        end: "",
        createdAt: "",
        updatedAt: "",
      },
    },
  ]);
const [modalVisibleSalida, setModalVisibleSalida] = useState(false);
const [modalVisible, setModalVisible] = useState(false);

const fecha = new Date().toISOString();
const fechaEvento =(parseInt(fecha.slice(0,10).split("-").join("")))

  useEffect(() => {
    URLBase.get(`/events/byDate/${fechaEvento}/${user.id}`).then((res) => setEvento(res.data))
  }, []);

  const handleOnPress = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let locacion = await Location.getCurrentPositionAsync({});
      const update = await URLBase.put(`/events/checkin/1`, {
        time_in: locacion.timestamp,
        position_in_latitude: locacion.coords.latitude,
        position_in_longitude: locacion.coords.longitude,
      });
      const horario = locacion.timestamp;
      const fecha = new Date(horario);
      setHoraEntrada(
        `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`
      );
    })();
    setBotonEntrada(true);
    setModalVisible(!modalVisible)
  };

  const handleOnPressSalida = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let locacion = await Location.getCurrentPositionAsync({});
      const update = await URLBase.put(`/events/checkout/1`, {
        time_out: locacion.timestamp,
        position_out_latitude: locacion.coords.latitude,
        position_out_longitude: locacion.coords.longitude,
      });
      const horario = locacion.timestamp;
      const fecha = new Date(horario);
      setHoraSalida(
        `${fecha.getHours()}: ${fecha.getMinutes()}: ${fecha.getSeconds()}`
      );
    })();
    setBotonSalida(true);
    setModalVisibleSalida(!modalVisible)
  };

  return (

    <View style={styles.container}>
    {
      evento?.length ? (<View style={styles.container}>
        <CardTrabajo evento={evento}/>
        {botonEntrada ? (<Text style={{ fontWeight: "bold", fontSize: 20, marginTop:5 }}> Su hora de entrada es: {horaEntrada} </Text> ) : null}
      <View style={{justifyContent:"center", alignItems:"center", marginTop:5}}>
            <Avatar
            size={130}
            rounded
            icon={{ name: 'login', type: 'MaterialIcons' }}
            containerStyle={{ backgroundColor: 'green' }}
            />
              <Text style={{fontSize:20, fontWeight:"bold"}}>{evento[0].shift.start} </Text>
        <View style={{ margin: 20 }}>
          {!botonEntrada ? ( <Button title="Ingrese la hora de entrada" onPress={() => setModalVisible(!modalVisible)} /> ) : null}
        </View>
        {botonSalida ? (<Text style={{ fontWeight: "bold", fontSize: 20, marginTop:5 }}> Su hora de salida es: {horaSalida} </Text>) : null}
      </View >
            <Avatar
            size={130}
            rounded
            icon={{ name: 'logout', type: 'MaterialIcons' }}
            containerStyle={{ backgroundColor: 'red' }}
            />
              <Text style={{fontSize:20, fontWeight:"bold"}}>{evento[0].shift.end} </Text>
        <View style={{ margin: 20 }}>
          {!botonSalida ? (<Button title="Ingrese la hora de salida" onPress={() => setModalVisibleSalida(!modalVisibleSalida)} /> ) : null} 
      <View/>
      </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  ¿Deseas confirmar el horario de entrada?
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={handleOnPress}
                >
                  <Text style={styles.textStyle}>Aceptar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleSalida}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  ¿Deseas confirmar el horario de salida?
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={handleOnPressSalida}
                >
                  <Text style={styles.textStyle}>Aceptar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisibleSalida(!modalVisibleSalida)}
                >
                  <Text style={styles.textStyle}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </View>): null
     }
</View>
 

 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "50%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    margin: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width:150,
  },
  modalText: {
    marginBottom: 15,

  },
});

export default Fichaje;




     {/* <MapView 
      style={styles.map} initialRegion={{
      latitude: latitud,
      longitude: longitud,
    }} >
      <Marker
      coordinate={{latitude: latitud, longitude: longitud}}
      title="Usted esta aquí"
      ></Marker>
      </MapView> */}