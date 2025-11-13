import {Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useEffect, useState} from "react";
import SearchBar from "@/components/SearchBar";
import LogoAnimated from "@/components/LogoAnimated";
import {useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {searchAnime} from "@/services/api";

export default function Index() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background items-center">
            <LogoAnimated className="max-w-[280px] max-h-[280px] p-4"/>
            <View className="p-1">
                <SearchBar
                    onPress={() => router.push("/search")}
                    placeholder="Поиск"
                />
            </View>
        </SafeAreaView>
    );
}
