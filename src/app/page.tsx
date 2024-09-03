"use client";

import { useEffect, useState } from "react";
import { addContent, Content, ContentColors, getCurrentContent } from "./add_content";
import useInput from "./useInput";

import { Inter } from "next/font/google";
import ReactGPicker from "react-gcolor-picker";
import Chunk, { ChunkType } from "./chunk";

const inter = Inter({
    weight: ["800"],
    subsets: ["latin"],
});

export default function Home() {
    const date = useInput("");
    const title = useInput("");
    const author = useInput("");
    const category = useInput("");
    // const body = useInput('');
    const [chunks, setChunks] = useState<
        (ChunkType & {
            valid: boolean;
        })[]
    >([
        {
            type: "image",
            uri: "",
            valid: false,
        },
    ]);

    let [currentContent, setCurrentContent] = useState<{ [key: string]: Content | null }>(
    );

    useEffect(() => {
        getCurrentContent().then((content) => {
            setCurrentContent(content);
        });
    }, []);

    // const [questions, setQuestions] = useState<FirebaseContentQuestion[]>([
    //     { question: '', choices: [{ choice: '', correct: false }] }
    // ]);
    const [colors, setColors] = useState<ContentColors>({
        textColor: "#000000",
        borderColor: "#000000",
        backgroundColor: "#ffffff",
        outerBackgroundColor: "#dddddd",
    });

    const dateObject = new Date(date.value + "T00:00:00");
    console.log(dateObject);
    const month = dateObject.toLocaleString("default", { month: "short" });
    const day = dateObject.getDate();
    let extra = "Today";

    return (
        <div
            className="flex justify-center space-x-16 pl-16"
            style={{
                fontFamily: inter.style.fontFamily,
                fontWeight: inter.style.fontWeight,
                backgroundColor: colors.outerBackgroundColor,
            }}
        >
            <div className="space-y-4 py-16">
                <div
                    className="shadow-2xl"
                    style={{
                        position: "relative",
                        borderRadius: 12,
                        borderWidth: 6,
                        width: 300,
                        height: 450,
                        borderColor: colors.borderColor,
                        backgroundColor: colors.backgroundColor,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            flex: 1,
                            top: 0,
                            width: "100%",
                            padding: 10,
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                alignItems: "center",
                                paddingTop: 4,
                            }}
                        >
                            <p
                                style={{
                                    color: colors.textColor,
                                    fontSize: 40,
                                }}
                            >
                                {day}
                            </p>
                            <p
                                style={{
                                    color: colors.textColor,
                                    fontSize: 20,
                                }}
                            >
                                {month}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <p
                            style={{
                                paddingLeft: 10,
                                paddingRight: 10,
                                color: colors.textColor,
                                fontSize: 40,
                                textAlign: "center",
                            }}
                        >
                            {title.value}
                        </p>

                        <button
                            // onPress={() => setContentModalVisible(true)}
                            style={{
                                width: "80%",
                                color: "white",
                                height: 50,
                                borderRadius: 12,
                                backgroundColor: colors.textColor,
                            }}
                        >
                            Go!
                        </button>
                        <div className="h-10"></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col bg-[#f9f7fa] p-16 space-y-4">
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
                                value="white"
                                onChange={(color) => {
                                    const newColors = { ...colors };
                                    newColors[key as keyof ContentColors] = color;
                                    setColors(newColors);
                                }}
                                popupWidth={180}
                                colorBoardHeight={100}
                                format="hex"
                                showAlpha={false}
                                allowAddGradientStops={false}
                                defaultColors={[]}
                            />
                        </div>
                    ))}
                </div>
                <p className="flex justify-center font-bold text-3xl">Click a purple day to get started</p>
                <div className="flex space-y-4 space-x-4 flex-wrap">
                    {currentContent &&
                        Object.keys(currentContent)
                            .toSorted(function (a, b) {
                                a = a.split('-').join('');
                                b = b.split('-').join('');
                                return a > b ? 1 : a < b ? -1 : 0;
                                // return a.localeCompare(b);         // <-- alternative 
                            })
                            .map((dateStr: string) => (
                                <button
                                    className="border-2 p-2 w-30 rounded-2xl shadow-sm justify-center items-center"
                                    onClick={currentContent[dateStr] ? () => { } :
                                        () => {
                                            date.setValue(dateStr);
                                        }}
                                    style={{
                                        backgroundColor: currentContent[dateStr] ? "#e5e5e5" : "#8b45a4",
                                        borderColor: new Date(dateStr + "T00:00:00").getDate() == new Date().getDate() ? "black" : 
                                            date.value === dateStr ? "black" : "transparent",
                                        color: currentContent[dateStr] ? "#ababab" : "white",
                                        borderWidth: 2,
                                    }}
                                >
                                    <p>{dateStr}</p>
                                    {currentContent[dateStr] && <p>{currentContent[dateStr]?.title}</p>}
                                </button>
                            ))}
                </div>

                <div className="flex space-x-4">
                    <input
                        className="bg-neutral-100 rounded-xl p-4 outline-none min-w-0 w-60"
                        style={{
                            borderColor: (currentContent && currentContent[date.value] !== null) || Number.isNaN(dateObject.getDate()) ? "red" : undefined,
                            borderWidth: 2,
                        }}
                        placeholder={"YYYY-MM-DD"}
                        value={date.value}
                        onChange={date.onChange}
                    />
                    <input
                        className="bg-neutral-100 rounded-xl p-4 min-w-0 outline-none w-full"
                        style={{
                            borderColor: title.value === "" ? "red" : undefined,
                            borderWidth: 2,
                        }}
                        placeholder="Title"
                        value={title.value}
                        onChange={title.onChange}
                    />
                    <input
                        className="bg-neutral-100 rounded-xl p-4 min-w-0 outline-none"
                        style={{
                            borderColor: title.value === "" ? "red" : undefined,
                            borderWidth: 2,
                        }}
                        placeholder="Author"
                        value={author.value}
                        onChange={author.onChange}
                    />
                    <input
                        className="bg-neutral-100 rounded-xl p-4 outline-none min-w-0 w-60"
                        style={{
                            borderColor: title.value === "" ? "red" : undefined,
                            borderWidth: 2,
                        }}
                        placeholder="Category"
                        value={category.value}
                        onChange={category.onChange}
                    />
                </div>

                {chunks.map(
                    (
                        chunk: ChunkType & {
                            valid: boolean;
                        },
                        index: number
                    ) => {
                        return (
                            <div className="p-2 bg-white rounded-2xl">
                                <Chunk
                                    chunk={chunk}
                                    setChunk={(
                                        chunk: ChunkType & {
                                            valid: boolean;
                                        }
                                    ) => {
                                        const newChunks = [...chunks];
                                        newChunks[index] = chunk;
                                        setChunks(newChunks);
                                    }}
                                    valid={chunks[index].valid}
                                    setValid={(valid: boolean) => {
                                        const newChunks = [...chunks];
                                        newChunks[index].valid = valid;
                                        setChunks(newChunks);
                                    }}
                                />
                                {/* to delete a specific chunk - chunks gets updated correctly but visuals don't */}
                                {/* <button
                                    className="font-bold text-3xl text-center"
                                    onClick={() => {
                                        console.log("delete", index);
                                        const newChunks = [...chunks];
                                        console.log(newChunks);
                                        newChunks.splice(index, 1);
                                        console.log(newChunks);
                                        setChunks(newChunks);
                                    }}
                                >
                                    -
                                </button> */}
                            </div>
                        );
                    }
                )}

                <div className="flex space-x-4">
                    <button
                        className="font-bold text-3xl text-center"
                        onClick={() => {
                            setChunks([...chunks, { type: "paragraph", text: "", valid: false }]);
                        }}
                    >
                        +
                    </button>
                    <button
                        className="font-bold text-3xl text-center"
                        onClick={() => {
                            setChunks(chunks.slice(0, chunks.length - 1));
                        }}
                    >
                        -
                    </button>
                </div>

                <button
                    className="items-start box-border text-white cursor-pointer font-bold h-14 mx-auto mt-5 text-center w-full rounded-2xl bg-[#8b45a4] p-4"
                    onClick={async () => {
                        if (currentContent && currentContent[date.value] !== null) {
                            alert("Content already exists for this date");
                            return;
                        }
                        if (Number.isNaN(dateObject.getDate())) {
                            alert("Please fill out a valid date");
                            return;
                        }
                        if (title.value === "") {
                            alert("Please fill out the title");
                            return;
                        }
                        if (author.value === "") {
                            alert("Please fill out the author");
                            return;
                        }
                        if (category.value === "") {
                            alert("Please fill out the category");
                            return;
                        }
                        if (chunks.filter((chunk) => !chunk.valid).length > 0) {
                            alert("Please fill out all chunks");
                            return;
                        }
                        if (colors.textColor === "#000000" || colors.borderColor === "#000000" || colors.backgroundColor === "#ffffff" || colors.outerBackgroundColor === "#dddddd") {
                            alert("Please change the colors");
                            return;
                        }

                        const content = {
                            title: title.value,
                            author: author.value,
                            category: category.value,
                            // pass in chunks but remove all "valid" keys
                            chunks: chunks.map((chunk) => {
                                const { valid, ...rest } = chunk;
                                return rest;
                            })
                        };

                        console.log(JSON.stringify(content));

                        console.log(date.value, content, colors);

                        const error = await addContent(date.value, content, colors);
                        if (error) {
                            alert(error);
                        } else {
                            // reset questions, colors, and inputs
                            date.setValue("");
                            title.setValue("");
                            category.setValue("");
                            setChunks([]);
                            setColors({
                                textColor: "#000000",
                                borderColor: "#000000",
                                backgroundColor: "#ffffff",
                                outerBackgroundColor: "#dddddd",
                            });
                            getCurrentContent().then((content) => {
                                setCurrentContent(content);
                            });
                        }
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
