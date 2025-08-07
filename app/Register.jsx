import { Button as BTNElm, Input } from "@rneui/base";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Image, ImageBackground, Text, View } from "react-native";
export default function Register() {
  const [email, SetEmail] = useState();
  const [password, SetPassword] = useState();
  const [firstname, SetFirstname] = useState();
  const [lastname, SetLastname] = useState();

  const [confirmpass, SetConfirmPass] = useState();

  const NameRegex = new RegExp("^[A-Za-z\s'-]{5,}$")
  const EmailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");


  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const router = useRouter();
    const apiUrl = "http://www.BurgerStation.somee.com/api/Users/register/";

 const RegisterUserToServer = async (user) => {
  console.log('Registering user:', user);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    console.log('res.status=', response.status);

    const contentType = response.headers.get('content-type');

    let result;
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text(); // Get raw text
    }

    console.log('Registration result:', result);
    return result;
  } catch (error) {
    console.log('fetch error:', error);
    return null;
  }
};


const Registertion = async () => {
    if (!firstname || !NameRegex.test(firstname)) {
      Alert.alert("Invalid First Name");
      return;
    }

    if (!lastname || !NameRegex.test(lastname)) {
      Alert.alert("Invalid Last Name");
      return;
    }

    if (!email || !EmailRegex.test(email)) {
      Alert.alert("Invalid Email");
      return;
    }

    if (!password || password.length < 8) {
      Alert.alert("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmpass) {
      Alert.alert("Passwords do not match");
      return;
    }

   const newUser = {
  FirstName: firstname,
  LastName: lastname,
  Email: email,
  Password: password,
  isAdmin: false
};



      console.log("Registering user:",  newUser);
      
    const result = await RegisterUserToServer(newUser);
    console.log("Registration result:", result);
    if (result) {
  Alert.alert(`${newUser.FirstName}, you registered successfully!`);
  router.push('/');
    } else {
      Alert.alert("Registration failed. Try again.");
    }
  };

  return (
    <ImageBackground
    source={require('./background.png')}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
      }}
    >
          <Image source={require('./DrawerDir/app_icon.png')} style={{width:120,height:100}}></Image>

      <View
        intensity={50}
        tint="dark"
        style={{
          width: windowWidth * 0.8,
          height: windowHeight * 0.8,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: 'white',
          borderRadius: 5,
          overflow: 'hidden',
          width: 370,
          height: 650,
        }}
      >
        <Text style={{ fontSize: 40 }}>Register{"\n"}</Text>
        <Input
          onChangeText={name => SetFirstname(name)}
          placeholderTextColor="gray"
          placeholder="Enter Your First Name"
          leftIcon={{ type: 'font-awesome', name: 'user', color: "red", }}
        />
        <Input
          onChangeText={name => SetLastname(name)}
          placeholderTextColor="gray"
          placeholder="Enter Your Last Name"
          leftIcon={{ type: 'font-awesome', name: 'user', color: "red", }}
        />
        <Input
          onChangeText={email => SetEmail(email)}
          placeholderTextColor="gray"
          placeholder="Enter Your Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope', color: "red", }}
        />
        <Input
          onChangeText={password => SetPassword(password)}
          placeholderTextColor="gray"
          placeholder="Enter Your Password"
          secureTextEntry={true}
          leftIcon={{ type: 'font-awesome', name: 'lock', color: "red" }}

        />
        <Input
          onChangeText={password => SetConfirmPass(password)}
          placeholderTextColor="gray"
          placeholder="Confirm Your Password"
          secureTextEntry={true}
          leftIcon={{ type: 'font-awesome', name: 'lock', color: "red" }}

        />
        <BTNElm radius={"sm"} type="solid" color="red" titleStyle={{ color: 'white', fontSize: 25, }} title="Register" style={{ width: 320, }} onPress={Registertion} />
        <Text>{"\n"}</Text>
        <Text style={{ fontSize: 15 }}>You Already have an account? {<Link href='/' style={{ color: 'red', margin: 20, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, overflow: 'hidden', textAlign: 'center' }}> Login </Link>}</Text>



      </View>

    </ImageBackground>
  );
}
