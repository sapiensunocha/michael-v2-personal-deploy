import dotenv from "dotenv"; dotenv.config(); console.log("Mapbox Token:", process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? "Present" : "MISSING (Map tiles will not load without a valid token)");
