"use client"

import { useState } from "react";
import { addContent, ContentColors, ContentQuestion } from "./add_content";
import Question from "./question";
import useInput from "./useInput";

import { Inter } from 'next/font/google';
import ReactGPicker from "react-gcolor-picker";

const inter = Inter({
    weight: ['800'],
    subsets: ['latin'],
})

export default function Home() {
    const date = useInput('');
    const title = useInput('');
    const category = useInput('');
    const body = useInput('');

    const [questions, setQuestions] = useState<ContentQuestion[]>([
        { question: '', choices: [{ choice: '', correct: false }] }
    ]);
    const [colors, setColors] = useState<ContentColors>({
        textColor: '#000000',
        borderColor: '#000000',
        backgroundColor: '#ffffff',
        outerBackgroundColor: '#dddddd'
    });

    const dateObject = new Date(date.value + 'T00:00:00');
    console.log(dateObject);
    const month = dateObject.toLocaleString('default', { month: 'short' });
    const day = dateObject.getDate();
    let extra = 'Today';

    return (
        <div className="flex justify-center items-center space-x-16 p-16" style={{
            fontFamily: inter.style.fontFamily,
            fontWeight: 800,
            backgroundColor: colors.outerBackgroundColor,
        }}>
            <div className="space-y-4">
                <div className="shadow-2xl" style={{
                    position: 'relative',
                    borderRadius: 12,
                    borderWidth: 6,
                    width: 300,
                    height: 450,
                    borderColor: colors.borderColor,
                    backgroundColor: colors.backgroundColor,
                }}>
                    <div style={{
                        position: 'absolute',
                        flex: 1,
                        top: 0,
                        width: '100%',
                        padding: 10,
                        justifyContent: 'space-between',
                    }}>
                        <div style={{
                            alignItems: 'center',
                            paddingTop: 4,
                        }}>
                            <p style={{
                                color: colors.textColor,
                                fontSize: 40,
                            }}>{day}</p>
                            <p style={{
                                color: colors.textColor,
                                fontSize: 20,
                            }}>{month}</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <p style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            color: colors.textColor,
                            fontSize: 40,
                            textAlign: 'center',
                        }}>{title.value}</p>

                        <button
                            // onPress={() => setContentModalVisible(true)}
                            style={{
                                width: '80%',
                                color: 'white',
                                height: 50,
                                borderRadius: 12,
                                backgroundColor: colors.textColor,
                            }}
                        >Go!</button>
                        <div className="h-10"></div>
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    {Object.keys(colors).map((key: string) => (
                        <div className="space-y-1">
                            <p>{key}</p>
                            {/* <input
                                className="bg-neutral-100 rounded-xl p-4 outline-none"
                                type="text"
                                placeholder={key}
                                value={colors[key as keyof ContentColors]}
                                onChange={(event) => {
                                    const newColors = { ...colors };
                                    newColors[key as keyof ContentColors] = event.target.value;
                                    setColors(newColors);
                                }}
                            /> */}
                            <ReactGPicker
                                value='white'
                                onChange={
                                    (color) => {
                                        const newColors = { ...colors };
                                        newColors[key as keyof ContentColors] = color;
                                        setColors(newColors);
                                    }
                                }
                                format='hex'
                                showAlpha={false}
                                allowAddGradientStops={false}
                                defaultColors={[]}
                            />
                        </div>
                    ))}
                </div>
            </div>


            <div className="flex flex-col bg-gray-200 p-16 rounded-xl space-y-4 w-[60%] shadow-2xl">
                <div className="flex space-x-4">
                    <input className="bg-neutral-100 rounded-xl p-4 outline-none min-w-0 w-60"
                        placeholder={new Date().toISOString().split('T')[0]}
                        value={date.value}
                        onChange={date.onChange}
                    />
                    <input className="bg-neutral-100 rounded-xl p-4 min-w-0 outline-none w-full"
                        placeholder="Title"
                        value={title.value}
                        onChange={title.onChange}
                    />
                    <input className="bg-neutral-100 rounded-xl p-4 outline-none min-w-0 w-60"
                        placeholder="Category"
                        value={category.value}
                        onChange={category.onChange}
                    />
                </div>
                <textarea className="bg-neutral-100 h-60 rounded-xl p-4 outline-none resize-none"
                    placeholder="Body"
                    value={body.value}
                    onChange={body.onChange}
                />

                {questions.map((question: any, index: number) => (
                    <Question question={question} setQuestion={(question: ContentQuestion) => {
                        const newQuestions = [...questions];
                        newQuestions[index] = question;
                        setQuestions(newQuestions);
                    }} key={index} />
                ))}

                <div className="flex space-x-4">
                    <button className="font-bold text-3xl text-center"
                        onClick={() => {
                            setQuestions([...questions, { question: '', choices: [{ choice: '', correct: false }] }]);
                        }}
                    >+</button>
                    <button className="font-bold text-3xl text-center"
                        onClick={() => {
                            setQuestions(questions.slice(0, questions.length - 1));
                        }}
                    >-</button>
                </div>

                <button
                    className="items-start box-border text-white cursor-pointer font-bold h-14 mx-auto mt-5 text-center w-full rounded-2xl bg-purple-600 p-4"
                    onClick={async () => {
                        const content = {
                            title: title.value,
                            category: category.value,
                            body: body.value,
                            questions: questions
                        };

                        console.log(date.value, content, colors);
                        // addContent has module issues
                        const error = await addContent(date.value, content, colors);
                        if (error) {
                            alert(error);
                        } else {
                            // reset questions, colors, and inputs
                            date.setValue('');
                            title.setValue('');
                            body.setValue('');
                            category.setValue('');
                            setQuestions([{ question: '', choices: [{ choice: '', correct: false }] }]);
                            setColors({
                                textColor: '#000000',
                                borderColor: '#000000',
                                backgroundColor: '#ffffff',
                                outerBackgroundColor: '#dddddd'
                            });
                        }
                    }}
                >Send</button>
            </div>
        </div>
    );
}
