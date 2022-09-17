import React from "react";
import { theme } from "../utilsContext";

const GlobalContext = React.createContext({
  theme,
  rooms: [],
  setRooms: () => {},
  unfilteredRooms: [],
  setUnfilteredRooms: () => {}
});

export default GlobalContext;