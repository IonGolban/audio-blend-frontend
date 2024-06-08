import { Store } from "pullstate";

const AuthStore = new Store({ isAuth: false, id:null, username: null, email:null });

export default AuthStore;