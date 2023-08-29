import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Timer({ questionsData, answers, time }) {
    const [timeLeft, setTimeLeft] = useState(time);
    const router = useRouter();
    function numberFormatter(sec) {
        // Formats single digit numbers to show as two digits with leading zero
        return (sec < 10 ? '0' : '') + sec;
    }
    useEffect(() => {
        if (timeLeft === 0) {
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

            router.replace({
                pathname: '/exam/exam_result',
                query: {
                    message: 'Times Up!',
                    examId: questionsData.examId,
                    answers: answerStr
                }
            })
        }
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    return (
        // <div className='fixed top-5 right-24  p-4 rounded-2xl text-white'>
        <div className={'fixed top-10 right-24 p-3 rounded-2xl text-white ' + (timeLeft <= 60 ? 'bg-red-500' : 'bg-green-500')}>
            <p className=' text-3xl font-bold'>Time Left: </p>
            <p className=' text-3xl font-bold ml-10'>{Math.trunc(timeLeft / 60)}:{numberFormatter(timeLeft % 60)}</p>
        </div>
    );
}