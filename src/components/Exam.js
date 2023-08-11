/* questionsDataArr is the array of questions each memeber is a question object*/
// answers is a state variable that tracks the answers

/* questionObj is js object with the following attributes
    id: The index number of question, THIS IS NOT THE DATABASE ID OF QUESTION..just dag no.
    body: The Quesiton itself
    options: An array of options can have 4 or 5
    optional-> image -> contains an image Link if no image is provided then
                        the obj will have null value
*/

import Question from "./Question";
import { useState } from 'react';
import useSWR from 'swr';


// const dummyQuestion = {
//     id: 1,
//     body: "Who is the first President of Bangladesh?",
//     options: ["Sheikh Mujibur Rahman", "Barack Obama", "Sheikh Hasina", "Khaleda Zia", "Jasim"],
//     image: "https://picsum.photos/400/300"
// }

export default function Exam({ examData }) {
    let initialAnswer = new Array(examData.questionCount).fill(null);
    const [answers, setAnswers] = useState(initialAnswer)
    // un-answered questions will remain NULL
    console.log(answers);

    // Fetching data from database use hello api
    const fetcher = (url) => fetch(url).then(res => res.json());
    const { data, error, isLoading } = useSWR('/api/hello', fetcher)
    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

    let result = data.rows;


    // Where we are doing some dummy data generation just for show casing purposes

    examData.questionCount = result.length // THIS IS JUST FOR SHOW CASING..
    // MUST DELETE THIS LINE

    let questionsDataArr = [];
    for (let i = 0; i < examData.questionCount; i++) {
        let tmp = {
            id: i + 1,
            body: result[i][1],
            options: [result[i][3], result[i][4], result[i][5], result[i][6], result[i][7]],
            image: result[i][2]

        };
        questionsDataArr.push(tmp);
    }

    let len = examData.questionCount;
    let questionsArr = [];
    for (let i = 0; i < len; i++) {
        questionsArr.push(
            <li key={i}><Question questionObj={questionsDataArr[i]} answers={answers} setAnswers={setAnswers} /></li>
        )
    }

    return <div className="flex flex-row justify-center"><ul>{questionsArr}</ul></div>
}