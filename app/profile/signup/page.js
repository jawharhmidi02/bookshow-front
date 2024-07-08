"use client"
import React from 'react'

// Components
import Nav from './nav/nav'
import Header from './header/header'
import Footer from './footer/footer'
import Content from './content/Content'

// Styles
import "./responsive.css";
import "./animations.css";
import "./page.css"
const Home = ()=> {
    return (
        <div >
            <div id="toast" class="toast"></div>
            <Nav />
            <Header />
            <Content />
            <Footer />
        </div>
    )
}

export default Home;