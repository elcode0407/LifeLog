import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import auth, { database } from "../../firebase/firebase";
import { Database, push, ref, set } from "firebase/database";

export default function AddFABButton({ category, category_id }) {
  const navigation = useNavigation();

  return (
    <FAB
      color="white"
      style={styles.fab}
      customSize={60}
      icon="plus"
      onPress={() =>
        navigation.navigate("AddNote", {
          initialCategory: category,
          initialCategoryId: category_id,
        })
      }
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 30,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    borderRadius: 100,
  },
});
