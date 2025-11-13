import React, { useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';

export default function AuthScreen({ onAuthSuccess }: { onAuthSuccess: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);

        try {
            const redirectUri = Linking.createURL('token');
            const authUrl = `https://anime.v0k1nt.su/app/login`;

            const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
            if (result.type === 'success' && result.url) {
                const token = new URL(result.url).searchParams.get('token');
                if (token) {
                    await SecureStore.setItemAsync('access_token', token);
                    onAuthSuccess();
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-white text-lg mb-4">Требуется авторизация</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <Button title="Войти через браузер" onPress={handleLogin} />
            )}
        </View>
    );
}
