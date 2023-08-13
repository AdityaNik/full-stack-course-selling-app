import { atom } from "recoil";

interface User {
    isLoading: boolean;
    user: string
}
export const userState = atom<User>({
    key: "userState",
    default: {
        isLoading: true,
        user: ""
    }
});