import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

const serviceAccountPath = path.join(
  process.cwd(),
  "firebase-service-account.json"
);

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const db = admin.database();
export default admin;