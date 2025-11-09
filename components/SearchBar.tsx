import {Image, Text, TextInput, View} from "react-native";
import React from "react";
import {icons} from "@/constants/icons";

interface Props {
    placeholder: string;
    onPress?: () => void;
}

const SearchBar = ({ placeholder, onPress }: Props) => {
    return (
        <View className="bg-input-bg rounded-full">
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value=""
                onChangeText={text => {}}
                placeholderTextColor="#555"
                className="text-white"
            />
            <Image
                source={icons.search}
                style={{ width: 24, height: 24, tintColor: "#fff", marginLeft: 8 }}
                resizeMode="contain"
            />
        </View>
    );
}

export default SearchBar;
