import { FlatList, Text, View, StyleSheet } from "react-native";
import AddFABButton from "../components/ui/AddFABButton";
import { useDispatch, useSelector } from "react-redux";
import Category from "../components/Category";
import Note from "../components/Note";
import { SwipeListView } from "react-native-swipe-list-view";
import { useState } from "react";
import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { removeNote, removeNoteToCategory, updateSum } from "../redux/logs";
import { ref, remove, set, update } from "firebase/database";
import auth, { database } from "../firebase/firebase";

export default function Notes() {
  const data = useSelector((state) => state.lifeLog.database?.userNotes);
  const sum = useSelector((state) => state.lifeLog.database?.userCategories);

  const dispatch = useDispatch();

  console.log(!!data);
  const renderItem = (data, rowMap) => {
    return <Note item={data.item} />;
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <LinearGradient
        colors={["white", "red"]}
        start={{ x: 0.2, y: 0.5 }} // Изменено значение x на 0
        end={{ x: 0.9, y: 0.5 }}
        style={[styles.container2]}
      >
        <Pressable>
          <MaterialIcons
            name="delete"
            size={28}
            color="white"
            style={{ marginLeft: 120 }}
            onPress={() => {
              const initialSum = sum[data.item.category_id].notesNum;
              dispatch(removeNote({ id: data.item.id }));
              remove(
                ref(
                  database,
                  `notes/${auth.currentUser.uid}/userNotes/${data.item.id}/`
                )
              );
              dispatch(
                removeNoteToCategory({
                  id: data.item.category_id,
                  idN: data.item.id,
                })
              );
              remove(
                ref(
                  database,
                  `categories/${auth.currentUser.uid}/userCategories/${data.item.category_id}/notes/${data.item.id}`
                )
              );
              set(
                ref(
                  database,
                  `categories/${auth.currentUser.uid}/userCategories/${data.item.category_id}/notesNum`
                ),
                initialSum - 1
              );
              dispatch(
                updateSum({ sum: initialSum - 1, id: data.item.category_id })
              );
            }}
          />
        </Pressable>
      </LinearGradient>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10 }}>
          List Notes
        </Text>
        {!!data ? (
          <SwipeListView
            data={Object.values(data)}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
          />
        ) : (
          <Text style={{ fontSize: 18, textAlign: "center", marginTop: 20 }}>
            No Notes
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  container2: {
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginTop: 13,
    width: "50%",
    marginLeft: "48%",
    height: "90%",
    justifyContent: "center",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
