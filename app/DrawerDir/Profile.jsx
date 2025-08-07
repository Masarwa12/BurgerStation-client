
import React, { useState , useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView ,ImageBackground,Alert} from 'react-native';


export default function Profile() {
  const [users,SetUsers]=useState({}) 
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [current_user,setCurrent_User] = useState();
  const NameRegex = new RegExp("^[A-Za-z\s'-]{5,}$")
  useEffect (()=>
    {
      const fetchUsers = async () => {
        let user = JSON.parse(await AsyncStorage.getItem('@current_user')); 
        setCurrent_User(user);
        let allusers = JSON.parse(await AsyncStorage.getItem('@users'));
        SetUsers(allusers)
        setFirstName(user.name)
         setEmail(user.email)
         setLastName(user.lastname)
        

        }
        fetchUsers()
    },[]);
  

  const toggleEditMode = async() => {
    if (editMode) {
    if (!firstName || firstName.trim() === '') {
          Alert.alert("The First Name Is Empty!!!");
          
          return;
        } else if (!NameRegex.test(firstName)) {
          Alert.alert("Wrong First Name Format!!!");
          
          return;
        }
       
    
        if (!lastName || lastName.trim() === '') {
          Alert.alert("The Last Name Is Empty!!!");
         
          return;
        }else if (!NameRegex.test(lastName)) {
          Alert.alert("Wrong Last Name Format!!!");
          
          return;
    
        }
        users.find((i)=>{
          if(i.email === email)
            {
              i.name = firstName
              i.lastname = lastName
              return i 
            }
        })
        const user={
          name:firstName,
          lastname : lastName,
          email: email,
          password:current_user.password,
          admin:current_user.admin

                     
        }
        console.log(user)
        await AsyncStorage.setItem('@users', JSON.stringify(users));
        await AsyncStorage.setItem('@current_user',JSON.stringify(user));

    
      // Save changes here if needed
      //console.log('Saved:', { firstName, lastName, email });
    }
    setEditMode(!editMode);
  };
  
  return (
    <ImageBackground source={require('./background.png')} style={styles.container}>
      

      <View style={styles.card}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={[styles.input, !editMode && styles.disabledInput]}
          value={firstName}
          onChangeText={setFirstName}
          editable={editMode}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={[styles.input, !editMode && styles.disabledInput]}
          value={lastName}
          onChangeText={setLastName}
          editable={editMode}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input,  styles.disabledInput]}
          value={email}
          onChangeText={setEmail}
          editable={false}
          keyboardType="email-address"
        />

        <TouchableOpacity onPress={toggleEditMode} style={styles.button}>
          <Text style={styles.buttonText}>{editMode ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop:150,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    color: '#666',
    fontSize: 14,
    marginTop: 12,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  disabledInput: {
    color: '#999',
  },
  button: {
    marginTop: 30,
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});