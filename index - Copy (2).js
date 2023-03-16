import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import TempMail from "node-temp-mail";
import request from "request";
import db from "../dist/db.js";
import { getRandomInt, sleep } from "./util.js";
import { getFirestore } from "firebase/firestore";
process.on('unhandledRejection', async (error)=>{
    console.log(error, `dead......`);
});
// madfut app data
const app = initializeApp({
    //apiKey: "AIzaSyAaUHfw860st4ztZlj8j4xLfEJHn-kMQd4",
    apiKey: "AIzaSyBJzsSLElHaERgbTXKUKG0GQrY8ipui2jg",
    //authDomain: "mf23-default-rtdb.europe-west1.firebaseapp.com",
    authDomain: "mf23-room-ids.europe-west1.firebaseapp.com",
    projectId: "madfut-23",
    storageBucket: "madfut-23.appspot.com",
    messagingSenderId: "359609929204",
    databaseURL: "https://mf23-trading-invites-2.europe-west1.firebasedatabase.app",
    //databaseURL: "mf23-default-rtdb.europe-west1.firebaseapp.com",
    appId: "1:359609929204:ios:2fd5ba3bd87c65f0d2fda1"
});
const auth = getAuth(app);
const db3 = getFirestore();
let emails = [];
console.log("Started");
// generating the account here
async function gen(email, password) {
    var address = new TempMail(email.split("@")[0]);
    let username = "easypeasy" + getRandomInt(1000);
    let nation = "nation_badge_2";
    try {
        createUserWithEmailAndPassword(auth, email, password).then(async (user)=>{
            const uid = auth.currentUser.uid;
            console.log(uid);
            emails.push(user.user.email);
            sendEmailVerification(user.user).then(async ()=>{
                async function getEmail() {
                    await sleep(1000);
                    address.fetchEmails(async function(err, body1) {
                        console.log(body1);
                        if (!body1) return;
                        const message = JSON.stringify(body1.messages, null, 2).split("address.")[1].replace(/\\n/g, "").split("If ")[0].toString();
                        console.log(message);
                        try {
                            if (message == "[]") return;
                            console.log(message);
                            const newEmail = message.split("&");
                            const key = newEmail[2].replace("apiKey", "key");
                            const oobCode = newEmail[1].replace("oobCode=", "");
                            request.get(email, function(error, response, body2) {
                                request.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?${key}`, {
                                    json: {
                                        oobCode: oobCode
                                    }
                                }, async function(error, response, body) {
                                    if (body.emailVerified == true) {
                                        await db.addAccount(email, password);
                                        console.log(`Auto-Verify Complete`);
                                    }
                                });
                            });
                        } catch  {
                            console.log("error");
                            return;
                        }
                    });
                }
                // Original: 3 * 1000
                setTimeout(getEmail, /*4.5*/ 3 * 3000);
            }).catch((err)=>{
                console.log("error: ", err);
                return;
            });
        }).catch((err)=>{
            console.log("error: ", err);
            return;
        });
    } catch  {
        console.log("error: ", err);
        return;
    }
}
let requestCount = 0;
setInterval(()=>{
    var i = 0;
    let getRandomNum = Math.floor(Math.random() * 100000000);
    i++;
    let email = "easyt576+" + getRandomNum + "@labworld.org";
    let password = "madfutters1";
    gen(email, password);
    requestCount++;
    console.log("Request Count:", requestCount, "+", email, "+", password);
}, 10 * 1000);
