const form=document.querySelector('#unlock'),input=document.querySelector('#password'),error=document.querySelector('#error'),submit=form.querySelector('button');
const decode=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
form.addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;error.textContent='';input.removeAttribute('aria-invalid');try{
 const response=await fetch('content.enc.json',{cache:'no-store'});if(!response.ok)throw new Error('network');const payload=await response.json();
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:decode(payload.salt),iterations:210000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
 const content=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(payload.iv)},key,decode(payload.data));if(window.PasswordCredential){try{await navigator.credentials.store(new PasswordCredential({id:'private-viewing',password:input.value,name:'AKIKO KOSHIYAMA'}))}catch{}}input.value='';document.open();document.write(new TextDecoder().decode(content));document.close();
}catch(e){error.textContent=e.name==='OperationError'?'パスワードが違います。もう一度お試しください。 / Incorrect password.':'読み込めませんでした。通信環境を確認して再度お試しください。 / Unable to load.';input.setAttribute('aria-invalid','true');input.focus();submit.disabled=false;}});
