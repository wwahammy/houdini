import ReactOnRails from 'react-on-rails';

import SessionLoginPage from '../legacy_react/src/components/session_login_page/SessionLoginPage';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  SessionLoginPage,
});
