import { Tabs } from "expo-router";
import { Dimensions } from "react-native";
import { Fontisto, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window');

export default function TabsLayout() {
    return (
        <Tabs
            initialRouteName="my-child"
            backBehavior="history"

        >


            <Tabs.Screen
                name="Import"
                options={{
                    // headerTitle : 'home screen',
                    tabBarLabel: 'Import',
                    tabBarShowLabel: true,
                    tabBarLabelStyle: { color: "#666", marginBottom: 10 },
                    headerShown: false,
                    tabBarHideOnKeyboard: false,
                    tabBarIcon: ({ focused }) => (<MaterialCommunityIcons name="database-import"
                        size={25}
                        style={[{
                            paddingTop: 24,
                            borderRadius: 14,
                            position: "absolute",
                            alignItems: "center",
                        }, focused ? { top: -13, color: "#66b3ff" } : { top: -10, color: "#666" }]} />),
                    tabBarStyle: {
                        bottom: 20,
                        backgroundColor: ' rgba(255,255,255,1)',
                        height: 70,
                        borderRadius: 20,
                        position: 'absolute',
                        width: width * 0.95,
                        justifyContent: 'center',
                        alignItems: 'center',
                        left: 0.025 * width,
                    },

                }}
            />

            <Tabs.Screen
                name="home/Home"
                options={{
                    tabBarLabel: 'Home',
                    tabBarLabelStyle: { color: "#666", marginBottom: 10 },
                    tabBarShowLabel: true,
                    headerShown: false,


                    activeTintColor: 'red',
                    tabBarActiveBackgroundColor: false,
                    tabBarHideOnKeyboard: false,
                    tabBarIcon: ({ focused }) => (<MaterialCommunityIcons name="home" size={25}
                        // color={focused ? COLORS.primary : '#999'}
                        style={[{

                            paddingTop: 24,
                            borderRadius: 14,
                            position: "absolute",
                            color: "#666",


                        }, focused ? { top: -13, color: "#66b3ff" } : { top: -10, color: "#666" }]} />),


                    tabBarStyle: {
                        bottom: 20,
                        backgroundColor: ' rgba(255,255,255,0.8)',
                        height: 70,
                        borderRadius: 20,
                        position: 'absolute',
                        width: width * 0.95,
                        justifyContent: 'center',
                        alignItems: 'center',
                        left: 0.025 * width,


                    },

                }}
            />

            <Tabs.Screen
                name="Export"
                options={{
                    // headerTitle : 'home screen',
                    tabBarLabel: 'Export',
                    tabBarShowLabel: true,
                    headerShown: false,
                    tabBarLabelStyle: { color: "#666", marginBottom: 10 },
                    tabBarHideOnKeyboard: false,
                    tabBarIcon: ({ focused }) => (<MaterialCommunityIcons name="database-export" size={25}
                        // color={focused ? COLORS.primary : '#999'}
                        style={[{

                            paddingTop: 24,
                            borderRadius: 14,
                            position: "absolute",
                            color: "#666",


                        }, focused ? { top: -13, color: "#66b3ff" } : { top: -10, color: "#666" }]} />),
                    tabBarStyle: {
                        bottom: 20,
                        backgroundColor: ' rgba(255,255,255,1)',
                        height: 70,
                        borderRadius: 20,
                        position: 'absolute',
                        width: width * 0.95,
                        justifyContent: 'center',
                        alignItems: 'center',
                        left: 0.025 * width,
                    },

                }}
            />



            <Tabs.Screen
                name="home/peotry/[id]"
                options={{

                    tabBarShowLabel: true,
                    headerShown: false,
                    tabBarButton: (props) => null,
                    tabBarVisible: false, // if you don't want to see the tab bar
                    tabBarStyle: {
                        bottom: 20,
                        backgroundColor: ' rgba(255,255,255,0.8)',
                        height: 70,
                        borderRadius: 20,
                        position: 'absolute',
                        width: width * 0.95,
                        justifyContent: 'center',
                        alignItems: 'center',
                        left: 0.025 * width,


                    },
                }}

            />

            <Tabs.Screen
                name="home/peotry/peoText/[id]"
                options={{

                    tabBarShowLabel: true,
                    headerShown: false,
                    tabBarButton: (props) => null,
                    tabBarVisible: false, // if you don't want to see the tab bar
                    tabBarStyle: {
                        bottom: 20,
                        backgroundColor: ' rgba(255,255,255,0.8)',
                        height: 70,
                        borderRadius: 20,
                        position: 'absolute',
                        width: width * 0.95,
                        justifyContent: 'center',
                        alignItems: 'center',
                        left: 0.025 * width,
                    },
                }}

            />




        </Tabs>
    );
}