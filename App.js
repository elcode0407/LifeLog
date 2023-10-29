import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/Screens/HomeScreen";
import CategoryScreen from "./screens/Screens/CategoryScreen";
import SettingsScreen from "./screens/Screens/SettingsScreen";
import SignUpScreen from "./screens/Auth/SignUpScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import * as eva from "@eva-design/eva";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import {
  ApplicationProvider,
  BottomNavigation,
  BottomNavigationTab,
  IconRegistry,
  Icon,
} from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import {
  MaterialIcons,
  Entypo,
  Ionicons,
  Octicons,
  Foundation,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import { useLayoutEffect, useState } from "react";
import auth, { database } from "./firebase/firebase";
import { authenticated, logout, setData } from "./redux/logs";
import AddNote from "./screens/AddSceens/AddNote";
import { onValue, ref } from "firebase/database";
import AddCategory from "./screens/AddSceens/AddCategory";
import CategoryNotes from "./screens/Screens/CategoryNotes";
import EditNote from "./screens/Screens/EditNote";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <StatusBar style="black" />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              paddingVertical: 20,
              height: "9.5%",
              backgroundColor: "black",
              borderTopRightRadius: 50,
              borderTopLeftRadius: 50,
            },
            headerTintColor: "black",
            headerShadowVisible: false,
          }}
        >
          <Tab.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={({ route }) => ({
              tabBarShowLabel: false,
              tabBarActiveTintColor: "white",
              headerLeft: ({ tintColor }) => (
                <MaterialCommunityIcons
                  name="notebook-edit"
                  size={24}
                  color={tintColor}
                  style={{ marginLeft: 10 }}
                />
              ),
              headerTitle: "Life Log",
              tabBarIcon: ({ focused, color, size }) =>
                !focused ? (
                  <Octicons name="home" color={color} size={size} />
                ) : (
                  <Foundation name="home" color={color} size={size * 1.4} />
                ),
            })}
          />
          <Tab.Screen
            name="CategoryScreen"
            component={CategoryScreen}
            options={({ navigation }) => ({
              tabBarShowLabel: false,
              tabBarActiveTintColor: "white",
              headerTitle: "Category",
              tabBarIcon: ({ focused, color, size }) =>
                focused ? (
                  <Ionicons name="ios-grid" color={color} size={size + 2} />
                ) : (
                  <Ionicons name="ios-grid-outline" color={color} size={size} />
                ),
              headerRight: ({ tintColor }) => (
                <View style={{ marginHorizontal: 10 }}>
                  {isLoading ? (
                    <ActivityIndicator size={"small"} color={"white"} />
                  ) : (
                    <Ionicons
                      name="add-circle-outline"
                      onPress={() => {
                        navigation.navigate("AddCategory");
                      }}
                      size={29}
                      color={tintColor}
                    />
                  )}
                </View>
              ),
            })}
          />
          <Tab.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{
              tabBarShowLabel: false,
              tabBarActiveTintColor: "white",
              tabBarIcon: ({ focused, color, size }) =>
                focused ? (
                  <Ionicons name="ios-settings" color={color} size={size + 2} />
                ) : (
                  <Ionicons
                    name="ios-settings-outline"
                    color={color}
                    size={size}
                  />
                ),
              headerRight: ({ tintColor }) => (
                <View style={{ marginHorizontal: 10 }}>
                  {isLoading ? (
                    <ActivityIndicator size={"small"} color={"white"} />
                  ) : (
                    <Ionicons
                      name="ios-exit"
                      onPress={async () => {
                        setIsLoading(true);
                        dispatch(logout());
                        await auth.signOut();
                      }}
                      size={24}
                      color={tintColor}
                    />
                  )}
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      </ApplicationProvider>
    </>
  );
}
function Authenticated() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{
          contentStyle: { backgroundColor: "white" },
        }}
        name="BottomTabs"
        component={BottomTabs}
      />
      <Stack.Screen
        name="AddNote"
        component={AddNote}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategory}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditNote"
        component={EditNote}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="CategoryNotes"
        component={CategoryNotes}
        options={{
          headerShown: true,
          headerTitle: "Notes",
        }}
      />
    </Stack.Navigator>
  );
}

function IsAuth() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
function Navigators() {
  const auth = useSelector((state) => state.lifeLog);
  console.log(auth.isAuthenticated);
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      {auth.isAuthenticated && <Authenticated />}
      {!auth.isAuthenticated && <IsAuth />}
    </ApplicationProvider>
  );
}

function Root() {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const data = useSelector((state) => state.lifeLog.database);
  useLayoutEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = auth.currentUser.uid;
        const dbUser = ref(database, `${uid}/`);
        const dbNotes = ref(database, `notes/${uid}/`);
        const dbCategories = ref(database, `categories/${uid}/`);
        const dbFavorites = ref(database, `favorites/${uid}/`);

        onValue(
          dbUser,
          (snapshot) => {
            dispatch(setData({ data: snapshot.val() }));
            console.log(0);
            console.log(data);
            console.log(snapshot.val());
            onValue(
              dbNotes,
              (snapshot) => {
                dispatch(setData({ data: snapshot.val() }));
                console.log(1);
                console.log(data);
                console.log(snapshot.val());
                onValue(
                  dbCategories,
                  (snapshot) => {
                    console.log(2);
                    console.log(data);
                    console.log(snapshot.val());
                    dispatch(setData({ data: snapshot.val() }));
                    onValue(
                      dbFavorites,
                      (snapshot) => {
                        console.log(3);
                        console.log(snapshot.val());
                        dispatch(setData({ data: snapshot.val() }));
                        console.log(Object.values(data));

                        dispatch(authenticated({ token: user.uid }));
                        setIsAuthenticated(true);
                      },
                      {
                        onlyOnce: true,
                      }
                    );
                  },
                  {
                    onlyOnce: true,
                  }
                );
              },
              {
                onlyOnce: true,
              }
            );
          },
          {
            onlyOnce: true,
          }
        );
      } else {
        // Пользователь не аутентифицирован
        console.log("Пользователь не вошел в систему");
        setIsAuthenticated(false);
      }
    });
    // Отписываемся от события при размонтировании компонента
    return () => unsubscribe();
  }, []);

  return isAuthenticated === null ? <LoadingOverlay /> : <Navigators />;
}
export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Provider store={store}>
          <NavigationContainer>
            <Root />
          </NavigationContainer>
        </Provider>
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNavigation: {
    marginVertical: 8,
  },
});
