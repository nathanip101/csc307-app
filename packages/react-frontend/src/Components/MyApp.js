import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    fetch("http://localhost:8000/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: characters[index]._id }),
    })
      .then(response => {
        if (response.status === 204) {
          const updated = characters.filter((character, i) => {
            return i !== index
          });
          setCharacters(updated);
        } else {
          throw new Error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then(response => {
        console.log(response);
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error("Failed to create new user");
        }
      })
      .then(newUser => setCharacters([...characters, newUser]))
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeOneCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;

