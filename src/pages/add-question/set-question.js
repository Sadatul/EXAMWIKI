
const studentUsername = "sadi";

export default function setQuestionPage({ questionMetaData }) {
    console.log(questionMetaData);
    return <h1>THis is where we work</h1>

}

export const getServerSideProps = async (context) => {
    let questionMetaData = context.query.questionMetaData;
    if (!questionMetaData) {
        return { redirect: { destination: '/add-question', permanent: false } }
    }

    questionMetaData = JSON.parse(questionMetaData);
    // console.log(questionMetaData);

    return {
        props: {
            questionMetaData
        }
    }
}