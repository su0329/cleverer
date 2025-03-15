import React from 'react';
import './App.css';
import RatingWidget from './component/Rating';
import { UserRatingList } from './component/List/UserRatingList';

function App() {
  return (
    <div className="App">
      <RatingWidget />
      <UserRatingList />
    </div>
  );
}

export default App;
