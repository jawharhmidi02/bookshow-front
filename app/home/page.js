"use client"
// Packages
import { useState, useEffect } from 'react';

// Components
import Nav from './nav/nav';
import Header from './header/header'
import Suggestion from './suggestion/suggestion';
import Review from './review/review';
import Footer from './footer/footer';

// Style
import "./page.css";
import "./animations.css"
import "./responsive.css"

const Home = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('show');
            } else {
              entry.target.classList.remove('show');
            }
          });
        });
    
        const hiddenElements = document.querySelectorAll(".hidden");
        hiddenElements.forEach(el => observer.observe(el));
    
        return () => {
          hiddenElements.forEach(el => observer.unobserve(el));
        };
      }, []);

    return(
        <div>
            <Nav />
            <Header />
            <Suggestion />
            <Review />
            <Footer />
        </div>
    )
}

export default Home;