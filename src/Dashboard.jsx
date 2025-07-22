import { useState, useEffect } from "react";
import SearchButton from "../public/SearchButton";
import NotePopup from "./NotePopup";

function Dashboard(){

    const [showPopup,setShowPopup] = useState(false);
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Not authorized. Please login again.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/getnotes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch notes");
        }

        setNotes(data); 
      } catch (err) {
        alert("Error fetching notes: " + err.message);
      }
    };

    fetchNotes();
  }, []);

    const handleDelete = async (noteId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:3000/api/deletenotes/${noteId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
            });

            const data = await response.json();

            if (!response.ok) {
            throw new Error(data.error || "Failed to delete note");
            }

            // Remove note from state
            setNotes((prevNotes) => prevNotes.filter(note => note._id !== noteId));

        } catch (error) {
            alert("Error: " + error.message);
        }
        };


    const handleCreate = async (note) => {

        const token = localStorage.getItem("token");

            try {
            const response = await fetch("http://localhost:3000/api/postnote", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title:note.title, content:note.content, color:note.color }) 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create note");
            }


                console.log("Note created: ", note);

                setNotes((prevNotes) => [...prevNotes, data]);
                setShowPopup(false);

            } catch (error) {
            alert("Error: " + error.message);
            }
    };

    const handleCancel = () => {
        setShowPopup(false);
    }

const handleClick = () => {
        window.location.href = 'http://localhost:5173/login';
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(<>
        <div> { showPopup && (<NotePopup onCreate={handleCreate} onCancel={handleCancel} />)} </div>
        <div className="bg-gradient-to-r from-orange-600 via-pink-600 to-pink-700 w-screen h-21 text-2xl font-family-cabin">
            <div className="relative bg-gray-900 w-full h-20 flex items-center px-6">
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-pink-600">
                    Memora
                    </div>
                    <div onClick={handleClick} className="text-pink-600 ml-auto hover:underline cursor-pointer text-[15px]">Back to Login</div>
            </div>
        </div>

        <div className="search-btn mt-10 text-shadow-white">
                    <SearchButton searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>


        <button onClick={() => setShowPopup(true)} class="font-family-cabin cursor-pointer mt-10 ml-[37%] md:ml-[47%] text-sm font-bold font-inherit text-pink-600 bg-[#f8f8fd] px-4 py-2 rounded-full border-[4px] border-pink-600 shadow-[0px_4px_0px_#831843] active:relative active:top-1 active:border-pink-700 active:shadow-none">
            Add Note
        </button>
        
          <div className="note-body mt-20 px-4 grid grid-cols-1 gap-6 place-items-center md:flex md:flex-wrap md:justify-start md:gap-5 md:place-items-start">
              
                {filteredNotes.map((note) => (
                    <div
                        key={note._id} 
                        className="note h-80 w-5/6 md:h-70 md:w-60 rounded shadow-md p-2"
                        style={{ backgroundColor: note.color }}
                    >
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }} className="note-title h-12 w-full bg-opacity-20 rounded text-center pt-2 font-bold text-white flex justify-between items-center px-2">
                            <p className="title-text font-family-cabin flex-1 truncate">{note.title}</p>
                            <div className="delete-button cursor-pointer" onClick={() => handleDelete(note._id)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 6V4C8 3.44772 8.44771 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 11V17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M14 11V17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <p className="font-family-cabin content-text overflow-y-auto h-[calc(100%-3rem)] mt-2 px-2 text-white">
                            {note.content}
                        </p>
                    </div>
                ))}
            </div>
    </>)
}

export default Dashboard;