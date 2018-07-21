import React, { Component } from "react";

// Layout imports
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Footer />
      </div>
    );
  }
}

export default App;
