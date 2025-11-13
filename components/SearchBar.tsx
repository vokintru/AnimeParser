import { TextInput, View, TouchableOpacity, Animated } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    placeholder: string;
    onPress?: () => void;
    value?: string;
    onChangeText?: (text: string) => void;
}

const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showClear, setShowClear] = useState(false);
    const animatedWidth = useRef(new Animated.Value(0.3)).current;

    const animateWidth = (toValue: number) => {
        Animated.timing(animatedWidth, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };
    const handleFocus = () => {
        setIsFocused(true);
        animateWidth(0.6);
        onPress?.();
    };
    const handleBlur = () => {
        setIsFocused(false);
        if (!value) {
            animateWidth(0.3);
        }
    };
    const handleClear = () => {
        onChangeText?.('');
    };
    useEffect(() => {
        setShowClear(!!value && value.length > 0 && isFocused);
    }, [value, isFocused]);
    const widthStyle = {
        width: animatedWidth.interpolate({
            inputRange: [0.3, 0.6],
            outputRange: ['30%', '60%'],
        }),
    };

    return (
        <Animated.View
            style={widthStyle}
            className="bg-input-bg rounded-full px-4 py-2 flex-row items-center"
        >
            <TextInput
                onPressIn={handleFocus}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#555"
                className="text-white flex-1"
            />
            {showClear && (
                <TouchableOpacity
                    onPress={handleClear}
                    className="ml-2"
                >
                    <Ionicons name="close-circle" size={20} color="#888" />
                </TouchableOpacity>
            )}
        </Animated.View>
    );
}

export default SearchBar;