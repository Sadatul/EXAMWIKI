import { Form, Button } from "react-bootstrap"
import _ from "lodash"
import { useContext, useState } from "react"
import { questionDataContext, setQuestionDataContext } from "./addQuestionContext"
// question data is a list
// This form will save its data in questionData list index
// index will be fixed even if the previous one gets deleted.

// The questionObject on ith index will already exist no need to add it here
// It will be added in set-question-page.js
export default function SetQuestionSchedule({ index, questionData, setQuestionData, topicIds }) {
    // const questionData = useContext(questionDataContext);
    // const setQuestionData = useContext(setQuestionDataContext);
    let optionList = [];
    for (let i = 0; i < topicIds.length; i++) {
        optionList.push(
            <option key={i} value={topicIds[i]}>
                {topicIds[i]}
            </option>
        );
    }
    const [optionE, setOptionE] = useState(false);
    // console.log("Outer" + index);
    // console.log(questionData);
    return <div className="flex flex-row justify-center mt-5">
        <Form className="w-1/2 p-10 bg-slate-100 rounded-2xl shadow-2xl relative" spellCheck="false">
            <p className="text-center">{index + 1}</p>
            <Form.Select
                aria-label="Default select example"
                id={index + "topics"}
                onChange={(e) => {
                    let copied = JSON.parse(JSON.stringify(questionData));
                    copied[index].topicId = e.target.value;
                    setQuestionData(copied);
                }}
            >
                <option value="">Select Topic</option>
                {optionList}
            </Form.Select>
            <Form.Group key="body" className="mb-3" controlId="exampleForm.ControlTextarea1">
                {/* <Form.Label>Question Body</Form.Label> */}
                <Form.Control as="textarea" rows={3}
                    placeholder="Enter Question Body"
                    onChange={(e) => {
                        // console.log(questionData);
                        let copied = JSON.parse(JSON.stringify(questionData));
                        // console.log(questionData);
                        // console.log(copied);
                        copied[index].body = e.target.value;
                        setQuestionData(copied);
                    }}
                />
            </Form.Group>
            <Form.Group key="options" className="mb-3" controlId="exampleForm.ControlTextarea1">
                {/* <Form.Label>Question Body</Form.Label> */}
                <Form.Control key="optionA" as="textarea" rows={1}
                    placeholder="Option A"
                    onChange={(e) => {
                        console.log("insideOptionA");
                        console.log(questionData);
                        let copied = JSON.parse(JSON.stringify(questionData));
                        copied[index].options[0] = e.target.value;
                        setQuestionData(copied);
                    }}
                />
                <Form.Control key="optionB" as="textarea" rows={1}
                    placeholder="Option B"
                    onChange={(e) => {
                        let copied = JSON.parse(JSON.stringify(questionData));
                        copied[index].options[1] = e.target.value;
                        setQuestionData(copied);
                    }}
                />
                <Form.Control key="optionC" as="textarea" rows={1}
                    placeholder="Option C"
                    onChange={(e) => {
                        let copied = JSON.parse(JSON.stringify(questionData));
                        console.log(index);
                        console.log(questionData);
                        copied[index].options[2] = e.target.value;
                        setQuestionData(copied);
                    }}
                />
                <Form.Control key="optionD" as="textarea" rows={1}
                    placeholder="Option D"
                    onChange={(e) => {
                        let copied = JSON.parse(JSON.stringify(questionData));
                        copied[index].options[3] = e.target.value;
                        setQuestionData(copied);
                    }}
                />
                <Form.Check // prettier-ignore
                    type="switch"
                    id={index + "optinESwitch"}
                    label="Toggle Option E"
                    onChange={(e) => {
                        setOptionE(e.target.checked);
                        // optionE was true before and now it is false but it hasn't
                        // been updated yet. So we check for true
                        if (setOptionE && questionData[index].options.length == 5) {
                            let copied = JSON.parse(JSON.stringify(questionData));
                            copied[index].options.pop();
                            copied[index].answer = "";
                            setQuestionData(copied);
                        }
                    }}
                />
                {
                    optionE ? (
                        <Form.Control key="optionE" as="textarea" rows={1}
                            placeholder="Option E"
                            onChange={(e) => {
                                let copied = JSON.parse(JSON.stringify(questionData));
                                if (copied[index].options.length == 4) {
                                    copied[index].options.push(e.target.value);
                                }
                                else {
                                    copied[index].options[4] = e.target.value;
                                }
                                setQuestionData(copied);
                            }}
                        />
                    ) : ""
                }
            </Form.Group>

            <Form.Group key={"answer" + optionE} className="mb-3 flex flex-row gap-5" controlId="exampleForm.ControlTextarea1">
                <Form.Select
                    aria-label="Default select example"
                    id={index + "answer"}
                    onChange={(e) => {
                        let copied = JSON.parse(JSON.stringify(questionData));
                        copied[index].answer = e.target.value;
                        setQuestionData(copied);
                    }}
                >
                    <option value="">Answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    {
                        optionE ? <option value="E">E</option> : ""
                    }
                </Form.Select>
                <Form.Select
                    aria-label="Default select example"
                    id={index + "difficulty"}
                    onChange={(e) => {
                        let copied = JSON.parse(JSON.stringify(questionData));
                        copied[index].difficulty = Number(e.target.value);
                        setQuestionData(copied);
                    }}
                >
                    <option value="">Difficulty</option>
                    <option value="1">Easy</option>
                    <option value="2">Medium</option>
                    <option value="3">Hard</option>
                </Form.Select>
            </Form.Group>
        </Form>
    </div>
}