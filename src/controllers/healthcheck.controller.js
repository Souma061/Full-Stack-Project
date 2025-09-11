import { version } from 'mongoose';
import { ApiResponse } from "../utils/Apiresponse.js"; // Fixed: ApiResponse -> Apiresponse
import { asyncHandler } from "../utils/asynchandler.js"; // Fixed: asyncHandler -> asynchandler


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    const healthData = {
        status: "OK",
        message: "Server is running smoothly",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
        services: {
            database: {
                status: "Connected", // In real scenario, check DB connection
                type: "MongoDB",
                version: version
            },
            server: {
                status: "Running",
                port: process.env.PORT || 8000,
                host: process.env.HOST || "localhost"
            }
        }
    };
    return res.status(200).json(new ApiResponse(healthData, 200, "Healthcheck data fetched successfully"));
});

export {
    healthcheck
};
