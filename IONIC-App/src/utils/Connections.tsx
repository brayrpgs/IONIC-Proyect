export const URL_BASE = "http://localhost:5041"
export const URL_GAMES = "http://localhost:5041/api/games"

export interface Games {
    id: number,
    title: string,
    imageUrl: string | Blob,
    platform: string,
    hoursPlayed: number,
    isCompleted: boolean,
    genre: string
}

export interface GameToSend {
    id: number,
    title: string,
    image: Blob | null,
    platform: string,
    hoursPlayed: string,
    isCompleted: string,
    genre: string
}

export const FetchGames = async (): Promise<Games[]> => {
    try {
        const res = await fetch(URL_GAMES);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const result: Games[] = await res.json();
        return result;

    } catch (error) {
        console.error("Error fetching games:", error);
        throw error;
    }
}

export const SendGame = async (game: GameToSend) => {
    try {
      const form = new FormData();
      form.append("title", game.title);
      if (game.image !== null && game.image !== undefined) {
        form.append("image", game.image);
      }
      form.append("platform", game.platform);
      form.append("hoursPlayed", game.hoursPlayed);
      form.append("isCompleted", game.isCompleted);
      form.append("genre", game.genre);
  
      const res = await fetch(URL_GAMES, {
        method: "POST",
        body: form,
      });
  
      if (!res.ok) {
        let errorMessage = await res.text();
        try {
          const json = JSON.parse(errorMessage);
          errorMessage = json.message || JSON.stringify(json);
        } catch {
          
        }
        throw new Error(`Error ${res.status}: ${errorMessage}`);
      }
  
      const result: Games = await res.json();
      return result;
  
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

export const DeleteGame = async (id: string) => {
    try {
        const res = await fetch(URL_GAMES + "/" + id, {
            method: "DELETE",
        });

        if (!res.ok) {
            const contentType = res.headers.get("content-type");
            let errorMessage = "Unknown error occurred";

            if (contentType?.includes("application/json")) {
                const errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await res.text();
            }

            console.error("Server error:", errorMessage);
            throw new Error(errorMessage);
        }

        const result = await res.json();
        console.log("Result is...", result);
        return result;

    } catch (error) {
        console.error("Error deleting game:", error);
        throw error;
    }
};

export const UpdateGame = async (game: GameToSend) => {
    try {
      const form = new FormData();
      form.append("id", game.id.toString());
      form.append("title", game.title);
      form.append("image", game.image instanceof File ? game.image : new File([""], "", { type: "application/octet-stream" }));
      form.append("platform", game.platform);
      form.append("hoursPlayed", game.hoursPlayed);
      form.append("isCompleted", game.isCompleted);
      form.append("genre", game.genre);
  
      const res = await fetch(URL_GAMES, {
        body: form,
        method: "PUT",
      });
  
      if (!res.ok) {
        
        let errorMessage = await res.text();
        try {
          
          const json = JSON.parse(errorMessage);
          errorMessage = json.message || JSON.stringify(json);
        } catch {
          
        }
        throw new Error(`Error ${res.status}: ${errorMessage}`);
      }
  
      const result: Games = await res.json();
      return result;
  
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
