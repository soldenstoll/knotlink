import React from 'react';
import './App.css'
import MosaicMaker from './MosaicMaker';
import { useRef } from "react";
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import Footer from './components/Footer';

function App() {
  const topOfPageRef = useRef(null);

  const scrollToTop = () => {
    topOfPageRef.current?.scrollIntoView();
  }

  return (
    <>  
      <Header refFunc={scrollToTop}></Header>
      <div className='main-content min-h-[101vh] pt-16' ref={topOfPageRef}>
        <Routes>
          {routes.map(( { path, element }, idx) => {
            console.log(path)
            return <Route key={idx} path={path} element={element}/>
          })}
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
