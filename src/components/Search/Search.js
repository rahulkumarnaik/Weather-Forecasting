import React, { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { fetchCities } from '../../api/OpenWeatherService';
import { useTheme } from '@mui/material/styles';

const Search = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState(null);
  const theme = useTheme();

  const loadOptions = async (inputValue) => {
    try {
      console.log("Fetching cities for:", inputValue); // Debugging API call

      const citiesList = await fetchCities(inputValue);
      console.log("API Response:", citiesList.data); // Debugging API response

      return {
        options: citiesList.data.map((city) => ({
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        })),
      };
    } catch (error) {
      console.error("Error fetching cities:", error);
      return { options: [] };
    }
  };

  const onChangeHandler = (enteredData) => {
    console.log("Selected City Data:", enteredData); // Debugging selected city data

    if (!enteredData) return;

    setSearchValue(enteredData);
    onSearchChange(enteredData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for cities"
      debounceTimeout={600}
      value={searchValue}
      onChange={onChangeHandler}
      loadOptions={loadOptions}
      styles={{
        control: (provided) => ({
          ...provided,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
        }),
        input: (provided) => ({
          ...provided,
          color: theme.palette.text.primary,
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: theme.palette.background.paper,
        }),
        option: (provided, { isFocused }) => ({
          ...provided,
          backgroundColor: isFocused ? theme.palette.action.hover : 'transparent',
          color: theme.palette.text.primary,
        }),
        singleValue: (provided) => ({
          ...provided,
          color: theme.palette.text.primary,
        }),
      }}
    />
  );
};

export default Search;
