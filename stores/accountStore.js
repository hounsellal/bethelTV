import { observable, action } from 'mobx';
import getAccount from './bethelWebStore/getAccount';

class AccountStore {
    @observable firstName = '';
    @observable lastName = '';
    @observable screenName = '';
    @observable email = '';

    @action getAccount = async () => {
        const account = await getAccount();
        if(account.firstName) this.firstName = account.firstName;
        if(account.lastName) this.lastName = account.lastName;
        if(account.screenName) this.screenName = account.screenName;
        if(account.email) this.email = account.email;
    }
}

export default new AccountStore();