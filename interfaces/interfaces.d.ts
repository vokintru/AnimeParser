interface searchAnime {
    id: number;
    name: string;
    russian: string;
    image: {
        original: string;
        preview: string;
        x96: string;
        x48: string;
    }
    url: string;
    kind: string;
    score: string;
    status: string;
    episodes: number;
    episodes_aired: number;
    aired_on: string | null;
    released_on: string | null;
}

interface watchlistAnime {
    id: number;
    episodes: number;
    title_id: number;
    updated_at: string;
    total_episodes: number;
    name: string;
    original_name: string;
    poster: string;
    type: string;
    score: string;
    status: string;
}