import axios from "axios";

export const login = async (email: string, password: string) => {
    const response = await axios.post("https://kltn-api-staging.sonata.io.vn/api/v1/user/login", {email, password});
    return response.data;
}