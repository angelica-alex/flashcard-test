import { useState } from 'react'
import './App.css'

type FlashCard = {
  front: string;
  back: string;
}

const cards: FlashCard[] = [
  { front: "Hello", back: "Привет"},
  { front: "Apple", back: "Яблоко"},
  { front: "Book", back: "Книга"},
  { front: "Water", back: "Вода"},
];

const App = () => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length );
    setFlipped(false);
  };

  return(
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md w-64">
      <div
        className="flex items-center justify-center w-56 h-36 bg-white rounded-lg shadow cursor-pointer select-none text-lg font-semibold"
        onClick={handleFlip}
      >
        {flipped ? cards[currentIndex].back : cards[currentIndex].front}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={handleFlip}
      >
        Перевернуть
      </button>
      <button
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        onClick={handleNext}
      >
        Следующая
      </button>
    </div>
  );

}

export default App