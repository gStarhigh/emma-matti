import React, { useState } from 'react'
import { UploadForm } from './components'
import Gallery from './components/Gallery'
import './App.css'

export default function App(){
  const [images, setImages] = useState<any[]>([])

  function handleUploaded(res:any){
    setImages(prev=>[res, ...prev])
  }

  return (
    <div className="container">
      <h1 className="my-4">Emma & Matti - Wedding Photos</h1>
      <div className="row">
        <div className="col-md-6">
          <UploadForm onUploaded={handleUploaded} />
        </div>
        <div className="col-md-6">
          <Gallery images={images} />
        </div>
      </div>
    </div>
  )
}
