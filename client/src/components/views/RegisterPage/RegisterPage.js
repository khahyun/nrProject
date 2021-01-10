import React, { useRef } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
import { useForm } from "react-hook-form";
import '../App.css';

function RegisterPage(props) {  
    const dispatch = useDispatch();
    
    const { register, handleSubmit, watch, errors } = useForm();
    const password = useRef();
    password.current = watch("password");
    //비밀번호 입력할 때마다 값이 들어간다.

    const onSubmit = (data) => {

        console.log('data', data)

        dispatch(registerUser(data))
        .then(response => {
            if (response.payload.success) {
                props.history.push("/login")
            } else {
                alert("회원가입 실패")
            }
        })
    };


    return (
       
<form onSubmit={handleSubmit(onSubmit)}>
      <label>Email</label>
      <input
        name="email"
        type="email"
        ref={register({ required: true, pattern: /^\S+@\S+$/i })}
      />
      {errors.email && <p>이메일을 입력해주세요.</p>}

      <label>Name</label>
      <input
        name="name"
        ref={register({ required: true, maxLength: 10 })}
      />
      {errors.name && errors.name.type === "required"
        && <p> 이름을 입력해주세요.</p>}
      {errors.name && errors.name.type === "maxLength"
        && <p> 이름을 확인해주세요.</p>}

      <label>Password</label>
      <input
        name="password"
        type="password"
        ref={register({ required: true, minLength: 6 })}
      />
      {errors.password && errors.password.type === "required"
        && <p> 비밀번호를 입력해주세요.</p>}
      {errors.password && errors.password.type === "minLength"
        && <p> 비밀번호는 6자리 이상으로 입력해주세요.</p>}

      <label>Password Confirm</label>
      <input
        type="password"
        name="password_confirm"
        ref={register({
          required: true,
          validate: (value) =>
            value === password.current
        })}
      />
      {errors.password_confirm && errors.password_confirm.type === "required"
        && <p> 비밀번호를 한번 더 입력해주세요.</p>}
      {errors.password_confirm && errors.password_confirm.type === "validate"
        && <p>위의 비밀번호 값과 다릅니다.</p>}

      <input type="submit"
        style={{ marginTop: '40px' }}
      />

    </form>
            
    )
}

export default withRouter(RegisterPage)
