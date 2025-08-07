import { Tabs } from 'expo-router';
import React from 'react'
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'red', headerShown: false, headerShown : false , }}>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Menu',
                tabBarIcon: ({ color }) => <Feather size={24} name="menu" color={color !== color ? '#00e7ff' : color} />
              }}/>
                <Tabs.Screen
              name="CartPage"
              options={{
                title: 'Cart',
                tabBarIcon: ({ color }) => <Feather size={24} name="shopping-cart" color={color !== color ? '#00e7ff' : color} />
              }}/>


          
            </Tabs>
  )
}
