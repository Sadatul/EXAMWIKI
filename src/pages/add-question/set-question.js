import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
// const studentUsername = "sadi";

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
    // console.log(questionMetaData);
    // This will be an array of objects where we store the question data
    // for each question individually.

    const router = useRouter();
    const [questionData, setQuestionData] = useState([]);
    console.log(questionData);
    let [questionList, setQuestionList] = useState([]);
    let renderList = [];
    for (let i = 0; i < questionData.length; i++) {
        if (!questionData[i].deleted) {
            renderList.push(questionList[i]);
        }
    }

    return <div>
        {/* This context provider is absolutely necessary
            Otherwise our state doesn't get latest state */}
        <questionDataContext.Provider value={questionData}>
            <setQuestionDataContext.Provider value={setQuestionData}>
                {renderList}
            </setQuestionDataContext.Provider>
        </questionDataContext.Provider>
        <Button className='fixed top-16 right-16' variant='primary' onClick={(e) => {
            let questionDataCopy = _.cloneDeep(questionData);
            questionDataCopy.push(initialQuestionObject);
            setQuestionData(questionDataCopy);

            let copied = [...questionList];
            copied.push(<SetQuestion
                key={copied.length}
                index={copied.length} />);
            setQuestionList(copied);
        }}>
            Add Question
        </Button>
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
            let res = questionData.filter((item) => {
                return !item.deleted;
            })
            if (res.length == 0) {
                alert("No questions added");
                return;
            }

            await fetch('/api/addQuestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionMetaData,
                    questionData: res,
                    studentUsername: questionMetaData.studentUsername,
                }),
            })

            router.replace('/add-question');
        }}>
            Submit
        </Button>

    </div>

}

export const getServerSideProps = async (context) => {
    try {
        let questionMetaData = context.query.questionMetaData;
        if (!questionMetaData) {
            return { redirect: { destination: '/add-question', permanent: false } }
        }

        const { username } = getUserInfoFromRequest(context.req);
        // const studentUsername = username;

        questionMetaData = JSON.parse(questionMetaData);
        // console.log(questionMetaData);
        questionMetaData.studentUsername = username;
        return {
            props: {
                questionMetaData
            }
        }
    } catch (e) {
        console.log(e);
        return { redirect: { destination: '/login', permanent: false } }
    }
}