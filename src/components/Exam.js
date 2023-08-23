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
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';


// const dummyQuestion = {
//     id: 1,
//     body: "Who is the first President of Bangladesh?",
//     options: ["Sheikh Mujibur Rahman", "Barack Obama", "Sheikh Hasina", "Khaleda Zia", "Jasim"],
//     image: "https://picsum.photos/400/300"
// }

export default function Exam({ questionsData }) {
    let router = useRouter();
    let initialAnswer = new Array(questionsData.questionCount).fill(null);
    const [answers, setAnswers] = useState(initialAnswer)
    // un-answered questions will remain NULL
    console.log(answers);
    console.log(questionsData.questionIds);

    let len = questionsData.questionCount;
    let questionsArr = [];
    for (let i = 0; i < len; i++) {
        questionsArr.push(
            <li key={i}><Question questionObj={questionsData.array[i]} answers={answers} setAnswers={setAnswers} /></li>
        )
    }

    return <div>
        <div className="flex flex-row justify-center">
            <ul className="w-3/4">{questionsArr}</ul>
        </div>
        <div className='flex flex-row justify-center mb-10'>
            <Button variant="primary" style={{ width: '50%' }}
                onClick={() => {
                    let tmp = [];
                    for (let i = 0; i < questionsData.questionCount; i++) {
                        tmp.push([questionsData.questionIds[i], answers[i] === null ? 'N' : answers[i]]);
                    }
                    tmp.sort((a, b) => a[0] - b[0]);
                    console.log(tmp);
                    let answerStr = '';
                    for (let i = 0; i < questionsData.questionCount; i++) {
                        answerStr += tmp[i][1];
                    }

                    router.push({
                        pathname: '/exam/exam_result',
                        query: {
                            message: 'Submission Successful',
                            examId: questionsData.examId,
                            answers: answerStr
                        }
                    })

                }}
            >
                Submit
            </Button>
        </div>
    </div>
}