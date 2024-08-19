"use client"

import { useEffect, useState } from "react";
import { addContent, Content, ContentColors, getCurrentContent } from "./add_content";
import useInput from "./useInput";

import { Inter } from 'next/font/google';
import ReactGPicker from "react-gcolor-picker";
import Chunk, { ChunkType } from "./chunk";

const inter = Inter({
    weight: ['800'],
    subsets: ['latin'],
})

export default function Home() {
    const date = useInput('');
    const title = useInput('');
    const author = useInput('');
    const category = useInput('');
    // const body = useInput('');
    const [chunks, setChunks] = useState<ChunkType[]>([]);

    let [currentContent, setCurrentContent] = useState<{ [key: string]: Content | null }>();

    useEffect(() => {
        getCurrentContent().then((content) => {
            setCurrentContent(content);
        });
    }, []);

    // const [questions, setQuestions] = useState<FirebaseContentQuestion[]>([
    //     { question: '', choices: [{ choice: '', correct: false }] }
    // ]);
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
        <div className="flex justify-center space-x-16 p-16" style={{
            fontFamily: inter.style.fontFamily,
            fontWeight: inter.style.fontWeight,
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
            </div>

            <div className="flex flex-col bg-gray-200 p-16 rounded-xl space-y-4 w-[80%] shadow-2xl">
                <div className="flex justify-between">
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
                                popupWidth={180}
                                colorBoardHeight={100}
                                format='hex'
                                showAlpha={false}
                                allowAddGradientStops={false}
                                defaultColors={[]}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex space-y-4 space-x-4 flex-wrap">
                    <p className='w-20 font-bold'>CURRENT CONTENT:</p>
                    {currentContent && Object.keys(currentContent).toSorted(
                        (a: string, b: string) => {
                            return new Date(a + 'T00:00:00').getDate() - new Date(b + 'T00:00:00').getDate();
                        }
                    ).map((date: string) => (
                        <div className="border-2 p-2 w-30 rounded-2xl shadow-sm justify-center items-center" style={{
                            backgroundColor: currentContent[date] ? 'white' : '#f74449',
                            borderColor: 'black',
                            borderWidth: new Date(date + 'T00:00:00').getDate() == new Date().getDate() ? 2 : 0,
                        }}>
                            <p>{date}</p>
                            {currentContent[date] && <p>{currentContent[date]?.title}</p>}
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <input className="bg-neutral-100 rounded-xl p-4 outline-none min-w-0 w-60"
                        style={{
                            borderColor: ((currentContent && currentContent[date.value] !== null) || Number.isNaN(dateObject.getDate()) && date.value !== '') ? 'red' : undefined,
                            borderWidth: 2,
                        }}
                        placeholder={
                            'YYYY-MM-DD'
                        }
                        value={date.value}
                        onChange={date.onChange}
                    />
                    <input className="bg-neutral-100 rounded-xl p-4 min-w-0 outline-none w-full"
                        placeholder="Title"
                        value={title.value}
                        onChange={title.onChange}
                    />
                    <input className="bg-neutral-100 rounded-xl p-4 min-w-0 outline-none"
                        placeholder="Author"
                        value={author.value}
                        onChange={author.onChange}
                    />
                    <input className="bg-neutral-100 rounded-xl p-4 outline-none min-w-0 w-60"
                        placeholder="Category"
                        value={category.value}
                        onChange={category.onChange}
                    />
                </div>

                {chunks.map((chunk: ChunkType, index: number) => (
                    <div className="p-4 bg-white rounded-2xl">
                        <Chunk
                            chunk={chunk}
                            setChunk={(chunk: ChunkType) => {
                                const newChunks = [...chunks];
                                newChunks[index] = chunk;
                                setChunks(newChunks);
                            }}
                            key={index}
                        />
                        {/* to delete a specific chunk - chunks gets updated correctly but visuals don't */}
                        {/* <button className="font-bold text-3xl text-center"
                            onClick={() => {
                                console.log('delete', index);
                                const newChunks = [...chunks];
                                console.log(newChunks);
                                newChunks.splice(index, 1);
                                console.log(newChunks);
                                setChunks(newChunks);
                            }}
                        >-</button> */}
                    </div>
                ))}

                <div className="flex space-x-4">
                    <button className="font-bold text-3xl text-center"
                        onClick={() => {
                            setChunks([...chunks, { type: 'paragraph', text: '' }]);
                        }}
                    >+</button>
                    <button className="font-bold text-3xl text-center"
                        onClick={() => {
                            setChunks(chunks.slice(0, chunks.length - 1));
                        }}
                    >-</button>
                </div>

                <button
                    className="items-start box-border text-white cursor-pointer font-bold h-14 mx-auto mt-5 text-center w-full rounded-2xl bg-purple-600 p-4"
                    onClick={async () => {
                        const content = {
                            title: title.value,
                            author: author.value,
                            category: category.value,
                            
                            chunks: chunks,
                        };

                        console.log(JSON.stringify(content));

                        console.log(date.value, content, colors);
                        // If content already exists for the date, don't overwrite it
                        if (currentContent && currentContent[date.value] !== null) {
                            return;
                        }
                        // If date is invalid, don't send
                        if (Number.isNaN(dateObject.getDate())) {
                            return;
                        }

                        const error = await addContent(date.value, content, colors);
                        if (error) {
                            alert(error);
                        } else {
                            // reset questions, colors, and inputs
                            date.setValue('');
                            title.setValue('');
                            category.setValue('');
                            setChunks([]);
                            setColors({
                                textColor: '#000000',
                                borderColor: '#000000',
                                backgroundColor: '#ffffff',
                                outerBackgroundColor: '#dddddd'
                            });
                            getCurrentContent().then((content) => {
                                setCurrentContent(content);
                            });
                        }
                    }}
                >Send</button>
            </div>
        </div>
    );
}
