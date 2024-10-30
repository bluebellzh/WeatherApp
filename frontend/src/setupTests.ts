import '@testing-library/jest-dom';
import 'jest-localstorage-mock';
import { configure } from '@testing-library/react';
import * as React from 'react';
import 'jest-transform-stub';

// Add React to global scope
global.React = React;

// Configure testing library
configure({ testIdAttribute: 'data-testid' });