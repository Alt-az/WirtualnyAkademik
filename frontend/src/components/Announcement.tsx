import React from 'react';

interface Creator {
    username: string;
    email: string;
}

interface AnnouncementData {
    id: number;
    title: string;
    content: string;
    creator: Creator;
    // createdAt?: string;
}

interface AnnouncementProps {
    data: AnnouncementData;
}

const Announcement: React.FC<AnnouncementProps> = ({ data }) => {
    const { title, content, creator /*, createdAt */ } = data;
    const { username, email } = creator;

    return (
        <div className="bg-white shadow-md rounded p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-700 mb-2">{content}</p>
            <div className="text-sm text-gray-500">
                <p>Użytkownik: {username}</p>
                <p>Email: {email}</p>
                {/* <p>Data utworzenia: {new Date(createdAt).toLocaleDateString()}</p> */}
            </div>
        </div>
    );
};

export default Announcement;
