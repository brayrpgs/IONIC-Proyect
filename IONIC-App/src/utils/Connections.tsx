export const URL_BASE = "http://localhost:5041"
export const URL_GAMES = "http://localhost:5041/api/games"

export interface Games {
    id: number,
    title: string,
    imageUrl: string,
    platform: string,
    hoursPlayed: number,
    isCompleted: boolean,
    genre: string
}

export const FetchGames = async (): Promise<Games[]> => {
    try {
        console.log("Starting the request...");
        const res = await fetch(URL_GAMES);
        console.log("Request completed successfully...");
        console.log("Checking the response...");
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        console.log("Converting to JSON...");
        const result: Games[] = await res.json();
        console.log("Returning Games results...", result);
        return result;

    } catch (error) {
        console.error("Error fetching games:", error);
        throw error;
    }
}
