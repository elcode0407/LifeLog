import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

function LoadingOverlay({ message }) {
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.rootContainer}>
        {/* Display a message, if provided */}
        <MaterialCommunityIcons name="notebook-edit" size={160} color="white" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            width: 70,
            marginTop: 10,
            color: "white",
          }}
        >
          LifeLog
        </Text>

        {/* Show an activity indicator with a large size */}
        <ActivityIndicator
          color={"white"}
          size="large"
          style={{ marginTop: 200 }}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
    </>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1, // Flex to occupy the entire screen
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    padding: 32, // Padding around the content
    backgroundColor: "black", // Background
  },
  message: {
    fontSize: 16, // Font size for the message text
    marginBottom: 12, // Margin bottom for spacing
    color: "white",
  },
});
