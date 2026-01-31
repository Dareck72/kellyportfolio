// api/user.api.js

import { api } from "./axios";
import { refreshToken } from "./refresh";

export const fetchProjects = async () => {
    try {
        const { data } = await api.get("/projects");
        return data;
    } catch (err) {
        if (err.response?.status === 401) {
            await refreshToken();
            const { data } = await api.get("/projects");
            return data;
        }
        throw err;
    }
}

export const fetchsiteInfos = async () => {
    try {
        const { data } = await api.get("/site");
        return data;
    } catch (err) {
        if (err.response?.status === 401) {
            await refreshToken();
            const { data } = await api.get("/site");
            return data;
        }
        throw err;
    }
}

export const createproject = async (datatosend) => {
    try {
        const { data } = await api.post("/project/", 
            datatosend
        );
        return data;
    } catch (err) {
        if (err.response?.status === 401) {
            await refreshToken();
            const { data } = await api.post("/project/",  
                datatosend
            );
            return data;
        }
        throw err;
    }
}

