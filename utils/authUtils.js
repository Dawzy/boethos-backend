export const SALT_ROUNDS = 10;

export const inLengthRange = (text, min, max) => text.length >= min && text.length <= max;
export const hasUppercase = text => /[A-Z]/.test(text)
export const hasLowercase = text => /[a-z]/.test(text)
export const hasNumber = text => /[0-9]/.test(text)
export const hasSymbol = text => /[!@#$%^&*-_+=/\\|,.()]/.test(text)
export const isEmail = text => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(text)

export const extractToken = authHeader =>authHeader && (authHeader.split(" ")[1] || authHeader.split(" ")[0]);

export const validatePassword = password => {
  let result = {
    success: true,
    message: ""
  }

  if (!inLengthRange(password, 8, 50)) {
    result.success = false;
    result.message = "Password must be between 8-50 characters.";
  }

  if (!hasUppercase(password)) {
    result.success = false;
    result.message = "Password must contain an uppercase.";
  }
  
  if (!hasLowercase(password)) {
    result.success = false;
    result.message = "Password must contain a lowercase.";
  }

  if (!hasNumber(password)) {
    result.success = false;
    result.message = "Password must contain a number.";
  }

  if (!hasSymbol(password)) {
    result.success = false;
    result.message = "Password must contain a special character.";
  }

  return result;
}