import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {DialogMessage} from './components/DialogMessage.jsx'
import {PostulationCard} from './components/PostulationCard.jsx'


function App() {
const [candidateData, setCandidateData]=useState();
const [listOpenPositions,setListOpenPositions]=useState();
const [loading,setLoading]=useState(true);
const [message, setMessage]=useState({
  open:false,
  type:"",
  text:""
});

const BASE_URL= import.meta.env.VITE_BASE_URL;
const TU_EMAIL=import.meta.env.VITE_TU_EMAIL;

useEffect(()=>{

  const fetchCandidateData =fetch(`${BASE_URL}/api/candidate/get-by-email?email=${TU_EMAIL}`)
.then((response)=>response.json()).then(data=>
      setCandidateData(data)).catch(error => console.log("Error:", error));

const fetchJobPositions =fetch(`${BASE_URL}/api/jobs/get-list`).then(response=>response.json())
.then(data=>
     setListOpenPositions(data)
  ).catch(error => console.log("Error:", error))

Promise.all([fetchCandidateData,fetchJobPositions ]).finally(()=>setLoading(false));

},[]);

const submitPostulation=(e , positionId)=>{
  e.preventDefault();

    fetch(`${BASE_URL}/api/candidate/apply-to-job`,{
      method:"POST",
      body:JSON.stringify({
        "uuid": candidateData.uuid,
        "jobId":positionId,
        "candidateId":candidateData.candidateId,
        "repoUrl": e.target.repository.value,
        "applicationId":candidateData.applicationId
      }),
      headers:{
        "Content-type": "application/json; charset=UTF-8"
      }
      }).then(response=>response.json())
    .then(data=>{
      if(!data.ok){
        console.log("Error: ",data.error)
        setMessage({
          open:true,
          type:"error",
          text:"Candidato no encontrado"
        })
        return
      }
      setMessage({
       open:true,
        type:"success",
        text:"Postulación enviada con exito!"
      })
    })
    .catch(error => console.log("Error:", error))
}

  return (
      <>
    {loading?<>Cargando...</>: <>
    {message.open && <DialogMessage message={message} setMessage={setMessage}/>

    }
     <h1>Listado de posiciones abiertas</h1>
     <div>
       <ul className="listOpenPosition">
        {listOpenPositions?.map(position=>(          
          <PostulationCard key={position.id} position={position} submitPostulation={submitPostulation}/>
          ))
          }        
      </ul>
     </div>
   </>
 }
    </>
  )
}

export default App
