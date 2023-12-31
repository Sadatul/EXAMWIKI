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

    let isTwoColumn = true; // Whether the options will be two column or single column
    for (let i = 0; i < 4; i++) {
        if (questionObj.options[i].length > 10) {
            isTwoColumn = false;
            break;
        }
    }

    // For two column we need to swap position of B and C in order to get
    // A B
    // C D
    // E
    // If we don't do this...we get
    // A C
    // B D
    // E ... which is confusing

    let optionBC = [
        <Form.Check
            type='radio'
            id={questionObj.id + "-B"}
            name="group1"
            label={" B. " + questionObj.options[1]}
            onChange={handler}
        />,
        <Form.Check
            type='radio'
            id={questionObj.id + "-C"}
            name="group1"
            label={" C. " + questionObj.options[2]}
            onChange={handler}
        />
    ];

    if (isTwoColumn) {
        optionBC.reverse();
    }
    return <div className='flex flex-row gap-2 my-5 bg-slate-100 rounded-2xl p-8 shadow-lg'>
        <div>
            <p>{questionObj.id}.</p>
        </div>
        <div className='grow max-w-full'>
            <p className='mb-3 text-lg' style={{ overflowWrap: 'break-word' }}>{questionObj.body}</p>
            {
                (questionObj.image == null ? "" :
                    <div className='relative h-32 md:h-72'>
                        <Image src={questionObj.image}
                            layout='fill'
                            objectFit='contain'
                            style={{ maxWidth: "500px" }}
                        />
                    </div>)
            }
            <Form className='mt-3' style={{ maxWidth: "700px" }}>
                <div key={questionObj.id}>
                    <div className={isTwoColumn ? 'grid grid-cols-2' : ""}>
                        <div>
                            <Form.Check
                                type='radio'
                                id={questionObj.id + "-A"}
                                name="group1"
                                label={" A. " + questionObj.options[0]}
                                onChange={handler}
                            />
                            {optionBC[0]}
                        </div>
                        <div>
                            {optionBC[1]}
                            <Form.Check
                                type='radio'
                                id={questionObj.id + "-D"}
                                name="group1"
                                label={" D. " + questionObj.options[3]}
                                onChange={handler}
                            />
                        </div>
                    </div>
                    {
                        questionObj.options[4] == null ? "" :
                            <div>
                                <Form.Check
                                    type='radio'
                                    id={questionObj.id + "-E"}
                                    name="group1"
                                    label={" E. " + questionObj.options[4]}
                                    onChange={handler}
                                />
                            </div>
                    }
                </div>
            </Form>
        </div>
    </div>

}