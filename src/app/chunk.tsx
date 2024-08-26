import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FirebaseContentQuestion, FirebaseEmptyContentChunkType, FirebaseIconContentChunkType, FirebaseImageContentChunkType, FirebaseParagraphContentChunkType, FirebaseQuestionContentChunkType } from "./add_content";
import Image from "next/image";

export type ChunkType = FirebaseParagraphContentChunkType | FirebaseImageContentChunkType | FirebaseIconContentChunkType | FirebaseQuestionContentChunkType | FirebaseEmptyContentChunkType;

export default function Chunk({
    chunk,
    setChunk,
    valid,
    setValid,
}: {
    chunk: ChunkType & {
        valid: boolean;
    };
    setChunk: Function;
    valid: boolean;
    setValid: Function;
}) {
    const [type, setType] = useState<"paragraph" | "image" | "icon" | "question" | "empty">(chunk.type);

    const [paragraph, setParagraph] = useState("");
    const [uri, setUri] = useState("");
    const [icon, setIcon] = useState("");
    const [question, setQuestion] = useState<FirebaseContentQuestion>({ question: "", choices: [{ choice: "", correct: false }] });
    const [fractionOfScreen, setFractionOfScreen] = useState(0.2);

    useEffect(() => {
        if (type === "paragraph") {
            setChunk({ type: "paragraph", text: paragraph, valid });
        } else if (type === "image") {
            setChunk({ type: "image", uri, valid });
        } else if (type === "icon") {
            setChunk({ type: "icon", icon, valid });
        } else if (type === "question") {
            console.log("change in question");
            setChunk({ type: "question", question: question.question, choices: question.choices, valid });
        } else if (type === "empty") {
            setChunk({ type: "empty", fractionOfScreen, valid });
        }
    }, [type, paragraph, uri, icon, question, fractionOfScreen, valid]);

    return (
        // create a dropdown menu to select the type of content chunk, and then render the appropriate content chunk
        <div
            className="flex"
            style={{
                borderWidth: valid ? 0 : 2,
                borderRadius: 10,
                borderColor: valid ? "transparent" : "#ff0000",
            }}
        >
            <div className="flex flex-col w-full p-2 bg-white rounded-2xl">
                <select
                    className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
                    value={type}
                    onChange={(e: any) => {
                        setValid(false);
                        const newType = e.target.value;
                        if (newType === "paragraph") {
                            setParagraph("");
                        } else if (newType === "image") {
                            setUri("");
                        } else if (newType === "icon") {
                            setIcon("");
                        } else if (newType === "question") {
                            setQuestion({ question: "", choices: [{ choice: "", correct: false }] });
                        } else if (newType === "empty") {
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
                {type === "paragraph" && <ParagraphContentChunk paragraph={paragraph} setParagraph={setParagraph} valid={valid} setValid={setValid} />}
                {type === "image" && <ImageContentChunk uri={uri} setUri={setUri} valid={valid} setValid={setValid} />}
                {type === "icon" && <IconContentChunk icon={icon} setIcon={setIcon} valid={valid} setValid={setValid} />}
                {type === "question" && <QuestionContentChunk question={question} setQuestion={setQuestion} valid={valid} setValid={setValid} />}
                {type === "empty" && <EmptyContentChunk fractionOfScreen={fractionOfScreen} setFractionOfScreen={setFractionOfScreen} valid={valid} setValid={setValid} />}
            </div>
        </div>
    );
}

function ParagraphContentChunk({ paragraph, setParagraph, valid, setValid }: { paragraph: string; setParagraph: Function; valid: boolean; setValid: Function }) {
    return (
        <textarea
            className="bg-neutral-100 h-20 rounded-xl p-4 outline-none resize-none"
            placeholder="Text"
            value={paragraph}
            onChange={(e: any) => {
                setParagraph(e.target.value);
                setValid(e.target.value.length > 0);
            }}
        />
    );
}

function ImageContentChunk({ uri, setUri, valid, setValid }: { uri: string; setUri: Function; valid: boolean; setValid: Function }) {
    return (
        <>
            <input
                className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
                placeholder="URI (link to image or base64)"
                value={uri}
                onChange={(e: any) => {
                    setUri(e.target.value);
                    setValid(e.target.value.length > 0);
                }}
            />
            {uri && (
                <img
                    src={uri}
                    onError={(e) => {
                        // @ts-expect-error
                        e.target.onError = null;
                        // @ts-expect-error
                        e.target.src = "";
                    }}
                    width={200}
                />
            )}
        </>
    );
}

function IconContentChunk({ icon, setIcon, valid, setValid }: { icon: string; setIcon: Function; valid: boolean; setValid: Function }) {
    return (
        <>
            <input
                className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
                placeholder="Icon Name (FontAwesome5)"
                value={icon}
                onChange={(e: any) => {
                    setIcon(e.target.value);
                    setValid(e.target.value.length > 0);
                }}
            />
        </>
    );
}

function QuestionContentChunk({ question, setQuestion, valid, setValid }: { question: FirebaseContentQuestion; setQuestion: Function; valid: boolean; setValid: Function }) {
    const [questionText, setQuestionText] = useState<string>(question.question);
    const [choices, setChoices] = useState(question.choices);

    useEffect(() => {
        setQuestion({ question: questionText, choices: choices });
        setValid(choices.length > 1 && choices.filter((choice: any) => choice.correct).length === 1 && questionText.length > 0 && choices.filter((choice: any) => choice.choice).length === choices.length);
    }, [questionText, choices]);

    return (
        <div className="flex flex-col space-y-4">
            <input
                className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
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
                    <input
                        className="flex bg-neutral-100 h-6 rounded-xl p-6 outline-none w-full"
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
                <button
                    className="font-bold text-3xl text-center"
                    onClick={() => {
                        const newChoices = [...choices];
                        newChoices.push({ choice: "", correct: false });
                        console.log(newChoices);
                        setChoices(newChoices);
                    }}
                >
                    +
                </button>
                <button
                    className="font-bold text-3xl text-center"
                    onClick={() => {
                        const newChoices = [...choices];
                        newChoices.pop();
                        console.log(newChoices);
                        setChoices(newChoices);
                    }}
                >
                    -
                </button>
            </div>
        </div>
    );
}

function EmptyContentChunk({ fractionOfScreen, setFractionOfScreen, valid, setValid }: { fractionOfScreen: number; setFractionOfScreen: Function; valid: boolean; setValid: Function }) {
    useEffect(() => {
        setValid(true);
    }, []);

    return (
        <></>
        // <input className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
        //     placeholder="Fraction of Screen"
        //     value={fractionOfScreen}
        //     onChange={(e: any) => { setFractionOfScreen(e.target.value) }}
        // />
    );
}
