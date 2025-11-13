import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AuthScreen from "./auth";
import "./globals.css";

export default function RootLayout() {
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const token = await SecureStore.getItemAsync("access_token");
            if (!token) {
                setAuthChecked(true);
                return;
            }
            try {
                const res = await fetch("https://anime.v0k1nt.su/app/check", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    await SecureStore.deleteItemAsync("access_token");
                }
            } catch (e) {
                console.error(e);
            }

            setAuthChecked(true);
        };

        checkToken();
    }, []);

    if (!authChecked) return null;

    if (!isAuthenticated) {
        return <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="release/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
    );
}
