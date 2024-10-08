import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import DynamicTitle from './DynamicTitle'; // Adjust the path if necessary
import ResetPassword from 'views/auth/resetpassword'; // Import the ResetPassword component

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <HashRouter>
          <DynamicTitle />
          <Switch>
            <Route path={`/auth/reset-password`} component={ResetPassword} />
            <Route path={`/auth`} component={AuthLayout} />
            <Route path={`/admin`} component={AdminLayout} />
            <Route path={`/rtl`} component={RtlLayout} />
            <Redirect from='/' to='/auth' />
          </Switch>
        </HashRouter>
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);
