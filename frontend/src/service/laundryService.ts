import axiosInstance from './axiosInstance';
import axios from "axios";
import { getConfig } from "./utils.ts";

export const getLaundrySlots = async (month: string, year: string) => {
    const response = await axiosInstance.get('/laundry/laundry-slots',{
        params: {
            "month": month,
            "year": year
        }
    });
    return response.data;
};

export const updateLaundrySlot = async (dateKey: string, slot: any) => {
    const [startHour, stopHour] = slot.time.split(' - ').map(time => parseInt(time.split(':')[0]));
    const startTime = new Date(dateKey);
    startTime.setHours(startHour+1, 0, 0, 0);
    const stopTime = new Date(dateKey);
    stopTime.setHours(stopHour+1, 0, 0, 0);
    console.log('room:' + slot.rooms[0])
    const response = await axiosInstance.post('/laundry/laundry-slots', {
        startTime: startTime.toISOString(),
        stopTime: stopTime.toISOString(),
        peopleLimit: 1, // Adjust this as needed
        isAvailable: true, // Adjust this as needed
        location: "Laundry Room", // Adjust this as needed
        room: slot.rooms[0], // Adjust this as needed
    });
    return response.data;
};

export const getUserLaundries = async () => {
    try {
        const config = getConfig();
        const endpoint = `http://localhost:8082/laundry/user-laundries`;

        const response = await axios.get(endpoint, config);

        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching user laundries:', error.response || error.message);
        return [];
    }
};


export const deleteLaundryReservation = async (laundryId) => {
    try {
        const config = getConfig();
        const response = await axios.delete(`http://localhost:8082/laundry/cancelReservation?id=${laundryId}`, config);
        console.log('Usunięto rezerwację:', response.data);
        return response.data;
    } catch (error) {
        console.error('Błąd podczas usuwania rezerwacji:', error.response || error.message);
        throw error;
    }
};



