import { atom } from 'recoil';

export interface Course {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
    _id: string
}

interface CourseAtom {
    isLoading: boolean
    course: CourseInput
}

type CourseInput = Partial<Course>;

export const courseState = atom<CourseAtom>({
    key: "courseState",
    default: {
        isLoading: true,
        course: {}
    }
})