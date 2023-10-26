import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "@ui-kitten/components";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Notes from "../Notes";
import FavoritesNotes from "../Favorites";
import FlatButton from "../../components/ui/FlatButton";
import { useState } from "react";
import { set } from "firebase/database";
import { FAB } from "react-native-paper";
import AddFABButton from "../../components/ui/AddFABButton";
import { useSelector } from "react-redux";
export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState(true);
  const Stack = createNativeStackNavigator();
  const data = useSelector((state) => state.lifeLog.database);

  return (
    <>
      <View style={{ backgroundColor: "white", flex: 0.3 }}>
        <View style={styles.container}>
          {!!data.userData ? (
            <Text style={styles.title}>Welcome, {data?.userData?.name} </Text>
          ) : (
            <Text style={styles.title}>
              Welcome, <ActivityIndicator color={"black"} size="small" />
            </Text>
          )}
          <View style={styles.notesContainer}>
            <Pressable
              style={notes ? styles.selected : styles.note}
              onPress={
                !notes
                  ? () => {
                      navigation.navigate("Notes");
                      setNotes(true);
                    }
                  : null
              }
            >
              <Text style={notes ? styles.selectedText : styles.noteText}>
                Notes
              </Text>
            </Pressable>
            <Pressable
              style={!notes ? styles.selected : styles.note}
              onPress={
                notes
                  ? () => {
                      navigation.navigate("FavoritesNotes");
                      setNotes(false);
                    }
                  : null
              }
            >
              <Text style={!notes ? styles.selectedText : styles.noteText}>
                Favorite Notes
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Notes" component={Notes} />
        <Stack.Screen name="FavoritesNotes" component={FavoritesNotes} />
      </Stack.Navigator>
      <AddFABButton />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: "white",
    borderTopColor: "#adaaaa",
    borderTopWidth: 1,
  },
  title: {
    fontSize: 18,
    marginTop: 20,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  notesContainer: {
    marginTop: "5%",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f4f4f4",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selected: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 15,
    elevation: 4,
    width: "50%",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  note: {
    width: "50%",
    padding: 15,
  },
  selectedText: {
    textAlign: "center",
    color: "white",
  },
  noteText: {
    textAlign: "center",
    color: "black",
  },
});
