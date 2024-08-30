import React, { useContext, useState } from "react";
import noteContext from "../context/note/noteContext";

const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote} = context;
    const [note, setNote] = useState({title:"",description:"",tag:""})

    const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value})
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag)
        props.showAlert("Note Added", 'success')
        setNote({ title: "", description: "", tag: "" })
    }

    return (
        <div className="container my-3">
            <h2>Add note</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" onChange={onChange}  value={note.title} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" onChange={onChange} value={note.tag} minLength={5} required />
                </div>
                <button disabled={note.title<5 || note.description<5} type="submit" className="btn btn-primary" onClick={handleSubmit}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote