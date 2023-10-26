import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function IconButton({ icon, color, size, onPress }) {
  return (
    <Pressable
      // Style for the button, with an opacity change when pressed
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      {/* Render an Ionicons icon */}
      <Ionicons name={icon} color={color} size={size} />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  button: {
    margin: 8, // Margin around the button
    borderRadius: 20, // Border radius for a circular appearance
  },
  pressed: {
    opacity: 0.7, // Opacity change when button is pressed
  },
});
