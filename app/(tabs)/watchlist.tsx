import {ActivityIndicator, FlatList, Text, View} from "react-native";
import React, { useState } from "react";
import useFetch from "@/services/useFetch";
import {getWatchlist,} from "@/services/api";
import BasicAnimeCard from "@/components/basicAnimeCard";

const WatchList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: watchlistData,
        loading: watchlistLoading,
        error: watchlistError,
    } = useFetch(() => getWatchlist())
    return (
        <View className="flex-1 bg-background px-5">
            {watchlistLoading ? (
                <ActivityIndicator
                    size="large"
                    color="white"
                    className="mt-10 self-center"
                />
            ) : watchlistError ? (
                <Text className="text-white">{watchlistError.message}</Text>
            ) : (
                <FlatList
                    data={watchlistData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <BasicAnimeCard {...item} />}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: 'flex-start',
                        gap: 20,
                        paddingRight: 5,
                        marginBottom: 5,
                    }}
                    contentContainerStyle={{ paddingTop: 60, paddingBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

export default WatchList;
