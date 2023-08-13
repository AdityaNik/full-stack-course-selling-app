import { selector } from "recoil";
import { courseState } from "../atoms/course";

export const isCourseLoading = selector({
    key: "isCourseLoading",
    get: ({ get }) => {
        const state = get(courseState);
        return state.isLoading
    }
})

export const courseTitle = selector({
    key: "courseTitle",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            if (state.course.title) {
                return state.course.title
            }
            return "";
        } else {
            return "";
        }
    }
})

export const courseDescription = selector({
    key: "courseDescription",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            if (state.course.description) {
                return state.course.description
            }
            return "";
        } else {
            return "";
        }
    }
})

export const coursePrice = selector({
    key: "coursePrice",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            if (state.course.price) {
                return state.course.price
            }
            return "";
        } else {
            return "";
        }
    }
})

export const courseImageLink = selector({
    key: "courseImageLink",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            if (state.course.imageLink) {
                return state.course.imageLink
            }
            return "";
        } else {
            return "";
        }
    }
})

export const coursePublished = selector({
    key: "coursePublished",
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            if (state.course.published) {
                return state.course.published
            }
            return "";
        } else {
            return "";
        }
    }
})