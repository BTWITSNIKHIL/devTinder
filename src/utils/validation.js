import validator from 'validator';

const validationSignUp = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
       
        throw new Error("Password must be at least 8 characters long");
    }
};

export default validationSignUp;
