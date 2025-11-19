import {ActivityIndicator, FlatList, Text, View} from "react-native";
import React, {useEffect, useState } from "react";
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
        <View className="bg-background items-center flex-1" style={{ paddingTop: 60 }}>
            <View className="p-1 pb-4">
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
            ) : searchError ? (
                <Text className='text-white'>{searchError.message}</Text>
            ) : (
                <FlatList
                    data={searchData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <SearchAnimeCard {...item} />}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                    }}
                    ListEmptyComponent={
                        !searchLoading && !searchError ? (
                            <View className="mt-2 px-5">
                                <Text className='text-center text-gray-600'>
                                    {searchQuery.trim() ? "Ничего не найдено" : "Поищите что-нибудь"}
                                </Text>
                            </View>
                        ) : null
                    }
                />
            )}
        </View>
    );
}

export default Search;
