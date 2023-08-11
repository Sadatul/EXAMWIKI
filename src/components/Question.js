/* questionObj is js object with the following attributes
    id: The index number of question, THIS IS NOT THE DATABASE ID OF QUESTION..just dag no.
    body: The Quesiton itself
    options: An array of options can have 5 eleemnts. The last element will be null if 
            5th option doesn't exist
    optional-> image -> contains an image Link if no image is provided then
                        the obj will have null value
*/
// answers is a state variable that tracks the answers
import Image from 'next/image';
import Form from 'react-bootstrap/Form';


export default function Question({ questionObj, answers, setAnswers }) {
    function handler(e) {
        let tmp = e.target.id.split('-');
        let tmpAnswer = [...answers];
        tmpAnswer[Number(tmp[0] - 1)] = tmp[1];
        setAnswers(tmpAnswer);
    }

    return <div className='flex flex-row gap-5 my-5'>
        <div>
            <p>{questionObj.id}.</p>
        </div>
        <div>
            <p className='mb-3 text-lg'>{questionObj.body}</p>
            {
                (questionObj.image == null ? "" : <Image src={questionObj.image} width={400} height={300} />)
            }
            <Form className='mt-3'>
                <div key={questionObj.id}>
                    <Form.Check
                        type='radio'
                        id={questionObj.id + "-A"}
                        name="group1"
                        label={" A. " + questionObj.options[0]}
                        onChange={handler}
                    />
                    <Form.Check
                        type='radio'
                        id={questionObj.id + "-B"}
                        name="group1"
                        label={" B. " + questionObj.options[1]}
                        onChange={handler}
                    />
                    <Form.Check
                        type='radio'
                        id={questionObj.id + "-C"}
                        name="group1"
                        label={" C. " + questionObj.options[2]}
                        onChange={handler}
                    />
                    <Form.Check
                        type='radio'
                        id={questionObj.id + "-D"}
                        name="group1"
                        label={" D. " + questionObj.options[3]}
                        onChange={handler}
                    />
                    {
                        questionObj.options[4] == null ? "" :
                            <Form.Check
                                type='radio'
                                id={questionObj.id + "-E"}
                                name="group1"
                                label={" E. " + questionObj.options[4]}
                                onChange={handler}
                            />
                    }
                </div>
            </Form>
        </div>
    </div>

}