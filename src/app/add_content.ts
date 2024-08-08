"use server"

import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export interface ContentColors {
    textColor: string;
    borderColor: string;
    backgroundColor: string;
    outerBackgroundColor: string;
}

export interface ContentQuestion {
    question: string;
    choices: ContentQuestionChoice[];
}

export interface ContentQuestionChoice {
    choice: string;
    correct: boolean;
}

export interface Content {
    title: string;
    author: string;
    category: string;
    body: string;
    questions: ContentQuestion[];
}

async function getTodayDate(): Promise<string> {
    const today = new Date().toISOString();
    return today.split('T')[0];
}

async function dateToString(date: Date): Promise<string> {
    return date.toISOString().split('T')[0];
}

async function stringToDate(dateString: string): Promise<Date> {
    return new Date(dateString + 'T00:00:00');
}

export async function getCurrentContent() {
    const dateToContent: { [key: string]: Content } = {};

    let success = true;
    let date = await stringToDate(await getTodayDate());
    while (success) {
        const dateString = await dateToString(date);
        try {
            const content = await admin.firestore().collection('content').doc(dateString).get() as admin.firestore.DocumentSnapshot<Content>;
            let Content = content.data();
            if (Content === undefined) {
                success = false;
                break;
            }
            dateToContent[dateString] = Content;
            date.setDate(date.getDate() - 1);
        } catch (error) {
            success = false;
        }
    }
    return dateToContent;
}

export async function addContent(date: string, content: Content, colors: ContentColors) {
    try {
        await admin.firestore().collection('content').doc(date).set({
            ...content,
            colors
        });
        return null;
    } catch (error) {
        return error;
    }
}
