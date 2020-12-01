import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated'
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import MainStack from './MainStack';

const Drawer = createDrawerNavigator();

export default ({ style }) => {
    const [progress, setProgress] = React.useState(new Animated.Value(0))
    const scale = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.8]
    })
    const borderRadius = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [0, 10]
    })
    const screenStyles = { borderRadius, transform: [{ scale }] }
    return (
        <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>

            <Drawer.Navigator
                drawerType="slide"
                overlayColor="transparent"
                drawerStyle={{ width: '50%' }}
                drawerContentOptions={{
                    activeBackgroundColor: 'transparent', activeTintColor: 'green', inactiveTintColor: 'green'
                }}
                sceneContainerStyle={{ backgroundColor: 'black' }}
                drawerContent={props => {
                    setProgress(props.progress)
                    return <CustomDrawerComp {...props} />
                }}>
                <Drawer.Screen name="MainStack" >
                    {props => <MainStack {...props} style={screenStyles} />}
                </Drawer.Screen>
            </Drawer.Navigator >
        </Animated.View>
    );
};

export const CustomDrawerComp = (props) => {
    const { navigation } = props;

    return (
        <DrawerContentScrollView  {...props} >
            <View style={{ flexGrow: 2 }} >
                < DrawerItem
                    label="Home"
                    onPress={() => navigation.navigate('HomeScreen')}
                />
            </View >
        </DrawerContentScrollView >
    );
};
