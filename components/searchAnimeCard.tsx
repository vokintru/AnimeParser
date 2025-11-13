import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Link} from "expo-router";
import { images } from "@/constants/images"

const SearchAnimeCard = ({ id, russian, image, kind, status, aired_on, released_on}: searchAnime) => {
    return (
        <Link href={`/release/${id}`} asChild>
            <TouchableOpacity className="bg-input-bg border-input-border p-3 rounded-lg mb-3 border flex-row max-w-full min-w-full">
                <Image
                    source={
                        image?.original
                            ? { uri: `https://shikimori.one${image.original}` }
                            : images.no_poster
                    }
                    className="w-28 h-40 rounded-md aspect-[2/3]"
                    resizeMode="cover"
                />
                <View className="ml-3 justify-items-start flex-1">
                    <Text
                        className="text-white font-bold text-base mb-1 leading-tight flex-wrap"
                    >
                        {russian}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                        {kind?.toUpperCase() || "TV Сериал"} |{" "}
                        {aired_on?.slice(0, 4) || released_on?.slice(0, 4)} год
                    </Text>
                    <Text className="text-green-400 font-semibold mt-1">
                        {status === "released" ? "Вышло" : "Онгоинг"}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default SearchAnimeCard;