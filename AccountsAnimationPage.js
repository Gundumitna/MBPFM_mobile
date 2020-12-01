import React from 'react'
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import AccountsPage from "./AccountsPage";
import AccountsSubPage from "./AccountsSubPage";
const { Value } = Animated;
export default () => {
    const y = new Value(0);
    return (
        <View style={styles.container}>
            <AccountsPage {...y} />
            <AccountsSubPage {...y} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    }
});
