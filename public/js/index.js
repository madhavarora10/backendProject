
import '@babel/polyfill';
import { displayMap } from "./mapbox";
import { login} from "./login";
import { logout} from "./login";
import { updateSettings} from "./updateSetting.js";

//Dom Elements
const mapBox=document.getElementById('map');
const loginForm=document.querySelector('.form');
const logOutBtn=document.querySelector('.nav__el--logout');
const userDataForm=document.querySelector('.form-user-data');
const userPasswordForm=document.querySelector('.form-user-password');
//Values

// Delegation
if(mapBox){
    const locations=JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}


    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
      });    

logOutBtn.addEventListener('click',logout);



if(userDataForm){
    userDataForm.addEventListener('submit',e=>{
        e.preventDefault();
        const name=document.getElementById('name').value;
        const email=document.getElementById('email').value;
        updateSettings({name,email},'data');
    });
}
if(userPasswordForm){
    userPasswordForm.addEventListener('submit',async e=>{
       e.preventDefault();
       const passwordCurrent=document.getElementById('password-current').value;
       const password=document.getElementById('password').value;
       const passwordConfirm=document.getElementById('password-confirm').value;
       await updateSettings({passwordCurrent,password,passwordConfirm},'password');

       document.getElementById('password-current').value='';
       document.getElementById('password').value='';
       document.getElementById('password-confirm').value='';
    });
}

