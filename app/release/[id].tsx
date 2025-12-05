import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {getRate, getReleaseInfo, getReleaseInfoPoster, getTranslations} from "@/services/api";
import { LinearGradient } from 'expo-linear-gradient'
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import { Modal } from "react-native";
import { Link } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

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
    const { data: anime } = useFetch(() => getReleaseInfo(id as string));
    const { data: poster } = useFetch(() => getReleaseInfoPoster(id as string));
    const { data: rate } = useFetch(() => getRate(id as string));

    const [modalVisible, setModalVisible] = React.useState(false);
    const { data: translations } = useFetch(() => getTranslations(id as string));

    const mainPoster = poster || anime?.poster || images.no_poster;

    const totalEpisodes = anime?.total_episodes == 0 ? "?" : anime?.total_episodes;

    const dateRange = formatDateRange(anime?.started, anime?.released);

    const nextEpisodeText = anime?.is_ongoing
        ? getNextEpisodeTime(anime.next_episode_at)
        : null;

    const targetEpisode =
        rate?.episodes === 0 && rate?.status !== "completed"
            ? 1
            : rate?.episodes + 1;

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
                    onPress={() => setModalVisible(true)}
                >
                    <Image
                        source={icons.play}
                        className="mr-1"
                        style={{
                            width: 18,
                            height: 18,
                            resizeMode: "contain",
                            tintColor: "#fff",
                        }}
                    />
                    <Text className="text-white font-semibold text-base">
                        {(!rate || (rate.episodes === 0 && rate.status !== "completed"))
                            ? "Смотреть"
                            : "Продолжить"}
                    </Text>

                    <View className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-700 rounded-b-lg">
                        <View
                            className="h-[2px] bg-white"
                            style={{
                                width: rate && totalEpisodes
                                    ? `${(rate.episodes / totalEpisodes) * 100}%`
                                    : "0%",
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

                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="none"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View
                        className="flex-1 bg-black/60 justify-center items-center px-6"
                        style={{ paddingTop: 20, paddingBottom: 20 }}
                    >
                        <View
                            className="bg-[#1c1c1e] w-full rounded-2xl p-5"
                            style={{ maxHeight: "80%" }}
                        >
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    padding: 5,
                                    zIndex: 10
                                }}
                            >
                                <Ionicons name="close" size={22} color="#888" />
                            </TouchableOpacity>

                            <Text className="text-white text-lg font-semibold mb-4">
                                Выберите перевод
                            </Text>

                            <ScrollView
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ paddingBottom: 10 }}
                            >
                                {(!translations || !translations.translations || translations.translations.length === 0) ? (
                                    <Text className="text-gray-400 text-center py-4">
                                        Переводы не найдены
                                    </Text>
                                ) : (
                                    translations.translations.map((tr: any) => {
                                        const data = `${id}/${tr.id}/${targetEpisode}`;

                                        return (
                                            <Link
                                                key={tr.id}
                                                href={`/watch/${data}`}
                                                asChild
                                            >
                                                <TouchableOpacity
                                                    className="bg-[#2a2a2d] rounded-xl p-3 mb-3"
                                                    onPress={() => setModalVisible(false)}
                                                >
                                                    <Text className="text-white text-base">{tr.name}</Text>
                                                </TouchableOpacity>
                                            </Link>
                                        );
                                    })
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}

export default Release;
