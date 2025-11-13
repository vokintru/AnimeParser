import React from "react";
import {Tabs} from "expo-router";
import {Image} from "react-native";
import {icons} from "@/constants/icons";

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: "#121212",
                    borderTopColor: "#333",
                    borderTopWidth: 1,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#888",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Главная",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <>
                            <Image
                                source={icons.home}
                                style={{ width: 24, height: 24, resizeMode: 'contain', alignSelf: 'center', tintColor: color }}
                            />

                        </>
                    )
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Поиск",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <>
                            <Image
                                source={icons.search}
                                style={{ width: 24, height: 24, resizeMode: 'contain', alignSelf: 'center', tintColor: color }}
                            />
                        </>
                    )
                }}
            />
            <Tabs.Screen
                name="watchlist"
                options={{
                    title: "Вотчлист",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <>
                            <Image
                                source={icons.watchlist}
                                style={{ width: 24, height: 24, resizeMode: 'contain', alignSelf: 'center', tintColor: color }}
                            />
                        </>
                    )
                }}
            />
        </Tabs>
    );
}

export default _Layout;
