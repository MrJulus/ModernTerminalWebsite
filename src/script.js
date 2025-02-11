import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

const input = document.getElementById("input");
const output = document.getElementById("output");

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const command = input.value.trim();
        handleCommand(command);
        input.value = "";
    }
});

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleCommand(command) {
    let response = "";

    if (command.startsWith("cd ")) {
        const path = command.slice(3).trim();
        window.location.href = `/${path}`;
    } 
    else if (command.startsWith("post new message ")) {
        const message = command.slice(16).trim();
        stockMessage(message);
        response = "New Message Set";
    } 
    else if (command === "get messages") {
        showMessage();
    } 
    else if (command === "clear") {
        output.innerHTML = "";
        return;
    } 
    else {
        response = `Commande non reconnue : ${command}`;
    }

    const commandElement = document.createElement("div");
    commandElement.innerHTML = `<span class="prompt">user@site:~$</span> ${command}`;
    
    const responseElement = document.createElement("div");
    responseElement.innerText = response;

    output.prepend(responseElement);
    wait(2000)
    output.prepend(commandElement);
}


async function showMessage() {
    if (firebaseConfig) {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        const docRef = doc(db, "mr-julus", "messages");
        const docSnap = await getDoc(docRef);
            
        if (docSnap.exists()) {
            const fieldValue = docSnap.data().messages_list;
            const responseElement = document.createElement("div");
            responseElement.innerText = `Messages: ${fieldValue.join(", ")}`;
            output.prepend(responseElement);
        } else {
            console.log("Aucun document trouvé !");
        }       
    }
}

async function stockMessage(message) {
    if (firebaseConfig) {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        const docRef = doc(db, "mr-julus", "messages");
        const docSnap = await getDoc(docRef);
            
        if (docSnap.exists()) {
            await updateDoc(docRef, {
                messages_list: arrayUnion(message)
            });
        } else {
            await setDoc(docRef, {
                messages_list: [message]
            });
            console.log("Nouveau document créé avec le message.");
        }       
    }
}
