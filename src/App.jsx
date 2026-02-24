import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


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
      console.log(data.ok)
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
    {message.open && <span className={message.type} >
      <div className="span-body"> 
      <h4>{message.text}</h4>
      <button onClick={()=>setMessage({
        open:false,
        type:"",
        text:""
        }
        )}>X</button>
      </div>
    </span>

    }
     <h1>Listado de posiciones abiertas</h1>
     <div>
       <ul className="listOpenPosition">
        {listOpenPositions.map(position=>(          
          <li className="form"  key={position.id}>
            <form  id={position.id} onSubmit={(e)=>submitPostulation(e, position.id)}>
                <h3>{position.title}</h3>
                <div className="card-form">
                  <label htmlFor="repository">Postulate!</label>
                  <input type="text" name="repository" placeholder="URL de tu repositorio"
               required></input>
                  <button type="submit">Enviar postulación</button>
                </div>
            </form>
          </li>
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
