import React, { useEffect } from 'react'
import { View, Text } from 'react-native'

const LeaderBoard = () => {
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            ls.save('selectedDrawerItem', 'leaderBoard');

        });
        return unsubscribe;
    }, [navigation])

    return (
        <View>
            <Text></Text>
        </View>
    )
}

export default LeaderBoard
