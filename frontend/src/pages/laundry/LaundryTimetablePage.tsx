import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles.css';
import {
  getLaundrySlots,
  updateLaundrySlot,
  getUserLaundries,
  deleteLaundryReservation,
} from '../../service/laundryService';

const LaundryTimetablePage = () => {
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState({});
  const [userLaundries, setUserLaundries] = useState([]);

  const formatSlots = (data, currentDate) => {
    const dateKey = currentDate.toDateString();

    const defaultSlots = Array(6)
        .fill(null)
        .map((_, i) => ({
          time: `${6 + i * 3}:00 - ${9 + i * 3}:00`,
          rooms: [],
        }));

    const newSlots = { ...slots };

    newSlots[dateKey] = defaultSlots.map(slot => ({ ...slot, rooms: [] }));

    data.forEach((slot) => {
      const slotDateKey = new Date(slot.startTime).toDateString();
      if (slotDateKey === dateKey) {
        const slotIndex = newSlots[dateKey].findIndex(
            (s) =>
                s.time ===
                `${new Date(slot.startTime).getHours()}:00 - ${new Date(slot.stopTime).getHours()}:00`
        );

        if (
            slotIndex !== -1 &&
            !newSlots[dateKey][slotIndex].rooms.includes(slot.room)
        ) {
          console.log('Dodawanie pokoju:', slot.room);
          newSlots[dateKey][slotIndex].rooms.push(slot.room);
          console.log('Aktualne pokoje w slocie:', newSlots[dateKey][slotIndex].rooms);
        }
      }
    });

    return newSlots;
  };

  const refreshData = async () => {
    try {
      const slotsData = await getLaundrySlots(
          (date.getMonth() + 1).toString(),
          date.getFullYear().toString()
      );
      const formattedSlots = formatSlots(slotsData, date);
      setSlots(formattedSlots);

      const userData = await getUserLaundries();
      console.log('Dane pralni użytkownika:', userData);
      setUserLaundries(userData);
    } catch (error) {
      console.error('Błąd podczas odświeżania danych:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, [date]);

  const addSlot = async (dateKey, slot) => {
    try {
      await updateLaundrySlot(dateKey, slot);
      await refreshData();
    } catch (error) {
      console.error('Błąd podczas dodawania slotu:', error);
    }
  };

  const handleSlotClick = async (index) => {
    const room = prompt('Wpisz numer pokoju:');
    if (room) {
      const dateKey = date.toDateString();

      const newSlots = slots[dateKey]
          ? [...slots[dateKey]]
          : Array(6)
              .fill(null)
              .map((_, i) => ({
                time: `${6 + i * 3}:00 - ${9 + i * 3}:00`,
                rooms: [],
              }));

      if (newSlots[index].rooms.length < 1) {
        console.log('Aktualny slot przed dodaniem:', newSlots[index]);
        newSlots[index].rooms.push(room);
        await addSlot(dateKey, newSlots[index]);
      } else {
        alert('Brak wolnych miejsc w tym slocie.');
      }
    }
  };

  const handleDeleteReservation = async (laundryId) => {
    const confirmDelete = window.confirm('Czy na pewno chcesz usunąć tę rezerwację?');
    if (confirmDelete) {
      try {
        console.log(`Attempting to delete reservation with ID: ${laundryId}`);
        await deleteLaundryReservation(laundryId);
        console.log('Rezerwacja została usunięta. Odświeżanie listy rezerwacji.');
        await refreshData();
        alert('Rezerwacja została usunięta.');
      } catch (error) {
        console.error('Nie udało się usunąć rezerwacji:', error);
        alert('Nie udało się usunąć rezerwacji. Spróbuj ponownie.');
      }
    }
  };

  const dateKey = date.toDateString();
  const daySlots =
      slots[dateKey] ||
      Array(6)
          .fill(null)
          .map((_, i) => ({
            time: `${6 + i * 3}:00 - ${9 + i * 3}:00`,
            rooms: [],
          }));

  return (
      <div className="container mx-auto p-4">
        <div className="mt-0 mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 border-b-2 pb-4">
            Twoje Rezerwacje
          </h2>
          {userLaundries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userLaundries.map((laundryItem) => (
                    <div
                        key={laundryItem.id}
                        className="p-4 border rounded-lg shadow-md bg-white flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-bold mb-2">
                          Miejsce: {laundryItem.laundry.location}
                        </h3>
                        <p className="text-gray-700">
                          <strong>Pokój:</strong> {laundryItem.laundry.room}
                        </p>
                        <p className="text-gray-700">
                          <strong>Start:</strong>{' '}
                          {new Date(laundryItem.laundry.startTime).toLocaleTimeString(
                              [],
                              {hour: '2-digit', minute: '2-digit'}
                          )}
                        </p>
                        <p className="text-gray-700">
                          <strong>Zakończenie:</strong>{' '}
                          {new Date(
                              laundryItem.laundry.stopTime
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <button
                          onClick={() => handleDeleteReservation(laundryItem.id)}
                          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Usuń rezerwację
                      </button>
                    </div>
                ))}
              </div>
          ) : (
              <p className="text-gray-700">Nie masz przypisanych rezerwacji.</p>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-4">Grafik pralni</h1>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="md:w-1/3 p-2">
            <Calendar
                onChange={(newDate) => {
                  setDate(newDate);
                  // updateCalendar();
                }}
                value={date}
                className="rounded-lg shadow-md"
            />
          </div>

          <div className="md:w-2/3 p-2">
            {daySlots.map((slot, index) => (
                <div
                    key={index}
                    className="p-4 border rounded-lg shadow-md bg-white mb-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xl">{slot.time}</span>
                    <button
                        onClick={async () => await handleSlotClick(index)}
                        className={`px-4 py-2 rounded ${
                            slot.rooms.length < 1
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                        }`}
                    >
                      {slot.rooms.length < 1 ? 'Dostępne' : 'Brak wolnych miejsc'}
                    </button>
                  </div>
                  <div className="mt-2">
                    {slot.rooms.map((room, i) => (
                        <div key={i} className="text-gray-700">
                          Pokój {room}
                        </div>
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
