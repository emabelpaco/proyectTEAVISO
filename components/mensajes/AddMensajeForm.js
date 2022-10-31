import React, {useEffect, useReducer, useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions, FlatList, Text, TouchableOpacity } from "react-native";
import { Button, Input, Image, Overlay, Icon } from "react-native-elements";
import { map, size, isEmpty } from 'lodash';
import { uploadImage } from "../../utils/actions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Voice from '@react-native-voice/voice';
import OptionsMenu from "react-native-option-menu";
import SelectList from 'react-native-dropdown-select-list'
import Loading from '../../components/Loading'
import firebase from "firebase/compat/app";
import uuid from 'random-uuid-v4';
import axios from 'axios'

const widthScreen = Dimensions.get("window").width
const MoreIcon = require("../../assets/optionsV.png");

export default function AddMensajeForm(route) {
    const [user, setUser] = useState(null)
    //console.log("a ver que hay conj categorias  ", route.navigation.params.conjCategorias)
    //console.log("a ver que hay mensajes:  ", route.navigation.params.mensajes[0].mensajes[0].imagenes)
    useEffect(() => {
        setListCategorias()
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(userInfo) : setUser(false)
            fetchApiGetCategorias(userInfo)
        })
    }, [])

    const fetchApiBuscarFrasePicto = async () => {
        console.log("fetch api por frase - pictogramas")//192.168.0.116
        try {
            const res = await axios.get('http://192.168.0.116:3000/api/users/searchFrasePictograma', {params: {mensaje: formData.name}})
            setearPictogramas(res.data)
        } catch (error){
            console.log(error)
        }
    }

    const fetchApiBuscarPalabraPicto = async () => {
        console.log("fetch api por palabra - pictogramas")
        try {
            const res = await axios.get('http://192.168.0.116:3000/api/users/searchFrasePictograma', {params: {mensaje: inputBusqueda}})
            setearPictogramaRespuesta(res.data)
        } catch (error){
            console.log(error)
        }
    }
    

    const setearPictogramas = (data) => {
        const urlImage = "http://hypatia.fdi.ucm.es/conversor/Pictos/"
        const arrayData = data.data
        var dataPicto = []
        var numImage;
        var textImage;
        var index = 0;
        arrayData.forEach(element => {
            var arrayImages = element.split('[').pop().split(']')[0];
            var bodyImage = {}
            numImage = arrayImages.split(',')[0];
            textImage = element.substring(element.indexOf(']') + 2);
            bodyImage.image = urlImage + numImage;
            bodyImage.text = textImage;
            bodyImage.idImagen = index; 
            index = index + 1;
            dataPicto.push(bodyImage)
        });
        setImagesSelected(dataPicto)
        setLoading(false)
    }

    const setearPictogramaRespuesta = (data) => {
        const urlImage = "http://hypatia.fdi.ucm.es/conversor/Pictos/"
        const arrayData = data.data
        var dataPicto = []
        var numImage;
        var textImage;
        var index = 0;
        arrayData.forEach(element => {
            var arrayImages = element.split('[').pop().split(']')[0];
            var bodyImage = {}
            numImage = arrayImages.substring(0,4);
            textImage = element.substring(element.indexOf(']') + 2);
            bodyImage.image = urlImage + numImage;
            bodyImage.text = textImage;
            bodyImage.idImagen = index; 
            index = index + 1;
            dataPicto.push(bodyImage)
        });
        if (busquedaRes == null) {
            setBusquedaRes(dataPicto)
        } 
        else  {
            dataPicto = busquedaRes
            dataPicto.push(bodyImage)
            setBusquedaRes(dataPicto)
        }   
        setLoading(false)
    }

    const [formData, setFormData] = useState(defaultFormValue())
    const [errorName, setErrorName] = useState(null)
    const [imagesSelected, setImagesSelected] = useState(null)
    const [inputBusqueda, setInputBusqueda] = useState(null)
    const [respuestasSelected, setRespuestasSelected] = useState(null)
    const [busquedaRes, setBusquedaRes] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleSave, setIsVisibleSave] = useState(false)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = React.useState("");
    const [categoriaSelect, setCategoriaSelect] = useState('')
    const [nuevaCategoria, setNuevaCategoria] = useState(null)
    const [dataCategorias, setDataCategorias] = useState(null)
    const [isVisibleNuevaCategoria, setIsVisibleNuevaCategoria] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const setListCategorias = async () => {
        if (dataCategorias === null) {
            const dataAux = route.navigation.params.conjCategorias
            const nuevaCatBody = {}
            nuevaCatBody.key = '1000'
            nuevaCatBody.value = '"Nueva Categoría"'
            dataAux.push(nuevaCatBody)
            setDataCategorias(dataAux)
        }
    }

    const addMensaje = async () => {
        var idMensaje = 0;
        if (selected == 1000 && nuevaCategoria == '') {
            console.log("debe ingresar el nombre de la categoria")
        }
        //setLoading(true)
        try {
            const categoriasActual = route.navigation.params.mensajes
            var dataUpdate = {}
            var dataNuevoMensaje = {}
            dataNuevoMensaje.idMensaje = "3"
            dataNuevoMensaje.nameMensaje = formData.name
            console.log("EL ARRAY DE IMAGENES A GUARDAR:   ", imagesSelected)
            dataNuevoMensaje.imagenes = imagesSelected
            var idCategoria = parseInt(categoriaSelect) - 1
            console.log("EL FOR DE CATEGORIAS ACTUAL  :   ", categoriasActual)
            categoriasActual.forEach(element => {
                if (element.idCategoria === categoriaSelect){
                    //dataUpdate = element
                    console.log("ANTES DEL PUSH  :   ", element.mensajes)
                    element.mensajes.push(dataNuevoMensaje)
                    console.log("DESPUES DEL PUSH  :   ", element.mensajes)
                    idMensaje = element.mensajes.length -1
                    console.log("ID IMAGEN  :   ", idMensaje)
                    return
                }
            });
            if (categoriaSelect == '1000' && nuevaCategoria != null) {
                var dataNuevaCategoria = {}
                dataNuevaCategoria.idCategoria = "3"
                dataNuevaCategoria.nameCategoria = nuevaCategoria
                dataNuevaCategoria.mensajes = []
                console.log("NUEVA CATE. EL PUSH  :   ", dataNuevoMensaje)
                dataNuevaCategoria.mensajes.push(dataNuevoMensaje)
                dataNuevaCategoria.imageCategoria = ""
                console.log("ANTES CATEGORIAS ACTUAL  :   ", categoriasActual)
                categoriasActual.push(dataNuevaCategoria)
                console.log("DESPUES CATEGORIAS ACTUAL  :   ", categoriasActual)
            }
            //console.log("se ejecuto el axios!!!!!!!!!!!", categoriasActual[0].mensajes[12].imagenes)
            console.log("se ejecuto el axios!!!!!!!!!!!", user.email,  idCategoria, idMensaje )
            const res = await axios.get('http://192.168.0.116:3000/api/users/saveMessajeInCategoria', {params: {email: user.email, categorias:categoriasActual, idCategoria: idCategoria, idMensaje: idMensaje}})
            console.log("RESULTADO:     ", res)
        } catch (error){
            console.log(error)
        }
        setIsVisibleSave(false)
    }

    const onBusqueda = (e) => {
        setInputBusqueda(e.nativeEvent.text);
    }

    const crearMensaje = async () => {
        setLoading(true)
        if(!validForm()) {
            setLoading(false)
            return
        }
        fetchApiBuscarFrasePicto()
    }

    const validForm = () => {
        clearErrors()
        let isValid = true

        if(isEmpty(formData.name)){
            setErrorName("Debe ingresar un mensaje.")
            isValid = false
        }
        return isValid
    }

    const clearErrors = () => {
        setErrorName(null)
    }
    const editPost = () => {
        setImagesSelected(null)
        // por el momento borrar las respuestas al cambiar el mensaje
        setRespuestasSelected(null)
    }
    const savePost = () => {
        setIsVisibleSave(!isVisibleSave)
    }
    const selectCategoria = (categoria) => {
        console.log("categoria seleccionada: ", categoria)
        setCategoriaSelect(categoria) // id de la categoria
        if (categoria == 1000) {
            setIsVisibleNuevaCategoria(true)
        } else {
            setIsVisibleNuevaCategoria(false)
        }
    }
    const onNuevaCategoria = (e) => {
        setNuevaCategoria(e.nativeEvent.text);
    }
    const addPost = () => {
        setIsVisible(!isVisible)
        setBusquedaRes(null);
    }

    const buscarPictograma = () => {
        setLoading(true)
        // validar input busqueda que no sean mas de dos palabras
        fetchApiBuscarPalabraPicto()
    }

    const confirmarRespuesta = () => {
        setInputBusqueda(null)
        setIsVisible(false)
        setBusquedaRes(null);
        if (respuestasSelected == null) {
            setRespuestasSelected(busquedaRes)
        } else {
            var data = respuestasSelected
            data.push(busquedaRes[0])
            setRespuestasSelected(data)
        } 
    }

    const cancelarRespuesta = () => {
        setInputBusqueda(null)
        setBusquedaRes(null);
        setIsVisible(false);
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <Loading isVisible={loading} text="Cargando..."/>
            { imagesSelected ? (
                <View>
                    <OptionsMenu
                        button={MoreIcon}
                        buttonStyle={{ width: 70, height: 26, marginTop: 15, resizeMode: "contain", margin: 7.5}}
                        destructiveIndex={1}
                        options={["Editar", "Guardar", "Agregar respuesta", "Cancelar"]}
                        actions={[editPost, savePost, addPost]}
                    />
                    <UploadImagePicto
                        imagesSelected={imagesSelected}
                        setImagesSelected={setImagesSelected}
                    />
                    { respuestasSelected ? (
                        <View>
                            <View>
                            <Text style={styles.textOpciones}>Opciones</Text>
                            <TouchableOpacity
                                onPress={() => addPost()}
                                style={{
                                    position: "absolute",
                                    right: 20,
                                    margin:-10,
                                    bottom: 20,
                                    borderRadius: 60,
                                    width: 45,
                                    height: 45,
                                    backgroundColor: "#4cb4eb",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="plus"
                                    size={30}
                                    color="white"
                                    style={{ transform: [{ scaleX: -1 }] }}
                                />
                            </TouchableOpacity>
                            </View>
                            <UploadRespuestasImagePicto
                                respuestasSelected={respuestasSelected}
                                setRespuestasSelected={setRespuestasSelected}
                            />
                        </View>
                    ) : (
                        <View></View>
                    )}
                    <Overlay
                        isVisible={isVisible}
                        onBackdropPress={addPost}
                        windowBackgroundColor="rgba(255, 255, 255, .5)"
                        overlayBackgroundColor="black"
                        overlayStyle={styles.overlay}
                        width="auto"
                        height="auto"
                    >
                        {
                            busquedaRes ? (
                                <Image
                                source={{uri: busquedaRes[0].image}}
                                style={{
                                    width: 120,
                                    height: 160,
                                    borderWidth: 2,
                                    borderColor: "black",
                                    resizeMode: "contain",
                                    margin: 20,
                                }}
                                />
                            ):(<Text></Text>)
                        }
                        <Input
                            placeholder="Busqueda de un pictograma"
                            onChange={(e) => onBusqueda(e)}
                        />
                        {
                            busquedaRes ? (
                                <View style={styles.alternativeLayoutButtonContainer}>
                                    <Button
                                    title="Aceptar"
                                    onPress={confirmarRespuesta}
                                    buttonStyle={styles.btnAddMensaje}
                                    />
                                    <Button
                                    title="Cancelar"
                                    type="outline"
                                    onPress={cancelarRespuesta}
                                    buttonStyle={styles.btnCancelarMensaje}
                                    />
                                </View>
                            ):(
                                <View style={styles.alternativeLayoutButtonContainer}>
                                    <Button
                                    title="Buscar"
                                    onPress={buscarPictograma}
                                    buttonStyle={styles.btnAddMensaje}
                                    />
                                    <Button
                                    title="Cancelar"
                                    type="outline"
                                    onPress={cancelarRespuesta}
                                    buttonStyle={styles.btnCancelarMensaje}
                                    />
                                </View>
                            )
                        }
                        
                    </Overlay>
                    <Overlay
                        isVisible={isVisibleSave}
                        onBackdropPress={savePost}
                        //overlayStyle={styles.overlay}
                        width="auto"
                        height="auto"
                    >
                        <View>
                        <Text style={{ fontWeight: 'bold' }}>Seleccione una categoría existente ó la opción "Nueva Categoría"</Text>
                        <Text style={{ marginTop: 30}}>Seleccione una Categoría</Text>
                        <SelectList 
                            onSelect={() => selectCategoria(selected)}
                            setSelected={setSelected} 
                            data={dataCategorias}  
                            search={false} 
                            boxStyles={{borderRadius:0}}
                            placeholder={"Opción"}
                        />
                        { isVisibleNuevaCategoria ? (
                            <View>
                                <Input
                                    style={{ marginTop: 30}}
                                    placeholder="Ingrese nombre de categoría"
                                    onChange={(e) => onNuevaCategoria(e)}
                                />
                            </View>
                        ) : (
                            <Text></Text>
                        )
                        }
                        <Button
                            title="Guardar"
                            onPress={addMensaje}
                            buttonStyle={styles.btnAddMensaje}
                        />
                        </View>
                       
                    </Overlay>
                </View>  
            ) : (
                <View>
                    <FormAdd
                    formData={formData}
                    setFormData={setFormData}
                    errorName={errorName}
                    />
                    <Button
                    title="Crear Mensaje"
                    onPress={crearMensaje}
                    buttonStyle={styles.btnAddMensaje}
                    />
                </View>
                
            )}
        </ScrollView>
    )
}

function ImageMensaje({imageMensaje}) {
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{width: widthScreen, height: 200}}
                source={
                    imageMensaje 
                    ? {uri: imageMensaje}
                    : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImagePicto(imagesSelected, setImagesSelected) {
    return (
        <ScrollView
            style={styles.viewImage}
        >
            {
        size(imagesSelected.imagesSelected) == 0 && (
            <ImageMensaje
                imageMensaje={imagesSelected[0]}
            />
        ) 
    }
    {
        <View>
            <FlatList
                data={imagesSelected.imagesSelected}
                style={{width:"100%"}}
                key={"3"}
                numColumns={3}
                renderItem={({ item }) => (
                    <View>
                        <Image
                            source={{uri: item.image}}
                            style={{
                                width: 120,
                                height: 160,
                                borderWidth: 2,
                                borderColor: "black",
                                resizeMode: "contain",
                                margin: 6,
                            }}
                            keyExtractor={(item) => item.id}
                        />
                        <Text style={styles.textInfo}>{item.text}</Text>
                    </View>
                )}
            />
        </View>
    }
        </ScrollView>
    )
}

function UploadRespuestasImagePicto(respuestasSelected, setRespuestasSelected) {
    const [isVisibleRes, setIsVisibleRes] = useState(false)
    const [resImage, setResImage] = useState(false)
    const pressRespuesta = (data) => {
        setIsVisibleRes(true)
        setResImage(data) 
    }
    const toggleOverlay = () => {
        setIsVisibleRes(!isVisibleRes);
      };
    return (
        <ScrollView
            style={styles.viewImage}
        >
            <View>
            <FlatList
                data={respuestasSelected.respuestasSelected}
                style={{width:"100%"}}
                key={"3"}
                numColumns={3}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => pressRespuesta(item)}>
                        <View>
                        <Image
                            source={{uri: item.image}}
                            style={{
                                width: 120,
                                height: 160,
                                borderWidth: 2,
                                borderColor: "black",
                                resizeMode: "contain",
                                margin: 6,
                            }}
                            keyExtractor={(item) => item.id}
                        />
                        <Text style={styles.textInfo}>{item.text}</Text>
                    </View>
                    </TouchableOpacity> 
                )}
            />
            { resImage ? (
                <Overlay
                isVisible={isVisibleRes}
                onBackdropPress={toggleOverlay}
                >
                    <Image
                    source={{uri: resImage.image}}
                    style={{
                        width: 120,
                        height: 160,
                        borderWidth: 2,
                        borderColor: "black",
                        resizeMode: "contain",
                        margin: 20,
                    }}
                    />
                    <Text style={styles.textInfo}>{resImage.text}</Text>
                </Overlay>
            ) : 
                (<Text></Text>)
            }
        </View>
        </ScrollView>
    )
}

function FormAdd(formData, setFormData, errorName, errorDescription, errorEmail, errorAddress, errorPhone) {
    const [started, setStarted] = useState(false)

    useEffect (() => {
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners)
        }
    }, [])

    const onChange = (e, type) => {
        formData.setFormData({...formData.formData, [type]: e.nativeEvent.text})
    }

    const onSpeechResults = (result) => {
        if (result != undefined) {
            formData.setFormData({...formData.formData, ["name"]: result.value[0]})
        }
    }

    const onSpeechError = (error) => {
        console.log("Hubo un error: ", error)
    }

    const startSpeechToText = async () => {
        await Voice.start("es-AR");
        setStarted(true)
    }

    const stopSpeechToText = async () => {
        await Voice.stop();
        setStarted(false)
    }

    return (
        <View styles={styles.viewForm}>
            <Input
                style={{marginTop:200}}
                placeholder="Escribí el mensaje"
                defaultValue={formData.formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={formData.errorName}
            />
            {!started ? 
                <Icon
                    type="material-community"
                    name="microphone"
                    color="#4cb4eb"
                    reverse
                    containerStyle={styles.btnContainer}
                    onPress={startSpeechToText}
                />
                : undefined 
            } 
            {started ? 
                <Icon
                    type="material-community"
                    name="stop"
                    color="#ed6379"
                    reverse
                    containerStyle={styles.btnContainer}
                    onPress={stopSpeechToText}
                /> 
                : undefined 
            }
            
        </View>
    )
}

const defaultFormValue = () => {
    return {
        name: ""
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%",
        backgroundColor: "#d6eefb"
    },
    viewForm: {
        marginHorizontal: 10
    },
    btnAddMensaje: {
        margin: 20,
        backgroundColor: "#4cb4eb"
    },
    viewImage: {
        // flexDirection: "row",
        // marginHorizontal: 20,
        // marginTop: 30,
        // width: 400, 
        // height: 120
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    textInfo: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: "center"
    },
    textOpciones: {
        color:"#4cb4eb",
        fontWeight: 'bold',
        fontSize: 30,
        lineHeight: 70,
        marginLeft:15
        //alignSelf: "center"
    },
    overlay: {
        alignItems: "center",
        justifyContent: "center",
        height: 400,
        width: 300,
        backgroundColor: "#d6eefb"
    },
    alternativeLayoutButtonContainer: {
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnContainer: {
        position: "absolute",
        bottom: 30,
        right: 30,
        shadowColor: "black",
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 0.5
    },
    btnCancelarMensaje: {
        margin: 20,
    }
})