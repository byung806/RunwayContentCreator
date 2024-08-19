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

export interface FirebaseContentQuestion {
    question: string;
    choices: FirebaseContentQuestionChoice[];
}

export interface FirebaseContentQuestionChoice {
    choice: string;
    correct: boolean;
}

export interface FirebaseParagraphContentChunkType {
    type: 'paragraph';
    text: string;
}

export interface FirebaseImageContentChunkType {
    type: 'image';
    uri: string;
}

export interface FirebaseIconContentChunkType {
    type: 'icon';
    icon: string;
}

export interface FirebaseQuestionContentChunkType {
    type: 'question';
    question: string;
    choices: FirebaseContentQuestionChoice[];
}

export interface FirebaseEmptyContentChunkType {
    type: 'empty';
    fractionOfScreen: number;
}


export interface Content {
    title: string;
    author: string;
    category: string;

    chunks?: (FirebaseParagraphContentChunkType | FirebaseImageContentChunkType | FirebaseIconContentChunkType | FirebaseQuestionContentChunkType | FirebaseEmptyContentChunkType)[];

    body?: string;
    questions?: FirebaseContentQuestion[];
}

async function getTodayDate(): Promise<string> {
    const today = new Date().toISOString();
    return today.split('T')[0];
}

async function dateToString(date: Date): Promise<string> {
    return date.toISOString().split('T')[0];
}

export async function stringToDate(dateString: string): Promise<Date> {
    return new Date(dateString + 'T00:00:00');
}

export async function getCurrentContent() {
    const dateToContent: { [key: string]: Content | null } = {};

    // Check ahead
    let amountToCheckAhead = 10;
    let date = await stringToDate(await getTodayDate());
    let countChecked = 0;
    while (countChecked <= amountToCheckAhead) {
        const dateString = await dateToString(date);
        try {
            date.setDate(date.getDate() + 1);
            countChecked++;

            const content = await admin.firestore().collection('content').doc(dateString).get() as admin.firestore.DocumentSnapshot<Content>;
            let Content = content.data();
            if (Content === undefined) {
                dateToContent[dateString] = null;
                continue;
            }
            dateToContent[dateString] = Content;
        } catch (error) {
            break;
        }
    }

    // Check behind
    let amountToCheckBehind = 3;
    date = await stringToDate(await getTodayDate());
    countChecked = 0;
    while (countChecked <= amountToCheckBehind) {
        const dateString = await dateToString(date);
        try {
            date.setDate(date.getDate() - 1);
            countChecked++;

            const content = await admin.firestore().collection('content').doc(dateString).get() as admin.firestore.DocumentSnapshot<Content>;
            let Content = content.data();
            if (Content === undefined) {
                dateToContent[dateString] = null;
                continue;
            }
            dateToContent[dateString] = Content;
        } catch (error) {
            break;
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
