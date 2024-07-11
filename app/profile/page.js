"use client"
import { useEffect, useState } from 'react'

// Components
import Nav from './nav/nav'
import Header from './header/header'
import Footer from './footer/footer'
import Content from './content/content'

// Styles
import "./responsive.css";
import "./animations.css";
import "./page.css"

function getEmailAndPasswordFromCookies() {
    function getCookieValue(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const email = getCookieValue('email');
    const password = getCookieValue('password');

    return { email, password };
}

const Home = () => {
    const [data, setData] = useState({ created_at: "", full_name: "", email: "", password: "", id_user: "", cover_photo: "" });
    const [full_name, setFull_name] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function call() {
            const { email, password } = getEmailAndPasswordFromCookies();
            if (!email || !password) {
                window.location.href = "./profile/signin"
                return;
            }

            const response = await fetch(`https://bookshow-back.onrender.com/users/${email}&${password}`, {
                method: 'GET',
            });

            if (response.ok) {
                const d = await response.json();
                if (d.length === 0) {
                    window.location.href = "./signin"
                } else {
                    setData(d[0]);
                    setFull_name(d[0].full_name);
                    setIsLoading(false);
                }
            }
        }
        call();
    }, []);

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div id="toast" class="toast"></div>
            <Nav />
            <Header name={full_name} />
            <Content user_data={data}/>
            <Footer />
        </div>
    );
}

export default Home;
