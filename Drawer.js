import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import Dashboard from './Dashboard'
import Messages from './Messages'
import { createStackNavigator } from '@react-navigation/stack'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { styles } from 'expo-ui-kit'
const Drawer = createDrawerNavigator();
const Filter = createDrawerNavigator();
const Stack = createStackNavigator();

const Screens = ({ navigation, style }) => {
    return (
        <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
            <Stack.Navigator screenOptions={{
                headerTransparent: true, headerTitle: null,
                headerLeft: () => (
                    <Button title="MENU" onPress={() => { navigation.openDrawer() }}>
                    </Button>
                )
            }}>
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Messages" component={Messages} />
            </Stack.Navigator>

        </Animated.View >
    );
}
const DrawerContent = props => {
    return (
        <DrawerContentScrollView {...props} >
            <DrawerItem
                label="Dashboard"
                onPress={() => props.navigation.navigate('Dashboard')}
            />
            <DrawerItem
                label="Messages"
                onPress={() => props.navigation.navigate('Messages')}
            />
        </DrawerContentScrollView>

    )
}
export default () => {


    const [progress, setProgress] = React.useState(new Animated.Value(0))
    // console.log(progress)
    const scale = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.8]
    })
    const borderRadius = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [0, 10]
    })
    const screenStyles = { borderRadius, transform: [{ scale }] }
    // if (value == '1') {
    return (
        // <View>
        <Drawer.Navigator
            // drawerPosition="right"
            drawerType="slide"
            overlayColor="transparent"
            drawerStyle={{ width: '50%' }}
            drawerContentOptions={{
                activeBackgroundColor: 'transparent', activeTintColor: 'green', inactiveTintColor: 'green'
            }}
            sceneContainerStyle={{ backgroundColor: 'black' }}
            initialRouteName="Dashboard" drawerContent={props => {
                setProgress(props.progress)
                return <DrawerContent {...props} />
            }}>
            <Drawer.Screen name="Screens"  >
                {props => <Screens {...props} style={screenStyles} />}
            </Drawer.Screen>
        </Drawer.Navigator>

        // </View >
    )
}

{/* <Filter.Navigator
                drawerPosition="right"
                drawerType="slide"
                overlayColor="transparent"
                drawerStyle={{ width: '50%' }}
                drawerContentOptions={{
                    activeBackgroundColor: 'transparent', activeTintColor: 'green', inactiveTintColor: 'green'
                }}
                sceneContainerStyle={{ backgroundColor: 'black' }}
                initialRouteName="Dashboard"
           
            >
                        <Filter.Screen  >

                <Text>Hello </Text>
            </Filter.Screen>
            </Filter.Navigator> */}

