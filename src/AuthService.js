import createAuth0Client from '@auth0/auth0-spa-js';
import { Config } from './Config';

export class AuthService {
    constructor(authData, setAuthData, showMessage, hideMessage) {
        this.authData = authData;
        this.setAuthData = setAuthData;
        this.showMessage = showMessage;
        this.hideMessage = hideMessage;
    }

    createClient = async () => {
        return await createAuth0Client({
            domain: Config.domain,
            client_id: Config.clientId,
        });
    };

    loginWithPopup = async (client, options) => {
        this.setAuthData(prevState => ({ ...prevState, popupOpen: true }));
        try {
            await client.loginWithPopup(options);
            const user = await client.getUser();
            const tokenClaims = await client.getIdTokenClaims();
            this.setAuthData(prevState => ({
                ...prevState,
                user,
                token: tokenClaims.__raw,
                isAuthenticated: true,
            }));
        } catch (err) {
            this.showMessage({ message: 'Failed to log in', type: 'danger' });
            setTimeout(this.hideMessage, 3000);
            console.log(err);
        } finally {
            this.setAuthData(prevState => ({ ...prevState, popupOpen: false }));
        }
    };

    logout = client => {
        return client.logout();
    };
}
