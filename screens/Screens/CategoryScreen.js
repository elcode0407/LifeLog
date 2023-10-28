import { FlatList, Text, View, StyleSheet } from "react-native";
import AddFABButton from "../../components/ui/AddFABButton";
import { useSelector } from "react-redux";
import Category from "../../components/Category";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CategoryScreen({ navigation }) {
  const data = useSelector((state) => state.lifeLog.database?.userCategories);
  console.log(data);

  function renderItem({ item }) {
    return <Category item={item} />;
  }
  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10 }}>
          List of Categories
        </Text>
        {!!data ? (
          <FlatList
            data={Object.values(data)}
            keyExtractor={() => Math.random().toString()}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-around" }}
            contentContainerStyle={{
              marginTop: 40,
              marginHorizontal: 5,
            }}
          />
        ) : (
          <Text style={{ fontSize: 18, textAlign: "center", marginTop: 20 }}>
            No Category
          </Text>
        )}

        <AddFABButton />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopColor: "#c0bdbd",
    borderTopWidth: 1,
    paddingHorizontal: 6,
  },
});
