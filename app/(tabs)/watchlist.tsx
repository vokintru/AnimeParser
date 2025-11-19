import {ActivityIndicator, Text, View, FlatList} from "react-native";
import React from "react";
import useFetch from "@/services/useFetch";
import {getWatchlist,} from "@/services/api";
import BasicAnimeCard from "@/components/basicAnimeCard";

const WatchList = () => {

    const {
        data: watchlistData,
        loading: watchlistLoading,
        error: watchlistError,
    } = useFetch(() => getWatchlist())
    return (
        <View className="flex-1 bg-background">
            {watchlistLoading ? (
                <View className="flex-1 justify-center items-center bg-background">
                    <ActivityIndicator size="large" color="white" />
                </View>
            ) : watchlistError ? (
                <Text className='text-white'>{watchlistError.message}</Text>
            ) : (
                <>
                    <FlatList
                        data={watchlistData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => <BasicAnimeCard {...item} />}
                        numColumns={3}
                        columnWrapperStyle={{
                            justifyContent: 'flex-start',
                            gap: 20,
                            paddingRight: 5,
                            marginBottom: 5,
                        }}
                        contentContainerStyle={{
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            paddingTop: 70,
                        }}
                    />
                </>
            )}
        </View>

    );
}

export default WatchList;
