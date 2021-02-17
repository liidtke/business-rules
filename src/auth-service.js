import createAuth0Client from "@auth0/auth0-spa-js";
import { user, isAuthenticated, popupOpen, canWrite, token } from "./store";
import config from "./config";

async function createClient() {
  let auth0Client = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId
  });

  return auth0Client;
}

//first thing on load
async function init(auth0Client) {
  const isAuth = await auth0Client.isAuthenticated()
  isAuthenticated.set(isAuth);

  if (!isAuth) {
    token.set();
    return;
  }

  let loggedUser = await auth0Client.getUser();
  user.set(loggedUser);

  //todo check permissions
  if (loggedUser) {
    canWrite.set(loggedUser.email.includes('iatec'));
  }

  let tkn = await auth0Client.getIdTokenClaims();
  console.log('get token');
  if (tkn) {
    token.set(tkn.__raw);
  }

}

async function loginWithPopup(client, options) {
  popupOpen.set(true);
  try {
    await client.loginWithPopup(options);
    init(client);


  } catch (e) {
    // eslint-disable-next-line
    //console.error(e);
  } finally {
    popupOpen.set(false);
  }
}

function logout(client) {
  token.set();
  return client.logout();
}

const auth = {
  createClient,
  loginWithPopup,
  logout,
  init,
};

export default auth;