import { OpenCV } from 'react-native-opencv3';

export const compareImages = async (img1, img2) => {
    try {
        const result = await OpenCV.subtract(img1, img2);
        return result; // Return the result image URI or other data
    } catch (error) {
        console.error("Error comparing images:", error);
        throw error; // Re-throw to handle it in the calling component
    }
};
