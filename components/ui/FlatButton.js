import { Pressable, StyleSheet, Text, View } from "react-native";

function FlatButton({ children, onPress }) {
  return (
    <Pressable
      // Style for the button, with an opacity change when pressed
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        {/* Text inside the flat button */}
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.7, // Opacity change when button is pressed
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff", // Text color
  },
});
