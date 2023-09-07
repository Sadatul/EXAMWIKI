import { createContext, useState } from "react"

const intialStateObject = {
    class: "",
    subjectInput: "",
    chapter: -1,
    questions: []
}

export const questionDataContext = createContext(null);
export const setQuestionDataContext = createContext(null);