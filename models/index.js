const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Load and initialize all models
const AccessViolationLog = require('./AccessViolationLog')(sequelize, Sequelize.DataTypes);
const Admission = require('./Admission')(sequelize, Sequelize.DataTypes);
const Announcement = require('./Announcement')(sequelize, Sequelize.DataTypes);
const Appointment = require('./Appointment')(sequelize, Sequelize.DataTypes);
const Bed = require('./Bed')(sequelize, Sequelize.DataTypes);
const Claim = require('./Claim')(sequelize, Sequelize.DataTypes);
const Consultation = require('./Consultation')(sequelize, Sequelize.DataTypes);
const DeliveryRecord = require('./DeliveryRecord')(sequelize, Sequelize.DataTypes);
const Department = require('./Department')(sequelize, Sequelize.DataTypes);
const Discharge = require('./Discharge')(sequelize, Sequelize.DataTypes);
const EKGRecord = require('./EKGRecord')(sequelize, Sequelize.DataTypes);
const Employee = require('./Employee')(sequelize, Sequelize.DataTypes);
const EmployeeShift = require('./EmployeeShift')(sequelize, Sequelize.DataTypes);
const HomeAbout = require('./HomeAbout')(sequelize, Sequelize.DataTypes);
const HomeVideo = require('./HomeVideo')(sequelize, Sequelize.DataTypes);
const InsuranceProvider = require('./InsuranceProvider')(sequelize, Sequelize.DataTypes);
const Invoice = require('./Invoice')(sequelize, Sequelize.DataTypes);
const InvoiceItem = require('./InvoiceItem')(sequelize, Sequelize.DataTypes);
const LabRequest = require('./LabRequest')(sequelize, Sequelize.DataTypes);
const LabResult = require('./LabResult')(sequelize, Sequelize.DataTypes);
const LabSupply = require('./LabSupply')(sequelize, Sequelize.DataTypes);
const Location = require('./Location')(sequelize, Sequelize.DataTypes);
const MaternityVisit = require('./MaternityVisit')(sequelize, Sequelize.DataTypes);
const MedicalRecord = require('./MedicalRecord')(sequelize, Sequelize.DataTypes);
const Medication = require('./Medication')(sequelize, Sequelize.DataTypes);
const Message = require('./Message')(sequelize, Sequelize.DataTypes);
const NursingNote = require('./NursingNote')(sequelize, Sequelize.DataTypes);
const ObstetricUltrasoundRecord = require('./ObstetricUltrasoundRecord')(sequelize, Sequelize.DataTypes);
const Patient = require('./Patient')(sequelize, Sequelize.DataTypes);
const PatientAccessLog = require('./PatientAccessLog')(sequelize, Sequelize.DataTypes);
const PatientAllergy = require('./PatientAllergy')(sequelize, Sequelize.DataTypes);
const PatientFile = require('./PatientFile')(sequelize, Sequelize.DataTypes);
const PatientHistory = require('./PatientHistory')(sequelize, Sequelize.DataTypes);
const PatientInsurance = require('./PatientInsurance')(sequelize, Sequelize.DataTypes);
const PatientMessage = require('./PatientMessage')(sequelize, Sequelize.DataTypes);
const PharmacyTransaction = require('./PharmacyTransaction')(sequelize, Sequelize.DataTypes);
const Prescription = require('./Prescription')(sequelize, Sequelize.DataTypes);
const Role = require('./Role')(sequelize, Sequelize.DataTypes);
const Service = require('./Service')(sequelize, Sequelize.DataTypes);
const ServiceItem = require('./ServiceItem')(sequelize, Sequelize.DataTypes);
const Slide = require('./Slide')(sequelize, Sequelize.DataTypes);
const Surgery = require('./Surgery')(sequelize, Sequelize.DataTypes);
const SystemAuditLog = require('./SystemAuditLog')(sequelize, Sequelize.DataTypes);
const SystemSettings = require('./SystemSettings')(sequelize, Sequelize.DataTypes);
const TriageRecord = require('./TriageRecord')(sequelize, Sequelize.DataTypes);
const User = require('./User')(sequelize, Sequelize.DataTypes);
const VisitorLog = require('./VisitorLog')(sequelize, Sequelize.DataTypes);

// Collect all models
const models = {
  AccessViolationLog,
  Admission,
  Announcement,
  Appointment,
  Bed,
  Claim,
  Consultation,
  DeliveryRecord,
  Department,
  Discharge,
  EKGRecord,
  Employee,
  EmployeeShift,
  HomeAbout,
  HomeVideo,
  InsuranceProvider,
  Invoice,
  InvoiceItem,
  LabRequest,
  LabResult,
  LabSupply,
  Location,
  MaternityVisit,
  MedicalRecord,
  Medication,
  Message,
  NursingNote,
  ObstetricUltrasoundRecord,
  Patient,
  PatientAccessLog,
  PatientAllergy,
  PatientFile,
  PatientHistory,
  PatientInsurance,
  PatientMessage,
  PharmacyTransaction,
  Prescription,
  Role,
  Service,
  ServiceItem,
  Slide,
  Surgery,
  SystemAuditLog,
  SystemSettings,
  TriageRecord,
  User,
  VisitorLog
};

// Run model associations (if defined)
Object.entries(models).forEach(([name, model]) => {
  if (typeof model?.associate === 'function') {
    model.associate(models);
  }
});

// Export Sequelize instance and all models
module.exports = {
  sequelize,
  Sequelize,
  ...models
};
