import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ref, remove, set } from "firebase/database";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import auth, { database } from "../firebase/firebase";
import { addFavorite, removeFavorite, updateFavorite } from "../redux/logs";

export default function Note({ item }) {
  const [pressed, setPressed] = useState(false);
  const data = useSelector(
    (state) => state.lifeLog.database?.userCategories[item.category_id]
  );
  const num = useSelector(
    (state) => state.lifeLog.database?.userNotes[item.id]?.favorite
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  function addToFavorite() {
    if (num === 0) {
      dispatch(addFavorite({ id: item.id, idValue: item.id }));
      set(
        ref(
          database,
          `favorites/${auth.currentUser.uid}/userFavorites/${item.id}`
        ),
        item.id
      );
      dispatch(updateFavorite({ id: item.id, num: 1 }));
      set(
        ref(
          database,
          `notes/${auth.currentUser.uid}/userNotes/${item.id}/favorite`
        ),
        1
      );
    } else {
      dispatch(removeFavorite({ id: item.id }));
      remove(
        ref(
          database,
          `favorites/${auth.currentUser.uid}/userFavorites/${item.id}`
        )
      );
      dispatch(updateFavorite({ id: item.id, num: 0 }));
      set(
        ref(
          database,
          `notes/${auth.currentUser.uid}/userNotes/${item.id}/favorite`
        ),
        0
      );
    }
  }
  return (
    <Pressable
      onLongPress={() =>
        pressed === true ? setPressed(false) : setPressed(true)
      }
      onPress={() => {
        navigation.navigate("EditNote", {
          id: item.id,
        });
      }}
      style={[styles.container, { backgroundColor: data.bColor }]}
    >
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>{item.header}</Text>
          <MaterialIcons
            name={item.favorite === 0 ? "favorite-outline" : "favorite"}
            size={24}
            color="black"
            onPress={addToFavorite}
          />
        </View>
        {pressed && (
          <View style={styles.details}>
            <Text style={styles.detailsText}>{item.details}</Text>
          </View>
        )}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{item.category}</Text>
          <Text style={styles.footerText}>{item.date.split("T")[0]}</Text>
        </View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginTop: 10,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 17,
    color: "#7d7d7d",
    marginTop: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 19,
    marginBottom: 20,
  },
});
