// LanguageSelector.js
import React from 'react';
import Select from 'react-select';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const allLanguages = [
    { value: 'mr', label: 'Marathi' },
    { value: 'hi', label: 'Hindi' },
    { value: 'en', label: 'English' },
  ];

  return (
    <Select
      value={allLanguages.find(lang => lang.value === selectedLanguage)}
      onChange={onLanguageChange}
      options={allLanguages}
      placeholder="Select Language"
      styles={{
        control: (provided) => ({
          ...provided,
          width: "100%",
        }),
      }}
    />
  );
};

export default LanguageSelector;
