import React from 'react'
import Navigation from './navigations/Navigation';
import { LogBox } from 'react-native'
import ContextWrapper from "./context/ContextWrapper";

LogBox.ignoreAllLogs()

export default function App() {
  return (
    <ContextWrapper><Navigation/></ContextWrapper>
  );
}