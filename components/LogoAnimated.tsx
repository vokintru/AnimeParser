import {logo_frames} from "@/constants/logo_frames";
import React, {useEffect, useState} from "react";
import {Image, View} from "react-native";
import Search from "@/app/(tabs)/search";

const framesArray = Object.values(logo_frames);

interface Props {
    className: string;
}

const LogoAnimated = ( {className}: Props) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % framesArray.length);
        }, 100);

        return () => clearInterval(timer);
    }, [100]);

    return (
        <Image
            source={framesArray[index]}
            className={className}
            style={{ aspectRatio: 491 / 428, resizeMode: 'contain' }}
        />
    );
};

export default LogoAnimated;