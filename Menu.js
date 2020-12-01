import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Dashboard from './Dashboard'
const Drawer = createDrawerNavigator()
function Menu() {
    useEffect(() => {
        console.log('menu')
    }, [])
    return (
        <View>
            <Text>Menu</Text>
        </View>
        // <Drawer.Navigator>
        //     {/* <Drawer.Screen name="Dashboard" component={Dashboard}></Drawer.Screen> */}
        // </Drawer.Navigator>
    )
}

export default Menu

