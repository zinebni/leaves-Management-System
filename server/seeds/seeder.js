/**
 * Database Seeder Script
 * 
 * This script populates the database with sample data for testing/development.
 * Run with: node seeds/seeder.js
 * 
 * Data created:
 * - 1 Organisation
 * - 3 Departments
 * - 1 HR + 5 Employees
 * - Leave rights for all employees
 * - Sample leave requests
 * - Sample events
 * - Sample notifications
 */

import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Import models
import Conge from '../models/congeModel.js';
import Department from '../models/departmentModel.js';
import DroitConge from '../models/droitCongeModel.js';
import Employee from '../models/employeeModel.js';
import Evenement from '../models/evenementModel.js';
import Notification from '../models/notificationModel.js';
import Organisation from '../models/organisationModel.js';

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/leaves_management';
const DEFAULT_PASSWORD = 'password123';

// Helper function to create leave rights for an employee
const createLeaveRightsForEmployee = async (employee) => {
  const droits = [];
  const now = new Date();
  const recrutementDate = new Date(employee.dateDeRecrutement);
  const moisTravaille = (now.getFullYear() - recrutementDate.getFullYear()) * 12 +
                        (now.getMonth() - recrutementDate.getMonth());

  // Check if eligible for annual leave (6+ months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const isEligible = recrutementDate <= sixMonthsAgo;

  if (isEligible) {
    let joursAnnuel = 18;
    const nb5ans = Math.floor(moisTravaille / 60);
    joursAnnuel += nb5ans * 1.5;
    joursAnnuel = Math.min(joursAnnuel, 30);

    droits.push({
      employee: employee._id,
      type: 'annuel',
      joursAutorisee: joursAnnuel,
      joursPris: 0,
      estPaye: true
    });
  }

  // Maternity leave (married women only)
  if (employee.sexe === 'Femme' && employee.situationFamiliale === 'marié(e)') {
    droits.push({
      employee: employee._id,
      type: 'maternite',
      joursAutorisee: 98,
      joursPris: 0,
      estPaye: true
    });
  }

  // Paternity leave (married men only)
  if (employee.sexe === 'Homme' && employee.situationFamiliale === 'marié(e)') {
    droits.push({
      employee: employee._id,
      type: 'paternite',
      joursAutorisee: 3,
      joursPris: 0,
      estPaye: true
    });
  }

  // Marriage leave (single employees only)
  if (employee.situationFamiliale === 'célibataire') {
    droits.push({
      employee: employee._id,
      type: 'Mariage du salarié',
      joursAutorisee: 4,
      joursPris: 0,
      estPaye: true
    });
  }

  // Unpaid leave (everyone)
  droits.push({
    employee: employee._id,
    type: 'sans_solde',
    joursAutorisee: null,
    joursPris: 0,
    estPaye: false
  });

  // Sick leave (everyone)
  droits.push({
    employee: employee._id,
    type: 'maladie',
    joursAutorisee: null,
    joursPris: 0,
    estPaye: false
  });

  // Exam leave (everyone)
  droits.push({
    employee: employee._id,
    type: 'examen',
    joursAutorisee: null,
    joursPris: 0,
    estPaye: false
  });

  // Bereavement leave
  droits.push({
    employee: employee._id,
    type: 'Décès (conjoint, parent, enfant)',
    joursAutorisee: 3,
    joursPris: 0,
    estPaye: false
  });

  droits.push({
    employee: employee._id,
    type: 'Décès (frère, sœur, beau-parent)',
    joursAutorisee: 2,
    joursPris: 0,
    estPaye: false
  });

  return await DroitConge.insertMany(droits);
};

// Main seeder function
const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Organisation.deleteMany({}),
      Department.deleteMany({}),
      Employee.deleteMany({}),
      DroitConge.deleteMany({}),
      Conge.deleteMany({}),
      Evenement.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('✅ Existing data cleared');

    // Hash password once for all users
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // ============================================
    // 1. CREATE ORGANISATION
    // ============================================
    console.log('🏢 Creating organisation...');
    const organisation = await Organisation.create({
      email: 'admin@techcorp.org',
      orgID: 'TECHCORP-001',
      nom: 'TechCorp Solutions',
      description: 'A leading technology solutions company',
      password: hashedPassword,
      role: 'org'
    });
    console.log(`✅ Organisation created: ${organisation.nom}`);

    // ============================================
    // 2. CREATE DEPARTMENTS
    // ============================================
    console.log('🏛️  Creating departments...');
    const departments = await Department.insertMany([
      {
        nom: 'Développement',
        description: 'Équipe de développement logiciel',
        organisation: organisation._id
      },
      {
        nom: 'Ressources Humaines',
        description: 'Gestion des ressources humaines',
        organisation: organisation._id
      },
      {
        nom: 'Marketing',
        description: 'Équipe marketing et communication',
        organisation: organisation._id
      }
    ]);
    console.log(`✅ Created ${departments.length} departments`);

    // ============================================
    // 3. CREATE EMPLOYEES (1 RH + 5 Regular)
    // ============================================
    console.log('👥 Creating employees...');

    // Create HR employee
    const hrEmployee = await Employee.create({
      nom: 'Bennani',
      prenom: 'Imane',
      email: `bennani.imane.${uuidv4().slice(0, 3)}@rh.org`,
      password: hashedPassword,
      role: 'RH',
      verificationEmail: 'zineb.bennani442@gmail.com',
      numeroDeContact: '+212612345678',
      dateDeRecrutement: new Date('2022-01-15'),
      department: departments[1]._id, // RH department
      organisation: organisation._id,
      sexe: 'Femme',
      situationFamiliale: 'marié(e)',
      nombreEnfants: 2,
      isAccountVerified: true
    });
    console.log(`✅ HR created: ${hrEmployee.prenom} ${hrEmployee.nom}`);

    // Sample employee data
    const employeeData = [
      {
        nom: 'Benali',
        prenom: 'Ahmed',
        email: `bennani.imane.${uuidv4().slice(0, 3)}@employe.org`,
        password: hashedPassword,
        verificationEmail: 'zineb.bennani442@gmail.com',
        numeroDeContact: '+212623456789',
        dateDeRecrutement: new Date('2023-03-01'),
        department: departments[0]._id,
        sexe: 'Homme',
        situationFamiliale: 'marié(e)',
        nombreEnfants: 1
      },
      {
        nom: 'ElAmrani',
        prenom: 'Fatima',
        email: `elamrani.fatima.${uuidv4().slice(0, 3)}@employe.org`,
        password: hashedPassword,
        verificationEmail: 'zineb.bennani442@gmail.com',
        numeroDeContact: '+212634567890',
        dateDeRecrutement: new Date('2022-06-15'),
        department: departments[0]._id,
        sexe: 'Femme',
        situationFamiliale: 'célibataire',
        nombreEnfants: 0
      },
      {
        nom: 'Tazi',
        prenom: 'Karim',
        email: `tazi.karim.${uuidv4().slice(0, 3)}@employe.org`,
        password: hashedPassword,
        verificationEmail: 'zineb.bennani442@gmail.com',
        numeroDeContact: '+212645678901',
        dateDeRecrutement: new Date('2021-09-01'),
        department: departments[2]._id,
        sexe: 'Homme',
        situationFamiliale: 'célibataire',
        nombreEnfants: 0
      },
      {
        nom: 'Alaoui',
        prenom: 'Nadia',
        email: `alaoui.nadia.${uuidv4().slice(0, 3)}@employe.org`,
        password: hashedPassword,
        verificationEmail: 'zineb.bennani442@gmail.com',
        numeroDeContact: '+212656789012',
        dateDeRecrutement: new Date('2020-02-01'),
        department: departments[2]._id,
        sexe: 'Femme',
        situationFamiliale: 'marié(e)',
        nombreEnfants: 3
      },
      {
        nom: 'Bouazza',
        prenom: 'Youssef',
        email: `bouazza.youssef.${uuidv4().slice(0, 3)}@employe.org`,
        password: hashedPassword,
        verificationEmail: 'zineb.bennani442@gmail.com',
        numeroDeContact: '+212667890123',
        dateDeRecrutement: new Date('2024-01-10'),
        department: departments[0]._id,
        sexe: 'Homme',
        situationFamiliale: 'célibataire',
        nombreEnfants: 0
      }
    ];

    const employees = [];
    for (const empData of employeeData) {
      const employee = await Employee.create({
        ...empData,
        email: `${empData.nom.toLowerCase()}.${empData.prenom.toLowerCase()}.${uuidv4().slice(0, 3)}@employe.org`,
        password: hashedPassword,
        role: 'employe',
        organisation: organisation._id,
        isAccountVerified: true
      });
      employees.push(employee);
    }
    console.log(`✅ Created ${employees.length} employees`);

    // ============================================
    // 4. CREATE LEAVE RIGHTS FOR ALL EMPLOYEES
    // ============================================
    console.log('📋 Creating leave rights...');
    const allEmployees = [hrEmployee, ...employees];
    for (const emp of allEmployees) {
      await createLeaveRightsForEmployee(emp);
    }
    console.log(`✅ Leave rights created for ${allEmployees.length} employees`);

    // ============================================
    // 5. CREATE SAMPLE LEAVE REQUESTS
    // ============================================
    console.log('📝 Creating sample leave requests...');

    // Get annual leave right for an employee
    const ahmadAnnualLeave = await DroitConge.findOne({
      employee: employees[0]._id,
      type: 'annuel'
    });

    const fatimaAnnualLeave = await DroitConge.findOne({
      employee: employees[1]._id,
      type: 'annuel'
    });

    const leaveRequests = [];

    if (ahmadAnnualLeave) {
      // Approved leave request
      leaveRequests.push(await Conge.create({
        employee: employees[0]._id,
        date_debut: new Date('2025-01-06'),
        date_fin: new Date('2025-01-10'),
        nombreDeJours: 5,
        motif: ahmadAnnualLeave._id,
        status: 'approuve',
        commentaire: 'Vacances familiales',
        approuvePar: hrEmployee._id
      }));

      // Update leave right
      ahmadAnnualLeave.joursPris = 5;
      await ahmadAnnualLeave.save();
    }

    if (fatimaAnnualLeave) {
      // Pending leave request
      leaveRequests.push(await Conge.create({
        employee: employees[1]._id,
        date_debut: new Date('2025-02-03'),
        date_fin: new Date('2025-02-07'),
        nombreDeJours: 5,
        motif: fatimaAnnualLeave._id,
        status: 'en attente',
        commentaire: 'Voyage personnel'
      }));
    }

    // Refused leave request
    const karimAnnualLeave = await DroitConge.findOne({
      employee: employees[2]._id,
      type: 'annuel'
    });

    if (karimAnnualLeave) {
      leaveRequests.push(await Conge.create({
        employee: employees[2]._id,
        date_debut: new Date('2024-12-23'),
        date_fin: new Date('2024-12-31'),
        nombreDeJours: 9,
        motif: karimAnnualLeave._id,
        status: 'refuse',
        commentaire: 'Congé de fin d\'année',
        refusePar: hrEmployee._id
      }));
    }

    console.log(`✅ Created ${leaveRequests.length} leave requests`);

    // ============================================
    // 6. CREATE SAMPLE EVENTS
    // ============================================
    console.log('📅 Creating sample events...');
    const events = await Evenement.insertMany([
      {
        titre: 'Réunion annuelle',
        description: 'Réunion annuelle de l\'entreprise',
        date_debut: new Date('2025-01-15'),
        date_fin: new Date('2025-01-15'),
        lieu: 'Salle de conférence principale',
        organisation: organisation._id
      },
      {
        titre: 'Formation sécurité',
        description: 'Formation obligatoire sur la sécurité au travail',
        date_debut: new Date('2025-02-10'),
        date_fin: new Date('2025-02-11'),
        lieu: 'Salle B2',
        organisation: organisation._id
      },
      {
        titre: 'Team Building',
        description: 'Journée de cohésion d\'équipe',
        date_debut: new Date('2025-03-20'),
        date_fin: new Date('2025-03-20'),
        lieu: 'Parc de la ville',
        organisation: organisation._id
      }
    ]);
    console.log(`✅ Created ${events.length} events`);

    // ============================================
    // 7. CREATE SAMPLE NOTIFICATIONS
    // ============================================
    console.log('🔔 Creating sample notifications...');
    const notifications = [];

    if (leaveRequests[0]) {
      notifications.push(await Notification.create({
        recipient: employees[0]._id,
        conge: leaveRequests[0]._id,
        message: 'Votre demande de congé du 06/01 au 10/01 a été approuvée.',
        isRead: true
      }));
    }

    if (leaveRequests[1]) {
      notifications.push(await Notification.create({
        recipient: hrEmployee._id,
        conge: leaveRequests[1]._id,
        message: `Nouvelle demande de congé de ${employees[1].prenom} ${employees[1].nom}.`,
        isRead: false
      }));
    }

    if (leaveRequests[2]) {
      notifications.push(await Notification.create({
        recipient: employees[2]._id,
        conge: leaveRequests[2]._id,
        message: 'Votre demande de congé du 23/12 au 31/12 a été refusée.',
        isRead: false
      }));
    }

    console.log(`✅ Created ${notifications.length} notifications`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n========================================');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('========================================');
    console.log(`📊 Summary:`);
    console.log(`   - 1 Organisation: ${organisation.nom}`);
    console.log(`   - ${departments.length} Departments`);
    console.log(`   - ${allEmployees.length} Employees (1 RH + ${employees.length} regular)`);
    console.log(`   - Leave rights created for all employees`);
    console.log(`   - ${leaveRequests.length} Leave requests`);
    console.log(`   - ${events.length} Events`);
    console.log(`   - ${notifications.length} Notifications`);
    console.log('\n📝 Login credentials:');
    console.log(`   Organisation: admin@techcorp.org / ${DEFAULT_PASSWORD}`);
    console.log(`   HR: ${hrEmployee.email} / ${DEFAULT_PASSWORD}`);
    console.log(`   Employee: ${employees[0].email} / ${DEFAULT_PASSWORD}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seeder
seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

