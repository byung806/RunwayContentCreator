"use server"

import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';
import { Content, ContentColors } from './home';


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});


export async function addContent(date: string, content: Content, colors: ContentColors) {
    // try {
    //     await admin.firestore().collection('content').doc(date).set({
    //         ...content,
    //         colors
    //     });
    //     return null;
    // } catch (error) {
    //     return error;
    // }

    return null;
}
