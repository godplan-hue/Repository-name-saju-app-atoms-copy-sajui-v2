import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "firebase-service-account.json"),
        "utf-8"
      )
    );

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const db = admin.database();
export default admin;