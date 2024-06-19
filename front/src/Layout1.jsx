import React from 'react'
import Header1 from './components/Header/Header1'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'

function Layout1(){
 return(
   <>
   <Header1/>
   <Outlet/>
   <Footer/>
   </>
 )
}

export default Layout1
