import { useState } from 'react';

type FlashCard = { front: string; back: string };

export default function FlashCardApp() {
  const [cards, setCards] = useState<FlashCard[]>([{ front: '', back: '' }]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [embedCards, setEmbedCards] = useState<FlashCard[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleChange = (index: number, field: 'front' | 'back', value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleAddCard = () => setCards([...cards, { front: '', back: '' }]);

  // Кодирование карточек в ссылку
const handleGenerateLink = () => {
  const validCards = cards.filter(c => c.front && c.back);
  if (!validCards.length) {
    alert('Заполните хотя бы одну карточку полностью!');
    return;
  }

  // Преобразуем JSON в base64 с поддержкой юникода
  const json = JSON.stringify(validCards);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  const link = `${window.location.origin}?cards=${encoded}`;
  setGeneratedLink(link);
};

// Декодирование карточек из ссылки
const handleLoadEmbed = () => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('cards');
  if (!encoded) return;
  try {
    // Декодируем base64 с юникодом
    const decoded = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    setEmbedCards(decoded);
  } catch (err) {
    console.error('Ошибка декодирования карточек', err);
  }
};

  const handleFlip = () => setFlipped(!flipped);
  const handleNext = () => {
    if (!embedCards) return;
    setCurrentIndex((prev) => (prev + 1) % embedCards.length);
    setFlipped(false);
  };

  // Если есть ?cards=..., сразу загружаем embed
  if (!embedCards) handleLoadEmbed();

  // Рендер виджета, если загружены карточки
  if (embedCards)
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-100 min-h-screen">
        <div
          className="flex items-center justify-center w-56 h-36 bg-white rounded-lg shadow cursor-pointer select-none text-lg font-semibold"
          onClick={handleFlip}
        >
          {flipped ? embedCards[currentIndex].back : embedCards[currentIndex].front}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleFlip}
        >
          Перевернуть
        </button>
        <button
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleNext}
        >
          Следующая
        </button>
      </div>
    );

  // Рендер формы создания карточек
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Создай свои флэш-карточки</h1>

      <div className="w-full max-w-md">
        {cards.map((card, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Front"
              value={card.front}
              onChange={(e) => handleChange(index, 'front', e.target.value)}
              className="flex-1 px-2 py-1 border rounded"
            />
            <input
              type="text"
              placeholder="Back"
              value={card.back}
              onChange={(e) => handleChange(index, 'back', e.target.value)}
              className="flex-1 px-2 py-1 border rounded"
            />
          </div>
        ))}
        <button
          onClick={handleAddCard}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Добавить карточку
        </button>
        <button
          onClick={handleGenerateLink}
          className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Сгенерировать ссылку
        </button>
      </div>

      {generatedLink && (
        <div className="mt-4 p-2 bg-white rounded shadow break-words">
          <p>Скопируй эту ссылку для вставки в Notion:</p>
          <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="text-blue-600">
            {generatedLink}
          </a>
        </div>
      )}
    </div>
  );
}