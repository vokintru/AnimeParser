import { Text, TextInput, View} from "react-native";
import React from "react";

interface Props {
    placeholder: string;
    onPress?: () => void;
}

const SearchBar = ({ placeholder, onPress }: Props) => {
    return (
        <View className="bg-input-bg rounded-full px-4 py-2 flex-row items-center">
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value=""
                onChangeText={text => {}}
                placeholderTextColor="#555"
                className="text-white"
            />
        </View>
    );
}

export default SearchBar;
