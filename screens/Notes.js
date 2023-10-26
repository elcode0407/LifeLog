import { FlatList, Text, View, StyleSheet } from "react-native";
import AddFABButton from "../components/ui/AddFABButton";
import { useSelector } from "react-redux";
import Category from "../components/Category";
import Note from "../components/Note";

export default function Notes() {
  const data = useSelector((state) => state.lifeLog.database?.userNotes);
  console.log(!!data);
  function renderItem({ item }) {
    return <Note item={item} />;
  }
  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10 }}>
          List Notes
        </Text>
        {!!data ? (
          <FlatList
            data={Object.values(data)}
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
