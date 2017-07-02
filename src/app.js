import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';

import { version } from '../package.json';
import * as handlers from './v1/util/handlers';
import './v1/config/mongo';
import { decodeJWT, hydrateUser } from './v1/config/jwt';


import userAdmin from './v1/services/admin/user';
import authAdmin from './v1/services/admin/authentication';
import category from './v1/services/app/category';
import post from './v1/services/app/post';


const port = process.eventNames.PORT || 3000;
const app = express();

const unless = {
  path: [
    { url: /^\/v1\/admin\/auth\/register/ },
    { url: /^\/v1\/admin\/auth\/login/ },
  ],
};

const dateOfBirth = new Date();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/health', (req, res) => res.status(200).json({ version, dateOfBirth }));

app.use(decodeJWT.unless(unless));
app.use(hydrateUser.unless(unless));

// Routes Import
app.use('/v1/admin/user', userAdmin);
app.use('/v1/admin/auth', authAdmin);
app.use('/v1/app/categories', category);
app.use('/v1/app/posts', post);

app.use(handlers.validationError);
app.use(handlers.internalError);

app.listen(port, () => console.log(`[#] Server on port: ${port}`));

export default app;
