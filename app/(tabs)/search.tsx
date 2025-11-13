import {ActivityIndicator, FlatList, Text, View} from "react-native";
import React, {useEffect, useState, useRef } from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import useFetch from "@/services/useFetch";
import {searchAnime} from "@/services/api";
import SearchBar from "@/components/SearchBar";
import SearchAnimeCard from "@/components/searchAnimeCard";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: searchData,
        loading: searchLoading,
        error: searchError,
        refetch: searchRefetch,
        reset: searchReset,
    } = useFetch(() => searchAnime({query: searchQuery}), false)

    useEffect(() => {
        const handler = setTimeout(() => {
            const searchFunc = async () => {
                if (searchQuery.trim()) {
                    await searchRefetch();
                } else {
                    searchReset();
                }
            }
            searchFunc();
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    return (
        <SafeAreaView className="bg-background items-center flex-1">
            <View className="p-1">
                <SearchBar
                    placeholder="Поиск"
                    value={searchQuery}
                    onChangeText={(text: string) => setSearchQuery(text)}
                />
            </View>
            {searchLoading ? (
                <ActivityIndicator
                    size="large"
                    color="white"
                    className="mt-10 self-center"
                />
            ): searchError ? (
                <Text className='text-white'>{searchError.message}</Text>
            ): (
                <>
                    <FlatList
                        data={searchData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <SearchAnimeCard {...item} />}
                        contentContainerStyle={{
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                        }}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

export default Search;
