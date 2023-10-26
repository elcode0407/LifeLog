import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Input } from "@ui-kitten/components";
import { Feather } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useState } from "react";
function InputComp({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  style,
}) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.inputContainer, style]}>
      {/* Display the label for the input */}
      {/* <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text> */}
      {/* Render the text input field */}
      <Input
        // style={[styles.input, isInvalid && styles.inputInvalid]}
        status={isInvalid ? "danger" : "basic"}
        // keyboardType={keyboardType}
        secureTextEntry={secure && secureTextEntry}
        onChangeText={onUpdateValue}
        value={value}
        style={style}
        placeholder={label}
        accessoryRight={
          secure
            ? () => (
                <Feather
                  onPress={toggleSecureEntry}
                  size={24}
                  name={secureTextEntry ? "eye-off" : "eye"}
                />
              )
            : null
        }
      />
    </View>
  );
}

export default InputComp;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: "white",
    marginBottom: 4,
  },
  labelInvalid: {
    color: "red", // Color for invalid labels
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: "#D7DDE9",
    borderRadius: 4,
    fontSize: 16,
  },
  inputInvalid: {
    backgroundColor: "#bfe9fc", // Background color for invalid inputs
  },
});
