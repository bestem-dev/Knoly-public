import { FC } from "react"
import { Controller } from "react-hook-form"
import { Avatar, Button, Chip, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Theme, Typography } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import theme from '@src/theme'
import { Box } from '@mui/system'
import { useState } from 'react'


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(item: string, selectedItems: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedItems.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}



const InputMultiSelect: FC<any> = ({name, control, label, options}) => {
  return(
    <Controller
      name={name}
      control={control}
      render={({ field: {onChange, value: selection} }) => {
        
        const handleChange = (event: SelectChangeEvent<typeof selection>) => {
          const {
            target: { value },
          } = event;
          onChange(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
        };

        return (
          <FormControl>
            <InputLabel id="multiple-chip-label">{label}</InputLabel>
            <Select
              labelId="multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={selection}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value: string) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {options.map((opt: string) => (
                <MenuItem
                  key={opt}
                  value={opt}
                  style={getStyles(opt, selection, theme)}
                >
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }}

    />
  )

}

export default InputMultiSelect