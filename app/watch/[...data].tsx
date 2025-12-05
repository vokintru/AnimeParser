import { View, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import Video from "react-native-video";
import { markWatched, getPlayerData, getTranslations } from "@/services/api";

const Watch = () => {
    const router = useRouter();
    const videoRef = useRef<Video>(null);

    // Ориентация экрана
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

    // Данные из параметров
    const { data } = useLocalSearchParams();
    const [title_id, translation_id, episodeParam] = data as string[];

    // Плеер
    const [currentEpisode, setCurrentEpisode] = useState(Number(episodeParam));
    const [playerUri, setPlayerUri] = useState<string | null>(null);
    const [playerSources, setPlayerSources] = useState<Record<string, Record<string, string>>>({});

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

    useEffect(() => {
        fetchAndSortLinks(currentEpisode);
    }, []);

    return (
        <View style={styles.container}>
            {playerUri && (
                <Video
                    ref={videoRef}
                    source={{ uri: playerUri }}
                    style={styles.video}
                    controls
                    resizeMode="contain"
                    onEnd={nextEpisode}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    video: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});

export default Watch;
