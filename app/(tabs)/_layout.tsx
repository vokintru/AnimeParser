import React from "react";
import {Tabs} from "expo-router";

const _Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Главная",
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Поиск",
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="watchlist"
                options={{
                    title: "Вотчлист",
                    headerShown: false
                }}
            />
        </Tabs>
    );
}

export default _Layout;
