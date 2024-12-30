import React, { useEffect, useState } from 'react';
import './styles.css';

type Package = {
    id: string;
    description: string;
    assignedTo: string;
};

type PackagePickupProps = {
    lodgeName: string;
};

const mockPackages: Package[] = [
    { id: '1', description: 'Small box with electronics', assignedTo: 'John Doe' },
    { id: '2', description: 'Envelope with documents', assignedTo: 'Jane Smith' },
    { id: '3', description: 'Medium package with clothes', assignedTo: 'Alice Johnson' },
];

const PackagePickup: React.FC<PackagePickupProps> = ({ lodgeName }) => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Simulate API call with mock data
        const fetchPackages = async () => {
            try {
                // Simulate network delay
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setPackages(mockPackages);
            } catch (err) {
                setError('Failed to fetch packages');
            }
        };

        fetchPackages();
    }, []);

    const handlePickup = async (packageId: string) => {
        try {
            // Simulate successful pickup operation
            await new Promise((resolve) => setTimeout(resolve, 500));
            alert(`Package ${packageId} has been picked up.`);
            setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
        } catch (err) {
            setError('Failed to pick up package');
        }
    };

    return (
        <div className="pickup-container">
            <h1 className="header">Package Pickup</h1>
            <p className="welcome-message">Welcome! Below is the list of packages assigned to you:</p>

            {error && <p className="error-message">{error}</p>}

            <ul className="package-list">
                {packages.map((pkg) => (
                    <li key={pkg.id} className="package-item">
                        <span className="package-description">{pkg.description}</span>
                        <button
                            className="pickup-button"
                            onClick={() => handlePickup(pkg.id)}
                        >
                            Pick Up
                        </button>
                    </li>
                ))}
            </ul>

            {packages.length === 0 && <p className="no-packages">No packages assigned to you at the moment.</p>}
        </div>
    );
};

export default PackagePickup;
