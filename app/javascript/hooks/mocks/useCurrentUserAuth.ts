
import {UserSignInFailsOnceAndThenSucceeds, UserSignInWaitUntilSignal,UserSignInSucceeds} from '../../api/mocks/users';
import {UserSignedInIfAuthenticated} from '../../api/api/mocks/users';

export const UserSignInFailsOnceAndThenSucceedsAndGetCurrentWaitsForAuthentication = [
	...UserSignInFailsOnceAndThenSucceeds,
	...UserSignedInIfAuthenticated,
];

export const UserWaitToSignInAndNotLoggedIn = [
	...UserSignInWaitUntilSignal,
	...UserSignedInIfAuthenticated,
];

export const UserSignsInOnFirstAttempt = [
	...UserSignInSucceeds,
	...UserSignedInIfAuthenticated,
];