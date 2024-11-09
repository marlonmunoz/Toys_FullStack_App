import { useState, useEffect } from 'react';   
import NavBar from './NavBar';
import Header from './Header';
import { Outlet } from 'react-router-dom'; 
import { v4 as uuidv4 } from 'uuid';



function App() {  
  const [toys, setToys] = useState([]); // State to store the toys
  const [searchText, setSearchText] = useState(""); // State to store the search text
  const [selectedAge, setSelectedAge] = useState("all"); // State to store the selected age

//   useEffect(() => {  // Fetch the toys from the API               
//     fetch("http://localhost:5000/toys")  
//       .then(response => response.json())  // Parse the JSON data
//       .then(data => setToys(data)); // Set the toys in the state
//   }, []);  // Empty dependency array to run the effect only once

    useEffect(() => {  // Fetch the toys from the API               
      fetch("http://localhost:4000/toys", {
        mode: 'cors'
      })  
        .then(response => response.json())  // Parse the JSON data
        .then(data => setToys(data)); // Set the toys in the state
    }, []);  // Empty dependency array to run the effect only once

  const filteredToysByAge = selectedAge === "all" ? toys : toys.filter(toy => toy.age === selectedAge);// Filter the toys by age   
  const filteredToys = filteredToysByAge.filter(toy => { // Filter the toys by search text
  return toy.name.toUpperCase().includes(searchText.toUpperCase());  //ensures that the search is not case-sensitive
  }); 
  

  // Update the search text
  function updateSearchText(event) {  
    setSearchText(event.target.value);  
  }
 
  // Update the selected age
  function handleAgeChange(event){  
    setSelectedAge(event.target.value)
  }

  // Delete a toy
  function deleteToy(toyId) {  
    setToys(toys.filter(toy => toy.id !== toyId));  // Remove the toy from the state
  }

  // Add a new toy
  function addNewToy(newToy) {  
    const tempToy = { ...newToy, id: uuidv4(), temp: true }; // Add a unique ID and temp flag
    setToys([...toys, tempToy]); // Temporarily add the new toy to the state

    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    };
  
    fetch("http://localhost:4000/toys", configObj)
      .then(response => response.json())
      .then(newToyData => {
        setToys([...toys, newToyData]); // Add the new toy to the state
      });
  }

  return (
    <div className="App"> 
      <NavBar />  {/*displays the navbar*/}
      <Header />   {/*displays the header*/}
      
      {/*Pass the context to the child components*/}
      <Outlet context={{toys: filteredToys, addNewToy: addNewToy, deleteToy: deleteToy, updateSearchText: updateSearchText, searchText: searchText, handleAgeChange: handleAgeChange, selectedAge: selectedAge}} /> 
    </div>
  );
}

export default App;
