import { AntDesign, Ionicons } from "@expo/vector-icons";
import { push, ref, set, update } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-native";
import { Dimensions } from "react-native";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { useDispatch, useSelector } from "react-redux";
import auth, { database } from "../../firebase/firebase";
import InputComp from "../../components/Auth/Input";
import { addNote, addNoteToCategory, updateSum } from "../../redux/logs";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AddNote({ navigation, route }) {
  const categories = useSelector(
    (state) => state.lifeLog.database.userCategories
  );
  const [open, setOpen] = useState(false);
  const [value1, setValue] = useState(null);
  const [value2, setValue2] = useState(null);

  const dispatch = useDispatch();

  const categoryOptions = Object.keys(categories).map((key) => ({
    label: categories[key].categoryName,
    value: key,
  }));
  const [items, setItems] = useState(categoryOptions);

  const richText = useRef();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <View style={{ marginHorizontal: 10 }}>
          <AntDesign
            name="checkcircleo"
            onPress={() => {
              setModalVisible(true);
            }}
            size={24}
            color={tintColor}
          />
        </View>
      ),
    });
  }, []);

  const [descHTML, setDescHTML] = useState("");
  const [showDescError, setShowDescError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [name, setName] = useState("");

  const richTextHandle = (descriptionText) => {
    if (descriptionText) {
      setShowDescError(false);
      setDescHTML(descriptionText);
    } else {
      setShowDescError(true);
      setDescHTML("");
    }
  };

  const submitContentHandle = async () => {
    const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
    const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();
    let value = null;
    if (replaceWhiteSpace.length <= 0) {
      setShowDescError(true);
      Alert.alert("Note must not be empty");
      return;
    } else {
      const cName = name > 15 || name <= 0;
      if (!!route.params?.initialCategory) {
        if (cName) {
          setIsInvalid(true);
          Alert.alert("Title or Category must not be empty");
          return;
        } else {
          console.log(route.params.initialCategoryId);
          value = {
            category: route.params?.initialCategory,
            category_id: route.params?.initialCategoryId,
          };
        }
      } else if (!!value1) {
        value = value1;
      } else if (cName || value === null) {
        setIsInvalid(true);
        Alert.alert("Title or Category must not be empty");
        return;
      }
      console.log(value);
      console.log(categories[value.category_id].notesNum);

      const sum = categories[value.category_id].notesNum + 1;
      console.log(sum);

      const newCategoryRef = push(
        ref(database, `notes/${auth.currentUser.uid}/userNotes`)
      );

      // add the new note to category
      update(
        ref(
          database,
          `categories/${auth.currentUser.uid}/userCategories/${value.category_id}/notes`
        ),
        { [newCategoryRef.key]: newCategoryRef.key }
      );
      dispatch(
        addNoteToCategory({
          id: value.category_id,
          data: {
            [newCategoryRef.key]: newCategoryRef.key,
          },
        })
      );

      // Добавляем данные в новую запись
      const newCategoryData = {
        id: newCategoryRef.key,
        category: value.category,
        category_id: value.category_id,
        date: new Date().toISOString(),
        details: replaceHTML.substring(0, 30),
        detailsHtml: descHTML,
        header: name,
        user_id: auth.currentUser.uid,
        favorite: 0,
      };

      // update sum
      dispatch(
        updateSum({
          id: value.category_id,
          sum: sum,
        })
      );
      set(
        ref(
          database,
          `categories/${auth.currentUser.uid}/userCategories/${value.category_id}/notesNum/`
        ),
        sum
      );

      // add new note
      dispatch(
        addNote({
          uid: newCategoryRef.key,
          data: newCategoryData,
        })
      );
      set(newCategoryRef, newCategoryData)
        .then(() => {
          console.log("Note успешно добавлена в базу данных.");
          !!route.params?.initialCategory
            ? navigation.goBack()
            : navigation.navigate("HomeScreen");
        })
        .catch((error) => {
          console.error("Ошибка при добавлении заметки: ", error);
        });
    }
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            richText.current?.dismissKeyboard();
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonOpen,
                    { marginLeft: 250 },
                  ]}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>X</Text>
                </Pressable>
                <InputComp
                  onUpdateValue={(text) => {
                    setName(text);
                  }}
                  keyboardType={"default"}
                  isInvalid={isInvalid}
                  label="Title"
                  style={{ width: 280 }}
                  value={name}
                />
                <DropDownPicker
                  placeholder={
                    !!route.params?.initialCategory
                      ? route.params?.initialCategory
                      : "Select Category"
                  }
                  open={open}
                  value={value2}
                  setValue={setValue2}
                  items={items}
                  setOpen={setOpen}
                  setItems={setItems}
                  style={{ marginTop: 10, marginBottom: 10 }}
                  onSelectItem={(item) => {
                    const selectedValue = item.value;
                    const selectedLabel = item.label;
                    setValue({
                      category: selectedLabel,
                      category_id: selectedValue,
                    });
                  }}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    submitContentHandle();
                    setModalVisible(!modalVisible);
                    setDisabled(true);
                  }}
                >
                  <Text style={styles.textStyle}>Add Note</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <View style={styles.richTextContainer}>
            <View style={styles.richTextEditorStyle}>
              <RichEditor
                ref={richText}
                initialContentHTML={descHTML}
                onChange={richTextHandle}
                placeholder="Write your cool content here :)"
                androidHardwareAccelerationDisabled={true}
                style={styles.richTextEditorStyle}
                initialHeight={700}
                // onHeightChange={(height) => {
                //   height > 700 && console.log("aaaa");
                // }}
                onTouchStart={() => setDisabled(false)}
                disabled={disabled}
                useContainer={false}
              />
            </View>
            <RichToolbar
              editor={richText}
              selectedIconTint="#cecece"
              iconTint="#ffffff"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.setStrikethrough,
                actions.setUnderline,
                actions.redo,
                actions.undo,
                actions.code,
              ]}
              style={styles.richTextToolbarStyle}
            />
          </View>

          {showDescError && (
            <Text style={styles.errorTextStyle}>
              Your content shouldn't be empty 🤔
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",

    alignItems: "center",

    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  headerStyle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 10,
  },

  richTextContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    width: "100%",
  },

  richTextEditorStyle: {
    shadowColor: "#000",
    width: Dimensions.get("window").width,
    height: 700,
    maxHeight: 1000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },

  richTextToolbarStyle: {
    backgroundColor: "#000000",

    height: 50,
  },

  errorTextStyle: {
    color: "#FF0000",
    marginBottom: 10,
  },

  saveButtonStyle: {
    backgroundColor: "#c6c3b3",
    borderWidth: 1,
    borderColor: "#c6c3b3",
    borderRadius: 10,
    padding: 10,
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },

  textButtonStyle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#312921",
  },
});
