import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles.css';

const LaundryTimetablePage = () => {
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState({});

  const handleSlotClick = (index) => {
    const room = prompt("Wpisz numer pokoju:");
    if (room) {
      const dateKey = date.toDateString();
      const newSlots = slots[dateKey] ? [...slots[dateKey]] : Array(6).fill(null).map((_, i) => ({
        time: `${6 + i * 3}:00 - ${9 + i * 3}:00`,
        rooms: [],
      }));
      if (newSlots[index].rooms.length < 3) {
        newSlots[index].rooms.push(room);
        setSlots({ ...slots, [dateKey]: newSlots });
      } else {
        alert("Brak wolnych miejsc w tym slocie.");
      }
    }
  };

  const dateKey = date.toDateString();
  const daySlots = slots[dateKey] || Array(6).fill(null).map((_, i) => ({
    time: `${6 + i * 3}:00 - ${9 + i * 3}:00`,
    rooms: [],
  }));

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Grafik pralni</h1>
        <div className="flex space-x-4">
          <div className="w-1/3 p-2">
            <Calendar
                onChange={setDate}
                value={date}
                className="rounded-lg shadow-md"
            />
          </div>
          <div className="w-2/3 p-2">
            {daySlots.map((slot, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-md bg-white mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl">{slot.time}</span>
                    <button
                        onClick={() => handleSlotClick(index)}
                        className={`px-4 py-2 rounded ${slot.rooms.length < 3 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                      {slot.rooms.length < 3 ? 'Dostępne' : 'Brak wolnych miejsc'}
                    </button>
                  </div>
                  <div className="mt-2">
                    {slot.rooms.map((room, i) => (
                        <div key={i} className="text-gray-700">Pokój {room}</div>
                    ))}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default LaundryTimetablePage;