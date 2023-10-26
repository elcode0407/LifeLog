import { Alert, ScrollView, Text } from "react-native";
import AuthContent from "../../components/Auth/AuthContent";
import auth, { database } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { authenticated } from "../../redux/logs";
import { useState } from "react";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { ref, set } from "firebase/database";

export default function SignUpScreen() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  async function signUp({ email, password, name }) {
    // Set loading state while signup is in progress
    setIsLoading(true);

    try {
      // Create a user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the signed-in user
      const user = userCredential.user;
      console.log(user.uid);
      await set(ref(database, `${user.uid}/`), {
        userData: {
          name: name,
        },
      });

      // Dispatch user authentication action
      dispatch(authenticated({ token: user.uid }));
    } catch (error) {
      // Handle any errors that occur during signup
      const errorCode = error.code;
      const errorMessage = error.message;

      // Set loading state back to false
      setIsLoading(false);

      // Show an alert with the error message
      Alert.alert("Authentication failed!", errorMessage);
    }
  }
  return isLoading ? (
    <LoadingOverlay />
  ) : (
    <ScrollView>
      <AuthContent onAuthenticate={signUp} />
    </ScrollView>
  );
}
