import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export class ANPRS_CONFIG {
    static BASE_URL = 'https://anime.v0k1nt.su/api/v1';
    static API_KEY: string | null = null;

    static async init() {
        this.API_KEY = await SecureStore.getItemAsync("access_token");
    }

    static async getHeaders() {
        if (!this.API_KEY) {
            this.API_KEY = await SecureStore.getItemAsync("access_token");
        }

        return {
            accept: 'application/json',
            Authorization: `Bearer ${this.API_KEY}`,
        };
    }
}

export const searchAnime = async ({ query }: {query: string}) => {
    console.log(query);
    const endpoint = `${ANPRS_CONFIG.BASE_URL}/search/${encodeURIComponent(query)}`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: await ANPRS_CONFIG.getHeaders(),
    })
    if(!response.ok) {
        if (response.status === 403) {
            await SecureStore.deleteItemAsync("access_token");
            router.replace("/auth");
            return;
        }
        throw new Error(`Ошибка запроса ${endpoint}\n${response.statusText}`);
    }
    const data = await response.json();
    return data;
}