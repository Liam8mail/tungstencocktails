import React, {useState} from 'react';
import { login } from '../services/authService';
import useFormInput from '../hooks/useFormInput';
import { loggingWait } from '../util/imgPicker';
export default function Loginform(props) {

    const email = useFormInput("");
    const password = useFormInput("");
    const submit = Submit;
    const [status, setStatus] = useState('idle'); // QUICK IMP
    

    
    return (
        <div>
            <h1 style={{textAlign:'center'}}>Login</h1>
                {status === 'logging' && loggingWait()} {/* conditional for loading image upon submit log request */}
                {status === 'idle' && <>


                 {/* Please Fix This Shitty Form XD*/}

                <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt="profile-img"
                className="profile-img-card"
                style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}}
                />
                    <div style={{textAlign:'center'}}>
                        <label htmlFor="InputEmail">Email address  </label>
                        <input {...email} type="default" className="form-control" id="InputEmail" aria-describedby="emailHelp"></input>
                        <small id="emailHelp" className="form-text text-muted"></small>
                    </div>
                    <div style={{textAlign:'center'}}>
                        <label htmlFor="InputPassword">Password    </label>
                        <input {...password} type="password" className="form-control" id="InputPassword"></input>
                        <small id="passwordHelp" className="form-text text-muted"></small>
                    </div>
                    <div style={{textAlign:'center'}}>
                        <button onClick={() => submit({email: email.value, password: password.value}, props, setStatus)} type="submit" className="btn btn-primary" style={{display: "flex", justifyContent: "center",textAlign: "center"}}>Submit</button>
                    </div> 
                {/* --------- */}


            </>
            }
        </div>
    );
    
}

async function Submit(details, props, setStatus){

    try{ //email: "sally@gmail.com", password: "tungsten"
        setStatus('logging'); //update display for display render loading image
        const result = await login(details); // auth user
        if (result === true){
            props.history.replace('/'); // https://reactrouter.com/web/api/history // remove login page from history 
            props.history.go(-1); // return to the page they where viewing before logging in
            setStatus('complete');
            return props.isAuthed(true);
        }

        console.log(result); // use this result to display reason : ie password too short etc 
        
      }
      catch(err){
        
        if (err.response && err.response.status === 400){
          setStatus('error'); // Need To Implement and Display Img
          //console.log(err.response.data);
          return err.response.data; 
        }
        console.log(err) // Internal Error
        return err 
        
      }
}
