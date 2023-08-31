
const teacherUsername = "sadi";

import { useEffect, useState } from 'react';
import SetQuestion from '@/components/SetQuestion';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
const initialQuestionObject = {
    body: "",
    options: ["", "", "", ""],
    image: "",
    answer: "",
    difficulty: -1,
}
import { questionDataContext, setQuestionDataContext } from '@/components/addQuestionContext';
import SetQuestionSchedule from '@/components/setQuestionSchedule';

export default function setQuestionPage({ questionMetaData }) {
    questionMetaData.datetime = new Date(questionMetaData.datetime);
    // console.log(questionMetaData);
    const router = useRouter();
    let tmp = [];
    let renderList = [];
    for (let i = 0; i < questionMetaData.questionCount; i++) {
        tmp.push(initialQuestionObject);
    }
    // console.log(tmp);
    const [questionData, setQuestionData] = useState(tmp);
    // let [questionList, setQuestionList] = useState(renderList);
    // if (questionData.length == 0) {
    //     let tmp = [];
    //     let renderList = [];
    //     for (let i = 0; i < questionMetaData.questionCount; i++) {
    //         tmp.push(initialQuestionObject);
    //         renderList.push(<SetQuestion
    //             key={i}
    //             index={i}
    //             deleteButton={false}
    //         />);
    //     }
    //     setQuestionData(tmp);
    //     setQuestionList(renderList);
    // }
    console.log(questionData);
    // console.log("Re-renders");

    for (let i = 0; i < questionMetaData.questionCount; i++) {
        renderList.push(<SetQuestionSchedule
            key={i}
            index={i}
            questionData={questionData}
            setQuestionData={setQuestionData}
        />);
    }

    // This will be an array of objects where we store the question data
    // for each question individually.
    return <div>
        {renderList}
        <Button className='fixed top-32 right-16' variant='success' onClick={async (e) => {
            for (let i = 0; i < questionData.length; i++) {
                if (questionData[i].deleted) continue;
                if (questionData[i].body == "") {
                    alert("Question " + (i + 1) + " has no body");
                    return;
                }
                if (questionData[i].answer == "") {
                    alert("Question " + (i + 1) + " has no answer");
                    return;
                }
                if (questionData[i].difficulty == -1) {
                    alert("Question " + (i + 1) + " has no difficulty");
                    return;
                }
                if (questionData[i].options[0] == "") {
                    alert("Question " + (i + 1) + " has no option A");
                    return;
                }
                if (questionData[i].options[1] == "") {
                    alert("Question " + (i + 1) + " has no option B");
                    return;
                }
                if (questionData[i].options[2] == "") {
                    alert("Question " + (i + 1) + " has no option C");
                    return;
                }
                if (questionData[i].options[3] == "") {
                    alert("Question " + (i + 1) + " has no option D");
                    return;
                }
                if (questionData[i].options.length > 4 && questionData[i].options[4] == "") {
                    alert("Question " + (i + 1) + " has no option E");
                    return;
                }
            }

            await fetch('/api/addScheduledExam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionMetaData,
                    questionData: questionData,
                    teacherUsername
                }),
            })

            router.replace('/schedule-exam');
        }}>
            Submit
        </Button>
    </div>
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