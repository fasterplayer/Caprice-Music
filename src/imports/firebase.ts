import * as admin from 'firebase-admin'
import fb from '../caprice-firebase-adminsdk.json'
import settings from './settings'

const serviceAccount: admin.ServiceAccount = fb as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: settings.databaseURL
})

export const db: admin.firestore.Firestore = admin.firestore()
// export const dbTickets: admin.firestore.CollectionReference = db.collection('tickets')
export const dbGuild: admin.firestore.CollectionReference = db.collection('guilds')