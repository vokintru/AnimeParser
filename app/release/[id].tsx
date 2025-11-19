import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {getRate, getReleaseInfo, getReleaseInfoPoster} from "@/services/api";
import { LinearGradient } from 'expo-linear-gradient'
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";

function formatDateRange(
    started: string | null | undefined,
    released: string | null | undefined
): string {
    if (!started) return "Неизвестно";

    const start = new Date(started).toLocaleDateString("ru-RU");
    const end = released ? new Date(released).toLocaleDateString("ru-RU") : "…";

    return `${start} — ${end}`;
}

function declOfNum(
    n: number,
    forms: [string, string, string]
): string {
    n = Math.abs(n) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
}

function getNextEpisodeTime(targetDate?: string | Date) {
    if (!targetDate) return null;

    const now = new Date();
    const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;

    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return "Эпизод уже вышел!";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    return `${days} ${declOfNum(days, ["день","дня","дней"])} ` +
        `${hours} ${declOfNum(hours, ["час","часа","часов"])}`;
}



const Release = () => {
    const { id } = useLocalSearchParams();
    const { data: anime, loading } = useFetch(() => getReleaseInfo(id as string));
    const { data: poster} = useFetch(() => getReleaseInfoPoster(id as string));
    const { data: rate } = useFetch(() => getRate(id as string));

    const mainPoster = poster || anime?.poster || images.no_poster;

    const totalEpisodes = anime?.total_episodes == 0 ? "?" : anime?.total_episodes;

    const dateRange = formatDateRange(anime?.started, anime?.released);

    const nextEpisodeText = anime?.is_ongoing
        ? getNextEpisodeTime(anime.next_episode_at)
        : null;

    if (!anime) return null;

    return (
        <View className="bg-background flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View className="relative">
                    <Image
                        source={{ uri: mainPoster }}
                        className="w-full h-[550px]"
                        resizeMode="cover"
                    />

                    <LinearGradient
                        colors={['transparent', '#121212']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 250,
                            justifyContent: 'flex-end',
                            paddingHorizontal: 16,
                            paddingBottom: 16,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>
                            {anime?.name}
                        </Text>
                    </LinearGradient>
                </View>

                <TouchableOpacity
                    className="bg-[#27272a] rounded-lg py-3.5 flex flex-row items-center justify-center mt-5 mx-5"
                    onPress={() => {
                        const targetEpisode =
                            rate?.episodes === 0 && rate?.status !== "completed"
                                ? rate?.episodes + 1
                                : 0;
                        console.log("Переходим на серию:", targetEpisode);
                    }}
                >
                    <Image
                        source={icons.play}
                        className="mr-1 mt-0.5"
                        style={{
                            width: 24,
                            height: 24,
                            resizeMode: "contain",
                            tintColor: "#fff",
                        }}
                    />
                    <Text className="text-white font-semibold text-base">
                        {rate?.episodes === 0 && rate?.status !== "completed" ? "Смотреть" : "Продолжить"}
                    </Text>

                    <View className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-700 rounded-b-lg">
                        <View
                            className="h-[2px] bg-white"
                            style={{
                                width: `${(rate?.episodes / totalEpisodes) * 100}%`,
                            }}
                        />
                    </View>
                </TouchableOpacity>

                <View className="mt-5 px-5 flex-row flex-wrap justify-between">
                    <View className="w-1/2 mb-2">
                        <Text className="text-gray-400 text-sm font-semibold">Тип:</Text>
                        <Text className="text-white text-sm">{anime?.type}</Text>
                    </View>

                    <View className="w-1/2 mb-2">
                        <Text className="text-gray-400 text-sm font-semibold">Статус:</Text>
                        <Text className="text-white text-sm">{anime?.status}</Text>
                    </View>

                    <View className="w-1/2 mb-2">
                        <Text className="text-gray-400 text-sm font-semibold">Оценка:</Text>
                        <Text className="text-white text-sm">{anime?.score}</Text>
                    </View>

                    <View className="w-1/2 mb-2">
                        <Text className="text-gray-400 text-sm font-semibold">Возрастной рейтинг:</Text>
                        <Text className="text-white text-sm">{anime?.rating}</Text>
                    </View>

                    {anime.is_ongoing ? (
                        <>
                            <View className="w-1/2 mb-2">
                                <Text className="text-gray-400 text-sm font-semibold">Кол-во серий:</Text>
                                <Text className="text-white text-sm">
                                    {anime.released_episodes}/{totalEpisodes}
                                </Text>
                            </View>

                            <View className="w-1/2 mb-2">
                                <Text className="text-gray-400 text-sm font-semibold">Даты:</Text>
                                <Text className="text-white text-sm">{dateRange}</Text>
                            </View>

                            <View className="w-1/2 mb-2">
                                <Text className="text-gray-400 text-sm font-semibold">Следующая серия через:</Text>
                                <Text className="text-white text-sm">{nextEpisodeText}</Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <View className="w-1/2 mb-2">
                                <Text className="text-gray-400 text-sm font-semibold">Кол-во серий:</Text>
                                <Text className="text-white text-sm">{totalEpisodes}</Text>
                            </View>

                            <View className="w-1/2 mb-2">
                                <Text className="text-gray-400 text-sm font-semibold">Даты:</Text>
                                <Text className="text-white text-sm">{dateRange}</Text>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default Release;
