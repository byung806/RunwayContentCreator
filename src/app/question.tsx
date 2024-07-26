import { ContentQuestion } from "./add_content";

export default function Question({ question, setQuestion, key }: { question: ContentQuestion, setQuestion: Function, key: number }) {
    return (
        <div className="flex flex-col space-y-4 border-4 p-4 rounded-xl border-gray-100 shadow-xl">
            <input className="bg-neutral-100 h-6 rounded-xl p-6 outline-none"
                placeholder="Question"
                value={question.question}
                onChange={(e: any) => {
                    question.question = e.target.value;
                    setQuestion(question);
                }}
            />
            {question.choices.map((choice: any, index: number) => (
                <div key={index} className="flex space-x-4 mx-4 items-center">
                    <input
                        placeholder="Correct"
                        type="checkbox"
                        checked={choice.correct}
                        onChange={(event: any) => {
                            question.choices[index].correct = event.target.checked;
                            setQuestion(question);
                        }}
                    />
                    <input className="flex bg-neutral-100 h-6 rounded-xl p-6 outline-none w-full"
                        placeholder="Choice"
                        value={choice.choice}
                        onChange={(event: any) => {
                            question.choices[index].choice = event.target.value;
                            setQuestion(question);
                        }}
                    />
                </div>
            ))}
            <div className="flex space-x-4 mx-4 items-center">
            <button className="font-bold text-3xl text-center"
                onClick={() => {
                    question.choices.push({ choice: '', correct: false });
                    setQuestion(question);
                }}
            >+</button>
            <button className="font-bold text-3xl text-center"
                onClick={() => {
                    question.choices.pop();
                    setQuestion(question);
                }}
            >-</button>
            </div>
        </div>
    )
}