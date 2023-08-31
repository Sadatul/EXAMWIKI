
const studentUsername = "sadi";

import { useState } from 'react';
import SetQuestion from '@/components/SetQuestion';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
const initialQuestionObject = {
    deleted: false, // This is to add the feature of delete with lazy deletion
    body: "",
    options: ["", "", "", ""],
    image: "",
    answer: "",
    difficulty: -1,
}
import { questionDataContext, setQuestionDataContext } from '@/components/addQuestionContext';

export default function setQuestionPage({ questionMetaData }) {
    questionMetaData.datetime = new Date(questionMetaData.datetime);
    console.log(questionMetaData);
    // This will be an array of objects where we store the question data
    // for each question individually.
    return <h1>Text</h1>
}

export const getServerSideProps = async (context) => {
    let questionMetaData = context.query.metaData;
    if (!questionMetaData) {
        return { redirect: { destination: '/schedule-exam', permanent: false } }
    }
    questionMetaData = JSON.parse(questionMetaData);
    // console.log(questionMetaData);

    return {
        props: {
            questionMetaData
        }
    }
}