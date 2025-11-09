import {logo_frames} from "@/constants/logo_frames";
import React, {useEffect, useState} from "react";
import {Image, View} from "react-native";
import Search from "@/app/(tabs)/search";

const framesArray = Object.values(logo_frames);

const LogoAnimated = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % framesArray.length);
        }, 100);

        return () => clearInterval(timer);
    }, [100]);

    return (
        <View className="w-full items-center">
            <Image
                source={framesArray[index]}
                className="w-full max-w-[280px]"
                style={{ aspectRatio: 491 / 428, resizeMode: 'contain' }}
            />
        </View>
    );
};

export default LogoAnimated;