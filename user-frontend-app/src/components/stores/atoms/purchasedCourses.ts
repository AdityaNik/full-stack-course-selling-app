import { atom } from "recoil";

export interface PurchasedCourse {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
    _id: string
}

export const purchasedCoursesState = atom<PurchasedCourse[]>({
    key: "courseState",
    default: []
});