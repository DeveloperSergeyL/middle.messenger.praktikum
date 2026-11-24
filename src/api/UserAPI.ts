import HTTPTransport from "../utils/HTTPTransport";
import { UpdatePasswordData, UpdateProfileData, UserDTO } from "../types";

export default class UserAPI {
    private http = new HTTPTransport('/user');

    public updateProfile(data: UpdateProfileData): Promise<UserDTO> {
        return this.http.put("/profile", { data });
    }

    public updateAvatar(data: FormData): Promise<UserDTO> {
        return this.http.put("/profile/avatar", { data });
    }

    public updatePassword(data: UpdatePasswordData): Promise<string> {
        return this.http.put("/password", { data });
    }

    public searchByLogin(login: string): Promise<UserDTO[]> {
        return this.http.post("/search", { data: { login } });
    }
}
