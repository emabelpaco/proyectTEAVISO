import React, { useContext, useState } from "react";
import { View, Text, Image, TextInput, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import Context from "../../context/Context"
import { signIn, signUp } from "../../utils/firebase";
export default function SignIn() {
  const navigation = useNavigation()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signUp");
  const {
    theme: { colors },
  } = useContext(Context);

  async function handlePress() {
      await signIn(email, password);
  }
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#bfe4f9"
      }}
    >
      <Text
        style={{ color: colors.foreground, fontSize: 30, marginBottom: 40, fontWeight: "bold" }}
      >
        Bienvenido a TEAviso
      </Text>
      <Image
        source={require("../../assets/logo.png")}
        style={{ width: 180, height: 180 }}
        resizeMode="cover"
      />
      <View style={{ marginTop: 20 }}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            alignSelf:"center",
            width: 250,
          }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            alignSelf:"center",
            width: 250,
            marginTop: 20,
          }}
        />
        <View style={{ margin: 10 }}>
          <Button
            title="Login"
            disabled={!password || !email}
            color={colors.secondary}
            buttonStyle={styles.btnLogin}
            onPress={handlePress}
          />
        </View>
            <Button
                title="Iniciar Sesión con Google"
                buttonStyle={styles.btnGoogle}
                titleStyle={styles.btnText}
                onPress={() => console.log("Iniciar con google")}
                icon={
                  <Icon
                    name="google"
                    size={20}
                    color="white"
                  />
                }
            />
            <Button
                title="Iniciar Sesión con Facebook"
                buttonStyle={styles.btnFacebook}
                titleStyle={styles.btnText}
                onPress={() => console.log("Iniciar con facebook")}
                icon={
                  <Icon
                    name="facebook"
                    size={20}
                    color="white"
                  />
                }
            />
        <TouchableOpacity
          style={{ marginTop: 15 }}
        >
          <Text 
            style={styles.register}
            onPress={() => navigation.navigate("register")}
            >
            ¿Aún no tienes una Cuenta? 
            <Text style={styles.btnRegister}> Regístrate </Text>
          </Text>
          <Text 
            style={styles.register}
            >
            ¿Olvidaste tu contraseña?{" "}
            <Text style={styles.btnRegister}>Recupérala</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    image: {
        height: 150,
        width: "100%",
        marginBottom: 5,
        marginTop: 100,
    },
    container: {
        marginHorizontal: 40
    },
    divider: {
        backgroundColor: "#4cb4eb",
        margin: 40
    },
    register: {
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center"
    },
    btnRegister: {
        color: "#4cb4eb",
        fontWeight: "bold"
    },
    btnLogin: {
      backgroundColor: "#4cb4eb"
    },
    btnGoogle: {
        margin:10,
        backgroundColor: "#4cb4eb"
    },
    btnFacebook: {
        margin:10,
        backgroundColor: "#4cb4eb"
    },
    btnText: {
        marginLeft: 15
    }
})