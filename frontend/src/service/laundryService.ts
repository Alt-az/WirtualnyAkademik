import axiosInstance from './axiosInstance';

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