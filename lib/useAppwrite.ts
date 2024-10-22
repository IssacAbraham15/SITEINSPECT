import { Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

// Define the expected data structure
interface SiteData {
    $id: string;
    Name: string;
    Location: string;
    Progress: number;
    Image: string;
}

const useAppwrite = (fn: () => Promise<SiteData[]>) => {
    const [data, setData] = useState<SiteData[]>([]); // State for the fetched data
    const [isLoading, setIsLoading] = useState<boolean>(true); // State for loading

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await fn();
            setData(response); // Set the fetched data
        } catch (err: any) { // Catching errors with a generic 'any' type
            Alert.alert('Error', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData(); // Function to refetch data

    return { data, isLoading, refetch }; // Return the data, loading state, and refetch function
};

export default useAppwrite;
