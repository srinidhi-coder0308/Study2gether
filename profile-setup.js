import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore,doc,setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig={YOUR_CONFIG_HERE};
const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

let currentUser=null;
let selectedAvatar="avatar1.png";

const avatars=document.querySelectorAll('.avatar');
avatars.forEach(a=>{
 a.onclick=()=>{
  avatars.forEach(x=>x.classList.remove('active'));
  a.classList.add('active');
  selectedAvatar=a.getAttribute('src');
 }
});

onAuthStateChanged(auth,user=>{
 if(!user){location.href='login.html';return;}
 currentUser=user;
 document.getElementById('email').value=user.email;
});

document.getElementById('saveBtn').onclick=async()=>{
 const data={
 username:username.value,
 email:email.value,
 age:age.value,
 interests:interests.value,
 avatar:selectedAvatar,
 joinedGroups:0,
 studyTime:0
 };
 await setDoc(doc(db,'users',currentUser.uid),data);
 location.href='dashboard.html';
};