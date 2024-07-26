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
    category: string;
    body: string;
    questions: ContentQuestion[];
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
