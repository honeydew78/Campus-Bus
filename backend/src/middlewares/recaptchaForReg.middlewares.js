import axios from 'axios';

export const recaptchaMiddleware1 = async (req, res, next) => {
  const recaptchaToken = req.query.recaptchaToken; // Get recaptchaToken from query parameter
  const secretKey = process.env.SECRET_KEY2; // Replace with your actual reCAPTCHA v3 secret key

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken,
      },
    });

    const data = response.data;

    if (data.success && data.score >= 0.5) {
      next(); // Proceed to the next middleware or route handler
    } else {
      res.status(400).json({ message: 'Failed reCAPTCHA verification' });
    }
  } catch (error) {
    console.error('Failed to verify reCAPTCHA', error);
    res.status(500).json({ message: 'Failed to verify reCAPTCHA' });
  }
};
