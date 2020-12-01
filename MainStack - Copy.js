import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Animated from 'react-native-reanimated'
import Dashboard from './Dashboard'
import Messages from './Messages'
const Stack = createStackNavigator();

export default ({ navigation, style }) => {
    return (
        <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>

            <Stack.Navigator >
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Messages" component={Messages} />
            </ Stack.Navigator >
        </Animated.View>
    );
};

