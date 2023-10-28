import { FlatList, Text, View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Note from "../../components/Note";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { ref, remove } from "firebase/database";
import { removeCategory, removeNote } from "../../redux/logs";
import auth, { database } from "../../firebase/firebase";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import AddFABButton from "../../components/ui/AddFABButton";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { removeNoteToCategory, updateSum } from "../../redux/logs";
import { set, update } from "firebase/database";
import { Pressable } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

export default function CategoryNotes({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(false);
  const notes2 = useSelector((state) => state.lifeLog.database?.userNotes);
  const sum = useSelector((state) => state.lifeLog.database?.userCategories);

  const categories = useSelector(
    (state) => state.lifeLog.database?.userCategories
  );
  console.log(categories[route.params.id]);
  const dispatch = useDispatch();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.name,
      headerRight: () => (
        <MaterialCommunityIcons
          name="delete"
          size={24}
          color="red"
          style={{ marginLeft: 120 }}
          onPress={() => {
            Alert.alert(
              "Warning",
              "Do you want to delete this category?\nThis will delete all notes that belong to this category",
              [
                {
                  text: "Cancel",
                  onPress: () => {
                    // Действие при отмене
                    console.log("Действие отменено");
                  },
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: async () => {
                    // Действие при подтверждении
                    setIsLoading(true);
                    remove(
                      ref(
                        database,
                        `categories/${auth.currentUser.uid}/userCategories/${route.params.id}`
                      )
                    );
                    !!categories[route.params.id]?.notes &&
                      Object.keys(categories[route.params.id]?.notes).forEach(
                        (noteId) => {
                          dispatch(removeNote({ id: noteId }));
                          remove(
                            ref(
                              database,
                              `notes/${auth.currentUser.uid}/userNotes/${noteId}`
                            )
                          );
                        }
                      );
                    dispatch(removeCategory({ id: route.params.id }));
                    navigation.navigate("CategoryScreen");
                  },
                },
              ],
              { cancelable: false } // Это предотвращает закрытие алерта при нажатии вне него
            );
          }}
        />
      ),
    });
  }, []);
  // function renderItem({ item }) {
  //   const item2 = notes2[item.replace(/\s/g, "")];
  //   console.log(item);
  //   return <Note item={item2} />;
  // }
  const renderItem = (data, rowMap) => {
    const item2 = notes2[data.item.replace(/\s/g, "")];
    console.log(data.item);
    return <Note item={item2} />;
  };
  const renderHiddenItem = (data, rowMap) => {
    const item2 = notes2[data.item.replace(/\s/g, "")];
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
              const initialSum = sum[item2.category_id].notesNum;
              dispatch(removeNote({ id: item2.id }));
              remove(
                ref(
                  database,
                  `notes/${auth.currentUser.uid}/userNotes/${item2.id}/`
                )
              );
              dispatch(
                removeNoteToCategory({
                  id: item2.category_id,
                  idN: item2.id,
                })
              );
              remove(
                ref(
                  database,
                  `categories/${auth.currentUser.uid}/userCategories/${item2.category_id}/notes/${item2.id}`
                )
              );
              set(
                ref(
                  database,
                  `categories/${auth.currentUser.uid}/userCategories/${item2.category_id}/notesNum`
                ),
                initialSum - 1
              );
              dispatch(
                updateSum({ sum: initialSum - 1, id: item2.category_id })
              );
            }}
          />
        </Pressable>
      </LinearGradient>
    );
  };
  if (isLoading) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10 }}>
          List Notes
        </Text>
        {!!categories[route.params.id]?.notes ? (
          <SwipeListView
            data={Object.values(categories[route.params.id]?.notes)}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
          />
        ) : (
          <Text style={{ fontSize: 18, textAlign: "center", marginTop: 20 }}>
            No Notes
          </Text>
        )}
        <AddFABButton
          category={route.params.name}
          category_id={route.params.id}
        />
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
