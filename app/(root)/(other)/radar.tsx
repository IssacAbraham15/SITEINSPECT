import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import Svg, { Polygon } from 'react-native-svg';
import { styled } from 'nativewind';
import { Magnetometer } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const RadarScreen = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [distance, setDistance] = useState(0);
  const [heading, setHeading] = useState(0); // Phone's orientation

  const navigation = useNavigation();

  // Request location permission
  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      setHasLocationPermission(true);

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    };

    requestLocationPermission();
  }, []);

  // Calculate distance and bearing to a destination 25.101285, 55.162669
  useEffect(() => {
    if (userLocation) {
      const destination = { lat: 25.101285, lng: 55.162669 }; // Example destination coordinates
      const calculatedDistance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        destination.lat,
        destination.lng
      );
      setDistance(calculatedDistance);

      const calculatedBearing = calculateBearing(
        userLocation.latitude,
        userLocation.longitude,
        destination.lat,
        destination.lng
      );
      setBearing(calculatedBearing);
    }
  }, [userLocation]);

  // Magnetometer to get phone's heading
  useEffect(() => {
    const subscribe = Magnetometer.addListener((data) => {
      let { x, y } = data;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      setHeading((angle + 360) % 360); // Normalize angle to be between 0 and 360
    });

    return () => subscribe.remove(); // Cleanup listener on unmount
  }, []);

  // Helper functions for distance and bearing calculation
  const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const lat1Rad = degreesToRadians(lat1);
    const lat2Rad = degreesToRadians(lat2);
    const diffLat = degreesToRadians(lat2 - lat1);
    const diffLong = degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(diffLong / 2) * Math.sin(diffLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const lat1Rad = degreesToRadians(lat1);
    const lat2Rad = degreesToRadians(lat2);
    const diffLong = degreesToRadians(lon2 - lon1);
    const y = Math.sin(diffLong) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(diffLong);
    const bearing = Math.atan2(y, x);
    return (bearing * (180 / Math.PI) + 360) % 360;
  };

  const circleRadius = width * 0.6;
  const arrowSize = circleRadius * 0.1; // Set arrow size to 10% of circle radius

  return (
    <SafeAreaView className='flex-1 bg-white'>
    <View className="flex-1 bg-white">
      {/* Header with back button and title */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <View className="bg-red-800 p-3 rounded-full">
            <Text className="text-white text-lg">{'←'}</Text>
          </View>
        </TouchableOpacity>
        <Text className="text-red-800 text-lg font-bold">Construct Radar</Text>
      </View>

      {/* Radar area */}
      <View className="flex-1 items-center justify-center">
        {hasLocationPermission ? (
          <View className="items-center bg-green-500 p-6 rounded-lg">
            {/* Arrow that points based on bearing */}
            <Svg height={circleRadius} width={circleRadius} style={{ position: 'relative' }}>
              <Polygon
                points={`
                  ${circleRadius / 2},${arrowSize / 2} 
                  ${(circleRadius / 2) + arrowSize / 2},${arrowSize + 40} 
                  ${(circleRadius / 2) - arrowSize / 2},${arrowSize + 40}
                `}
                fill="#fff"
                stroke="#fff"
                strokeWidth="2"
                originX={circleRadius / 2}
                originY={circleRadius / 2}
                rotation={bearing - heading} // Arrow rotates based on phone's heading
              />
            </Svg>
            
            {/* Distance */}
            <Text className="text-white text-3xl mt-4">
              {Math.round(distance)} <Text className="text-xl">m</Text> {/* Display distance in meters */}
            </Text>
          </View>
        ) : (
          <Text className="text-red-500 text-center">Location permission is required.</Text>
        )}

        {/* Example image (for bottom floorplan display) */}
        <View className="mt-8">
          <Svg height={120} width={width * 0.8}>
            {/* Add the image or SVG content of your floor plan here */}
          </Svg>
        </View>
      </View>
    </View>
  </SafeAreaView>
  );
};

export default styled(RadarScreen);