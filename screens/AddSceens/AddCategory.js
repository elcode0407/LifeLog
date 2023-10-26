import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Text } from "react-native-paper";
import InputComp from "../../components/Auth/Input";
import { useState } from "react";
import { Select, SelectItem } from "@ui-kitten/components/ui";
import DropDownPicker from "react-native-dropdown-picker";
import Button from "../../components/ui/Button";
import { Alert } from "react-native";
import { push, ref, set } from "firebase/database";
import auth, { database } from "../../firebase/firebase";
import { useDispatch } from "react-redux";
import { addCategory } from "../../redux/logs";

export default function AddCategory({ navigation }) {
  const useSelectState = (initialState = undefined) => {
    const [selectedIndex, setSelectedIndex] = useState(initialState);
    return { selectedIndex, onSelect: setSelectedIndex };
  };
  const [touched, setTouched] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Blue", value: "blue" },
    { label: "Orange", value: "orange" },
    { label: "Purple", value: "purple" },
    { label: "Green", value: "green" },
  ]);

  const [isInvalid, setIsInvalid] = useState(false);
  const [name, setName] = useState("");

  const colorPalate = {
    blue: {
      bColor: "#f6faff",
      color: "#428bfa",
    },
    orange: {
      bColor: "#fef9ed",
      color: "#ffc545",
    },
    purple: {
      bColor: "#fbe8ff",
      color: "#e86aff",
    },
    green: {
      bColor: "#ecffee",
      color: "#54d25d",
    },
  };
  const dispatch = useDispatch();
  function submit() {
    const color = value;
    const cName = name > 15;
    if (cName) {
      Alert.alert(
        "Please enter a valid Name",
        "Name must be at must 15 characters"
      );
      setIsInvalid(!isInvalid);
      return;
    }
    const newCategoryRef = push(
      ref(database, `categories/${auth.currentUser.uid}/userCategories`)
    );

    // Добавляем данные в новую запись
    const newCategoryData = {
      bColor: colorPalate[value].bColor,
      categoryName: name,
      color: colorPalate[value].color,
      date: new Date().toISOString(),
      notesNum: 0,
      id: newCategoryRef.key,
      user_id: auth.currentUser.uid,
    };
    dispatch(
      addCategory({
        uid: newCategoryRef.key,
        data: newCategoryData,
      })
    );
    set(newCategoryRef, newCategoryData)
      .then(() => {
        console.log("Заметка успешно добавлена в базу данных.");
        navigation.navigate("CategoryScreen");
      })
      .catch((error) => {
        console.error("Ошибка при добавлении заметки: ", error);
      });
  }
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add New Category</Text>
        <View>
          <InputComp
            onUpdateValue={(text) => {
              setName(text);
            }}
            keyboardType={"default"}
            isInvalid={isInvalid}
            label={"Name Of Category"}
            value={name}
          />

          <DropDownPicker
            placeholder="Select Color of Category"
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={{ marginTop: 15 }}
            onPress={() => {
              touched === true ? setTouched(false) : setTouched(true);
            }}
            onClose={() => {
              setTouched(false);
            }}
            onOpen={() => {
              setTouched(true);
            }}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          {!touched && <Button onPress={submit}>Submit</Button>}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "black",
    paddingVertical: 30,
    paddingHorizontal: 40,
    margin: 15,
    borderRadius: 10,
  },
  title: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
});
