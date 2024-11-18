import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import Svg, { Circle, Polygon, Defs, RadialGradient, Stop } from 'react-native-svg';
import { styled } from 'nativewind';
import { Magnetometer } from 'expo-sensors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const RadarScreen = () => {

  const { constructId, siteName } = useLocalSearchParams();
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [distance, setDistance] = useState(0);
  const [heading, setHeading] = useState(0); // Phone's orientation


  const siteNameString = Array.isArray(siteName) ? siteName[0] : siteName ?? '';
  const constructIdString = Array.isArray(constructId) ? constructId[0] : constructId ?? '';

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

  // Calculate distance and bearing to a destination every 3 seconds
  useEffect(() => {
    if (userLocation) {
      const updateDistanceAndBearing = () => {
        const destination = { lat: 25.101285, lng: 55.162669 };
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
      };

      // Initial call
      updateDistanceAndBearing();

      // Set interval to update every 3 seconds
      const interval = setInterval(updateDistanceAndBearing, 3000);

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [userLocation]);

  // Magnetometer to get phone's heading
  useEffect(() => {
    const subscribe = Magnetometer.addListener((data) => {
      let { x, y } = data;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      setHeading((angle + 360) % 360); // Normalize angle to be between 0 and 360
    });

    return () => subscribe.remove();
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

  const calculateBearing = (lat1: any, lon1: number, lat2: number, lon2: number) => {
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
  const arrowSize = circleRadius * 0.1;

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View className="flex-1">
        {/* Header with back button and title */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <View className="bg-red-800 p-3 rounded-full">
              <Text className="text-white text-lg">{'←'}</Text>
            </View>
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">Construct Radar</Text>
        </View>

        <View className='justify-center items-center'>
          
          <Text className='text-white text-xl font-bold mt-4'>{siteNameString}-{constructId}</Text>
        </View>

        {/* Radar area */}
        <View className="flex-1 items-center justify-center mb-8">
          {hasLocationPermission ? (
            <View className="items-center p-6 rounded-full">
              {/* Radar background with gradient */}
              <Svg height={circleRadius} width={circleRadius}>
                <Defs>
                  <RadialGradient
                    id="radarGradient"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                  >
                    <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                    <Stop offset="100%" stopColor="#00ff00" stopOpacity="0.3" />
                  </RadialGradient>
                </Defs>
                
                {/* Outer Circle Layers */}
                <Circle cx={circleRadius / 2} cy={circleRadius / 2} r={circleRadius / 2 - 20} fill="url(#radarGradient)" />
                <Circle cx={circleRadius / 2} cy={circleRadius / 2} r={(circleRadius / 2) * 0.75} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
                <Circle cx={circleRadius / 2} cy={circleRadius / 2} r={(circleRadius / 2) * 0.5} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
                <Circle cx={circleRadius / 2} cy={circleRadius / 2} r={(circleRadius / 2) * 0.25} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />

                {/* Arrow that points based on bearing */}
                <Polygon
                  points={`${circleRadius / 2},${arrowSize / 2} ${(circleRadius / 2) + arrowSize / 2},${arrowSize + 40} ${(circleRadius / 2) - arrowSize / 2},${arrowSize + 40}`}
                  fill="white"
                  originX={circleRadius / 2}
                  originY={circleRadius / 2}
                  rotation={bearing - heading}
                />
              </Svg>

              {/* Distance */}
              <Text className="text-white text-3xl mt-4 font-semibold">
                {Math.round(distance)} <Text className="text-lg">m</Text>
              </Text>
            </View>
          ) : (
            <Text className="text-red-500 text-center">Location permission is required.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default styled(RadarScreen);
