import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Button } from "@ui-kitten/components";
import InputComp from "./Input";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  // State to manage input values
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [name, setName] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const {
    name: nameIsValid,
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  // Handler to update input values
  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "name":
        setName(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  // Handler for form submission
  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      name: name,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <View style={styles.form}>
      <View>
        {/* Render the "Name" input field if it's not a login form */}
        {!isLogin && (
          <InputComp
            label="Name"
            onUpdateValue={updateInputValueHandler.bind(this, "name")}
            value={name}
            keyboardType={"email-address"}
            isInvalid={nameIsValid}
          />
        )}
        {/* Render the "Email Address" input field */}
        <InputComp
          label="Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, "email")}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />
        {/* Render the "Confirm Email Address" input field if it's not a login form */}
        {!isLogin && (
          <InputComp
            label="Confirm Email Address"
            onUpdateValue={updateInputValueHandler.bind(this, "confirmEmail")}
            value={enteredConfirmEmail}
            keyboardType="email-address"
            isInvalid={emailsDontMatch}
          />
        )}
        {/* Render the "Password" input field */}
        <InputComp
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(this, "password")}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        {/* Render the "Confirm Password" input field if it's not a login form */}
        {!isLogin && (
          <InputComp
            label="Confirm Password"
            onUpdateValue={updateInputValueHandler.bind(
              this,
              "confirmPassword"
            )}
            secure
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}
        {/* Render the submission button */}
        <View style={styles.buttons}>
          <Button onPress={submitHandler} status="basic">
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 40,
  },
});
