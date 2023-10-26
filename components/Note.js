import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function Note({ item }) {
  const [pressed, setPressed] = useState(false);
  const data = useSelector(
    (state) => state.lifeLog.database.userCategories[item.category_id]
  );
  const navigation = useNavigation();
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
