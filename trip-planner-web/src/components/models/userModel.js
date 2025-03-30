class UserModel {
    constructor(full_name, email, password) {
      this.full_name = full_name;
      this.email = email;
      this.password = password;
    }
  
    static validate(userData) {
      if (!userData.full_name || !userData.email || !userData.password) {
        throw new Error('All fields are required.');
      }
     
    }
  }
  export default UserModel;