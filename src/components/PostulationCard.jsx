export function PostulationCard({position,submitPostulation }){
	return(
	<li className="form">
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
	)
}