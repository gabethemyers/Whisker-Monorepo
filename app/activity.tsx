import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Stack } from 'expo-router'; 
import { globalStyles } from '@/styles/globalStyle';
import Header from '@/components/activityHeader';

export default function activityScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>activity, coming soon</Text>
      </View>
    </>
  );
}


