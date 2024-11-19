import axios from 'axios';

// Middleware function to verify reCAPTCHA v3 token
export const recaptchaMiddleware2 = async (req, res, next) => {
  const recaptchaToken = req.body.recaptchaToken;
  const secretKey = process.env.SECRET_KEY1; // Replace with your actual reCAPTCHA v3 secret key

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken,
      },
    });

    const data = response.data;

    if (data.success && data.score >= 0.5) { // Adjust the score threshold as needed
      next();
    } else {
      res.status(400).json({ message: 'Failed reCAPTCHA verification' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify reCAPTCHA' });
  }
};