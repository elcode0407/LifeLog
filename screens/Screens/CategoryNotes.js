import { FlatList, Text, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Note from "../../components/Note";
import { useEffect } from "react";

export default function CategoryNotes({ navigation, route }) {
  const notes2 = useSelector((state) => state.lifeLog.database?.userNotes);
  const categories = useSelector(
    (state) => state.lifeLog.database?.userCategories
  );
  console.log(categories[route.params.id]);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.name,
    });
  }, []);
  function renderItem({ item }) {
    const item2 = notes2[item.replace(/\s/g, "")];
    console.log(item);
    return <Note item={item2} />;
  }
  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10 }}>
          List Notes
        </Text>
        {!!categories[route.params.id]?.notes ? (
          <FlatList
            data={Object.values(categories[route.params.id]?.notes)}
            keyExtractor={() => Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              marginTop: 30,
            }}
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
});
