import Image from 'next/image';
import Form from 'react-bootstrap/Form';


export default function QuestionResult({ questionObj, actualAnswer, givenAnswer }) {

    let isTwoColumn = true; // Whether the options will be two column or single column
    for (let i = 0; i < 4; i++) {
        if (questionObj.options[i].length > 10) {
            isTwoColumn = false;
            break;
        }
    }
    function optionColorHandler(option, givenAnswer, actualAnswer) {
        if (givenAnswer == 'N') {
            if (option == actualAnswer) {
                return 'bg-sky-300';
            }
            else return "";
        }
        else {
            if (givenAnswer != actualAnswer) {
                if (option == givenAnswer) {
                    return 'bg-red-500';
                }
            }
            if (option == actualAnswer) {
                return 'bg-green-500';
            }
            return "";
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
    const optionStyling = " p-1 rounded-2xl my-1" // This styling will be applied to all options
    let optionBC = [
        <div id={questionObj.id + "-B"} className={optionColorHandler('B', givenAnswer, actualAnswer) + optionStyling}>
            {" B. " + questionObj.options[1]}
        </div>,
        <div id={questionObj.id + "-C"} className={optionColorHandler('C', givenAnswer, actualAnswer) + optionStyling}>
            {" C. " + questionObj.options[2]}</div>
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
            <div className='mt-3' style={{ maxWidth: "700px" }}>
                <div key={questionObj.id}>
                    <div className={isTwoColumn ? 'grid grid-cols-2' : ""}>
                        <div>
                            <div id={questionObj.id + "-A"} className={optionColorHandler('A', givenAnswer, actualAnswer) + optionStyling}>
                                {" A. " + questionObj.options[0]}</div>
                            {optionBC[0]}
                        </div>
                        <div>
                            {optionBC[1]}
                            <div id={questionObj.id + "-D"} className={optionColorHandler('D', givenAnswer, actualAnswer) + optionStyling}>{"D. " + questionObj.options[3]}</div>
                        </div>
                    </div>
                    {
                        questionObj.options[4] == null ? "" :
                            <div>
                                <div id={questionObj.id + "-E"} className={optionColorHandler('E', givenAnswer, actualAnswer) + optionStyling}>{"E. " + questionObj.options[4]}</div>
                            </div>
                    }
                </div>
            </div>
        </div>
    </div>

}