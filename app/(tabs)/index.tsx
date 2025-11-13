import {SafeAreaView} from "react-native-safe-area-context";
import React from "react";
import LogoAnimated from "@/components/LogoAnimated";

export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-background items-center">
            <LogoAnimated className="max-w-[280px] max-h-[280px] p-4"/>
        </SafeAreaView>
    );
}
