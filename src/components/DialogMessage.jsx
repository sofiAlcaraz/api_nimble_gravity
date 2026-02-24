
export function DialogMessage({message, setMessage}){
return(	<span className={message.type} >
      <div className="span-body"> 
      <h4>{message.text}</h4>
      <button onClick={()=>setMessage({
        open:false,
        type:"",
        text:""
        }
        )}>X</button>
      </div>
    </span>)
}