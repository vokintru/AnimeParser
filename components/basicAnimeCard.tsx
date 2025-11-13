import {Link} from "expo-router";
import {Image, Text, TouchableOpacity} from "react-native";
import {images} from "@/constants/images";
import React from "react";

const BasicAnimeCard = ({ id, name, original_name, poster }: watchlistAnime) => {
    return (
        <Link href={`/release/${id}`} asChild>
            <TouchableOpacity className="w-[30%]">
                <Image
                    source={poster
                        ? { uri: `https://shikimori.one${poster}` }
                        : images.no_poster
                    }
                    className="rounded-md aspect-[2/3]"
                    resizeMode="cover"
                />
                <Text className="text-sm font-bold text-white mt-2" numberOfLines={3}>
                    {name || original_name}
                </Text>
            </TouchableOpacity>
        </Link>
    );
};

export default BasicAnimeCard;