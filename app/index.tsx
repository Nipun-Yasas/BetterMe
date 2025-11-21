import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello World</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
