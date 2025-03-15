import { UserRating } from "../component/Rating";

interface ActionResult {
    status: "OK" | "FAILED"
    data?: any
    error?: any
}

class LocalStorageHelper {
    private ITEM_KEY__USER_RATING = "user-ratings";

    UpsertUserRating(userRating: UserRating){
        const result: ActionResult = {
            status: "OK"
        }

        try{
            const existingRatings = localStorage.getItem(this.ITEM_KEY__USER_RATING);

            // if no existing ratings, do inserting directly
            if (!!!existingRatings){
                localStorage.setItem(this.ITEM_KEY__USER_RATING, JSON.stringify([userRating]));
                return result;
            }
    
            // there are existing ratings
            const parsedRatings = JSON.parse(existingRatings) as UserRating[];
            
            // combine new rating to existing ratings
            parsedRatings.push(userRating);

            // update local storage
            localStorage.setItem(this.ITEM_KEY__USER_RATING, JSON.stringify(parsedRatings));
            return result;
        }catch(error){
            console.error("failed to upsert User rating - ", error);
            result.status = "FAILED"
            result.error = error
            return result
        }
    }
}

export const localStorageHelper = new LocalStorageHelper();