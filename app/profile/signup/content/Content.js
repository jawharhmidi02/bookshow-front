import { useRef, useState } from "react";
import "./Content.css";

const Content = () => {
  const emailRef = useRef();
  const confirmPasswordRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const checkboxRef = useRef();
  const [errors, setErrors] = useState({});

  const showPassword = () => {
    if (checkboxRef.current.checked) {
      passwordRef.current.type = "text";
      confirmPasswordRef.current.type = "text";
    } else {
      passwordRef.current.type = "password";
      confirmPasswordRef.current.type = "password";
    }
  };

  const checkDetails = () => {
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const confirmPassword = confirmPasswordRef.current.value.trim();

    const newErrors = {};

    if (!/^[a-zA-Z\s]{3,}$/.test(name)) {
      newErrors.name = "must contain only alphabets and more than 3 characters long.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)
    ) {
      newErrors.password = "Password Not Strong enough.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      showToast("Registering, Please wait!")
      register();
    }
  };

  const showToast = (message)=> {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => {
      toast.className = toast.className.replace('show', '');
    }, 3000);
  };

  const setCookie = (name, value, days, path = "/", domain, secure)=> {
    let expires = "";
    
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
  
    let cookie = `${name}=${value || ""}${expires}; path=${path}`;
    
    if (domain) {
      cookie += `; domain=${domain}`;
    }
    
    if (secure) {
      cookie += "; secure";
    }
    
    document.cookie = cookie;
  }
  

  const register = async() => {
    const full_name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const newErrors = {};

    const response = await fetch("http://localhost:5000/users/", {
      method:"POST"
      , headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({full_name, email, password}),
    })

    if (response.ok) {
      showToast("Registered Successfully, Redirecting!");
      setCookie("email", email, 7, "/", undefined, true);
      setCookie("password", password, 7, "/", undefined, true);
      setTimeout(() => {
        window.location.href = "./";
      }, 3000);
    } else {
      newErrors.email = "Email Already used.";
      setErrors(newErrors);
    }
  }

  return (
    <section className="signin-container">
      <div className="signin-content">
        <div className="title">Register</div>
        <div className="inputs">
          <div>
            <input type="text" placeholder="Full name" ref={nameRef} />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>
          <div>
            <input type="text" placeholder="Email" ref={emailRef} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="password-div">
            <div>
              <input
                className="password"
                type="password"
                placeholder="Password"
                ref={passwordRef}
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <div>
              <input
                className="password"
                type="password"
                placeholder="Confirm Password"
                ref={confirmPasswordRef}
              />
              {errors.confirmPassword && (
                <div className="error">{errors.confirmPassword}</div>
              )}
            </div>

            <div className="show-password">
              <div className="checkbox-wrapper-1">
                <input
                  id="example-1"
                  className="substituted"
                  type="checkbox"
                  aria-hidden="true"
                  onClick={showPassword}
                  ref={checkboxRef}
                />
                <label htmlFor="example-1">Show Password</label>
              </div>
            </div>
          </div>
        </div>
        <div className="button">
          <button onClick={checkDetails}>Sign up</button>
        </div>
        <div className="link">
          <div className="sign-up">
            Already have an account? <a href="./signin">Sign In</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
