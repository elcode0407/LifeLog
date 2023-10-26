import { Alert, ScrollView, Text } from "react-native";
import AuthContent from "../../components/Auth/AuthContent";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth, { database } from "../../firebase/firebase";
import { authenticated, setData } from "../../redux/logs";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { onValue, ref } from "firebase/database";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.lifeLog.database);

  // Function to handle user login
  async function loginHandler({ email, password }) {
    setIsLoading(true);

    // Attempt to sign in with provided email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully, get user information
        const user = userCredential.user;
        const uid = user.uid;
        console.log(user.uid);
        const dbUser = ref(database, `${uid}/`);
        const dbNotes = ref(database, `notes/${uid}/`);
        const dbCategories = ref(database, `categories/${uid}/`);
        onValue(
          dbUser,
          (snapshot) => {
            dispatch(setData({ data: snapshot.val() }));
            console.log(0);
            console.log(data);
            console.log(snapshot.val());
            onValue(
              dbNotes,
              (snapshot) => {
                dispatch(setData({ data: snapshot.val() }));
                console.log(1);
                console.log(data);
                console.log(snapshot.val());
                onValue(
                  dbCategories,
                  (snapshot) => {
                    console.log(2);
                    console.log(data);
                    console.log(snapshot.val());
                    dispatch(setData({ data: snapshot.val() }));
                    dispatch(authenticated({ token: user.uid }));
                  },
                  {
                    onlyOnce: true,
                  }
                );
              },
              {
                onlyOnce: true,
              }
            );
          },
          {
            onlyOnce: true,
          }
        );
      })
      .catch((error) => {
        // Handle authentication errors
        const errorCode = error.code;
        const errorMessage = error.message;
        setIsLoading(false);
        Alert.alert("Authentication failed!", errorMessage);
      });
  }

  // Render loading overlay while the login is in progress

  if (isLoading) {
    return <LoadingOverlay message={"Signing In"} />;
  }
  return (
    <ScrollView>
      <AuthContent onAuthenticate={loginHandler} isLogin />
    </ScrollView>
  );
}
