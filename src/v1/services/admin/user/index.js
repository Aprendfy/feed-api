import express from 'express';
import validate from 'express-validation';

// import { loginSchema } from './schema';

const router = express.Router();
router.get('/ping', (req, res, next) => {
  return res.status(200).json({
      payload : 'ping'
    });
});

// router.post('/login', validate(loginSchema), ({ body }, res, next) => {
//   const { email, password } = body;

//   login(email, password)
//     .then(payload => res.status(200).json({
//       message: messages.LOGIN_SUCCESS,
//       payload
//     }))
//     .catch(error => next(error));
// });

export default router;