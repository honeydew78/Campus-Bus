import React from 'react'
import Header2 from './components/Header/Header2'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'

function Layout2(){
 return(
   <>
   <Header2/>
   <Outlet/>
   <Footer/>
   </>
 )
}

export default Layout2
