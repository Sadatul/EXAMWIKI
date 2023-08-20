import Exam from "@/components/Exam";
import { runQueryFromFile } from "@/utils/runQuery";

export default function practiceExamPage({ questionsData }) {
    // console.log(questionsData);

    // If the user doesn't follow proper procedure to get to this page
    // then redirect them to the home exam page
    return <Exam questionsData={questionsData} />
}

export const getServerSideProps = async (context) => {
    let examData = context.query.examData;
    // If the user doesn't follow proper procedure to get to this page
    // then redirect them to the home exam page
    if (!examData) {
        return { redirect: { destination: '/exam', permanent: false } }
    }
    examData = JSON.parse(examData);
    console.log(examData);
    let questionsData = {
        error: true,
        questionCount: 10,
        array: []
    }

    questionsData.error = false;
    const result = await runQueryFromFile('getAllQuestions');

    questionsData.questionCount = result.length;

    for (let i = 0; i < questionsData.questionCount; i++) {
        let tmp = {
            id: i + 1,
            body: result[i].body,
            options: [result[i].optionA, result[i].optionB, result[i].optionC, result[i].optionD, result[i].optionE],
            image: result[i].image

        };
        questionsData.array.push(tmp);
    }
    return { props: { questionsData } }
}