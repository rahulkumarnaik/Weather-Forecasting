import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Link, Typography, CssBaseline, Button, IconButton } from '@mui/material';
import Search from './components/Search/Search';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { fetchWeatherData } from './api/OpenWeatherService';
import { transformDateFormat } from './utilities/DatetimeUtils';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import ErrorBox from './components/Reusable/ErrorBox';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import GitHubIcon from '@mui/icons-material/GitHub';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Logo from './assets/logo.png';
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils';

// Get stored theme preference from local storage
const getStoredTheme = () => {
  return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
};

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [themeMode, setThemeMode] = useState(getStoredTheme());

  // Define themes
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
      text: {
        primary: '#000000',
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
      },
    },
  });

  // Toggle theme and store preference
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const searchChangeHandler = async (enteredData) => {
    if (!enteredData) return;
    console.log('Fetching weather data for:', enteredData);

    const [latitude, longitude] = enteredData.value.split(' ');

    setIsLoading(true);
    setError(false);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] = await fetchWeatherData(latitude, longitude);

      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({ city: enteredData.label, list: all_week_forecasts_list });

      console.log('Weather data updated successfully');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(true);
    }

    setIsLoading(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: '500px',
      }}
    >
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: '12px', sm: '14px' },
          color: 'rgba(255,255,255, .85)',
          fontFamily: 'Poppins',
          textAlign: 'center',
          margin: '2rem 0',
          maxWidth: '80%',
          lineHeight: '22px',
        }}
      >
        Explore current weather data and 6-day forecast of more than 200,000
        cities!
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TodayWeather data={todayWeather} forecastList={todayForecast} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </Grid>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong. Please try again."
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '500px',
        }}
      >
        <LoadingBox value="1">
          <Typography variant="h3" component="h3">
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container
        sx={{
          maxWidth: { xs: '95%', sm: '80%', md: '1100px' },
          width: '100%',
          height: '100%',
          margin: '0 auto',
          padding: '1rem 0 3rem',
          marginBottom: '1rem',
          borderRadius: { xs: 'none', sm: '0 0 1rem 1rem' },
          backgroundColor: 'background.default',
          color: 'text.primary',
        }}
      >
        <Grid container columnSpacing={2}>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                width: '100%',
                marginBottom: '1rem',
              }}
            >
              <Box
                component="img"
                sx={{
                  height: { xs: '50px', sm: '70px', md: '90px' },
                  width: { xs: '50px', sm: '70px', md: '90px' },
                  borderRadius: '8px',
                  objectFit: 'contain',
                }}
                alt="logo"
                src={Logo}
              />
              <UTCDatetime />
              <IconButton onClick={toggleTheme} color="inherit">
                {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <Link href="https://github.com/aminawinti/the-weather-forecasting" target="_blank">
                <GitHubIcon sx={{ color: 'text.primary', '&:hover': { color: '#2d95bd' } }} />
              </Link>
            </Box>
            <Search onSearchChange={searchChangeHandler} />
          </Grid>
          {appContent}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
