import toast from 'react-hot-toast';

// Validate login page username
export async function usernameValidate(values) {
    const error = usernameVerify({}, values);
    return error;
}
// Validate Password
export async function passwordValidate(values) {
    const error = passwordVerify({}, values);
    return error;
}

// Validate reset password
export async function resetPasswordValidation(values) {
    const error = passwordVerify({}, values);

    if (values.password !== values.confirm_pwd) {
        error.exist = toast.error('Password not match');
    }
    return error;
}

// Validate register form
export async function registerValidation(values) {
    const error = usernameVerify({}, values);
    passwordVerify(error, values);
    emailVerify(error, values)
    return error
}

// Validate Profile page
export async function profileValidation(values){
    const error = emailVerify({}, values)
    


    return error
}

// Validate Password
function passwordVerify(error = {}, values) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!values.password) {
        error.password = toast.error('Password Required...!');
    } else if (values.password.includes(' ')) {
        error.password = toast.error('Wrong Password...!');
    } else if (values.password.length < 4) {
        error.password = toast.error(
            'Password must be more than 4 character...!'
        );
    } else if (!specialChars.test(values.password)) {
        error.password = toast.error(
            'Password must have special character...!'
        );
    }

    return error;
}

// validate username

function usernameVerify(error = {}, values) {
    if (!values.username) {
        error.username = toast.error('Username Required...!');
    } else if (values.username.includes(' ')) {
        error.username = toast.error('Invalid Username...!');
    }

    return error;
}

// Validate Email
function emailVerify(error = {}, values) {
    if (!values.email) {
        error.email = toast.error('Email Required...!');
    } else if (values.email.includes(' ')) {
        error.email = toast.error('Invalid Email...!');
    }

    return error;
}
