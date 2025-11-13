import {ActivityIndicator, FlatList, Text} from "react-native";
import React from "react";
import useFetch from "@/services/useFetch";
import {getWatchlist,} from "@/services/api";
import BasicAnimeCard from "@/components/basicAnimeCard";
import {SafeAreaView} from "react-native-safe-area-context";

const WatchList = () => {

    const {
        data: watchlistData,
        loading: watchlistLoading,
        error: watchlistError,
    } = useFetch(() => getWatchlist())
    return (
        <SafeAreaView className="flex-1 bg-background">
            {watchlistLoading ? (
                    <ActivityIndicator size="large" color="white" className="mt-10 self-center"/>)
                : watchlistError ? (
                        <Text className='text-white'>{watchlistError.message}</Text>)
                    : (<>
                        <FlatList
                            data={watchlistData}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={
                                ({item}) =>
                                    <BasicAnimeCard {...item} />
                            }
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
                            }}/>

                    </>)}
        </SafeAreaView>);
}

export default WatchList;
