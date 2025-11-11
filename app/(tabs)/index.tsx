import {Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useEffect, useState} from "react";
import SearchBar from "@/components/SearchBar";
import LogoAnimated from "@/components/LogoAnimated";
import { useRouter} from "expo-router";

export default function Index() {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 bg-background">
            <LogoAnimated className="w-full max-w-[280px]" />
            <View className="flex-1 mt-5">
                <SearchBar
                    onPress={() => router.push("/search")}
                    placeholder="Поиск"
                />
            </View>
        </SafeAreaView>
    );
}
