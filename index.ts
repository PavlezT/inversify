import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { HttpError } from 'restify-errors';
// import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import * as logger from 'morgan';
import * as express from 'express';
import * as helmet from 'helmet';
import * as swagger from 'swagger-express-ts';
import TYPES from './src/config/types';
import config from './src/config';
import db from './db';
import './src/controllers';

import {
  UserService,
  AuthMiddleware,
  TerritoryService,
  ClinicService,
  SettingsService,
  PatientService,
  SessionService,
  LanguageService,
  DirectoryService,
  QuestionnaireService,
  AppointmentService,
  TreatmentService,
  OutcomeService,
  ExportService,
  DBLogger,
  ReportService,
} from './src/services';

let container = new Container();

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind<DBLogger>(TYPES.DBLogger).to(DBLogger);
container.bind<TerritoryService>(TYPES.TerritoryService).to(TerritoryService);
container.bind<ClinicService>(TYPES.ClinicService).to(ClinicService);
container.bind<SettingsService>(TYPES.SettingsService).to(SettingsService);
container.bind<PatientService>(TYPES.PatientService).to(PatientService);
container.bind<SessionService>(TYPES.SessionService).to(SessionService);
container.bind<LanguageService>(TYPES.LanguageService).to(LanguageService);
container.bind<QuestionnaireService>(TYPES.QuestionnaireService).to(QuestionnaireService);
container.bind<AppointmentService>(TYPES.AppointmentService).to(AppointmentService);
container.bind<TreatmentService>(TYPES.TreatmentService).to(TreatmentService);
container.bind<OutcomeService>(TYPES.OutcomeService).to(OutcomeService);
container.bind<DirectoryService>(TYPES.DirectoryService).to(DirectoryService);
container.bind<ExportService>(TYPES.ExportService).to(ExportService);
container.bind<ReportService>(TYPES.ReportService).to(ReportService);

let server = new InversifyExpressServer(container, null, {
  rootPath: config.SERVER.prefix
});

server.setConfig((app) => {
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(helmet());
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', (Array.isArray(config.SERVER.uiUrl) ? config.SERVER.uiUrl.join(',') : config.SERVER.uiUrl) || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 1);
    next();
  });

  app.options('/*', function(req, res, next){
    return res.send();
  });

  if (config.name.includes('dev')) {
    app.use('/api-docs/swagger', express.static('swagger'));
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    app.use(swagger.express({
            definition: {
                externalDocs: {
                    url: 'http:// to some useful document'
                },
                info: {
                    title: 'CTS app',
                    version: '1.0'
                },
                securityDefinitions: {
                    JWTtoken: {
                        type: swagger.SwaggerDefinitionConstant.Security.Type.API_KEY,
                        in: swagger.SwaggerDefinitionConstant.Security.In.HEADER,
                        name: 'Authorization'
                    }
                },
                basePath: `${config.SERVER.prefix}/`, // ${config.SERVER.base_url}:${config.SERVER.port}
            }
        }));
    console.log(`Swagger started on ${config.SERVER.base_url}:${config.SERVER.port}/api-docs/swagger`);
  }

});

server.setErrorConfig((app: any) => {
  app.use(
      (err: HttpError, request: express.Request, response: express.Response, next: express.NextFunction) => {
         console.log('error stack:', err.stack);

          const DEFAULT_ERR_MSG = 'An error occured. Please contact system administrator';

          if (err instanceof HttpError) {
              response.status(err.statusCode || 500).json({
                  errorMessage: err.message || DEFAULT_ERR_MSG,
                  status: err.statusCode || 500
              });
          } else {
              response.status(500).json({
                  message: DEFAULT_ERR_MSG
              });
          }
      }
  );
});

process.on('uncaughtException', (err) => {
  console.error('Unhandled exception', err);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection', err);
});


db.connect().then(() => {
  const nodeServer = server.build().listen(config.SERVER.port);
  nodeServer.on('error', console.log.bind(null, 'Server start error:'));
  nodeServer.on('listening', console.log.bind(null, `Server started on ${config.SERVER.base_url}:${config.SERVER.port}${config.SERVER.prefix}/`));
})
.catch(error => {
  console.log('Something went wrong: Check DB connection and Server port avaibility', error);
});

// exports = module.exports = app;
