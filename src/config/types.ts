const TYPES = {
    AuthMiddleware: Symbol.for('AuthMiddleware'),
    DBLogger: Symbol.for('DBLogger'),

    MongoDBClient: Symbol.for('MongoDBClient'),
    UserService: Symbol.for('UserService'),
    TerritoryService: Symbol.for('TerritoryService'),
    ClinicService: Symbol.for('ClinicService'),
    SettingsService: Symbol.for('SettingsService'),
    PatientService: Symbol.for('PatientService'),
    SessionService: Symbol.for('SessionService'),
    LanguageService: Symbol.for('LanguageService'),
	QuestionnaireService: Symbol.for('QuestionnaireService'),
    AppointmentService: Symbol.for('AppointmentService'),
    TreatmentService: Symbol.for('TreatmentService'),
    OutcomeService: Symbol.for('OutcomeService'),
    ExportService: Symbol.for('ExportService'),
    DirectoryService: Symbol.for('DirectoryService'),
    ReportService: Symbol.for('ReportService'),
};

export default TYPES;
