import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FirebaseContentQuestion, FirebaseEmptyContentChunkType, FirebaseIconContentChunkType, FirebaseImageContentChunkType, FirebaseParagraphContentChunkType, FirebaseQuestionContentChunkType } from "./add_content";
import Image from "next/image";

export type ChunkType = FirebaseParagraphContentChunkType | FirebaseImageContentChunkType | FirebaseIconContentChunkType | FirebaseQuestionContentChunkType | FirebaseEmptyContentChunkType;

export default function Chunk({ chunk, setChunk, key }: { chunk: ChunkType, setChunk: Function, key: number }) {
    const [type, setType] = useState<'paragraph' | 'image' | 'icon' | 'question' | 'empty'>('paragraph');

    const [paragraph, setParagraph] = useState('');
    const [uri, setUri] = useState('');
    const [icon, setIcon] = useState('');
    const [question, setQuestion] = useState<FirebaseContentQuestion>({ question: '', choices: [{ choice: '', correct: false }] });
    const [fractionOfScreen, setFractionOfScreen] = useState(0.2);

    useEffect(() => {
        if (type === 'paragraph') {
            setChunk({ type: 'paragraph', text: paragraph });
        } else if (type === 'image') {
            setChunk({ type: 'image', uri });
        } else if (type === 'icon') {
            setChunk({ type: 'icon', icon });
        } else if (type === 'question') {
            console.log('change in question');
            setChunk({ type: 'question', question: question.question, choices: question.choices });
        } else if (type === 'empty') {
            setChunk({ type: 'empty', fractionOfScreen });
        }
    }, [type, paragraph, uri, icon, question, fractionOfScreen]);

    return (
        // create a dropdown menu to select the type of content chunk, and then render the appropriate content chunk
        <div className="flex flex-col">
            <select
                className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
                value={type}
                onChange={(e: any) => {
                    const newType = e.target.value;
                    if (newType === 'paragraph') {
                        setParagraph('');
                    } else if (newType === 'image') {
                        setUri('');
                    } else if (newType === 'icon') {
                        setIcon('');
                    } else if (newType === 'question') {
                        setQuestion({ question: '', choices: [{ choice: '', correct: false }] });
                    } else if (newType === 'empty') {
                        setFractionOfScreen(0.2);
                    }
                    setType(newType);
                }}
            >
                <option value="paragraph">Paragraph</option>
                <option value="image">Image</option>
                <option value="icon">Icon</option>
                <option value="question">Question</option>
                <option value="empty">Spacer</option>
            </select>
            {type === 'paragraph' && <ParagraphContentChunk paragraph={paragraph} setParagraph={setParagraph} />}
            {type === 'image' && <ImageContentChunk uri={uri} setUri={setUri} />}
            {type === 'icon' && <IconContentChunk icon={icon} setIcon={setIcon} />}
            {type === 'question' && <QuestionContentChunk question={question} setQuestion={setQuestion} />}
            {type === 'empty' && <EmptyContentChunk fractionOfScreen={fractionOfScreen} setFractionOfScreen={setFractionOfScreen} />}
        </div>
    )
}

function ParagraphContentChunk({ paragraph, setParagraph }: { paragraph: string, setParagraph: Function }) {
    return (
        <textarea className="bg-neutral-100 h-20 rounded-xl p-4 outline-none resize-none"
            placeholder="Text"
            value={paragraph}
            onChange={(e: any) => { setParagraph(e.target.value) }}
        />
    )
}

function ImageContentChunk({ uri, setUri }: { uri: string, setUri: Function }) {
    return (
        <>
        <input className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
            placeholder="URI (link to image or base64)"
            value={uri}
            onChange={(e: any) => { setUri(e.target.value) }}
        />
        {
            uri &&
            // @ts-expect-error
            <img src={uri} onError={(e)=>{e.target.onError = null; e.target.src = ''}} width={200} />
        }
        </>
    )
}

function IconContentChunk({ icon, setIcon }: { icon: string, setIcon: Function }) {
    return (
        <input className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
            placeholder="Icon Name (FontAwesome5)"
            value={icon}
            onChange={(e: any) => { setIcon(e.target.value) }}
        />
    )
}

function QuestionContentChunk({ question, setQuestion }: { question: FirebaseContentQuestion, setQuestion: Function }) {
    const [questionText, setQuestionText] = useState<string>(question.question);
    const [choices, setChoices] = useState(question.choices);

    useEffect(() => {
        setQuestion({ question: questionText, choices: choices });
    }, [questionText, choices]);

    return (
        <div className="flex flex-col space-y-4">
            <input className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
                placeholder="Question"
                value={questionText}
                onChange={(e: any) => {
                    setQuestionText(e.target.value);
                }}
            />
            {choices.map((choice: any, index: number) => (
                <div key={index} className="flex space-x-4 mx-4 items-center">
                    <input
                        placeholder="Correct"
                        type="checkbox"
                        checked={choice.correct}
                        onChange={(event: any) => {
                            const newChoices = [...choices];
                            newChoices[index].correct = event.target.checked;
                            setChoices(newChoices);
                        }}
                    />
                    <input className="flex bg-neutral-100 h-6 rounded-xl p-6 outline-none w-full"
                        placeholder="Choice"
                        value={choice.choice}
                        onChange={(event: any) => {
                            const newChoices = [...choices];
                            newChoices[index].choice = event.target.value;
                            setChoices(newChoices);
                        }}
                    />
                </div>
            ))}
            <div className="flex space-x-4 mx-4 items-center">
                <button className="font-bold text-3xl text-center"
                    onClick={() => {
                        const newChoices = [...choices];
                        newChoices.push({ choice: '', correct: false });
                        console.log(newChoices);
                        setChoices(newChoices);
                    }}
                >+</button>
                <button className="font-bold text-3xl text-center"
                    onClick={() => {
                        const newChoices = [...choices];
                        newChoices.pop();
                        console.log(newChoices);
                        setChoices(newChoices);
                    }}
                >-</button>
            </div>
        </div>
    )
}

function EmptyContentChunk({fractionOfScreen, setFractionOfScreen}: {fractionOfScreen: number, setFractionOfScreen: Function}) {
    return (
        <></>
        // <input className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
        //     placeholder="Fraction of Screen"
        //     value={fractionOfScreen}
        //     onChange={(e: any) => { setFractionOfScreen(e.target.value) }}
        // />
    )
}