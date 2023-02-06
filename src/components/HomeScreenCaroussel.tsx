import React, { FC } from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils';
// const SwipeableViews = require('react-swipeable-views');
// const autoPlay = require('react-swipeable-views-utils').autoPlay
import Image from 'next/image';


const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    label: 'Valida las aptitudes de tus colegas, empleados o clientes',
    imgPath:
      '/assets/images/welcome/welcome1.png',
    width: 1400,
    height: 1439
  },
  {
    label: 'Obtén una validación por tus conocimientos',
    imgPath:
      '/assets/images/welcome/welcome2.png',
    width: 1400,
    height: 1439
  },
  {
    label: 'Recibe ofertas de empresas buscando el mejor talento',
    imgPath:
      '/assets/images/welcome/welcome3.png',
    width: 1400,
    height: 1439
  }
];


const HomeScreenCaroussel: FC<any> = ({sx}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Stack
      alignItems="center"
      sx={sx}
    >
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        style={{height:"100%", width:"100%", overflow:"hidden", maxWidth: "300px"}}
      >
        {images.map((step, index) => (
            // <div key={step.label} style={{display: "flex", justifyContent: "center", height:100, width:100}}>
            Math.abs(activeStep - index) <= 2 ? (
              <Image
                src={step.imgPath}
                alt={step.label}
                height={step.height}
                width={step.width}
                layout="responsive"
              />
              ) : null
            // </div>
        ))}
      </AutoPlaySwipeableViews>
      <Paper
        square
        elevation={0}
        sx={{
            display: 'flex',
            alignItems: 'center',
            height: 50,
            pl: 2,
            bgcolor: 'background.default',
          }}
          >
      <Typography style={{
        textAlign: "center"
      }}>{images[activeStep].label}</Typography>
      </Paper>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        backButton={undefined}
        nextButton={undefined}
      />
    </Stack>
  );
}

export default HomeScreenCaroussel;
