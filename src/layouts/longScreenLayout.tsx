import { FunctionComponent } from "react";
import { Stack } from "@mui/material";

import { LayoutProps } from "@src/interfaces"

const LongScreenLayout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  return (
    <Stack
    direction="column"
    justifyContent="flex-start"
    >
      { props.children }
    </Stack>
    )
  }
  
  export default LongScreenLayout