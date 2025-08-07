import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Alert, Image, View , Text ,Dimensions} from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";



const CustomDrawerContent = (props) => {

    
    const [currentuser, SetCurrentUser] = useState();
    useEffect(() => {
       const fetchUsers = async () => {
         let current_user = JSON.parse(await AsyncStorage.getItem('@current_user'));
         // We have data!!
         if (current_user != undefined) {
           SetCurrentUser(current_user)
        
         }
        }
        fetchUsers()
    }
    ,[])
         
               
            

    const Logout= async() =>
        {
         await AsyncStorage.setItem('@current_user',JSON.stringify([]));
          Alert.alert("Bye :(")
          router.push('/')
      
        }
        if(currentuser != undefined){
        if(currentuser.admin)
            {
                return(
                    <DrawerContentScrollView {...props}>


<Image style={{width:150,height:150}} source={require('./app_icon.png')}></Image>
         
         <DrawerItem
             label={"Menu"}
             onPress={() => { router.push('/DrawerDir/(tabs)'); }}
             icon={({ color, size }) => (<Feather name="menu"  size={24} color={color}  /> )}
             />
         
         <DrawerItem
             label={"Profile"}
             onPress={() => { router.push('/DrawerDir/Profile'); }}
             icon={({ color, size }) => (<Feather name="user" size={24} color={color} />)}
             />
             
     
                
        
              <DrawerItem
             label={"History"}
             onPress={() => { router.push('/DrawerDir/History'); }} 
             icon={({ color, size }) => (<Feather name="rotate-cw" size={24} color={color} />)}
             />
              <DrawerItem
             label={"Contact Us"}
             onPress={() => { router.push('/DrawerDir/Contact_Us'); }} 
             icon={({ color, size }) => (<Feather name="send" size={24} color={color} />)}
             />
             <Text>{"\n\n\n\n\n"}</Text>
              <DrawerItem
             label={"Sign Out"}
             onPress={Logout} 
             icon={({ color, size }) => (<Feather name="log-out" size={24} color={color} />)}
             />


                    
                    <DrawerItem
        label={"AddItem"}
        onPress={() => { router.push('/DrawerDir/AddItem'); }}
        icon={({ color, size }) => (<Feather name="plus-square" size={24} color={color} />)}       
    />
      </DrawerContentScrollView>
                )
            }}

    

    return (
    
        <DrawerContentScrollView {...props}>

            <Image style={{width:150,height:150}} source={require('./app_icon.png')}></Image>
         
            <DrawerItem
                label={"Menu"}
                onPress={() => { router.push('/DrawerDir/(tabs)'); }}
                icon={({ color, size }) => (<Feather name="menu"  size={24} color={color}  /> )}
                />
            
            <DrawerItem
                label={"Profile"}
                onPress={() => { router.push('/DrawerDir/Profile'); }}
                icon={({ color, size }) => (<Feather name="user" size={24} color={color} />)}
                />
                
        
                   
           
                 <DrawerItem
                label={"History"}
                onPress={() => { router.push('/DrawerDir/History'); }} 
                icon={({ color, size }) => (<Feather name="rotate-cw" size={24} color={color} />)}
                />
                 <DrawerItem
                label={"Contact Us"}
                onPress={() => { router.push('/DrawerDir/Contact_Us'); }} 
                icon={({ color, size }) => (<Feather name="send" size={24} color={color} />)}
                />
                <Text>{"\n\n\n\n\n"}</Text>
                 <DrawerItem
                label={"Sign Out"}
                onPress={Logout} 
                icon={({ color, size }) => (<Feather name="log-out" size={24} color={color} />)}
                />
                      <DrawerItem
        label={"AddItem"}
        onPress={() => { router.push('/DrawerDir/AddItem'); }}
        icon={({ color, size }) => (<Feather name="plus-square" size={24} color={color} />)}       
    />




        </DrawerContentScrollView>
    );
}



export default function DrawerLayout() {
    const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

    



    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={props => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: true,
                    headerTintColor: 'black',
                    headerStyle: { backgroundColor: 'red' },
                    
                    

                }}>


                  <Drawer.Screen
                    name="(tabs)"
                    options={{
                        
                        headerTitle:(({ color, size }) => (<Image style={{width: 80,height:80, marginTop: -30 }} source={require('./app_icon.png')} />)),

                        headerShown: true
                        
                    }}


                />


<Drawer.Screen
                    name="Profile"
                    options={{
                        title: 'Profile',

                        headerShown: true
                    }}


                />


<Drawer.Screen
                    name="AddItem"
                    options={{
                        title: 'Add Item',

                        headerShown: true
                    }}


                />
                <Drawer.Screen
                    name="Contact_Us"
                    options={{
                        title: 'Contact Us',

                        headerShown: true
                    }}


                />
                <Drawer.Screen
                    name="History"
                    options={{
                        title: 'History',

                        headerShown: true
                    }}


                />


                </Drawer>
                
                </GestureHandlerRootView>
    );}
