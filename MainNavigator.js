import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RightDrawer from './RightDrawer';
import Animated from 'react-native-reanimated'
const Stack = createStackNavigator();

export default () => {
    return (

        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="RightDrawer"
                    component={RightDrawer}
                />
            </Stack.Navigator>
        </NavigationContainer>
        // </Animated.View>
    );
};