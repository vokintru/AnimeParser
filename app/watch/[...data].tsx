import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useVideoPlayer, VideoView } from "expo-video";
import { markWatched, getPlayerData, getTranslations } from "@/services/api";

const Watch = () => {
    const router = useRouter();

    // --- Ориентация экрана ---
    useEffect(() => {
        let previousOrientation: ScreenOrientation.OrientationLock | null = null;

        const setLandscapeButUnlocked = async () => {
            previousOrientation = await ScreenOrientation.getOrientationLockAsync();
            await ScreenOrientation.unlockAsync();
        };

        setLandscapeButUnlocked();

        return () => {
            const restoreOrientation = async () => {
                if (previousOrientation) {
                    await ScreenOrientation.lockAsync(previousOrientation);
                }
            };
            restoreOrientation();
        };
    }, []);

    // --- Данные из параметров ---
    const { data } = useLocalSearchParams();
    const [title_id, translation_id, episodeParam] = data as string[];

    // --- Состояния ---
    const [currentEpisode, setCurrentEpisode] = useState(Number(episodeParam));
    const [playerUri, setPlayerUri] = useState<string | null>(null);
    const [playerSources, setPlayerSources] = useState<Record<string, Record<string, string>>>({});

    // --- Инициализация плеера ---
    const player = useVideoPlayer(playerUri || "", (p) => {
        p.play();
        p.loop = false;
    });

    // --- Функция получения ссылок и сортировки ---
    const fetchAndSortLinks = async (episodeNumber: number) => {
        try {
            const resp = await getPlayerData(title_id, translation_id, episodeNumber.toString());

            const data: Record<string, Record<string, string>> = {};

            for (const source in resp) {
                const qualities = resp[source];
                const sorted: Record<string, string> = {};

                const order = ["1080p", "720p", "480p", "360p"];
                order.forEach((q) => {
                    if (qualities[q]) {
                        sorted[q] = qualities[q].startsWith("!onlyapp ")
                            ? qualities[q].replace("!onlyapp ", "")
                            : qualities[q];
                    }
                });

                data[source] = sorted;
            }

            setPlayerSources(data);

            const bestSource = Object.values(data)[0];
            const bestQuality = Object.keys(bestSource)[0];
            setPlayerUri(bestSource[bestQuality] || null);

        } catch (e) {
            console.error("Ошибка при получении ссылок:", e);
        }
    };

    const nextEpisode = async () => {
        await markWatched(title_id, currentEpisode);

        const resp = await getTranslations(title_id);
        const info = await resp.json();
        const total = info && typeof info.series_count === "number" ? info.series_count : null;

        const nextEp = currentEpisode + 1;
        if (total !== null && nextEp > total) {
            router.back();
            return;
        }

        setCurrentEpisode(nextEp);
        await fetchAndSortLinks(nextEp);
    };

    const lastEpisode = async () => {
        const prevEp = currentEpisode - 1;
        if (prevEp < 1) return;

        setCurrentEpisode(prevEp);
        await fetchAndSortLinks(prevEp);
    };

    // --- Инициализация при первом рендере ---
    useEffect(() => {
        fetchAndSortLinks(currentEpisode);
    }, []);

    return (
        <View className="bg-background flex-1">
            {playerUri && (
                <VideoView
                    player={player}
                    style={{ height: "100%" }}
                    allowsPictureInPicture
                />
            )}
        </View>
    );
};

export default Watch;
