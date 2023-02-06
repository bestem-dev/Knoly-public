import { TextField, Typography } from "@mui/material"
import { FC } from "react"
import { Controller } from "react-hook-form"

const InputFormText: FC<any> = ({name, control, label, type, multiline, sx, error, ...otherProps}) => {
  return(
    <Controller
      name={name}
      control={control}
      render={({ field: {onChange, value} }) => (
        <>
          <TextField
            id={name}
            label={label}
            type={type}
            variant="outlined"
            value={value ? value : ""}
            onChange={onChange}
            multiline={multiline? true: false}
            sx={sx}
            error={error?.error}
            {...otherProps}
          />
          <Typography color="red">
            {error?.message}
          </Typography>
        </>
      )}

    />
  )

}

export default InputFormText