import { Button as BTNElm, Input } from "@rneui/base";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, ImageBackground, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const router = useRouter();
  const windowWidth = Dimensions.get("window").width;
  const apiUrl = "http://www.BurgerStation.somee.com/api/users/";

  const fetchLoginFromServer = async (Email, Password) => {
    const data = {
      Email: Email,
      Password: Password,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Accept: "application/json; charset=UTF-8",
        },
      });

      console.log("res.status=", response.status);

      if (response.status === 204) {
        Alert.alert("No Content");
        return null;
      } else if (response.status === 200) {
        const result = await response.json();
        console.log("Login success:", result);
        return result;
      } else {
        Alert.alert("Login failed");
        return null;
      }
    } catch (error) {
      console.log("fetch error:", error);
      Alert.alert("Error connecting to server");
      return null;
    }
  };

  const Login = async () => {
    if (!email) {
      Alert.alert("The Email Is Empty!!!");
      return;
    }
    if (!password) {
      Alert.alert("The Password Is Empty!!!");
      return;
    }

    const currentUser = await fetchLoginFromServer(email, password);
    
    if (!currentUser) {
      Alert.alert("Wrong login", "Email or password invalid", [
        { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      try {
        await AsyncStorage.setItem('@current_user', JSON.stringify(currentUser));
        console.log(" Current user saved:", currentUser);
        router.push("./DrawerDir/(tabs)");
      } catch (e) {
        console.error(" Failed to save user to AsyncStorage:", e);
        Alert.alert("Storage error", "Could not save user session");
      }
    }
  };

  return (
    <ImageBackground
      source={require("./background.png")}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
      }}
    >
      <Image
        source={require("./DrawerDir/app_icon.png")}
        style={{ width: 120, height: 100 }}
      />
      <View
        style={{
          width: windowWidth * 0.8,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 5,
          overflow: "hidden",
          width: 370,
          height: 470,
        }}
      >
        <Text>{"\n"}</Text>
        <Text style={{ fontSize: 40 }}>Login</Text>
        <Text>{"\n"}</Text>
        <Input
          onChangeText={(email) => SetEmail(email)}
          placeholderTextColor="gray"
          placeholder="Enter Your Email"
          leftIcon={{
            type: "font-awesome",
            name: "envelope",
            color: "red",
          }}
        />
        <Input
          onChangeText={(password) => SetPassword(password)}
          placeholderTextColor="gray"
          placeholder="Enter Your Password"
          secureTextEntry={true}
          leftIcon={{
            type: "font-awesome",
            name: "lock",
            color: "red",
          }}
        />
        <Text>{"\n"}</Text>
        <BTNElm
          radius={"sm"}
          type="solid"
          color="red"
          titleStyle={{ color: "white", fontSize: 25 }}
          title="Login"
          style={{ width: 320 }}
          onPress={Login}
        />
        <Text>{"\n"}</Text>
        <Text style={{ fontSize: 15 }}>
          Don't have an account?{" "}
          <Link
            href="./Register"
            style={{
              color: "red",
              margin: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {" "}
            Register{" "}
          </Link>
        </Text>
      </View>
    </ImageBackground>
  );
}
