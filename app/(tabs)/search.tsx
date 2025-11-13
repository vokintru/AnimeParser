import {ActivityIndicator, FlatList, Text, View} from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import useFetch from "@/services/useFetch";
import {searchAnime} from "@/services/api";
import LogoAnimated from "@/components/LogoAnimated";
import SearchBar from "@/components/SearchBar";
import AnimeCard from "@/components/animeCard";

const Search = () => {

    const {
        data: searchData,
        loading: searchLoading,
        error: searchError
    } = useFetch(() => searchAnime({query: "Магическая битва"}))

    return (
        <SafeAreaView className="flex-1 bg-background items-center">
            <View className="p-1">
                <SearchBar
                    placeholder="Поиск"
                />
            </View>
            {searchLoading ? (
                <ActivityIndicator
                    size="large"
                    color="white"
                    className="mt-10 self-center"
                />
            ): searchError ? (
                <Text>{searchError.message}</Text>
            ): (
                <>
                    <FlatList
                        data={searchData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <AnimeCard {...item} />}
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
