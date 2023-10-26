import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";

import { useNavigation } from "@react-navigation/native";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  // State to track invalid credentials and input errors
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    name: false,
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  // Handler for switching authentication mode (login or signup)
  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("SignupScreen"); // Switch to signup mode
    } else {
      navigation.replace("LoginScreen"); // Switch to login mode
    }
  }

  // Handler for submitting the authentication form
  function submitHandler(credentials) {
    let { email, name, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    // Check the validity of email and password length
    const nameIsValid = name > 15;
    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    // If invalid data is entered, display an error message
    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      // Set state to track errors
      setCredentialsInvalid({
        name: !nameIsValid,
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password, name });
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? "Create a new user" : "Log in instead"}
        </FlatButton>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "black",
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
