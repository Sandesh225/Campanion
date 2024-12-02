import React from "react";
import { Button } from "react-native-paper";

const CustomButton = ({ children, ...props }) => (
  <Button mode="contained" {...props}>
    {children}
  </Button>
);

export default CustomButton;
