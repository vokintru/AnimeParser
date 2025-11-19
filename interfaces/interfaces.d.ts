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

interface rateAnime {
    id: number;
    user_id: number;
    target_id: number;
    target_type: string;
    score: number;
    status: string;
    rewatches: number;
    episodes: number;
    volumes: number;
    chapters: number;
    text: string | null;
    text_html: string;
    created_at: string;
    updated_at: string;
}