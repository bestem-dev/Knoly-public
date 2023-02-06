import { FunctionComponent } from "react";
import { Stack } from "@mui/material";

import { LayoutProps } from "@src/interfaces"

const OneScreenLayout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  return (
    <Stack
    direction="column"
    justifyContent={props.justifyContent ?? "space-evenly"}
    alignItems="center"
    style={{
      height: "100vh",
      ...props.style
    }}
    >
      { props.children }
    </Stack>
    )
  }
  
  export default OneScreenLayout