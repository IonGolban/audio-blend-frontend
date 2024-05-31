import { Store } from "pullstate";

const AuthStore = new Store({ isAuth: false, username: null, email:null });

export default AuthStore;