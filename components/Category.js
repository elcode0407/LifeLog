import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { StyleSheet, Text, View } from "react-native";

export default function Category({ item }) {
  console.log(item.id);
  const navigation = useNavigation();
  function onPress() {
    navigation.navigate("CategoryNotes", {
      id: item.id,
      name: item.categoryName,
    });
  }
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, { backgroundColor: item.bColor }]}>
        <View style={styles.icon}>
          <Ionicons color={item.color} name="md-folder-open" size={80} />
          <Text style={styles.iconText}>{item.categoryName}</Text>
        </View>
        <View style={styles.num}>
          <Text style={styles.numText}>{item.notesNum} Notes</Text>
        </View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingVertical: 50,
    paddingHorizontal: 45,
    alignItems: "center",
    marginTop: 10,
  },
  numText: {
    fontSize: 16,
    color: "#7d7d7d",
    fontWeight: "bold",
    width: 65,
    marginTop: 15,
  },
  icon: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 18,
  },
  num: {},
});
